import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  className?: string;
  /** Kept for call-site compatibility; logo artwork includes its own colors. */
  dark?: boolean;
  /** Compact icon-only mark for tight layouts (e.g. admin sidebar). */
  mark?: boolean;
  size?: number;
}

export default function Logo({
  href = '/',
  className = '',
  mark = false,
  size,
}: LogoProps) {
  const height = size ?? (mark ? 36 : 56);
  const src = mark ? '/brand/logo-mark.png' : '/brand/logo.png';

  const content = (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt="NursePath"
        width={height}
        height={height}
        className="object-contain"
        style={{ height, width: height }}
        priority
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center" aria-label="NursePath home">
        {content}
      </Link>
    );
  }

  return content;
}
