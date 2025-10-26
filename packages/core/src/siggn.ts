import type { Msg, Subscription } from './types.js';

export class Siggn<T extends Msg> {
  private subscriptions: Map<T['type'], Array<Subscription<T, any>>>;
  private subscribeAllSubscriptions: Array<Subscription<T, any>> = [];

  constructor() {
    this.subscriptions = new Map();
  }

  createChild<C extends Msg>() {
    return new Siggn<C | T>();
  }

  make(id: string): {
    subscribe: <K extends T['type']>(
      type: K,
      callback: (msg: Extract<T, { type: K }>) => void,
    ) => void;
    unsubscribe: () => void;
    subscribeMany: (
      setup: (
        subscribe: <K extends T['type']>(
          type: K,
          callback: (msg: Extract<T, { type: K }>) => void,
        ) => void,
      ) => void,
    ) => void;
    subscribeAll: (callback: (msg: T) => void) => void;
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

  subscribeMany(
    id: string,
    setup: (
      subscribe: <K extends T['type']>(
        type: K,
        callback: (msg: Extract<T, { type: K }>) => void,
      ) => void,
    ) => void,
  ) {
    setup((type, callback) => this.subscribe(id, type, callback));
  }

  subscribe<K extends T['type']>(
    id: string,
    type: K,
    callback: (msg: Extract<T, { type: K }>) => void,
  ) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }

    this.subscriptions.get(type)?.push({ id, callback });
  }

  subscribeAll(id: string, callback: (msg: T) => void) {
    this.subscribeAllSubscriptions.push({ id, callback });
  }

  publish(msg: T) {
    this.subscribeAllSubscriptions.forEach((sub) => {
      sub.callback(msg as Extract<T, { type: any }>);
    });

    if (!this.subscriptions.has(msg.type)) {
      return;
    }

    this.subscriptions.get(msg.type)?.forEach((sub) => {
      sub.callback(msg as Extract<T, { type: any }>);
    });
  }

  unsubscribe(id: string) {
    this.subscribeAllSubscriptions = this.subscribeAllSubscriptions.filter((s) => s.id !== id);

    for (const [type, subscriptions] of this.subscriptions) {
      this.subscriptions.set(
        type,
        subscriptions.filter((sub) => sub.id !== id),
      );
    }
  }
}
