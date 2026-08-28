/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // تصاویر محصولات فعلاً از plaeholder داخلی می‌آیند؛
    // هنگام اتصال به CMS/CDN دامنه‌ها را اینجا اضافه کنید.
    remotePatterns: [],
  },
};

export default nextConfig;
