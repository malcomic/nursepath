import { Shield, Download, UserCheck, Percent, GraduationCap, RefreshCw } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Comprehensive Content',
    body: 'Covers all key exam objectives and next-gen style layouts.',
  },
  {
    icon: Download,
    title: 'Instant PDF Download',
    body: 'Immediate access links delivered straight to your email inbox.',
  },
  {
    icon: UserCheck,
    title: 'No Account Required',
    body: 'No usernames, passwords, or endless profiles to manage.',
  },
  {
    icon: Percent,
    title: 'Affordable Pricing',
    body: 'Premium nursing materials at a fraction of standard test-prep costs.',
  },
  {
    icon: GraduationCap,
    title: 'Expert-Written',
    body: 'Co-authored by practicing nurse practitioners and test-prep professionals.',
  },
  {
    icon: RefreshCw,
    title: 'Updated Regularly',
    body: 'Aligned with current NGN exam rubrics and guidelines.',
  },
];

export default function Features() {
  return (
    <section className="bg-soft py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
            Built for Nursing Students
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            Why Students Choose NursePath
          </h2>
          <p className="text-lg text-navy-400">
            Everything you need to succeed without the complications of traditional learning
            platforms.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-soft"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-navy-800">{b.title}</h3>
                <p className="text-sm leading-relaxed text-navy-400">{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
