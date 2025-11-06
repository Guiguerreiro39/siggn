import type { Msg, Siggn } from '@siggn/core';

export type SubscriptionOptions<T extends Msg> =
  | Siggn<T>
  | {
      instance: Siggn<T>;
      id?: string;
    };
