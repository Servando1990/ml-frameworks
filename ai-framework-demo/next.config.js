/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Configure headers to allow embedding in Webflow
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Allow requests from any origin
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // Allow all methods
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          // Allow all headers
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
          // Allow credentials
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Set X-Frame-Options to allow embedding
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://webflow.com https://*.webflow.io',
          },
          // Update Content-Security-Policy to explicitly allow Webflow to frame your site
          {
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval'; frame-ancestors https://*.webflow.io https://webflow.com https://*.webflow.com *;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 