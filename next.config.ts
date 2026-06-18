// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    const upstreamApiBase = process.env.NEXT_API_BASE_URL || 'http://adminapi.realtipro.com';

    return [
      {
        source: '/api/:path*',
        destination: `${upstreamApiBase}/:path*`,
      },
    ];
  },
  // images: {
  //   // allow external images from Google Cloud Storage, demo site images, and Unsplash
  //   domains: ['storage.googleapis.com', 'demorealestate.webnapps.net', 'demorealestate2.webnapps.net', 'images.unsplash.com'],
  // },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
     
      {
        protocol: "http",
        hostname: "104.225.217.254"
      },
      {
        protocol: "https",
        hostname: "demorealestate.webnapps.net",
      },
        {
        protocol: "http",
        hostname: "adminapi.realtipro.com",
      },
      {
        protocol: "https",
        hostname: "demorealestate2.webnapps.net",
      },
      {
        protocol: 'https',
        hostname: 'cdn.realtipro.com',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dor1non99fv9y.cloudfront.net",
      },

       {
        protocol: "https",
        hostname: "adminapi.realtipro.com",
      },
     
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "145.223.121.84",
      },
      {
        protocol: "https",
        hostname: "admin.realtipro.com",
      },
      {
        protocol: "https",
        hostname: "staging.realtipro.com",
      },
       {
        protocol: "http",
        hostname: "localhost",
      },
       {
        protocol: "https",
        hostname: "realtipro.s3.us-west-2.amazonaws.com",
      },
        {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      
      
    ],
  },

};

module.exports = nextConfig;



// {
//   "functions": [
//     {
//       "source": "functions",
//       "codebase": "default",
//       "ignore": [
//         "node_modules",
//         ".git",
//         "firebase-debug.log",
//         "firebase-debug.*.log",
//         "*.local"
//       ],
//       "predeploy": [
//         "npm --prefix \"$RESOURCE_DIR\" run build"
//       ]
//     }
//   ],
//   "hosting": {
//     "public": "next",
//     "ignore": [
//       "firebase.json",
//       "**/.*",
//       "**/node_modules/**"
//     ]
//   }
// }
