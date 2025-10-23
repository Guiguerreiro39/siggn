export type Msg = {
  type: string;
  [key: string]: unknown;
};

export type Subscription<T extends Msg> = {
  id: string;
  callback: (msg: T) => void;
};
