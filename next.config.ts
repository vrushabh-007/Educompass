
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbxmsfmikhbvbweaderx.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zcfxvkqzyxxxftmtvwdo.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
