import type { Metadata } from 'next';
import MyGuidesClient from '@/components/dashboard/MyGuidesClient';

export const metadata: Metadata = {
  title: 'My Guides',
  description: 'View and download your purchased NursePath study guides.',
};

export default function MyGuidesPage() {
  return <MyGuidesClient />;
}
