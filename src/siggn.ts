type Msg = {
  type: string;
  [key: string]: unknown;
};

export class Siggn<T extends Msg> {
  private subscriptions: Map<T['type'], Map<string, Function>>;

  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(id: string, type: T['type'], callback: (msg: T) => void) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, new Map());
    }

    this.subscriptions.get(type)?.set(id, callback);
  }

  emit(msg: T) {
    this.subscriptions.get(msg.type)?.forEach((callback) => {
      callback(msg);
    });
  }

  unsubscribe(id: string) {
    this.subscriptions.forEach((sub) => {
      sub.delete(id);
    });
  }
}
