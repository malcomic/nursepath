import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The NCLEX cram sheet was a lifesaver. It summarized exactly what I needed to know, especially for pharmacology. I passed in minimum questions!',
    name: 'Jessica Miller, BSN',
    detail: 'Passed NCLEX-RN (75 Qs)',
    initials: 'JM',
  },
  {
    quote:
      'These visual charts are incredible. Traditional study books are so dry, but NursePath kept me engaged and built actual understanding.',
    name: 'Michael Chen, LPN',
    detail: 'Passed NCLEX-PN on 1st Try',
    initials: 'MC',
  },
  {
    quote:
      'Med-Surg used to be my absolute nightmare. This study guide broke down complex disease processes into clean, simple flowcharts.',
    name: 'Sarah Jenkins',
    detail: 'Senior Nursing Student',
    initials: 'SJ',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-soft py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
            Success Stories
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            What Our Students Say
          </h2>
          <p className="text-lg text-navy-400">
            Join thousands of students who studied smarter and passed their exams on the first try.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-white p-8 shadow-soft"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                ))}
              </div>
              <p className="mb-8 flex-grow text-[15px] leading-relaxed text-navy-400">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 font-display text-sm font-bold text-primary-700">
                  {t.initials}
                </div>
                <div>
                  <p className="font-display font-bold text-navy-800">{t.name}</p>
                  <p className="text-sm text-navy-400">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
