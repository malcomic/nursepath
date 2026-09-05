'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I receive my study guides after purchasing?',
    a: "Instantly! Once your checkout is complete, you'll immediately see a download link on the screen. We also send an automated email with backup links.",
  },
  {
    q: 'Can I view these guides on multiple devices?',
    a: 'Yes. Your PDF downloads work on phone, tablet, and desktop. Save them wherever you study.',
  },
  {
    q: 'Are the study guides updated for the Next-Gen NCLEX (NGN)?',
    a: 'Yes. Our materials are aligned with current NGN-style objectives and are updated regularly.',
  },
  {
    q: 'Do I need to sign up for an account to purchase?',
    a: 'No. Checkout only needs your name and email so we can deliver your download links.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a 30-day money-back guarantee on eligible purchases. See our Refund Policy for details.',
  },
  {
    q: 'Who writes the study guides?',
    a: 'Guides are co-authored by practicing nurse practitioners and experienced test-prep educators.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
            Have Questions?
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-navy-400">
            Everything you need to know about our PDF nursing study guides.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-border bg-soft"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-navy-800">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-[15px] leading-relaxed text-navy-400">{faq.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
