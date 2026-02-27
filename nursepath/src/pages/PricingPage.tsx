import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Pricing from '../components/sections/Pricing';
import CTA from '../components/sections/CTA';
import FAQ from '../components/sections/FAQ';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Pricing />
        <FAQ />
        <CTA
          title="Ready to Get Started?"
          description="Choose a plan that works for you and start your journey to exam success today."
          primaryButtonText="Browse Study Guides"
          primaryButtonLink="/services"
        />
      </main>
      <Footer />
    </div>
  );
}
