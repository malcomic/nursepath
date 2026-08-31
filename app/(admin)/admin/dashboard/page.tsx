'use client';

import Link from 'next/link';
import {
  BookOpen,
  Tags,
  FileText,
  MessageSquare,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

const quickLinks = [
  {
    href: '/admin/guides',
    label: 'Manage Guides',
    description: 'Create, edit, and upload study guide PDFs.',
    icon: BookOpen,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    description: 'Organize guides into searchable categories.',
    icon: Tags,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    description: 'View purchases, resend links, and process refunds.',
    icon: FileText,
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    description: 'Approve or reject student review submissions.',
    icon: MessageSquare,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    description: 'Configure downloads, support email, and payments.',
    icon: Settings,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Welcome to NursePath Admin</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Manage study guides, moderate reviews, fulfill orders, and configure store settings
              from this dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">
                    {link.label}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
