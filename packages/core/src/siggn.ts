import type { Msg, Subscription } from "./types.js";


export class Siggn<T extends Msg> {
  private subscriptions: Map<T['type'], Array<Subscription<T>>>;

  constructor() {
    this.subscriptions = new Map();
  }

  makeSubscriptions(id: string): {
    subscribe: (type: T['type'], callback: (msg: T) => void) => void,
    unsubscribe: () => void
  } {
    return {
      subscribe: (type, callback) => {
        this.subscribe(id, type, callback);
      },
      unsubscribe: () => {
        this.unsubscribe(id);
      }
    }
  }

  subscribe(id: string, type: T['type'], callback: (msg: T) => void) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }

    this.subscriptions.get(type)?.push({ id, callback });
  }

  publish(msg: T) {
    if (!this.subscriptions.has(msg.type)) {
      return;
    }

    this.subscriptions.get(msg.type)?.forEach((sub) => {
      sub.callback(msg);
    });
  }

  unsubscribe(id: string) {
    for (const [type, subscriptions] of this.subscriptions) {
      this.subscriptions.set(type, subscriptions.filter((sub) => sub.id !== id));
    }
  }
}
