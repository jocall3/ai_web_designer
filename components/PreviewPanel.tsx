
import React, { useMemo } from 'react';
import { WebsiteSettings, Page, ContentBlock } from '../types';
import CodePanel from './CodePanel';
import { HeaderSettings, ThemeSettings, FooterSettings } from '../types';

interface PreviewPanelProps {
  settings: WebsiteSettings;
  activePath: string;
  onNavigate: (path: string) => void;
}

const generatePageHtml = (page: Page, settings: WebsiteSettings): string => {
    const { theme, header, footer } = settings;

    const navLinks = header.navLinks || [];

    const headerHtml = `
<header style="background-color: ${theme.headerBg}; color: ${theme.primaryTextColor}; padding: 1rem 2rem;">
    <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
            ${header.logoUrl ? `<img src="${header.logoUrl}" alt="Logo" class="h-10 w-10 object-contain bg-white rounded-full p-1">` : ''}
            <a href="index.html" class="text-2xl font-bold">${header.title}</a>
        </div>
        <div class="hidden md:flex items-center space-x-6">
            ${navLinks.map(link => `<a href="${link.href}" style="color: ${theme.secondaryTextColor};" class="hover:text-white transition-colors ${page.path === link.href ? 'font-bold !text-white' : ''}">${link.text}</a>`).join('\n            ')}
        </div>
    </div>
</header>
    `.trim();

    const renderBlock = (block: ContentBlock) => {
        switch(block.type) {
            case 'hero': return `
                <section class="text-center flex flex-col items-center justify-center min-h-[50vh] p-8" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${block.bgImage}); background-size: cover; background-position: center;">
                    <h2 class="text-4xl md:text-6xl font-bold" style="color: ${block.headlineColor};">${block.headline || ''}</h2>
                    <p class="mt-4 text-lg md:text-xl max-w-2xl" style="color: ${block.subheadlineColor};">${block.subheadline || ''}</p>
                </section>`;
            case 'textWithImage': return `
                <section class="container mx-auto py-12 md:py-20 px-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div class="${block.imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}">
                            <h3 class="text-3xl font-bold mb-4" style="color: ${theme.primaryTextColor};">${block.headline || ''}</h3>
                            <p style="color: ${theme.secondaryTextColor};">${(block.text || '').replace(/\n/g, '<br/>')}</p>
                        </div>
                        <div class="${block.imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}">
                            <img src="${block.image}" alt="${block.headline || 'content image'}" class="rounded-lg shadow-xl w-full h-auto object-cover aspect-square">
                        </div>
                    </div>
                </section>`;
            case 'featureList': return `
                <section class="container mx-auto py-12 md:py-20 px-6">
                    <h2 class="text-4xl font-bold text-center mb-12" style="color: ${theme.primaryTextColor};">${block.headline || ''}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${(block.features || []).map(f => `
                            <div class="p-6 rounded-lg" style="background-color: ${theme.panelBg};">
                                <h4 class="text-xl font-bold mb-2" style="color: ${theme.primaryAccent};">${f.title || ''}</h4>
                                <p style="color: ${theme.secondaryTextColor};">${f.description || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>`;
             case 'text': return `
                <section class="container mx-auto py-12 md:py-20 px-6 max-w-4xl">
                    <h2 class="text-4xl font-bold text-center mb-12" style="color: ${theme.primaryTextColor};">${block.headline || ''}</h2>
                    <div class="prose prose-invert lg:prose-xl mx-auto" style="color: ${theme.secondaryTextColor};">
                        ${(block.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
                    </div>
                </section>`;
            case 'form': return `
                <section class="container mx-auto py-12 md:py-20 px-6 flex justify-center">
                    <div class="w-full max-w-md p-8 rounded-lg" style="background-color: ${theme.panelBg};">
                        <h2 class="text-3xl font-bold text-center mb-8" style="color: ${theme.primaryTextColor};">${block.headline || ''}</h2>
                        <form class="space-y-6" onsubmit="event.preventDefault(); alert('Form submitted! (This is a preview)');">
                            ${(block.fields || []).map(f => `
                                <div>
                                    <label for="${f.name}" class="block text-sm font-medium mb-1" style="color: ${theme.secondaryTextColor};">${f.label || ''}</label>
                                    <input type="${f.type}" name="${f.name}" id="${f.name}" class="w-full rounded-md p-2 text-sm" style="background-color: ${theme.appBg}; color: ${theme.primaryTextColor}; border: 1px solid ${theme.panelBg};" />
                                </div>
                            `).join('')}
                            <div>
                                <button type="submit" class="w-full flex items-center justify-center p-2 text-white font-semibold rounded-md transition-colors" style="background-color: ${theme.secondaryAccent};">
                                    ${block.submitButtonText || 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>`;
            default: return '';
        }
    }

    const footerHtml = `
<footer style="background-color: ${theme.footerBg}; color: ${theme.secondaryTextColor};" class="py-6 px-4 mt-auto">
    <div class="container mx-auto text-center">
        <p>${footer.text || ''}</p>
        <div class="mt-2 flex justify-center space-x-4">
             ${(footer.links || []).map(link => `<a href="${link.href}" class="hover:text-white transition-colors">${link.text}</a>`).join('\n            ')}
        </div>
    </div>
</footer>
    `.trim();

    // Injected script to handle navigation inside the iframe
    const navigationScript = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                // Only intercept relative page links
                if (href && !href.startsWith('#') && !href.startsWith('http')) {
                    event.preventDefault();
                    window.parent.postMessage({ type: 'navigate', path: href }, '*');
                }
            });
        });
    });
</script>
    `.trim();

    return `
<!DOCTYPE html>
<html lang="en" class="${theme.fontFamily}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${header.title} - ${page.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
           extend: {
                typography: ({ theme }) => ({
                  invert: {
                    css: {
                      '--tw-prose-body': theme('colors.gray[300]'),
                      '--tw-prose-headings': theme('colors.white'),
                      '--tw-prose-lead': theme('colors.gray[400]'),
                      '--tw-prose-links': theme('colors.white'),
                      '--tw-prose-bold': theme('colors.white'),
                      '--tw-prose-counters': theme('colors.gray[400]'),
                      '--tw-prose-bullets': theme('colors.gray[600]'),
                      '--tw-prose-hr': theme('colors.gray[700]'),
                      '--tw-prose-quotes': theme('colors.gray[100]'),
                      '--tw-prose-quote-borders': theme('colors.gray[700]'),
                      '--tw-prose-captions': theme('colors.gray[400]'),
                      '--tw-prose-code': theme('colors.white'),
                      '--tw-prose-pre-code': theme('colors.gray[300]'),
                      '--tw-prose-pre-bg': 'rgba(0,0,0,0.2)',
                      '--tw-prose-th-borders': theme('colors.gray[600]'),
                      '--tw-prose-td-borders': theme('colors.gray[700]'),
                    },
                  },
                }),
              },
        }
      }
    </script>
</head>
<body style="background-color: ${theme.appBg};" class="flex flex-col min-h-screen">
    ${headerHtml}
    <main>
        ${(page.contentBlocks || []).map(renderBlock).join('\n')}
    </main>
    ${footerHtml}
    ${navigationScript}
</body>
</html>
    `.trim();
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ settings, activePath, onNavigate }) => {
  const { theme, pages } = settings;

  const activePage = useMemo(() => pages.find(p => p.path === activePath), [pages, activePath]);
  
  const pageHtml = useMemo(() => {
    if (!activePage) return '';
    return generatePageHtml(activePage, settings);
  }, [activePage, settings]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex flex-col lg:flex-row gap-6">
        {/* Page Navigator */}
        <div className="w-full lg:w-48 shrink-0">
             <h2 className="text-xl font-bold mb-4" style={{color: theme.primaryTextColor}}>Pages</h2>
             <nav className="space-y-2">
                {pages.map(page => (
                    <button 
                        key={page.path}
                        onClick={() => onNavigate(page.path)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: activePath === page.path ? theme.primaryAccent : theme.panelBg,
                            color: activePath === page.path ? '#ffffff' : theme.secondaryTextColor,
                        }}
                    >
                        {page.name}
                    </button>
                ))}
             </nav>
        </div>
        
        {/* Iframe Preview */}
        <div className="flex-grow rounded-lg border overflow-hidden" style={{ borderColor: theme.panelBg }}>
            {activePage ? (
                 <iframe 
                    key={activePath} // Re-mount iframe when path changes
                    srcDoc={pageHtml}
                    title="Website Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: theme.appBg}}>
                    <p>No page selected or found.</p>
                </div>
            )}
        </div>
      </div>
      <div className="mt-8 flex-shrink-0">
         <CodePanel settings={settings} />
      </div>
    </div>
  );
};

export default PreviewPanel;
export { generatePageHtml };