// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // --- CORS WORKAROUND ---
  // API calls (/api/*) are proxied by the Route Handler at src/app/api/[...path]/route.ts
  // so it can strip the browser Origin (forcing the backend into API-client mode so it
  // returns access_token in the body) and rewrite the backend's Set-Cookie headers for
  // localhost. Do NOT add an /api rewrite here: an afterFiles rewrite runs before the
  // dynamic route and would shortcut /api/* straight to the backend, bypassing the proxy
  // and breaking login persistence. The CDN rewrite stays since it sets no cookies.
  async rewrites() {
    return [
      {
        // Proxy CDN images so useCachedImage's fetch() isn't blocked by CORS.
        source: '/cdn-proxy/:path*',
        destination: 'https://cdn.realtipro.com/:path*',
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
