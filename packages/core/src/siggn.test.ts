import { Siggn } from './siggn.js';
import { test, expect } from 'vitest';

type Msg =
  | {
      type: 'increment_count';
      value: number;
    }
  | { type: 'decrement_count'; value: number };

test('user should be able to use subscribe and publish', () => {
  const siggn = new Siggn<Msg>();
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
});

test('user should be able to use unsubscribe', () => {
  const siggn = new Siggn<Msg>();
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

test('user should be able to use makeSubscriptions to subscribe and publish', () => {
  const siggn = new Siggn<Msg>();
  let count = 0;

  const subscriptions = siggn.makeSubscriptions('1');

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
});

test('user should be able to use makeSubscriptions to unsubscribe', () => {
  const siggn = new Siggn<Msg>();
  let count = 0;

  const subscriptions = siggn.makeSubscriptions('1');

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
