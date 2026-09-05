import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="bg-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5">
              <Image src="/brand/sparkles.svg" alt="" width={14} height={14} className="size-3.5" />
              <span className="font-display text-[13px] font-bold uppercase text-primary-600">
                Updated for the 2026 NCLEX-RN &amp; PN
              </span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.15] text-navy-800 sm:text-5xl lg:text-[54px]">
              Pass Your NCLEX on the{' '}
              <span className="text-primary-600">First Try</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-navy-400 sm:text-xl">
              Master key nursing concepts with comprehensive, visual PDF study guides created by
              experienced educators. Download instantly, study at your own pace, and ace your exams
              without stress.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/services">
                <Button size="lg">Browse Study Guides</Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[280px] w-full max-w-[540px] shrink-0 overflow-hidden rounded-3xl sm:h-[360px] lg:h-[440px]">
            <Image
              src="/brand/hero.jpg"
              alt="Nursing student studying for NCLEX"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
              priority
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-white px-6 py-6 sm:px-8 lg:grid-cols-4 lg:gap-4">
          {[
            { value: '10,000+', label: 'Nursing students helped' },
            { value: '98.4%', label: 'First-time pass rate' },
            { value: '50+', label: 'Expert-written guides' },
            { value: '4.9/5', label: 'Average student rating' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span className="font-display text-2xl font-extrabold text-primary-600 sm:text-3xl">
                {stat.value}
              </span>
              <span className="max-w-[150px] text-sm font-medium text-navy-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
