'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';

interface GuidePurchaseButtonProps {
  guideId: string;
  price: number;
}

export default function GuidePurchaseButton({ guideId, price }: GuidePurchaseButtonProps) {
  return (
    <div className="space-y-3">
      <Link href={`/purchase/${guideId}`} className="block">
        <Button size="lg" fullWidth className="group">
          <ShoppingBag className="w-5 h-5 mr-2" />
          {price === 0 ? 'Get Free Guide' : `Buy Now — $${price.toFixed(2)}`}
        </Button>
      </Link>
    </div>
  );
}
