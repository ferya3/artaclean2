/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // sharp باینری بومی دارد و نباید وارد باندل سرور شود.
  // (node:sqlite چون builtin است، خودکار external می‌ماند.)
  serverExternalPackages: ["sharp"],

  images: {
    // تصاویر آپلودی از public/uploads سرو می‌شوند و به دامنه بیرونی نیاز ندارند.
    remotePatterns: [],
  },
};

export default nextConfig;
