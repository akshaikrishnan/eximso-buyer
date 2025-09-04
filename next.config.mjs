/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL + "/:path*", // Proxy to Backend
      },
    ];
  },
  images: {
    minimumCacheTTL: 2678400,
    formats: ["image/webp"],
    qualities: [25, 50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eximso-store.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
