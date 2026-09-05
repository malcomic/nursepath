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
      <section className="bg-navy-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="text-xl leading-relaxed text-navy-200">
            Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>
      <ContactForm />
    </main>
  );
}
