export type Msg = {
  type: string;
  [key: string]: unknown;
};

export type Subscription<T extends Msg, K extends T['type']> = {
  id: string;
  callback: (msg: Extract<T, { type: K }>) => void;
};

export type SubscriptionMap<T extends Msg> = {
  [K in T['type']]: Array<Subscription<T, K>>;
};

export type SiggnId = string;
