
import React from 'react';
import { SparklesIcon } from './icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-bg text-light-text font-sans p-8">
      <div className="text-center max-w-3xl">
        <SparklesIcon className="w-16 h-16 mx-auto text-secondary mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold text-light-text mb-4">
          AI Website Architect
        </h1>
        <p className="text-lg md:text-xl text-medium-text mb-8">
          Welcome! Instead of code, you'll answer a series of questions about your vision. Our AI will then act as your creative director, designer, and content strategist to generate a complete, multi-page website tailored to your needs—from brand identity and color schemes to page layouts and content.
        </p>
        <button
          onClick={onStart}
          className="bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Start Building Your Website
        </button>
      </div>
       <div className="mt-16 text-center text-dark-text">
        <p>How it works:</p>
        <ol className="mt-2 space-y-2 list-decimal list-inside inline-block text-left">
            <li>Answer a guided questionnaire.</li>
            <li>The AI analyzes your responses.</li>
            <li>A complete website is generated.</li>
            <li>Fine-tune the results instantly.</li>
        </ol>
      </div>
    </div>
  );
};

export default WelcomeScreen;
