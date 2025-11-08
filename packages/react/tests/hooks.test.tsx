import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { useSiggn, useSubscribe, useSubscribeAll } from '../src/hooks.js';
import { Siggn } from '@siggn/core';
import { act, render, renderHook, screen, cleanup } from '@testing-library/react';
import { useState } from 'react';

type Msg =
  | {
      type: 'increment_count';
      value: number;
    }
  | { type: 'decrement_count'; value: number }
  | { type: 'custom_event'; data: string }
  | { type: 'dependency_changed'; newValue: number };

describe('@siggn/react', () => {
  let siggn: Siggn<Msg>;

  beforeEach(() => {
    const { result } = renderHook(() => useSiggn<Msg>());
    siggn = result.current;
  });

  afterEach(() => {
    cleanup();
  });

  test('user should be able to create a siggn instance and subscribe using hooks', () => {
    function TestComponent() {
      const [count, setCount] = useState(0);

      useSubscribe(siggn, (subscribe) => {
        subscribe('increment_count', (msg) => {
          setCount((prev) => prev + msg.value);
        });

        subscribe('decrement_count', (msg) => {
          setCount((prev) => prev - msg.value);
        });
      });

      return <div data-testid='value'>{count}</div>;
    }

    render(<TestComponent />);

    expect(screen.getByTestId('value')).toHaveTextContent('0');

    act(() => {
      siggn.publish({ type: 'increment_count', value: 4 });
    });

    expect(screen.getByTestId('value')).toHaveTextContent('4');

    act(() => {
      siggn.publish({ type: 'decrement_count', value: 2 });
    });

    expect(screen.getByTestId('value')).toHaveTextContent('2');
  });

  test('useSiggn should return a stable instance across re-renders', () => {
    const { result, rerender } = renderHook(() => useSiggn<Msg>());
    const firstInstance = result.current;

    rerender(); // Re-render the hook

    const secondInstance = result.current;
    expect(firstInstance).toBe(secondInstance); // Should be the same instance
  });

  test('useSubscribe should work with explicit id in options', () => {
    let receivedData: string | null = null;
    const customId = 'my-custom-subscriber';

    function TestComponent() {
      useSubscribe({ instance: siggn, id: customId }, (subscribe) => {
        subscribe('custom_event', (msg) => {
          receivedData = msg.data;
        });
      });
      return null;
    }

    render(<TestComponent />);

    act(() => {
      siggn.publish({ type: 'custom_event', data: 'hello' });
    });

    expect(receivedData).toBe('hello');

    // Manually unsubscribe using the custom ID
    act(() => {
      siggn.unsubscribe(customId);
    });

    act(() => {
      siggn.publish({ type: 'custom_event', data: 'world' });
    });

    // Should not receive 'world' as it's unsubscribed
    expect(receivedData).toBe('hello');
  });

  test('useSubscribe should re-subscribe when dependencies change', () => {
    let callCount = 0;
    let lastReceivedValue = 0;

    function TestComponent({ depValue }: { depValue: number }) {
      useSubscribe(
        siggn,
        (subscribe) => {
          callCount++; // This should increment when subscription is re-established
          subscribe('dependency_changed', (msg) => {
            lastReceivedValue = msg.newValue + depValue; // Use depValue in callback
          });
        },
        [depValue], // Dependency array includes depValue
      );
      return <div data-testid='last-value'>{lastReceivedValue}</div>;
    }

    const { rerender } = render(<TestComponent depValue={10} />);

    act(() => {
      siggn.publish({ type: 'dependency_changed', newValue: 5 });
    });
    expect(lastReceivedValue).toBe(15); // 5 + 10
    expect(callCount).toBe(1);

    rerender(<TestComponent depValue={20} />); // Change dependency

    act(() => {
      siggn.publish({ type: 'dependency_changed', newValue: 5 });
    });

    expect(lastReceivedValue).toBe(25); // 5 + 20
    expect(callCount).toBe(2); // Subscription should have been re-established
  });

  test('useSubscribe should automatically unsubscribe on component unmount', () => {
    let receivedMessage: string | null = null;

    function TestComponent() {
      useSubscribe(siggn, (subscribe) => {
        subscribe('custom_event', (msg) => {
          receivedMessage = msg.data;
        });
      });
      return null;
    }

    const { unmount } = render(<TestComponent />);

    act(() => {
      siggn.publish({ type: 'custom_event', data: 'first message' });
    });
    expect(receivedMessage).toBe('first message');

    receivedMessage = null; // Reset for next check

    unmount(); // Unmount the component

    act(() => {
      siggn.publish({ type: 'custom_event', data: 'second message' });
    });

    // After unmount, the subscription should be gone
    expect(receivedMessage).toBeNull();
  });

  test('useSubscribeAll should receive all messages', () => {
    const receivedMessages: Msg[] = [];
    const callback = vi.fn((msg: Msg) => {
      receivedMessages.push(msg);
    });

    function TestComponent() {
      useSubscribeAll(siggn, callback);
      return null;
    }

    render(<TestComponent />);

    act(() => {
      siggn.publish({ type: 'increment_count', value: 1 });
      siggn.publish({ type: 'custom_event', data: 'test' });
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(receivedMessages).toEqual([
      { type: 'increment_count', value: 1 },
      { type: 'custom_event', data: 'test' },
    ]);
  });

  test('useSubscribeAll should automatically unsubscribe on component unmount', () => {
    const callback = vi.fn();

    function TestComponent() {
      useSubscribeAll(siggn, callback);
      return null;
    }

    const { unmount } = render(<TestComponent />);

    act(() => {
      siggn.publish({ type: 'increment_count', value: 1 });
    });
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      siggn.publish({ type: 'custom_event', data: 'after unmount' });
    });

    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
  });

  test('useSubscribeAll should re-subscribe when dependencies change', () => {
    const callback = vi.fn();

    function TestComponent({ dep }: { dep: number }) {
      useSubscribeAll(siggn, callback, [dep]);
      return null;
    }

    const { rerender } = render(<TestComponent dep={1} />);

    act(() => {
      siggn.publish({ type: 'increment_count', value: 1 });
    });
    expect(callback).toHaveBeenCalledTimes(1);

    rerender(<TestComponent dep={2} />);

    act(() => {
      siggn.publish({ type: 'increment_count', value: 2 });
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('useSubscribeAll should work with explicit id in options', () => {
    const callback = vi.fn();
    const customId = 'my-global-subscriber';

    function TestComponent() {
      useSubscribeAll({ instance: siggn, id: customId }, callback);
      return null;
    }

    render(<TestComponent />);

    act(() => {
      siggn.publish({ type: 'increment_count', value: 1 });
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      siggn.unsubscribeGlobal(customId);
    });

    act(() => {
      siggn.publish({ type: 'increment_count', value: 2 });
    });
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
