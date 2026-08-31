import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/catalog', destination: '/services', permanent: true },
      { source: '/order-success', destination: '/payment-success', permanent: true },
    ];
  },
};

export default nextConfig;
