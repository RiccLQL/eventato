export function generateEventCode(eventName: string, posthogSetup: any): string {
  const { type, usagePattern } = posthogSetup;
  
  switch (type) {
    case 'javascript':
    case 'react':
      return generateJavaScriptEvent(eventName);
    case 'python':
      return generatePythonEvent(eventName);
    default:
      return generateGenericEvent(eventName);
  }
}

function generateJavaScriptEvent(eventName: string): string {
  return `// PostHog analytics event
posthog.capture('${eventName}', {
  // Add relevant properties here
  timestamp: new Date().toISOString(),
  // Add more properties as needed
});`;
}

function generatePythonEvent(eventName: string): string {
  return `# PostHog analytics event
posthog.capture('${eventName}', {
    # Add relevant properties here
    'timestamp': datetime.now().isoformat(),
    # Add more properties as needed
})`;
}

function generateGenericEvent(eventName: string): string {
  return `// PostHog analytics event for ${eventName}
// Add your PostHog capture call here with appropriate properties`;
}
