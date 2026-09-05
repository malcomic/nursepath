import type { Metadata } from 'next';
import CartCheckoutForm from '@/components/cart/CartCheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CartCheckoutForm />;
}
