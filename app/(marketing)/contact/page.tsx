import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the NursePath team. We are here to help with questions about study guides, orders, and exam prep.',
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Get in Touch</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>
      <ContactForm />
    </main>
  );
}
