# Eventato

🚀 Automatically add PostHog analytics events to your codebase using Cursor's headless CLI.

## Overview

This tool streamlines the process of adding PostHog analytics events for product engineers. By the time your PR is up, the event calls should be up too - with minimal effort on your part.

## Features

- 🔍 **Auto-detection**: Automatically detects your PostHog setup and configuration
- 🎯 **Smart targeting**: Finds relevant files based on your feature name
- 🤖 **Cursor integration**: Uses Cursor's headless CLI to propose intelligent code changes
- 📝 **Interactive prompts**: Simple CLI interface to specify events and context
- 🔧 **Multi-language support**: Works with JavaScript, TypeScript, Python, and more

## Installation

```bash
npm install -g eventato
```

## Prerequisites

- Node.js 16+
- Cursor IDE with CLI access
- PostHog setup in your project

## Usage

### Basic Usage
```bash
# Run in your project directory
eventato add-events
```

### With Feature Name
```bash
eventato add-events --feature "User Onboarding"
```

### In Specific Directory
```bash
eventato add-events --feature "Payment Flow" --directory /path/to/project
```

### Dry Run
```bash
eventato add-events --feature "New Feature" --dry-run
```

## How It Works

1. **Detection**: The tool scans your codebase to detect your PostHog setup
2. **Interactive Setup**: Prompts you for the feature name and events to track
3. **File Discovery**: Finds relevant files based on your feature name
4. **Code Generation**: Uses Cursor's headless CLI to intelligently add PostHog events
5. **Review**: You review and commit the changes

## Example Workflow

```bash
$ eventato add-events

🚀 Eventato
Adding PostHog analytics events to your codebase...

✅ PostHog setup detected
✅ Found PostHog setup: react
   Import: import { PostHog } from 'posthog-js/react'
   Usage: posthog.capture()

? What feature are you adding events for? User Registration
? What events do you want to track? (comma-separated) user_signed_up, email_verified, profile_completed
? Any additional context about these events? (optional) Track user journey through registration

📋 Summary:
   Feature: User Registration
   Events: user_signed_up, email_verified, profile_completed
   Context: Track user journey through registration
   Directory: /Users/you/project

✅ Found 3 relevant files
✅ Changes applied successfully!

✅ Success!
PostHog events have been added to your codebase.
Review the changes and commit them to your repository.
```

## Supported PostHog Setups

- **JavaScript/TypeScript**: `posthog-js`
- **React**: `posthog-js/react`
- **Next.js**: `posthog-js/react` with Next.js integration
- **Python**: `posthog` Python library
- **Vue.js**: `posthog-js` with Vue integration

## Configuration

The tool automatically detects your PostHog setup by scanning your codebase for:
- Import statements
- Usage patterns
- Configuration files

## Troubleshooting

### Cursor CLI Not Found
```bash
# Ensure Cursor is installed and cursor-agent is in your PATH
which cursor-agent
```

### No PostHog Setup Detected
Make sure PostHog is properly installed and imported in your project:
```javascript
// JavaScript/React
import posthog from 'posthog-js'
// or
import { PostHog } from 'posthog-js/react'
```

```python
# Python
import posthog
```

### No Relevant Files Found
Try being more specific with your feature name or check that you're in the correct directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/RiccLQL/auto-create-events)
- 🐛 [Issues](https://github.com/RiccLQL/auto-create-events/issues)
- 💬 [Discussions](https://github.com/RiccLQL/auto-create-events/discussions)
