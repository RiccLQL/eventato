import { glob } from 'glob';
import path from 'path';

export async function findRelevantFiles(workingDir: string, featureName: string): Promise<string[]> {
  const patterns = [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.py',
    '**/*.vue'
  ];

  const allFiles = await glob(patterns, { 
    cwd: workingDir, 
    ignore: ['node_modules/**', 'dist/**', 'build/**', '**/*.test.*', '**/*.spec.*'] 
  });

  // Filter files based on feature name relevance
  const relevantFiles = allFiles.filter(file => {
    const fileName = path.basename(file).toLowerCase();
    const featureLower = featureName.toLowerCase();
    
    // Check if file name contains feature keywords
    return fileName.includes(featureLower) || 
           fileName.includes('component') || 
           fileName.includes('page') || 
           fileName.includes('feature');
  });

  // If no specific matches, return common file types
  if (relevantFiles.length === 0) {
    return allFiles.slice(0, 10); // Return first 10 files as fallback
  }

  return relevantFiles.slice(0, 5); // Limit to 5 most relevant files
}
