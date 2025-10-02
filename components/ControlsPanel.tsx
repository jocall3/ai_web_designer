// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import React, { useState } from 'react';
import { WebsiteSettings, Page, ContentBlock, FormBlock, TextWithImageBlock, HeroBlock, TextBlock, FeatureListBlock } from '../types';
import { FONT_OPTIONS } from '../constants';
import { SparklesIcon, AlertTriangleIcon, LayoutIcon, PaletteIcon, TextIcon, RefreshIcon } from './icons';

interface ControlsPanelProps {
  settings: WebsiteSettings;
  activePagePath: string;
  onSettingsChange: <K extends keyof WebsiteSettings>(section: K, value: WebsiteSettings[K] | Partial<WebsiteSettings[K]>) => void;
  onPageContentChange: (pagePath: string, blockId: string, newContent: Partial<ContentBlock>) => void;
  onStartOver: () => void;
}

const Control: React.FC<{ label: string; children: React.ReactNode; htmlFor?: string, theme: WebsiteSettings['theme'] }> = ({ label, children, htmlFor, theme }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1" style={{ color: theme.secondaryTextColor }}>{label}</label>
    {children}
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean, theme: WebsiteSettings['theme'] }> = ({ title, children, defaultOpen = false, theme }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4 mb-4" style={{ borderColor: theme.appBg }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-lg font-semibold" style={{ color: theme.primaryTextColor }}>
        {title}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9660;</span>
      </button>
      {isOpen && <div className="space-y-4 mt-3">{children}</div>}
    </div>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || hex.length < 4) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const PageContentEditor: React.FC<{
    page: Page;
    theme: WebsiteSettings['theme'];
    onPageContentChange: (pagePath: string, blockId: string, newContent: Partial<ContentBlock>) => void;
    inputStyle: React.CSSProperties;
}> = ({ page, theme, onPageContentChange, inputStyle }) => {

    const handleBlockChange = (blockId: string, newContent: Partial<ContentBlock>) => {
        onPageContentChange(page.path, blockId, newContent);
    };

    return (
        <div className="space-y-4">
            {(page.contentBlocks || []).map((block) => (
                <Section key={block.id} title={`${block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block`} theme={theme} defaultOpen>
                    <div className="space-y-2">
                        {('headline' in block) && (
                             <Control label="Headline" theme={theme}>
                                <input type="text" value={block.headline} onChange={e => handleBlockChange(block.id, { headline: e.target.value })} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                            </Control>
                        )}
                         {block.type === 'hero' && (
                             <Control label="Subheadline" theme={theme}>
                                <textarea value={(block as HeroBlock).subheadline} onChange={e => handleBlockChange(block.id, { subheadline: e.target.value })} rows={2} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                            </Control>
                        )}
                        {block.type === 'textWithImage' && (
                             <Control label="Text" theme={theme}>
                                <textarea value={(block as TextWithImageBlock).text} onChange={e => handleBlockChange(block.id, { text: e.target.value })} rows={4} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                            </Control>
                        )}
                        {block.type === 'text' && (
                            ((block as TextBlock).paragraphs || []).map((p, i) => (
                                <Control label={`Paragraph ${i+1}`} theme={theme} key={i}>
                                    <textarea value={p} onChange={e => {
                                        const newParagraphs = [...(block as TextBlock).paragraphs];
                                        newParagraphs[i] = e.target.value;
                                        handleBlockChange(block.id, { paragraphs: newParagraphs });
                                    }} rows={3} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                                </Control>
                            ))
                        )}
                        {block.type === 'featureList' && (
                            ((block as FeatureListBlock).features || []).map((feature, i) => (
                                <div key={i} className="p-2 border rounded" style={{borderColor: hexToRgba(theme.secondaryTextColor, 0.2)}}>
                                     <Control label={`Feature ${i+1} Title`} theme={theme}>
                                        <input type="text" value={feature.title} onChange={e => {
                                            const newFeatures = [...(block as FeatureListBlock).features];
                                            newFeatures[i] = {...newFeatures[i], title: e.target.value };
                                            handleBlockChange(block.id, { features: newFeatures });
                                        }} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                                    </Control>
                                    <Control label={`Feature ${i+1} Description`} theme={theme}>
                                        <textarea value={feature.description} onChange={e => {
                                            const newFeatures = [...(block as FeatureListBlock).features];
                                            newFeatures[i] = {...newFeatures[i], description: e.target.value };
                                            handleBlockChange(block.id, { features: newFeatures });
                                        }} rows={2} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                                    </Control>
                                </div>
                            ))
                        )}
                        {block.type === 'form' && (
                           <>
                             {((block as FormBlock).fields || []).map((field, i) => (
                                <Control key={i} label={`Field ${i+1}: ${field.label}`} theme={theme}>
                                    <input type="text" value={field.label} onChange={e => {
                                        const newFields = [...(block as FormBlock).fields];
                                        newFields[i] = {...newFields[i], label: e.target.value };
                                        handleBlockChange(block.id, { fields: newFields });
                                    }} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                                </Control>
                             ))}
                             <Control label="Submit Button Text" theme={theme}>
                                <input type="text" value={(block as FormBlock).submitButtonText} onChange={e => handleBlockChange(block.id, { submitButtonText: e.target.value })} className="w-full rounded-md p-2 text-sm" style={inputStyle} />
                            </Control>
                           </>
                        )}
                    </div>
                </Section>
            ))}
        </div>
    )
}


const ControlsPanel: React.FC<ControlsPanelProps> = ({ 
    settings, onSettingsChange, onPageContentChange, onStartOver, activePagePath
}) => {
    const [activeTab, setActiveTab] = useState<'content' | 'header' | 'theme'>('content');
    
    const theme = settings.theme;
    const activePage = settings.pages.find(p => p.path === activePagePath);

    const tabs = [
        { id: 'content', label: 'Page Content', icon: TextIcon },
        { id: 'header', label: 'Header & Footer', icon: LayoutIcon },
        { id: 'theme', label: 'Theme', icon: PaletteIcon },
    ];
    
    const inputStyle: React.CSSProperties = {
        backgroundColor: hexToRgba(theme.appBg, 0.5),
        borderColor: hexToRgba(theme.secondaryTextColor, 0.3),
        color: theme.primaryTextColor
    };

    return (
    <div className="flex flex-col space-y-4 h-full">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: theme.primaryTextColor }}>Website Editor</h1>
            <button 
                onClick={onStartOver} 
                className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors"
                style={{ backgroundColor: hexToRgba(theme.secondaryTextColor, 0.2), color: theme.secondaryTextColor }}
            >
                <RefreshIcon className="w-4 h-4" />
                <span>Start Over</span>
            </button>
        </div>
        
        <div className="border-b" style={{ borderColor: hexToRgba(theme.secondaryTextColor, 0.3) }}>
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            color: activeTab === tab.id ? theme.primaryAccent : theme.secondaryTextColor,
                            borderColor: activeTab === tab.id ? theme.primaryAccent : 'transparent'
                        }}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <div className="space-y-4">
                {activeTab === 'content' && activePage && (
                    <PageContentEditor 
                        page={activePage}
                        theme={theme}
                        onPageContentChange={onPageContentChange}
                        inputStyle={inputStyle}
                    />
                )}

                {activeTab === 'header' && (
                    <div className="space-y-4">
                        <Section title="Header" defaultOpen theme={theme}>
                            <Control label="Site Title" htmlFor="headerTitle" theme={theme}>
                                <input type="text" id="headerTitle" value={settings.header.title} onChange={e => onSettingsChange('header', { title: e.target.value })} className="w-full rounded-md p-2 text-sm" style={inputStyle}/>
                            </Control>
                        </Section>
                         <Section title="Footer" defaultOpen theme={theme}>
                            <Control label="Footer Text" htmlFor="footerText" theme={theme}>
                                <input type="text" id="footerText" value={settings.footer.text} onChange={e => onSettingsChange('footer', { text: e.target.value })} className="w-full rounded-md p-2 text-sm" style={inputStyle}/>
                            </Control>
                             {(settings.footer.links || []).map((link, index) => (
                                 <div key={index} className="flex items-center space-x-2">
                                    <Control label="Link Text" theme={theme}>
                                        <input type="text" value={link.text} onChange={e => {
                                            const newLinks = [...settings.footer.links];
                                            newLinks[index].text = e.target.value;
                                            onSettingsChange('footer', { links: newLinks });
                                        }} className="w-full rounded-md p-2 text-sm" style={inputStyle}/>
                                    </Control>
                                    <Control label="Link URL" theme={theme}>
                                        <input type="text" value={link.href} onChange={e => {
                                            const newLinks = [...settings.footer.links];
                                            newLinks[index].href = e.target.value;
                                            onSettingsChange('footer', { links: newLinks });
                                        }} className="w-full rounded-md p-2 text-sm" style={inputStyle}/>
                                     </Control>
                                 </div>
                             ))}
                        </Section>
                    </div>
                )}

                {activeTab === 'theme' && (
                    <div className="space-y-4">
                        <Section title="Colors" defaultOpen theme={theme}>
                            <div className="grid grid-cols-2 gap-4">
                                {(Object.keys(settings.theme) as Array<keyof typeof settings.theme>).filter(k => k !== 'fontFamily').map(key => (
                                    <Control key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} htmlFor={key} theme={theme}>
                                        <input type="color" id={key} value={settings.theme[key]} onChange={e => onSettingsChange('theme', { [key]: e.target.value })} className="w-full h-10 p-1 border rounded-md cursor-pointer" style={inputStyle}/>
                                    </Control>
                                ))}
                            </div>
                        </Section>
                        <Section title="Font" defaultOpen theme={theme}>
                            <Control label="Font Family" theme={theme}>
                               <select value={theme.fontFamily} onChange={e => onSettingsChange('theme', { fontFamily: e.target.value })} className="w-full rounded-md p-2 text-sm" style={inputStyle}>
                                    {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                               </select>
                            </Control>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ControlsPanel;
