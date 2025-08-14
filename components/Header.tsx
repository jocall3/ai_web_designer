
import React from 'react';
import { HeaderSettings, ThemeSettings, Page } from '../types';

interface HeaderProps {
    settings: HeaderSettings;
    theme: ThemeSettings;
}

const Header: React.FC<HeaderProps> = ({ settings, theme }) => {
    return (
        <header style={{ backgroundColor: theme.headerBg, color: theme.primaryTextColor, padding: '1rem 2rem' }}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1" />
                    ) : (
                         <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{backgroundColor: theme.appBg}}></div>
                    )}
                    <h1 className="text-2xl font-bold">{settings.title}</h1>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    {(settings.navLinks || []).map((link) => (
                        <a key={link.href} href={link.href} style={{ color: theme.secondaryTextColor }} className="hover:text-white transition-colors">{link.text}</a>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
