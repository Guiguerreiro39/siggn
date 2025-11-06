import { Siggn } from '@siggn/react';

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type Message =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'USER_LOGIN'; username: string }
  | { type: 'SHOW_NOTIFICATION'; message: string; variant: 'success' | 'error' | 'info' }
  | { type: 'NAVIGATE_TO_CHECKOUT' }
  | { type: 'NAVIGATE_TO_SUCCESS' }
  | { type: 'NAVIGATE_TO_HOME' };

export const siggn = new Siggn<Message>();

// Example of publishing an event after a delay
setTimeout(() => {
  siggn.publish({ type: 'USER_LOGIN', username: 'JaneDoe' });
}, 1000);
