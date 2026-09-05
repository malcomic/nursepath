import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import Button from '../ui/Button';

interface BundleOfferProps {
  slug: string;
  title: string;
  description?: string | null;
  price: number;
  thumbnailUrl?: string | null;
}

export default function BundleOffer({
  slug,
  title,
  description,
  price,
  thumbnailUrl,
}: BundleOfferProps) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
            Special Bundle Offer
          </p>
          <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            Save Big with All-in-One Packs
          </h2>
          <p className="text-lg text-navy-400">
            Everything you need for comprehensive prep in one single download bundle.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-soft lg:flex lg:items-center">
          <div className="relative h-56 w-full shrink-0 bg-primary-50 lg:h-auto lg:min-h-[280px] lg:w-[380px]">
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} alt={title} fill className="object-cover" sizes="380px" />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center">
                <FileText className="h-16 w-16 text-primary-600" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-8 lg:p-12">
            <span className="inline-flex w-fit rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-700">
              Popular Savings
            </span>
            <h3 className="font-display text-2xl font-bold text-navy-800 sm:text-3xl">{title}</h3>
            {description && (
              <p className="max-w-xl text-navy-400">{description}</p>
            )}
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                  Bundle price
                </p>
                <p className="font-display text-4xl font-extrabold text-primary-600">
                  ${price.toFixed(0)}
                </p>
              </div>
              <Link href={`/guides/${slug}`}>
                <Button size="lg">Get Complete Bundle</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
