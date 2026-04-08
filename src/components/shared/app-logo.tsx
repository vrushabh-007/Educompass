import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <span className="text-xl font-bold text-foreground">EDUCOMPASS</span>
    </Link>
  );
}
