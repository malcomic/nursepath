'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';

const faqs = [
  {
    question: 'What format are the study guides in?',
    answer:
      'All study guides are provided as PDF files that you can download and access on any device. They are optimized for both desktop and mobile viewing.',
  },
  {
    question: 'How long do I have access to purchased guides?',
    answer:
      "You have lifetime access to all purchased study guides. Once you buy a guide, it's yours forever. You can download it as many times as you need.",
  },
  {
    question: 'Are the study guides updated regularly?',
    answer:
      "Yes! We regularly update our study guides to reflect the latest exam requirements and best practices. You'll receive notifications when updates are available for your purchased guides.",
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "Absolutely! We offer a 30-day money-back guarantee. If you're not satisfied with your purchase for any reason, contact us within 30 days for a full refund.",
  },
  {
    question: 'Can I share my purchased guides with others?',
    answer:
      'No, our study guides are for personal use only. Each purchase is licensed to a single user. Sharing or distributing the materials violates our terms of service.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, and PayPal. All transactions are secure and encrypted for your protection.',
  },
  {
    question: 'How quickly will I receive my study guide after purchase?',
    answer:
      'You receive instant access! As soon as your payment is confirmed, you can immediately download your study guide from your account dashboard.',
  },
  {
    question: 'Do you offer discounts for bulk purchases?',
    answer:
      'Yes! We offer special pricing for students purchasing multiple guides. Contact our support team for information about bulk discounts and institutional pricing.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking
            for, feel free to contact us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
