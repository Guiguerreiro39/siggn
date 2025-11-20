import { useState } from 'react';
import { Logger } from '@/components/Logger';
import { NotificationHandler } from '@/components/NotificationHandler';
import { ProductList } from '@/components/ProductList';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/Navbar';
import { CheckoutPage } from '@/components/CheckoutPage';
import { SuccessPage } from '@/components/SuccessPage';
import { useSubscribeMany } from '@siggn/react';
import { siggn } from '@/siggn';

function App() {
  const [page, setPage] = useState('home');

  useSubscribeMany(siggn, (subscribe) => {
    subscribe('NAVIGATE_TO_CHECKOUT', () => setPage('checkout'));
    subscribe('NAVIGATE_TO_SUCCESS', () => setPage('success'));
    subscribe('NAVIGATE_TO_HOME', () => setPage('home'));
  });

  return (
    <>
      <Toaster />
      <NotificationHandler />
      <Navbar />
      <div className='container mx-auto p-4'>
        <header className='text-center my-8'>
          <h1 className='text-4xl font-bold'>E-Commerce Showcase</h1>
          <p className='text-muted-foreground mt-2'>
            An example project for <code>@siggn/react</code>.
          </p>
        </header>
        {(() => {
          switch (page) {
            case 'checkout':
              return <CheckoutPage />;
            case 'success':
              return <SuccessPage />;
            case 'home':
            default:
              return (
                <main className='grid grid-cols-1'>
                  <div>
                    <ProductList />
                  </div>
                </main>
              );
          }
        })()}
      </div>
      <Logger />
    </>
  );
}

export default App;
