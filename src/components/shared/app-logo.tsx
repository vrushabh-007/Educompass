import Image from 'next/image';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Image 
        src="https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/educompass-logo.png" 
        alt="EDUCOMPASS Logo" 
        width={32} 
        height={32} 
        className="h-8 w-auto"
        data-ai-hint="compass logo"
      />
      <span className="text-xl font-bold">EDUCOMPASS</span>
    </Link>
  );
}
