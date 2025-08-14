import React from 'react';
import { ThemeSettings } from '../types';
import { SparklesIcon } from './icons';

interface LogoPickerProps {
    logos: string[];
    onSelect: (logoUrl: string) => void;
    theme: ThemeSettings;
}

const LogoPicker: React.FC<LogoPickerProps> = ({ logos, onSelect, theme }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div
                className="rounded-lg shadow-2xl w-full max-w-2xl border"
                style={{ backgroundColor: theme.panelBg, borderColor: theme.appBg }}
            >
                <div className="p-6 border-b" style={{borderColor: theme.appBg}}>
                     <h2 className="text-2xl font-bold flex items-center" style={{ color: theme.primaryTextColor }}>
                        <SparklesIcon className="w-6 h-6 mr-3" style={{color: theme.secondaryAccent}} />
                        Choose Your Logo
                    </h2>
                    <p className="mt-1 text-sm" style={{color: theme.secondaryTextColor}}>The AI has generated these logo options. Pick your favorite to continue.</p>
                </div>

                <div className="p-6 grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {logos.map((logo, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(logo)}
                            className="aspect-square rounded-md bg-white/10 p-2 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 hover:ring-2"
                            style={{ '--tw-ring-color': theme.primaryAccent } as React.CSSProperties}
                        >
                            <img src={logo} alt={`Logo option ${index + 1}`} className="max-w-full max-h-full object-contain" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoPicker;