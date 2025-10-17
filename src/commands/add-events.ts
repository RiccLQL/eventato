import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { detectPostHogSetup } from '../utils/posthog-detector';
import { generateEventCode } from '../utils/code-generator';
import { findRelevantFiles } from '../utils/file-finder';

export interface AddEventsOptions {
  feature?: string;
  directory?: string;
  dryRun?: boolean;
}

export async function addEventsCommand(options: AddEventsOptions): Promise<void> {
  const workingDir = options.directory || process.cwd();
  
  // Check if we're in a git repository
  try {
    await execa('git', ['rev-parse', '--git-dir'], { cwd: workingDir });
  } catch {
    throw new Error('Not in a git repository. Please run this command from a git repository.');
  }

  // Detect PostHog setup
  const spinner = ora('Detecting PostHog setup...').start();
  const posthogSetup = await detectPostHogSetup(workingDir);
  spinner.succeed('PostHog setup detected');

  if (!posthogSetup) {
    throw new Error('No PostHog setup detected. Please ensure PostHog is installed and configured in your project.');
  }

  console.log(chalk.green(`✅ Found PostHog setup: ${posthogSetup.type}`));
  console.log(chalk.gray(`   Import: ${posthogSetup.importStatement}`));
  console.log(chalk.gray(`   Usage: ${posthogSetup.usagePattern}\n`));

  // Get feature name
  let featureName = options.feature;
  if (!featureName) {
    const { feature } = await inquirer.prompt([
      {
        type: 'input',
        name: 'feature',
        message: 'What feature are you adding events for?',
        validate: (input: string) => input.trim().length > 0 || 'Feature name is required'
      }
    ]);
    featureName = feature.trim();
  }

  // Get events to track
  const { events } = await inquirer.prompt([
    {
      type: 'input',
      name: 'events',
      message: 'What events do you want to track? (comma-separated)',
      validate: (input: string) => {
        const events = input.split(',').map(e => e.trim()).filter(e => e.length > 0);
        return events.length > 0 || 'At least one event is required';
      }
    }
  ]);

  const eventList = events.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);

  // Get additional context
  const { context } = await inquirer.prompt([
    {
      type: 'input',
      name: 'context',
      message: 'Any additional context about these events? (optional)',
      default: ''
    }
  ]);

  console.log(chalk.blue('\n📋 Summary:'));
  console.log(chalk.gray(`   Feature: ${featureName}`));
  console.log(chalk.gray(`   Events: ${eventList.join(', ')}`));
  console.log(chalk.gray(`   Context: ${context || 'None'}`));
  console.log(chalk.gray(`   Directory: ${workingDir}\n`));

  if (options.dryRun) {
    console.log(chalk.yellow('🔍 Dry run mode - no changes will be made'));
    return;
  }

  // Find relevant files
  const fileSpinner = ora('Finding relevant files...').start();
  const relevantFiles = await findRelevantFiles(workingDir, featureName!);
  fileSpinner.succeed(`Found ${relevantFiles.length} relevant files`);

  if (relevantFiles.length === 0) {
    console.log(chalk.yellow('⚠️  No relevant files found. You may need to specify the feature more specifically.'));
    return;
  }

  // Generate and apply changes using Cursor
  const cursorSpinner = ora('Applying changes with Cursor...').start();
  
  try {
    await applyChangesWithCursor(workingDir, featureName!, eventList, context, posthogSetup, relevantFiles);
    cursorSpinner.succeed('Changes applied successfully!');
    
    console.log(chalk.green.bold('\n✅ Success!'));
    console.log(chalk.gray('PostHog events have been added to your codebase.'));
    console.log(chalk.gray('Review the changes and commit them to your repository.'));
  } catch (error) {
    cursorSpinner.fail('Failed to apply changes');
    throw error;
  }
}

async function applyChangesWithCursor(
  workingDir: string,
  featureName: string,
  events: string[],
  context: string,
  posthogSetup: any,
  relevantFiles: string[]
): Promise<void> {
  const prompt = `Add PostHog analytics events for the "${featureName}" feature.

Events to track: ${events.join(', ')}

Context: ${context || 'No additional context provided'}

PostHog setup detected:
- Type: ${posthogSetup.type}
- Import: ${posthogSetup.importStatement}
- Usage pattern: ${posthogSetup.usagePattern}

Please add the appropriate PostHog event tracking calls in the relevant files. Make sure to:
1. Import PostHog if not already imported
2. Add event tracking calls at the appropriate locations
3. Use meaningful event names and properties
4. Follow the existing code style and patterns
5. Add comments explaining the analytics events

Files to focus on: ${relevantFiles.join(', ')}`;

  try {
    await execa('cursor-agent', [
      '--print',
      '--force',
      prompt
    ], {
      cwd: workingDir,
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Failed to run Cursor agent: ${error instanceof Error ? error.message : error}`);
  }
}
