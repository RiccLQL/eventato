import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export interface PostHogSetup {
  type: 'javascript' | 'react' | 'nextjs' | 'vue' | 'angular' | 'python' | 'unknown';
  importStatement: string;
  usagePattern: string;
  files: string[];
}

export async function detectPostHogSetup(workingDir: string): Promise<PostHogSetup | null> {
  const patterns = [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.py',
    '**/*.vue'
  ];

  const files = await glob(patterns, { cwd: workingDir, ignore: ['node_modules/**', 'dist/**', 'build/**'] });
  
  for (const file of files) {
    const filePath = path.join(workingDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Check for PostHog imports and usage
    if (content.includes('posthog') || content.includes('PostHog')) {
      const setup = analyzePostHogUsage(content, file);
      if (setup) {
        return {
          ...setup,
          files: [file]
        };
      }
    }
  }

  return null;
}

function analyzePostHogUsage(content: string, filePath: string): Omit<PostHogSetup, 'files'> | null {
  // JavaScript/TypeScript patterns
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    if (content.includes('import posthog') || content.includes('from \'posthog-js\'')) {
      return {
        type: 'javascript',
        importStatement: 'import posthog from \'posthog-js\'',
        usagePattern: 'posthog.capture()'
      };
    }
    
    if (content.includes('import { PostHog }') || content.includes('from \'posthog-js/react\'')) {
      return {
        type: 'react',
        importStatement: 'import { PostHog } from \'posthog-js/react\'',
        usagePattern: 'posthog.capture()'
      };
    }
  }

  // Python patterns
  if (filePath.endsWith('.py')) {
    if (content.includes('import posthog') || content.includes('from posthog')) {
      return {
        type: 'python',
        importStatement: 'import posthog',
        usagePattern: 'posthog.capture()'
      };
    }
  }

  return null;
}
