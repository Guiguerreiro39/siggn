import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { siggn } from '@/siggn';
import { useState } from 'react';

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = () => {
    setIsPaying(true);
    siggn.publish({ type: 'SHOW_NOTIFICATION', message: 'Processing payment...', variant: 'info' });

    setTimeout(() => {
      setIsPaying(false);
      siggn.publish({
        type: 'SHOW_NOTIFICATION',
        message: 'Payment successful!',
        variant: 'success',
      });
      siggn.publish({ type: 'CLEAR_CART' });
      siggn.publish({ type: 'NAVIGATE_TO_SUCCESS' });
    }, 2000);
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Select Payment Method</h3>
            <RadioGroup
              defaultValue='credit-card'
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className='grid grid-cols-2 gap-4 mt-2'
            >
              <div>
                <RadioGroupItem value='credit-card' id='credit-card' className='peer sr-only' />
                <Label
                  htmlFor='credit-card'
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                >
                  Credit Card
                </Label>
              </div>
              <div>
                <RadioGroupItem value='paypal' id='paypal' className='peer sr-only' />
                <Label
                  htmlFor='paypal'
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                >
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={handlePayment} disabled={isPaying} className='w-full'>
            {isPaying ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
