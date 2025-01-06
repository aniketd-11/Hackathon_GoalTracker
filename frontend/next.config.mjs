/** @type {import('next').NextConfig} */

async function headers() {
  return [
    {
      source: "/api/(.*)", // Matches all API routes
      headers: [
        {
          key: "Cache-Control",
          value: "no-store", // Forces all API routes to be dynamic
        },
      ],
    },
  ];
}

const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  headers,
};

export default nextConfig;
