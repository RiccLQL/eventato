import { execa } from 'execa';
import chalk from 'chalk';

export async function checkDependencies(): Promise<void> {
  // Check if Cursor is installed
  try {
    await execa('cursor-agent', ['--version']);
  } catch {
    throw new Error(
      'Cursor CLI is not installed or not in PATH. Please install Cursor and ensure the CLI is available.'
    );
  }

  console.log(chalk.green('✅ Cursor CLI is available'));
}
