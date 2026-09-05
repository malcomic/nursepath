import { FileText, DownloadCloud, BookOpen } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: FileText,
    title: 'Choose Your Guide',
    body: 'Browse our clinically validated study materials and select the topics you need help with.',
  },
  {
    num: '02',
    icon: DownloadCloud,
    title: 'Instant Download',
    body: 'Pay securely via card, Apple Pay, or Google Pay. Receive your PDF downloads immediately.',
  },
  {
    num: '03',
    icon: BookOpen,
    title: 'Start Studying',
    body: 'Open your guide on any mobile, tablet, or desktop device. No accounts or registrations required.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
            No Hassle, Just Learning
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            Instant Study Prep in 3 Easy Steps
          </h2>
          <p className="text-lg text-navy-400">
            Get study materials in seconds with zero accounts or sign-up walls to slow you down.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary-600">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="font-display text-5xl font-extrabold text-primary-50">
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 font-display text-xl font-bold text-navy-800">{step.title}</h3>
                  <p className="text-[15px] leading-relaxed text-navy-400">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
