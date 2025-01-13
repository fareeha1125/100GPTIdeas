'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadIdeas, searchIdeas, getCategories, getIdeasByCategory } from '@/utils/data';
import { GPTIdea } from '@/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState('Top Picks');
  
  const ideas = loadIdeas();
  const categories = getCategories(ideas);
  const filteredIdeas = searchTerm ? searchIdeas(ideas, searchTerm) : ideas;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const renderIdeasGrid = (categoryIdeas: GPTIdea[], expanded: boolean) => {
    const displayIdeas = expanded ? categoryIdeas : categoryIdeas.slice(0, 6);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {displayIdeas.map((idea) => (
          <Link
            key={idea.name}
            href={`/idea/${encodeURIComponent(idea.name)}`}
            className="block p-6 bg-[#2A2A2A] rounded-lg hover:bg-[#333333] transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{idea.name}</h3>
            <p className="text-gray-400 text-sm">{idea.description}</p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#1E1E1E] text-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">100 GPT Ideas</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Explore cutting-edge concepts and bring your futuristic vision to life
          </p>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto px-4 mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search GPTs"
              className="w-full px-12 py-3 bg-[#2A2A2A] rounded-full border border-gray-700 focus:outline-none focus:border-gray-500 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex justify-center space-x-8 px-4 min-w-max mx-auto">
            {['Top Picks', ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-16">
          <div className="px-4 mb-8">
            <h2 className="text-3xl font-bold">Featured</h2>
            <p className="text-gray-400">Curated top picks from this week</p>
          </div>
          {categories.map((category) => {
            const categoryIdeas = getIdeasByCategory(filteredIdeas, category);
            if (categoryIdeas.length === 0) return null;
            
            const isExpanded = expandedCategories[category] || false;
            const showSeeMore = categoryIdeas.length > 6;

            return (
              <section key={category} className="mb-16">
                <div className="flex justify-between items-center px-4 mb-6">
                  <h2 className="text-2xl font-bold">{category}</h2>
                  {showSeeMore && (
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isExpanded ? 'Show Less' : 'See More'}
                    </button>
                  )}
                </div>
                {renderIdeasGrid(categoryIdeas, isExpanded)}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
