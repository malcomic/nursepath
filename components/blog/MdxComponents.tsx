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

export const mdxComponents = {
  a: MdxLink,
  Callout,
};
