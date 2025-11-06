import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { siggn } from '@/siggn';

export function SuccessPage() {
  const onBackToHome = () => {
    siggn.publish({ type: 'NAVIGATE_TO_HOME' });
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='max-w-md mx-auto text-center'>
        <CardHeader>
          <CardTitle className='flex justify-center items-center gap-2'>
            <CheckCircle className='h-8 w-8 text-green-500' />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for your purchase.</p>
          <Button onClick={onBackToHome} className='mt-4'>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
