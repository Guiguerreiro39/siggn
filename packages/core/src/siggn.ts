import type { Msg, Subscription } from './types.js';

export class Siggn<T extends Msg> {
  private subscriptions: Map<T['type'], Array<Subscription<T, any>>>;

  constructor() {
    this.subscriptions = new Map();
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

  publish<K extends T['type']>(msg: Extract<T, { type: K }>) {
    if (!this.subscriptions.has(msg.type)) {
      return;
    }

    this.subscriptions.get(msg.type)?.forEach((sub) => {
      sub.callback(msg);
    });
  }

  unsubscribe(id: string) {
    for (const [type, subscriptions] of this.subscriptions) {
      this.subscriptions.set(
        type,
        subscriptions.filter((sub) => sub.id !== id),
      );
    }
  }
}
