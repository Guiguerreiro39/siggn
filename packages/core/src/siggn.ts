import type { Msg, Subscription, SiggnId, Middleware } from './types.js';

/**
 * A type-safe message bus for dispatching and subscribing to events.
 * @template T A union of all possible message types.
 * @since 0.0.5
 */
export class Siggn<M extends Msg> {
  private nextId = 0;
  private subscriptions: Map<M['type'], Array<Subscription<M, any>>>;
  private globalSubscriptions: Array<Subscription<M, any>>;
  private middlewares: Middleware<M>[];

  /**
   * Creates a new Siggn instance.
   * @category Lifecycle
   * @since 0.0.5
   */
  constructor() {
    this.subscriptions = new Map();
    this.globalSubscriptions = [];
    this.middlewares = [];
  }

  use(mw: Middleware<M>) {
    this.middlewares.push(mw);
    return () => {
      this.middlewares = this.middlewares.filter((m) => m !== mw);
    };
  }

  /**
   * Creates a new, independent `Siggn` instance that inherits the message
   * types of its parent and adds new ones.
   *
   * @template C The new message types to add.
   * @returns A new `Siggn` instance with combined message types.
   * @category Lifecycle
   * @since 0.0.5
   * @example
   * 
```typescript
 * const baseSiggn = new Siggn<{ type: 'A' }>();
 * const childSiggn = baseSiggn.createClone<{ type: 'B' }>();
 * // childSiggn can now publish and subscribe to types 'A' and 'B'.
 * ```
   */
  createClone<C extends Msg>() {
    return new Siggn<M | C>();
  }

  /**
   * Generates a unique ID for a subscriber.
   * If an ID is provided, it will be used; otherwise, a new one is generated.
   *
   * @param id An optional ID to use.
   * @returns A unique subscriber ID.
   * @category Utilities
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn();
 * const id1 = siggn.makeId(); // e.g., "sub_0"
 * const id2 = siggn.makeId('custom-id'); // "custom-id"
 * ```
   */
  makeId(id?: string): SiggnId {
    return id ?? `sub_${(this.nextId++).toString(36)}`;
  }

  /**
   * Creates a subscription helper object that is pre-configured with a
   * specific subscriber ID. This simplifies managing multiple subscriptions
   * for a single component or service.
   *
   * @param id The subscriber ID to use for all subscriptions.
   * @returns An object with `subscribe`, `unsubscribe`, `subscribeMany`, and `subscribeAll` methods.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'event' }>();
 * const component = siggn.make('my-component');
 * component.subscribe('event', () => console.log('event received!'));
 * component.unsubscribe();
 * ```
   */
  make(id: SiggnId): {
    subscribe: <T extends M['type']>(
      type: T,
      callback: (msg: Extract<M, { type: T }>) => void,
    ) => void;
    unsubscribe: () => void;
    subscribeMany: (
      setup: (
        subscribe: <T extends M['type']>(
          type: T,
          callback: (msg: Extract<M, { type: T }>) => void,
        ) => void,
      ) => void,
    ) => void;
    subscribeAll: (callback: (msg: M) => void) => void;
  } {
    return {
      subscribe: (type, callback) => {
        this.subscribe(id, type, callback);
      },
      unsubscribe: () => {
        this.unsubscribe(id);
      },
      subscribeMany: (setup) => {
        this.subscribeMany(id, setup);
      },
      subscribeAll: (callback) => {
        this.subscribeAll(id, callback);
      },
    };
  }

  /**
   * Subscribes to multiple message types using a single subscriber ID.
   *
   * @param id The subscriber ID.
   * @param setup A function that receives a `subscribe` helper to register callbacks.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'A' } | { type: 'B' }>();
 * siggn.subscribeMany('subscriber-1', (subscribe) => {
 *   subscribe('A', () => console.log('A received'));
 *   subscribe('B', () => console.log('B received'));
 * });
 * ```
   */
  subscribeMany(
    id: SiggnId,
    setup: (
      subscribe: <T extends M['type']>(
        type: T,
        callback: (msg: Extract<M, { type: T }>) => void,
      ) => void,
    ) => void,
  ) {
    setup((type, callback) => this.subscribe(id, type, callback));
  }

  /**
   * Subscribes to a specific message type.
   *
   * @param id The subscriber ID.
   * @param type The message type to subscribe to.
   * @param callback The function to call when a message of the specified type is published.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'my-event', payload: string }>();
 * siggn.subscribe('subscriber-1', 'my-event', (msg) => {
 *   console.log(msg.payload);
 * });
 * ```
   */
  subscribe<T extends M['type']>(
    id: SiggnId,
    type: T,
    callback: (msg: Extract<M, { type: T }>) => void,
  ) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }

    this.subscriptions.get(type)?.push({ id, ref: callback });
  }

  /**
   * Subscribes to all message types. The callback will be invoked for every
   * message published on the bus.
   *
   * @param id The subscriber ID.
   * @param callback The function to call for any message.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'A' } | { type: 'B' }>();
 * siggn.subscribeAll('logger', (msg) => {
 *   console.log(`Received message of type: ${msg.type}`);
 * });
 * ```
   */
  subscribeAll(id: SiggnId, callback: (msg: M) => void) {
    this.globalSubscriptions.push({ id, ref: callback });
  }

  /**
   * Runs through all middlewares and then delivers the message to all subscribers.
   *
   * @param msg The message to publish.
   * @category Publishing
   * @since 0.0.5
   * @example
   * 
  ```typescript
  * const siggn = new Siggn<{ type: 'my-event' }>();
  * siggn.subscribe('sub-1', 'my-event', () => console.log('received'));
  * siggn.publish({ type: 'my-event' }); // "received"
  * ```
   */
  async publish(msg: M) {
    const run = async (i: number): Promise<void> => {
      const mw = this.middlewares[i];

      if (mw) {
        await mw(msg, () => run(i + 1));
        return;
      }

      this.deliverMessage(msg);
    };

    await run(0);
  }

  /**
   * Publishes a message to all relevant subscribers.
   *
   * @param msg The message to publish.
   * @category Publishing
   * @since 0.0.5
   *
   */
  private deliverMessage(msg: M) {
    this.globalSubscriptions.forEach((sub) => {
      sub.ref(msg as Extract<M, { type: any }>);
    });

    if (!this.subscriptions.has(msg.type)) {
      return;
    }

    this.subscriptions.get(msg.type)?.forEach((sub) => {
      sub.ref(msg as Extract<M, { type: any }>);
    });
  }

  /**
   * Removes all subscriptions (both specific and global) for a given
   * subscriber ID.
   *
   * @param id The subscriber ID to unsubscribe.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'my-event' }>();
 * siggn.subscribe('sub-1', 'my-event', () => console.log('received'));
 * siggn.unsubscribe('sub-1');
 * siggn.publish({ type: 'my-event' }); // (nothing is logged)
 * ```
   */
  unsubscribe(id: SiggnId) {
    this.unsubscribeGlobal(id);

    for (const [type, subscriptions] of this.subscriptions) {
      this.subscriptions.set(
        type,
        subscriptions.filter((sub) => sub.id !== id),
      );
    }
  }

  /**
   * Removes a global subscription for a given subscriber ID.
   *
   * @param id The subscriber ID to unsubscribe.
   * @category Subscription
   * @since 0.0.5
   * @example
   * 
```typescript
 * const siggn = new Siggn<{ type: 'my-event' }>();
 * siggn.subscribeAll('logger', console.log);
 * siggn.unsubscribeGlobal('logger');
 * siggn.publish({ type: 'my-event' }); // (nothing is logged)
 * ```
   */
  unsubscribeGlobal(id: SiggnId) {
    this.globalSubscriptions = this.globalSubscriptions.filter((s) => s.id !== id);
  }
}
