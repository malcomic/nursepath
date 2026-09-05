import type { Metadata } from 'next';
import { Outfit, Figtree } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['500', '600', '700', '800'],
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'NursePath',
    template: '%s | NursePath',
  },
  description: 'NCLEX-RN study guides and nursing exam prep for students.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NursePath',
    title: 'NursePath — NCLEX-RN Study Guides & Nursing Exam Prep',
    description: 'NCLEX-RN study guides and nursing exam prep for students.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NursePath — NCLEX-RN Study Guides & Nursing Exam Prep',
    description: 'NCLEX-RN study guides and nursing exam prep for students.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${figtree.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
