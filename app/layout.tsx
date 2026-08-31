import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
