import ideasData from '@/data/ideas.json';
import { GPTIdea } from '@/types';

export const loadIdeas = (): GPTIdea[] => {
  return ideasData;
};

export const searchIdeas = (ideas: GPTIdea[], searchTerm: string): GPTIdea[] => {
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  return ideas.filter(
    (idea) =>
      idea.name.toLowerCase().includes(lowercaseSearchTerm) ||
      idea.description.toLowerCase().includes(lowercaseSearchTerm) ||
      idea.category.toLowerCase().includes(lowercaseSearchTerm)
  );
};

export const getCategories = (ideas: GPTIdea[]): string[] => {
  const categories = new Set(ideas.map((idea) => idea.category));
  return Array.from(categories).sort();
};

export const getIdeasByCategory = (ideas: GPTIdea[], category: string): GPTIdea[] => {
  return ideas.filter((idea) => idea.category === category);
};
