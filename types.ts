
export type BlockType = 'hero' | 'textWithImage' | 'featureList' | 'form' | 'text';

export interface BaseBlock {
    type: BlockType;
    id: string;
}

export interface HeroBlock extends BaseBlock {
    type: 'hero';
    headline: string;
    subheadline: string;
    bgImage: string;
    headlineColor: string;
    subheadlineColor: string;
}

export interface TextWithImageBlock extends BaseBlock {
    type: 'textWithImage';
    headline: string;
    text: string;
    image: string;
    imagePosition: 'left' | 'right';
}

export interface FeatureListBlock extends BaseBlock {
    type: 'featureList';
    headline: string;
    features: { title: string, description: string, icon?: string }[];
}

export interface FormBlock extends BaseBlock {
    type: 'form';
    headline: string;
    fields: { label: string, type: 'text' | 'email' | 'password', name: string }[];
    submitButtonText: string;
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    headline: string;
    paragraphs: string[];
}


export type ContentBlock = HeroBlock | TextWithImageBlock | FeatureListBlock | FormBlock | TextBlock;

export interface Page {
    path: string; // e.g. "index.html"
    name: string; // e.g. "Home"
    contentBlocks: ContentBlock[];
}

export interface HeaderSettings {
    title: string;
    logoUrl: string;
    navLinks: { text: string; href: string }[];
}

export interface FooterSettings {
    text: string;
    links: { text: string; href: string }[];
}

export interface ThemeSettings {
    appBg: string;
    panelBg: string;
    headerBg: string;
    footerBg: string;
    primaryTextColor: string;
    secondaryTextColor: string;
    primaryAccent: string;
    secondaryAccent: string;
    fontFamily: string;
}

export interface WebsiteSettings {
    theme: ThemeSettings;
    header: HeaderSettings;
    pages: Page[];
    footer: FooterSettings;
}
