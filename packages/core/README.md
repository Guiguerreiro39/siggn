# @siggn/core

A lightweight and type-safe event-driven pub/sub system for TypeScript projects.

## Features

- **Type-Safe**: Leverages TypeScript to ensure that message payloads are correct at compile and
  runtime.
- **Lightweight**: Zero dependencies and a minimal API surface.
- **Simple API**: Easy to learn and use, with a clear and concise API.

## Installation

You can install the package using your favorite package manager:

```bash
npm install @siggn/core
```

```bash
yarn add @siggn/core
```

```bash
pnpm add @siggn/core
```

## Usage

Here's a basic example of how to use Siggn:

```typescript
import { Siggn } from '@siggn/core';

// 1. Define your message types
type Message =
  | { type: 'user_created'; userId: string; name: string }
  | { type: 'user_deleted'; userId: string };

// 2. Create a new Siggn instance
const siggn = new Siggn<Message>();

// 3. Subscribe to events
// Use a unique ID for each subscriber to manage subscriptions
const subscriberId = 'analytics-service';

siggn.subscribe(subscriberId, 'user_created', (msg) => {
  console.log(`[Analytics] New user created: ${msg.name} (ID: ${msg.userId})`);
});

// 4. Publish events
siggn.publish({ type: 'user_created', userId: '123', name: 'John Doe' });
// Output: [Analytics] New user created: John Doe (ID: 123)

// 5. Unsubscribe from all events for a given ID
siggn.unsubscribe(subscriberId);

siggn.publish({ type: 'user_created', userId: '456', name: 'Jane Doe' });
// No output, because the subscriber was removed.
```

### Using the `make` helper

The `make` method simplifies managing subscriptions for a specific component or service.

```typescript
const userComponent = siggn.make('user-component');

userComponent.subscribe('user_deleted', (msg) => {
  console.log(`[UI] User ${msg.userId} was deleted. Updating view...`);
});

siggn.publish({ type: 'user_deleted', userId: '123' });
// Output: [UI] User 123 was deleted. Updating view...

// Unsubscribe from all subscriptions made by 'user-component'
userComponent.unsubscribe();
```

### Subscribing to multiple events

You can use `subscribeMany` to group subscriptions for a single subscriber.

```typescript
const auditService = siggn.make('audit-service');

auditService.subscribeMany((subscribe) => {
  subscribe('user_created', (msg) => {
    console.log(`[Audit] User created: ${msg.name}`);
  });
  subscribe('user_deleted', (msg) => {
    console.log(`[Audit] User deleted: ${msg.userId}`);
  });
});

siggn.publish({ type: 'user_created', userId: '789', name: 'Peter Pan' });
siggn.publish({ type: 'user_deleted', userId: '123' });

// Unsubscribe from all audit-service events
auditService.unsubscribe();
```

## API

### `new Siggn<T>()`

Creates a new message bus instance. `T` is a union type of all possible messages.

### `publish(msg)`

Publishes a message to all relevant subscribers.

### `subscribe(id, type, callback)`

Subscribes a callback to a specific message type with a unique subscriber ID.

### `unsubscribe(id)`

Removes all subscriptions associated with a specific subscriber ID.

### `make(id)`

Returns a helper object with `subscribe`, `subscribeMany`, and `unsubscribe` methods pre-bound to
the provided ID. This is useful for encapsulating subscription logic within a component or service.

### `subscribeMany(id, setup)`

A convenience method to subscribe to multiple message types for a single ID.

## License

This project is licensed under the [MIT License](LICENSE).
