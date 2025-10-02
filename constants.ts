// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import { WebsiteSettings, ThemeSettings, HeaderSettings, FooterSettings, Page, HeroBlock } from './types';
import { nanoid } from 'https://esm.sh/nanoid';


export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
    appBg: '#111827',
    panelBg: '#1f2937',
    headerBg: '#1f2937',
    footerBg: '#1f2937',
    primaryTextColor: '#f9fafb',
    secondaryTextColor: '#d1d5db',
    primaryAccent: '#4f46e5',
    secondaryAccent: '#10b981',
    fontFamily: 'font-sans',
};

export const DEFAULT_HEADER_SETTINGS: HeaderSettings = {
    title: "My Awesome Site",
    logoUrl: '',
    navLinks: [],
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
    text: "© 2024 My Awesome Site. All rights reserved.",
    links: [
        { text: "Privacy Policy", href: "#"},
        { text: "Terms of Service", href: "#"},
    ]
};

const DEFAULT_INITIAL_PAGE: Page = {
    path: 'index.html',
    name: 'Home',
    contentBlocks: [
        {
            id: nanoid(),
            type: 'hero',
            headline: 'Welcome to Your AI-Generated Website',
            subheadline: 'Describe your vision and watch it come to life.',
            bgImage: '',
            headlineColor: '#ffffff',
            subheadlineColor: '#d1d5db',
        } as HeroBlock
    ]
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
    theme: DEFAULT_THEME_SETTINGS,
    header: DEFAULT_HEADER_SETTINGS,
    pages: [DEFAULT_INITIAL_PAGE],
    footer: DEFAULT_FOOTER_SETTINGS,
};


export const FONT_OPTIONS = [
  { value: 'font-sans', label: 'Sans-Serif' },
  { value: 'font-serif', label: 'Serif' },
  { value: 'font-mono', label: 'Monospace' },
];
