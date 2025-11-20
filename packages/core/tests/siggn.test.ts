import { Siggn } from '../src/index.js';
import { test, expect, describe, beforeEach } from 'vitest';

type Msg =
  | {
      type: 'increment_count';
      value: number;
    }
  | { type: 'decrement_count'; value: number }
  | { type: 'custom_event' };

type Msg1 = { type: 'reset_count' };

describe('Basic usage', () => {
  let siggn: Siggn<Msg>;

  beforeEach(() => {
    siggn = new Siggn<Msg>();
  });

  test('use subscribe, publish and unsubscribe', () => {
    let count = 0;

    siggn.subscribe('1', 'increment_count', (msg) => {
      count += msg.value;
    });

    siggn.subscribe('1', 'decrement_count', (msg) => {
      count -= msg.value;
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    siggn.unsubscribe('1');

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('use subscribeMany, publish and unsubscribe', () => {
    let count = 0;

    siggn.subscribeMany('1', (subscribe) => {
      subscribe('increment_count', (msg) => {
        count += msg.value;
      });

      subscribe('decrement_count', (msg) => {
        count -= msg.value;
      });
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    siggn.unsubscribe('1');

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('use subscribeAll, publish and unsubscribe', () => {
    let count = 0;

    siggn.subscribeAll('1', (msg) => {
      if (msg.type === 'increment_count') {
        count += msg.value;
      } else if (msg.type === 'decrement_count') {
        count -= msg.value;
      }
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    siggn.unsubscribe('1');

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('use makeSubscriptions to subscribe, publish and unsubscribe', () => {
    let count = 0;

    const subscriptions = siggn.make('1');

    subscriptions.subscribe('increment_count', (msg) => {
      count += msg.value;
    });

    subscriptions.subscribe('decrement_count', (msg) => {
      count -= msg.value;
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    subscriptions.unsubscribe();

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('use makeSubscriptions to subscribeMany, publish and unsubscribe', () => {
    let count = 0;

    const subscriptions = siggn.make('1');

    subscriptions.subscribeMany((subscribe) => {
      subscribe('increment_count', (msg) => {
        count += msg.value;
      });

      subscribe('decrement_count', (msg) => {
        count -= msg.value;
      });
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    subscriptions.unsubscribe();

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('use makeSubscriptions to subscribeAll, publish and unsubscribe', () => {
    let count = 0;

    const subscriptions = siggn.make('1');

    subscriptions.subscribeAll((msg) => {
      if (msg.type === 'increment_count') {
        count += msg.value;
      } else if (msg.type === 'decrement_count') {
        count -= msg.value;
      }
    });

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    siggn.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    subscriptions.unsubscribe();

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(2);
  });

  test('create a clone which inherits the types from the primary instance', () => {
    const child = siggn.createClone<Msg1>();

    let count = 0;

    child.subscribe('1', 'increment_count', (msg) => {
      count += msg.value;
    });

    child.subscribe('1', 'decrement_count', (msg) => {
      count -= msg.value;
    });

    child.subscribe('1', 'reset_count', () => {
      count = 0;
    });

    child.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(4);

    child.publish({ type: 'decrement_count', value: 2 });

    expect(count).toBe(2);

    child.publish({ type: 'reset_count' });

    expect(count).toBe(0);

    siggn.publish({ type: 'increment_count', value: 4 });

    expect(count).toBe(0);
  });
});

// describe('Middleware', () => {
//   test('use global middleware', () => {
//     const siggn = new Siggn<Msg>();
//   })
// })
