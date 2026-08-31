import type { Metadata } from 'next';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'View your NursePath orders and download your purchased study guides.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
