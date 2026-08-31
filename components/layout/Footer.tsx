import Link from 'next/link';
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Study Guides', path: '/services' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'FAQ', path: '/#faq' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
    ],
    resources: [
      { label: 'Help Center', path: '/help' },
      { label: 'My Purchases', path: '/dashboard' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Refund Policy', path: '/refund' },
      { label: 'Sitemap', path: '/sitemap.xml' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">NursePath</span>
                <p className="text-xs text-gray-400 -mt-1">Nursing Exam Prep</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner for nursing exam success. We provide high-quality study guides and
              resources to help students excel in NCLEX, KRCHN, and other nursing exams.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href="tel:+12135744133" className="hover:text-white transition-colors">
                  +1 (213) 574-4133
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>Online — Serving Students Worldwide</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© {currentYear} NursePath. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
