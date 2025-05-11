import Image from 'next/image';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Image
        src="https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/educompass-logo.png" // Corrected URL (removed double slash)
        alt="EDUCOMPASS Icon"
        width={32}
        height={32}
        className="h-8 w-auto"
        data-ai-hint="compass logo"
      />
      <Image
        src="https://bbxmsfmikhbvbweaderx.supabase.co/storage/v1/object/public/universitylogos/image_0.png" // URL for the new text image "EDUCOMPASS"
        alt="EDUCOMPASS" // Alt text describes the content
        width={226} // Width calculated based on aspect ratio for a 28px height
        height={28}  // Height set to 28px (h-7 tailwind)
        className="h-7 w-auto" // Tailwind class for responsive height
        data-ai-hint="text logo"
      />
    </Link>
  );
}
