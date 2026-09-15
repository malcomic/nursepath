import type { Metadata } from 'next';
import AccountClient from '@/components/dashboard/AccountClient';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your NursePath account.',
};

export default function AccountPage() {
  return <AccountClient />;
}
