import { siggn, type Product } from '@/siggn';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const mockProducts: Product[] = [
  { id: 'p1', name: 'Wireless Mouse', price: 25.99 },
  { id: 'p2', name: 'Mechanical Keyboard', price: 89.99 },
  { id: 'p3', name: 'USB-C Hub', price: 45.5 },
  { id: 'p4', name: '4K Monitor', price: 399.0 },
];

export function ProductList() {
  const handleAddToCart = (product: Product) => {
    siggn.publish({ type: 'ADD_TO_CART', product });
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Products</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold'>${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAddToCart(product)} className='w-full'>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
