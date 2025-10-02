// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useCallback, useMemo } from 'react';
import { WebsiteSettings } from '../types';
import { ClipboardCheckIcon, ClipboardIcon } from './icons';
import { generatePageHtml } from './PreviewPanel';

interface CodePanelProps {
    settings: WebsiteSettings;
}

const CodePanel: React.FC<CodePanelProps> = ({ settings }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState(settings.pages[0]?.path || '');

    const activePage = useMemo(() => settings.pages.find(p => p.path === activeTab), [settings.pages, activeTab]);

    const code = useMemo(() => {
        if (!activePage) return '// Select a file to view its code.';
        return generatePageHtml(activePage, settings);
    }, [activePage, settings]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [code]);
    
    // Ensure activeTab is valid
    React.useEffect(() => {
        if (!settings.pages.some(p => p.path === activeTab)) {
            setActiveTab(settings.pages[0]?.path || '');
        }
    }, [settings.pages, activeTab]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4" style={{color: settings.theme.primaryTextColor}}>Embed Code</h2>
            <div className="rounded-lg border" style={{backgroundColor: settings.theme.panelBg, borderColor: settings.theme.appBg}}>
                <div className="flex justify-between items-center p-2" style={{borderBottom: `1px solid ${settings.theme.appBg}`}}>
                     <div className="flex space-x-1">
                        {settings.pages.map(page => (
                             <button 
                                key={page.path}
                                onClick={() => setActiveTab(page.path)}
                                className="px-3 py-1 text-sm rounded-md transition-colors"
                                style={{
                                    backgroundColor: activeTab === page.path ? settings.theme.appBg : 'transparent',
                                    color: activeTab === page.path ? settings.theme.primaryTextColor : settings.theme.secondaryTextColor
                                }}
                            >
                                {page.path}
                            </button>
                        ))}
                     </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-md transition-all"
                        style={{ backgroundColor: settings.theme.appBg, color: settings.theme.secondaryTextColor}}
                        aria-label="Copy code"
                    >
                        {copied ? <ClipboardCheckIcon className="w-5 h-5" style={{color: settings.theme.secondaryAccent}} /> : <ClipboardIcon className="w-5 h-5" />}
                    </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto max-h-80" style={{color: settings.theme.primaryTextColor}}>
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodePanel;