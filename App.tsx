
import React, { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'https://esm.sh/nanoid';
import ControlsPanel from './components/ControlsPanel';
import PreviewPanel from './components/PreviewPanel';
import LogoPicker from './components/LogoPicker';
import WelcomeScreen from './components/WelcomeScreen';
import Questionnaire from './components/Questionnaire';
import { LoaderIcon } from './components/icons';
import { WebsiteSettings, Page, ContentBlock } from './types';
import { DEFAULT_WEBSITE_SETTINGS } from './constants';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

type AppState = 'welcome' | 'questionnaire' | 'generating' | 'preview';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [activePreviewPath, setActivePreviewPath] = useState<string>(DEFAULT_WEBSITE_SETTINGS.pages[0].path);
  
  const [logos, setLogos] = useState<string[]>([]);
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = websiteSettings.theme.appBg;
  }, [websiteSettings.theme.appBg]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "null" && !event.isTrusted) return;
      if (typeof event.data === 'object' && event.data.type === 'navigate') {
        const newPath = event.data.path;
        if (websiteSettings.pages.some(p => p.path === newPath)) {
            setActivePreviewPath(newPath);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [websiteSettings.pages]);

  const handleStart = () => {
    setAppState('questionnaire');
  };

  const handleStartOver = () => {
      setAppState('welcome');
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      setActivePreviewPath(DEFAULT_WEBSITE_SETTINGS.pages[0].path);
      setError(null);
  };

  const handleQuestionnaireSubmit = useCallback(async (answers: Record<string, string>) => {
    setAppState('generating');
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const prompt = `
Based on the following user input, generate a complete website design as a single JSON object.

User Input:
- Website Name: ${answers.name}
- Purpose: ${answers.purpose}
- Target Audience: ${answers.audience}
- Desired Style: ${answers.style}
- Preferred Colors: ${answers.colors}
- Theme Preference: ${answers.theme}
- Required Pages: ${answers.pages}
- Home Page Message: ${answers.homeMessage}
- Key Features/Services: ${answers.features}
- About Us Content: ${answers.about}
- Brand Tone: ${answers.tone}
- Tagline: ${answers.tagline}
- Extra Instructions: ${answers.extra}

The output must be a single, valid JSON object, without any markdown formatting or surrounding text.

The JSON object must contain two top-level keys: "logoPrompts" and "website".

1.  "logoPrompts": An array of 5 short, descriptive prompts for an image generation model to create simple, iconic logos based on the website's name and purpose. Example: "A minimalist brain icon with circuit patterns".
2.  "website": An object matching the WebsiteSettings structure.

WebsiteSettings Structure:
- theme: { appBg, panelBg, headerBg, footerBg, primaryTextColor, secondaryTextColor, primaryAccent, secondaryAccent, fontFamily }
- header: { title, navLinks: [{text, href}] }
- pages: An array of Page objects. Each Page object must have { path, name, contentBlocks: [...] }.
- footer: { text, links: [{text, href}] }

Content Block Types:
- 'hero': { type: 'hero', headline, subheadline, bgImage, headlineColor, subheadlineColor }
- 'textWithImage': { type: 'textWithImage', headline, text, image, imagePosition: 'left' | 'right' }
- 'featureList': { type: 'featureList', headline, features: [{ title, description }] }
- 'form': { type: 'form', headline, fields: [{ label, type, name }], submitButtonText }
- 'text': { type: 'text', headline, paragraphs: string[] }

Guidelines:
- Generate content for all user-requested pages.
- For all image properties (bgImage, image), provide descriptive prompts for an image generator (e.g., "A futuristic cityscape at dusk"). Do not use URLs.
- Make the design aesthetically pleasing and modern.
- Ensure color contrast and readability.
- Page 'path' should be like 'index.html', 'about.html'.
- The 'href' in links must match page paths.
- The entire output MUST be a valid JSON object.
`;

      const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
          }
      });
      
      const responseText = result.text.trim();
      const jsonResponse = JSON.parse(responseText);
      
      const generatedSettings = jsonResponse.website as WebsiteSettings;
      const logoPrompts = jsonResponse.logoPrompts as string[];

      if (logoPrompts && logoPrompts.length > 0) {
        const imageResponses = await Promise.all(logoPrompts.slice(0, 5).map(p => 
          ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `${p}, simple, vector logo, on a plain background`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
          })
        ));
        const generatedLogos = imageResponses.map(r => `data:image/png;base64,${r.generatedImages[0].image.imageBytes}`);
        setLogos(generatedLogos);
        setIsLogoPickerOpen(true);
      }

      generatedSettings.pages.forEach(page => {
          page.contentBlocks = (page.contentBlocks || []).map(block => ({
              ...block,
              id: nanoid()
          }));
      });
      
      generatedSettings.header.logoUrl = ''; // Set initially, will be updated by picker.
      setWebsiteSettings(generatedSettings);
      setActivePreviewPath(generatedSettings.pages[0]?.path || 'index.html');
      
      if (!logoPrompts || logoPrompts.length === 0) {
           setAppState('preview');
      }

    } catch(e: any) {
      console.error(e);
      setError(`An error occurred while generating the website: ${e.message}. Please check your prompt or API key and try again.`);
      setAppState('questionnaire');
    }
  }, []);

  const handleLogoSelect = (logoUrl: string) => {
      setWebsiteSettings(prev => ({
          ...prev,
          header: {
              ...prev.header,
              logoUrl: logoUrl
          }
      }));
      setIsLogoPickerOpen(false);
      setAppState('preview');
  };

  const handleSettingsChange = useCallback(<K extends keyof WebsiteSettings>(section: K, value: WebsiteSettings[K] | Partial<WebsiteSettings[K]>) => {
      setWebsiteSettings(prev => ({
          ...prev,
          [section]: typeof value === 'object' && !Array.isArray(value) 
              ? { ...prev[section], ...value } 
              : value
      }));
  }, []);

  const handlePageContentChange = useCallback((pagePath: string, blockId: string, newContent: Partial<ContentBlock>) => {
      setWebsiteSettings(prev => {
          const newPages = prev.pages.map(page => {
              if (page.path === pagePath) {
                  const newBlocks = page.contentBlocks.map(block => {
                      if (block.id === blockId) {
                          return { ...block, ...newContent };
                      }
                      return block;
                  });
                  return { ...page, contentBlocks: newBlocks };
              }
              return page;
          });
          return { ...prev, pages: newPages };
      });
  }, []);

  const renderContent = () => {
      switch (appState) {
          case 'welcome':
              return <WelcomeScreen onStart={handleStart} />;
          case 'questionnaire':
              return <Questionnaire onSubmit={handleQuestionnaireSubmit} isGenerating={appState === 'generating'} error={error} />;
          case 'generating':
              return (
                  <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: websiteSettings.theme.appBg}}>
                      <LoaderIcon className="w-12 h-12 animate-spin mb-4" style={{color: websiteSettings.theme.primaryAccent}} />
                      <h2 className="text-2xl font-bold" style={{color: websiteSettings.theme.primaryTextColor}}>Generating Your Website...</h2>
                      <p className="mt-2" style={{color: websiteSettings.theme.secondaryTextColor}}>The AI is crafting your design, content, and branding.</p>
                  </div>
              );
          case 'preview':
              return (
                  <div className="flex flex-col md:flex-row h-screen overflow-hidden" style={{ backgroundColor: websiteSettings.theme.appBg }}>
                      <aside className="w-full md:w-[450px] lg:w-[500px] h-1/2 md:h-full shrink-0 p-6 overflow-y-auto" style={{ backgroundColor: websiteSettings.theme.panelBg }}>
                          <ControlsPanel 
                              settings={websiteSettings} 
                              onSettingsChange={handleSettingsChange}
                              onPageContentChange={handlePageContentChange}
                              onStartOver={handleStartOver}
                              activePagePath={activePreviewPath}
                          />
                      </aside>
                      <main className="flex-grow p-6 h-1/2 md:h-full overflow-y-auto">
                          <PreviewPanel 
                              settings={websiteSettings} 
                              activePath={activePreviewPath} 
                              onNavigate={setActivePreviewPath} 
                          />
                      </main>
                  </div>
              );
          default:
              return null;
      }
  }
  
  return (
      <>
          {renderContent()}
          {isLogoPickerOpen && <LogoPicker logos={logos} onSelect={handleLogoSelect} theme={websiteSettings.theme} />}
      </>
  );
};

export default App;
