import Image from 'next/image';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Image
        src="https://picsum.photos/seed/edu-logo/32/32"
        alt="EDUCOMPASS Icon"
        width={32}
        height={32}
        className="h-8 w-auto"
        data-ai-hint="compass logo"
      />
      <Image
        src="https://picsum.photos/seed/edu-text/226/28"
        alt="EDUCOMPASS"
        width={226} 
        height={28}
        className="h-7 w-auto"
        data-ai-hint="text logo"
      />
    </Link>
  );
}
