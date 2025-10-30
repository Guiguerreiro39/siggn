import { test, expect, describe, beforeEach } from 'vitest';
import { useSiggn, useSubscribe } from '../src/hooks.js';
import { Siggn } from '@siggn/core';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useState } from 'react';

type Msg =
  | {
      type: 'increment_count';
      value: number;
    }
  | { type: 'decrement_count'; value: number };

describe('@siggn/react', () => {
  let siggn: Siggn<Msg>;

  beforeEach(() => {
    const { result } = renderHook(() => useSiggn<Msg>());
    siggn = result.current;
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
});
