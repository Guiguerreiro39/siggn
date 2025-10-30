import { type Msg, Siggn } from '@siggn/core';
import { useEffect, useMemo, useRef, type DependencyList } from 'react';

type SubscriptionOptions<T extends Msg> =
  | Siggn<T>
  | {
      instance: Siggn<T>;
      id?: string;
    };

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

export function useSiggn<T extends Msg>(): Siggn<T> {
  const siggn = useRef<Siggn<T>>(new Siggn<T>());
  return siggn.current;
}
