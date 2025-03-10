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
        // Apply these headers to all routes
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
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          // Allow credentials
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Explicitly allow framing from any origin
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          // Update Content-Security-Policy to allow embedding from anywhere
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
  // Disable authentication for API routes during development
  rewrites() {
    return {
      beforeFiles: [
        // Rewrite API requests to bypass authentication in development
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig; 