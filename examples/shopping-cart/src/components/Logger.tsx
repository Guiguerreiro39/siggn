import { useSubscribeAll } from '@siggn/react';
import { siggn } from '../siggn';

export function Logger() {
  useSubscribeAll(siggn, (msg) => {
    console.log('[Siggn Event Logger]:', msg);
  });

  return null; // This component doesn't render anything
}
