import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  className?: string;
  dark?: boolean;
}

export default function Logo({ href = '/', className = '', dark = false }: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-600">
        <Image
          src="/brand/stethoscope.svg"
          alt=""
          width={22}
          height={22}
          className="size-[22px]"
          unoptimized
        />
      </span>
      <span className={`font-display text-[22px] font-extrabold leading-none ${dark ? 'text-white' : ''}`}>
        <span className={dark ? 'text-white' : 'text-navy-800'}>Nurse</span>
        <span className={dark ? 'text-primary-300' : 'text-primary-600'}>Path</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    );
  }

  return content;
}
