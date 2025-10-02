// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import React, { useState } from 'react';
import { SparklesIcon, LoaderIcon, AlertTriangleIcon } from './icons';

interface QuestionnaireProps {
    onSubmit: (answers: Record<string, string>) => void;
    isGenerating: boolean;
    error: string | null;
}

interface Question {
  id: string;
  section: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

const questions: Question[] = [
    { id: 'name', section: 'Core Identity', label: 'What is the name of your website/company?', type: 'text', placeholder: 'e.g., QuantumBank, Artisan Breads', required: true },
    { id: 'purpose', section: 'Core Identity', label: 'What is the primary purpose of your website?', type: 'textarea', placeholder: 'e.g., To sell handmade bread, to showcase my design portfolio...', required: true },
    { id: 'audience', section: 'Core Identity', label: 'Who is your target audience?', type: 'textarea', placeholder: 'e.g., Tech enthusiasts, local foodies, potential freelance clients.' },
    
    { id: 'style', section: 'Aesthetics', label: 'Describe the overall style or vibe.', type: 'text', placeholder: 'e.g., Professional & futuristic, warm & rustic, minimalist & clean' },
    { id: 'colors', section: 'Aesthetics', label: 'Any preferred colors?', type: 'text', placeholder: 'e.g., Dark blues and purples, earthy tones, black and white' },
    { id: 'theme', section: 'Aesthetics', label: 'Do you prefer a light or a dark theme?', type: 'select', options: [{value: 'dark', label: 'Dark Theme'}, {value: 'light', label: 'Light Theme'}] },
    
    { id: 'pages', section: 'Content & Structure', label: 'What pages do you need?', type: 'text', placeholder: 'Suggest: Home, About, Services, Contact, Blog' },
    { id: 'homeMessage', section: 'Content & Structure', label: 'For the Home page, what is the main message/headline?', type: 'textarea', placeholder: 'e.g., "The Future of Baking, Today."' },
    { id: 'features', section: 'Content & Structure', label: 'What are 3-5 key features, services, or products?', type: 'textarea', placeholder: 'List each on a new line. e.g.,\n- Sourdough Loaves\n- Croissants\n- Custom Cakes' },
    { id: 'about', section: 'Content & Structure', label: 'Tell me about your company/project for the "About Us" page.', type: 'textarea', placeholder: 'Describe your mission, history, and team.' },
    
    { id: 'tone', section: 'Brand Voice', label: 'What tone of voice should the website copy have?', type: 'text', placeholder: 'e.g., Formal, conversational, witty, inspiring' },
    { id: 'tagline', section: 'Brand Voice', label: 'Do you have a slogan or tagline?', type: 'text', placeholder: 'e.g., "Banking at the speed of light."' },
    
    { id: 'extra', section: 'Final Touches', label: 'Is there anything else you want to include or avoid?', type: 'textarea', placeholder: 'e.g., "Please include customer testimonials." or "Do not use stock photos of people in suits."' },
];

const sections = [...new Set(questions.map(q => q.section))];

const Questionnaire: React.FC<QuestionnaireProps> = ({ onSubmit, isGenerating, error }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({
        name: 'QuantumBank',
        purpose: 'A high-tech financial company exploring the intersection of quantum computing and finance.',
        audience: 'Investors, researchers, and tech enthusiasts interested in fintech.',
        style: 'Dark, futuristic, and professional with a high-tech feel.',
        colors: 'Deep blues, purples, with bright cyan accents.',
        theme: 'dark',
        pages: 'Home, About Us, Research, Philosophy, Login/Sign-Up, User Dashboard',
        homeMessage: 'QuantumBank: The Future of Finance is Here.',
        features: '- Quantum-secured transactions\n- AI-powered investment analysis\n- Decentralized financial instruments',
        about: 'Founded by leading quantum physicists and financial experts, QuantumBank is pioneering the next generation of financial technology.',
        tone: 'Authoritative, innovative, and forward-thinking.',
        tagline: 'Banking at the speed of light.',
        extra: 'The design should feel sleek and sophisticated, almost like science fiction made real.'
    });

    const handleChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    const inputStyle: React.CSSProperties = {
        backgroundColor: '#374151',
        borderColor: '#4b5563',
        color: '#f9fafb'
    };
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start bg-dark-bg text-light-text font-sans p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Build Your Website</h1>
                    <p className="text-medium-text">Answer these questions to give the AI a creative brief for your project.</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-md p-3 flex items-start space-x-2">
                        <AlertTriangleIcon className="w-5 h-5 mt-0.5 shrink-0"/>
                        <span>{error}</span>
                    </div>
                )}

                {sections.map(section => (
                    <div key={section} className="p-6 bg-dark-card rounded-lg border border-dark-input">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">{section}</h2>
                        <div className="space-y-4">
                            {questions.filter(q => q.section === section).map(q => (
                                <div key={q.id}>
                                    <label htmlFor={q.id} className="block text-sm font-medium mb-1 text-medium-text">{q.label}{q.required && <span className="text-red-400">*</span>}</label>
                                    {q.type === 'textarea' ? (
                                        <textarea
                                            id={q.id}
                                            value={answers[q.id] || ''}
                                            onChange={e => handleChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            required={q.required}
                                            rows={3}
                                            className="w-full rounded-md p-2 text-sm"
                                            style={inputStyle}
                                        />
                                    ) : q.type === 'select' ? (
                                        <select
                                            id={q.id}
                                            value={answers[q.id] || ''}
                                            onChange={e => handleChange(q.id, e.target.value)}
                                            required={q.required}
                                            className="w-full rounded-md p-2 text-sm"
                                            style={inputStyle}
                                        >
                                            <option value="" disabled>Select an option</option>
                                            {q.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={q.type}
                                            id={q.id}
                                            value={answers[q.id] || ''}
                                            onChange={e => handleChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            required={q.required}
                                            className="w-full rounded-md p-2 text-sm"
                                            style={inputStyle}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="pt-4">
                    <button type="submit" disabled={isGenerating} className="w-full flex items-center justify-center p-3 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg bg-secondary hover:bg-opacity-80">
                        {isGenerating ? <LoaderIcon className="w-6 h-6 animate-spin" /> : <SparklesIcon className="w-6 h-6 mr-2" />}
                        {isGenerating ? 'Generating...' : 'Generate My Website'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Questionnaire;
