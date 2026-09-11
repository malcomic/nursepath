import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CurrencyProvider } from '@/components/currency/CurrencyProvider';
import { settingsService } from '@/lib/services/settingsService';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await settingsService.getSettings();
  const usdToKesRate = Number(settings.usdToKesRate);

  return (
    <CartProvider>
      <CurrencyProvider usdToKesRate={usdToKesRate}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </CurrencyProvider>
    </CartProvider>
  );
}
