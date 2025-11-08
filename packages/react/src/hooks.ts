import { type Msg, Siggn } from '@siggn/core';
import type { SubscriptionOptions } from 'packages/react/src/types';
import { useEffect, useMemo, useRef, type DependencyList } from 'react';

/**
 * Creates and returns a `Siggn` instance that persists for the lifetime of the component.
 * This is useful for creating a message bus scoped to a component and its children.
 *
 * @template T A union of all possible message types for the new instance.
 * @returns A `Siggn<T>` instance.
 * @category Lifecycle
 * @since 0.0.1
 * @example
 * 
```tsx
 * function MyComponent() {
 *   const localSiggn = useSiggn<{ type: 'local-event' }>();
 *   // ...
 * }
 * ```
 */
export function useSiggn<T extends Msg>(): Siggn<T> {
  const siggn = useRef(new Siggn<T>());
  return siggn.current;
}

/**
 * Subscribes to messages and automatically unsubscribes when the component unmounts.
 *
 * @template T A union of all possible message types.
 * @param options A `Siggn` instance or an object with the instance and an optional subscriber ID.
 * @param setup A function that receives a `subscribe` helper to define subscriptions.
 * @param deps An optional dependency array to control when the subscriptions are re-created.
 * @category Subscription
 * @since 0.0.1
 * @example
 * 
```tsx
 * import { siggn } from './siggn'; // Your shared instance
 *
 * function MyComponent() {
 *   useSubscribe(siggn, (subscribe) => {
 *     subscribe('user-created', (msg) => console.log(msg.name));
 *   });
 *   // ...
 * }
 * ```
 */
export function useSubscribe<T extends Msg>(
  options: SubscriptionOptions<T>,
  setup: (
    subscribe: <K extends T['type']>(
      type: K,
      callback: (msg: Extract<T, { type: K }>) => void,
    ) => void,
  ) => void,
  deps: DependencyList = [],
) {
  const instance = useMemo(
    () => (options instanceof Siggn ? options : options.instance),
    [options],
  );
  const id = useMemo(() => instance.makeId('id' in options ? options.id : undefined), [instance]);

  useEffect(() => {
    instance.subscribeMany(id, setup);

    return () => {
      instance.unsubscribe(id);
    };
  }, [instance, id, ...deps]);
}

/**
 * Subscribes to all messages on a `Siggn` instance and automatically unsubscribes
 * when the component unmounts.
 *
 * @template T A union of all possible message types.
 * @param options A `Siggn` instance or an object with the instance and an optional subscriber ID.
 * @param callback The function to call for any message.
 * @param deps An optional dependency array to control when the subscription is re-created.
 * @category Subscription
 * @since 0.0.1
 * @example
 * 
```tsx
 * import { siggn } from './siggn';
 *
 * function LoggerComponent() {
 *   useSubscribeAll(siggn, (msg) => {
 *     console.log(`[LOG]: ${msg.type}`);
 *   }, []);
 *   // ...
 * }
 * ```
 */
export function useSubscribeAll<T extends Msg>(
  options: SubscriptionOptions<T>,
  callback: (msg: T) => void,
  deps: DependencyList = [],
) {
  const instance = useMemo(
    () => (options instanceof Siggn ? options : options.instance),
    [options],
  );
  const id = useMemo(() => instance.makeId('id' in options ? options.id : undefined), [instance]);

  useEffect(() => {
    instance.subscribeAll(id, callback);

    return () => {
      instance.unsubscribeGlobal(id);
    };
  }, [instance, id, ...deps]);
}
