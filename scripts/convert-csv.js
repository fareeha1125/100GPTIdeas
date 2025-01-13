const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Read the CSV file
const csvFilePath = path.join(__dirname, '../../ideaslist.csv');
const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

// Parse CSV
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true
});

// Categories for classification
const categories = {
  'Writing': ['Story', 'Poetry', 'Grammar', 'Content', 'Writer'],
  'Education': ['Tutor', 'Teacher', 'Learning', 'Study', 'Education'],
  'Productivity': ['Planner', 'Tracker', 'Assistant', 'Helper', 'Organizer'],
  'Entertainment': ['Game', 'Quiz', 'Riddle', 'Fun', 'Entertainment'],
  'Language': ['Translator', 'Language', 'Dictionary', 'Translation'],
  'Lifestyle': ['Health', 'Fitness', 'Diet', 'Meditation', 'Lifestyle']
};

// Function to assign category
function assignCategory(name) {
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
}

// Convert records to TypeScript array
const ideas = records.map(record => ({
  name: record.Name,
  description: record.Description,
  prompt: record.Prompt,
  category: assignCategory(record.Name)
}));

// Generate TypeScript code
const tsCode = `import { GPTIdea } from '@/types';

export const ideas: GPTIdea[] = ${JSON.stringify(ideas, null, 2)} as const;
`;

// Write to TypeScript file
const outputPath = path.join(__dirname, '../data/ideas.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, tsCode);

console.log('Conversion complete! Data written to src/data/ideas.ts');
