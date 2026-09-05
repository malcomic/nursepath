import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Logo from './Logo';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Our Blog', path: '/blog' },
      { label: 'Affiliate Program', path: '/contact' },
    ],
    studyGuides: [
      { label: 'NCLEX-RN Prep', path: '/services?category=NCLEX-RN' },
      { label: 'Pharmacology Guides', path: '/services?search=Pharmacology' },
      { label: 'Med-Surg Core Sheets', path: '/services?search=Med-Surg' },
      { label: 'Pediatrics Overview', path: '/services?search=Pediatrics' },
    ],
    support: [
      { label: 'FAQ Help Center', path: '/help' },
      { label: 'My Purchases', path: '/dashboard' },
      { label: 'Exam Prep Guide', path: '/blog' },
      { label: 'Sitemap', path: '/sitemap.xml' },
    ],
  };

  return (
    <footer className="bg-navy-800 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <Logo dark className="mb-5" />
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-navy-300">
              High-yield, visual PDF study guides engineered to help nursing students master key
              concepts and pass their NCLEX exams with confidence.
            </p>
            <div className="space-y-3 text-sm text-navy-300">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary-400" />
                {SUPPORT_EMAIL}
              </a>
              <a
                href="tel:+12135744133"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-primary-400" />
                +1 (213) 574-4133
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">Study Guides</h3>
            <ul className="space-y-3">
              {footerLinks.studyGuides.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-700 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs text-navy-400">
              © {currentYear} NursePath Study Prep. All rights reserved. NCLEX® is a registered
              trademark of the NCSBN.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/terms" className="text-navy-400 transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-navy-400 transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
