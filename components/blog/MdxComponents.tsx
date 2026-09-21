import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

function MdxLink({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} className="text-primary-600 font-medium hover:text-primary-700">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="text-primary-600 font-medium hover:text-primary-700"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

interface CalloutProps {
  children: ReactNode;
  title?: string;
}

function Callout({ children, title = 'Tip' }: CalloutProps) {
  return (
    <div className="my-6 rounded-xl border border-primary-200 bg-primary-50 px-5 py-4 not-prose">
      <p className="text-sm font-bold text-primary-800 mb-2">{title}</p>
      <div className="text-sm text-primary-900 leading-relaxed">{children}</div>
    </div>
  );
}

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

function Figure({ src, alt, caption, width = 800, height = 480 }: FigureProps) {
  const isSvg = src.endsWith('.svg');

  return (
    <figure className="my-8 not-prose">
      <div className="overflow-hidden rounded-xl border border-border bg-soft">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
        ) : (
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-navy-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function MdxImg({ src, alt }: ComponentPropsWithoutRef<'img'>) {
  if (!src || typeof src !== 'string') return null;
  const isSvg = src.endsWith('.svg');
  if (isSvg) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} className="my-6 h-auto w-full rounded-xl border border-border" />;
  }
  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={800}
      height={480}
      className="my-6 h-auto w-full rounded-xl border border-border"
    />
  );
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxImg,
  Callout,
  Figure,
};
