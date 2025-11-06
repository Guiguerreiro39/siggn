import { useSubscribe } from '@siggn/react';
import { siggn } from '@/siggn';
import { toast } from 'sonner';

export function NotificationHandler() {
  useSubscribe(siggn, (subscribe) => {
    subscribe('SHOW_NOTIFICATION', (msg) => {
      switch (msg.variant) {
        case 'success':
          toast.success(msg.message);
          break;
        case 'error':
          toast.error(msg.message);
          break;
        default:
          toast.info(msg.message);
          break;
      }
    });

    subscribe('ADD_TO_CART', (msg) => {
      toast.success(`${msg.product.name} added to cart!`);
    });

    subscribe('USER_LOGIN', (msg) => {
      toast.info(`Welcome back, ${msg.username}!`);
    });
  });

  return null;
}
