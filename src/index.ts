#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addEventsCommand } from './commands/add-events';
import { checkDependencies } from './utils/dependencies';
import { version } from '../package.json';

const program = new Command();

program
  .name('eventato')
  .description('Automatically add PostHog analytics events to your codebase using Cursor\'s headless CLI')
  .version(version);

// Add events command
program
  .command('add-events')
  .description('Add PostHog analytics events for a feature')
  .option('-f, --feature <feature>', 'Name of the feature to add events for')
  .option('-d, --directory <directory>', 'Directory to work in (defaults to current directory)')
  .option('--dry-run', 'Show what would be done without making changes')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('🚀 Eventato'));
      console.log(chalk.gray('Adding PostHog analytics events to your codebase...\n'));

      // Check dependencies
      await checkDependencies();

      await addEventsCommand(options);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Default command
program
  .command('*')
  .action(() => {
    console.log(chalk.yellow('Please specify a command. Use --help for more information.'));
    program.help();
  });

program.parse();
