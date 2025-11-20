export type Msg = {
  type: string;
  [key: string]: unknown;
};

export type Subscription<M extends Msg, T extends M['type']> = {
  id: string;
  ref: (msg: Extract<M, { type: T }>) => void;
};

export type SubscriptionMap<T extends Msg> = {
  [K in T['type']]: Array<Subscription<T, K>>;
};

export type SiggnId = string;

export type Middleware<M extends Msg> = (msg: M, next: () => void) => void | Promise<void>;
