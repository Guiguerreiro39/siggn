[![npm version](https://badge.fury.io/js/%40siggn%2Freact.svg)](https://www.npmjs.com/package/%40siggn%2Freact)

# @siggn/react

React package for `@siggn/core`, providing a simple and idiomatic way to integrate the message bus with your React components.

## Features

- **Seamless Integration**: Hooks-based API that feels natural in React.
- **Automatic Cleanup**: Subscriptions are automatically managed throughout the component lifecycle.
- **Type-Safe**: Full TypeScript support, inheriting the type safety of `@siggn/core`.

## Installation

```bash
npm install @siggn/react
```

```bash
yarn add @siggn/react
```

```bash
pnpm add @siggn/react
```

## Usage

The primary way to use `@siggn/react` is by creating a `Siggn` instance and sharing it across your application. You can do this using React Context or by exporting a singleton instance.

### 1. Create a Siggn Instance

It's recommended to create a single `Siggn` instance and share it throughout your app.

```typescript
// src/siggn.ts
import { Siggn } from '@siggn/react';

// Define your message types
export type Message =
  | { type: 'user_login'; name: string }
  | { type: 'user_logout' };

// Create and export the instance
export const siggn = new Siggn<Message>();
```

Alternatively, you can use the `useSiggn` hook to create a `Siggn` instance that is scoped to a component and its children.

### 2. Subscribe to Events in a Component

Use the `useSubscribe` hook to listen for a message. It automatically handles subscribing and unsubscribing.

```tsx
// src/components/Notification.tsx
import { useState } from 'react';
import { useSubscribe } from '@siggn/react';
import { siggn, type Message } from '../siggn';

function Notification() {
  const [notification, setNotification] = useState<string | null>(null);

  useSubscribe(siggn, 'user_login', (msg) => {
    setNotification(`Welcome, ${msg.name}!`);
  });

  if (!notification) {
    return null;
  }

  return <div className='notification'>{notification}</div>;
}
```

You can also use the `useSubscribeMany` hook to listen for multiple messages. It automatically handles subscribing and unsubscribing.

```tsx
// src/components/Notification.tsx
import { useState } from 'react';
import { useSubscribeMany } from '@siggn/react';
import { siggn, type Message } from '../siggn';

function Notification() {
  const [notification, setNotification] = useState<string | null>(null);

  useSubscribeMany(siggn, (subscribe) => {
    subscribe('user_login', (msg) => {
      setNotification(`Welcome, ${msg.name}!`);
    });

    subscribe('user_logout', () => {
      setNotification('You have been logged out.');
    });
  });

  if (!notification) {
    return null;
  }

  return <div className='notification'>{notification}</div>;
}
```

### 3. Publish Events

You can publish events from anywhere in your application.

```tsx
// src/components/AuthButton.tsx
import { siggn } from '../siggn';

function AuthButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const handleClick = () => {
    if (isLoggedIn) {
      siggn.publish({ type: 'user_logout' });
    } else {
      siggn.publish({ type: 'user_login', name: 'Jane Doe' });
    }
  };

  return <button onClick={handleClick}>{isLoggedIn ? 'Log Out' : 'Log In'}</button>;
}
```

### Subscribing to All Events

If you need to listen to all messages, you can use `useSubscribeAll`. This is useful for cross-cutting concerns like logging or analytics.

```tsx
// src/components/Logger.tsx
import { useSubscribeAll } from '@siggn/react';
import { siggn } from '../siggn';

function Logger() {
  useSubscribeAll(siggn, (msg) => {
    console.log(`[Logger] Event of type ${msg.type} was triggered`);
  });

  return null; // This component does not render anything
}
```

### Using `useSiggn`

The `useSiggn` hook creates a `Siggn` instance that is tied to the component's lifecycle. This can be useful for local, component-specific event buses.

```tsx
import { useSiggn, useSubscribe } from '@siggn/react';

type LocalMessage = { type: 'local_event' };

function LocalComponent() {
  const localSiggn = useSiggn<LocalMessage>();

  useSubscribe(localSiggn, (subscribe) => {
    subscribe('local_event', () => {
      console.log('Local event received!');
    });
  });

  const triggerEvent = () => {
    localSiggn.publish({ type: 'local_event' });
  };

  return <button onClick={triggerEvent}>Trigger Local Event</button>;
}
```

### Using Middleware

You can use the `useMiddleware` hook to register middleware for a `Siggn` instance. The middleware intercepts messages before they are delivered to subscribers and is automatically unregistered when the component unmounts.

```tsx
import { useMiddleware } from '@siggn/react';
import { siggn } from '../siggn';

function LoggerComponent() {
  useMiddleware(siggn, (msg, next) => {
    console.log('Middleware:', msg);
    next();
  });

  return null;
}
```

## API

### `useSiggn<T>()`

Creates and returns a `Siggn` instance that persists for the lifetime of the component.

- `T`: A union type of all possible messages.

Returns a `Siggn<T>` instance.

### `useSubscribe(options, type, callback, deps)`

Subscribes to a single message type and automatically unsubscribes when the component unmounts.

- `options`: A `Siggn` instance or an object `{ instance: Siggn<T>; id?: string; }`.
- `type`: The message type to subscribe to.
- `callback`: The function to call when the message is received.
- `deps` (optional): A dependency array to control when the subscription is re-created.

### `useSubscribeMany(options, setup, deps)`

Subscribes to multiple message types and automatically unsubscribes when the component unmounts.

- `options`: A `Siggn` instance or an object `{ instance: Siggn<T>; id?: string; }`.
- `setup`: A function that receives a `subscribe` helper to define subscriptions.
- `deps` (optional): A dependency array to control when the subscriptions are re-created.

### `useSubscribeAll(options, callback, deps)`

Subscribes to all messages and automatically unsubscribes when the component unmounts.

- `options`: A `Siggn` instance or an object `{ instance: Siggn<T>; id?: string; }`.
- `deps` (optional): A dependency array to control when the subscriptions are re-created.

### `useMiddleware(instance, middleware, deps)`

Registers a middleware and automatically unregisters it when the component unmounts.

- `instance`: A `Siggn` instance.
- `middleware`: The middleware function.
- `deps` (optional): A dependency array to control when the middleware is re-registered.

## License

This project is licensed under the [MIT License](LICENSE).
