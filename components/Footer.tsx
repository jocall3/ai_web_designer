
import React from 'react';
import { FooterSettings, ThemeSettings } from '../types';

interface FooterProps {
    settings: FooterSettings;
    theme: ThemeSettings;
}

const Footer: React.FC<FooterProps> = ({ settings, theme }) => {
    return (
        <footer style={{ backgroundColor: theme.footerBg, color: theme.secondaryTextColor }} className="py-6 px-4 mt-auto">
            <div className="container mx-auto text-center">
                <p>{settings.text}</p>
                <div className="mt-2 flex justify-center space-x-4">
                    {(settings.links || []).map((link, index) => (
                        <a key={index} href={link.href} style={{color: theme.secondaryTextColor}} className="hover:text-white transition-colors">{link.text}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
