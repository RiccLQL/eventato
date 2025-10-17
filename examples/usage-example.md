# Usage Example

This example demonstrates how to use `eventato` to add PostHog analytics to a React component.

## Before Running the Tool

Here's a typical React component before adding analytics:

```jsx
// src/components/UserRegistration.jsx
import React, { useState } from 'react';

const UserRegistration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('User registered successfully');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="registration-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserRegistration;
```

## Running the Tool

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the tool
eventato add-events --feature "User Registration"
```

## Interactive Session

```
🚀 Eventato
Adding PostHog analytics events to your codebase...

✅ PostHog setup detected
✅ Found PostHog setup: react
   Import: import { PostHog } from 'posthog-js/react'
   Usage: posthog.capture()

? What feature are you adding events for? User Registration
? What events do you want to track? (comma-separated) user_registration_started, user_registration_completed, user_registration_failed
? Any additional context about these events? (optional) Track user journey through registration flow

📋 Summary:
   Feature: User Registration
   Events: user_registration_started, user_registration_completed, user_registration_failed
   Context: Track user journey through registration flow
   Directory: /Users/you/project

✅ Found 3 relevant files
✅ Changes applied successfully!

✅ Success!
PostHog events have been added to your codebase.
Review the changes and commit them to your repository.
```

## After Running the Tool

The tool will automatically modify your code to include PostHog events:

```jsx
// src/components/UserRegistration.jsx
import React, { useState } from 'react';
import posthog from 'posthog-js';

const UserRegistration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // PostHog analytics event
    posthog.capture('user_registration_started', {
      timestamp: new Date().toISOString(),
      email_domain: email.split('@')[1] // Track email domain for insights
    });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // PostHog analytics event
      posthog.capture('user_registration_completed', {
        timestamp: new Date().toISOString(),
        email_domain: email.split('@')[1],
        registration_method: 'email'
      });
      
      console.log('User registered successfully');
    } catch (error) {
      // PostHog analytics event
      posthog.capture('user_registration_failed', {
        timestamp: new Date().toISOString(),
        error_message: error.message,
        email_domain: email.split('@')[1]
      });
      
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="registration-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserRegistration;
```

## Key Features Demonstrated

1. **Automatic PostHog Import**: The tool detects your PostHog setup and adds the appropriate import
2. **Smart Event Placement**: Events are placed at logical points in your code flow
3. **Contextual Properties**: The tool adds relevant properties like timestamps and derived data
4. **Error Handling**: Failed events are tracked with error context
5. **Code Style Preservation**: The tool maintains your existing code style and patterns

## Next Steps

1. Review the generated code
2. Test the analytics events in your development environment
3. Commit the changes to your repository
4. Monitor the events in your PostHog dashboard
