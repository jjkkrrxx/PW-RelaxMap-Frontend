import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // аватари юзерів із seed-даних
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
        pathname: '/**',
      },
      // дефолтний аватар нових юзерів
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        pathname: '/**',
      },
      // тимчасове зображення
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**',
      },
    ],
  },

  serverExternalPackages: ["axios"],
};

export default nextConfig;

