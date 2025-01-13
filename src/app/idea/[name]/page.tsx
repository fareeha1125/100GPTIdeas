'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { loadIdeas } from '@/utils/data';
import { GPTIdea } from '@/types';

export default function IdeaPage({ params }: { params: Promise<{ name: string }> }) {
  const [copied, setCopied] = useState(false);
  const resolvedParams = use(params);
  
  const ideas: GPTIdea[] = loadIdeas();
  const idea = ideas.find(i => i.name === decodeURIComponent(resolvedParams.name));

  if (!idea) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Idea not found</h1>
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(idea.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#1E1E1E] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Ideas
        </Link>

        {/* Idea header */}
        <div className="bg-[#2A2A2A] rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-[#333333] text-sm rounded-full text-gray-300 mb-4">
                {idea.category}
              </span>
              <h1 className="text-3xl font-bold mb-4">{idea.name}</h1>
              <p className="text-gray-400 text-lg">{idea.description}</p>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-[#2A2A2A] rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-8">Implementation Guide</h2>
          
          {/* Step 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333333] text-sm mr-2">1</span>
              Copy the prompt
            </h3>
            <div className="relative">
              <pre className="bg-[#333333] p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                {idea.prompt}
              </pre>
              <button
                onClick={copyPrompt}
                className="absolute top-2 right-2 px-3 py-1 bg-[#4A4A4A] text-white rounded hover:bg-[#5A5A5A] text-sm transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333333] text-sm mr-2">2</span>
              Create a new chat in ChatGPT
            </h3>
            <p className="text-gray-400">
              Open ChatGPT and start a new conversation to implement this idea.
            </p>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333333] text-sm mr-2">3</span>
              Paste the prompt
            </h3>
            <p className="text-gray-400">
              Paste the copied prompt into ChatGPT and replace the placeholder values (in curly braces) with your specific requirements.
            </p>
          </div>

          {/* Step 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333333] text-sm mr-2">4</span>
              Start the conversation
            </h3>
            <p className="text-gray-400">
              Begin interacting with your customized GPT. Feel free to modify the prompt or add additional context as needed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
