import { useState } from 'react';
import { useSubscribeMany } from '@siggn/react';
import { siggn, type CartItem } from '@/siggn';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ShoppingCartIcon, Trash2, User } from 'lucide-react';

export function Navbar() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [username, setUsername] = useState('Guest');

  useSubscribeMany(siggn, (subscribe) => {
    subscribe('ADD_TO_CART', (msg) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === msg.product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === msg.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...prevItems, { ...msg.product, quantity: 1 }];
      });
    });

    subscribe('REMOVE_FROM_CART', (msg) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== msg.productId));
    });

    subscribe('CLEAR_CART', () => {
      setItems([]);
    });

    subscribe('USER_LOGIN', (msg) => {
      setUsername(msg.username);
    });
  });

  const handleClearCart = () => {
    siggn.publish({ type: 'CLEAR_CART' });
  };

  const handleRemoveItem = (productId: string) => {
    siggn.publish({ type: 'REMOVE_FROM_CART', productId });
  };

  const onCheckout = () => {
    siggn.publish({ type: 'NAVIGATE_TO_CHECKOUT' });
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className='bg-card border-b'>
      <div className='container mx-auto p-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <User className='h-6 w-6' />
          <span className='font-semibold'>{username}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='icon' className='relative'>
              <ShoppingCartIcon className='!size-6' />
              {totalItems > 0 && (
                <span className='absolute top-0 -right-1 inline-flex items-center justify-center size-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                  {totalItems}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[30rem]'>
            <div className='p-4'>
              <h3 className='text-lg font-medium'>Shopping Cart</h3>
              <Separator className='my-2' />
              {items.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  <ul className='space-y-2'>
                    {items.map((item) => (
                      <li key={item.id} className='flex justify-between items-center'>
                        <div>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className='flex items-center gap-4'>
                          <p className='font-semibold'>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant='destructive'
                            className='px-2 py-1'
                            size='sm'
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Separator className='my-2' />
                  <div className='flex justify-between font-bold text-base'>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className='mt-4 flex justify-between'>
                    <Button variant='outline' onClick={handleClearCart}>
                      Clear Cart
                    </Button>
                    <Button onClick={onCheckout}>Checkout</Button>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
