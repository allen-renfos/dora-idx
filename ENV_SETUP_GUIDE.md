# Environment Variables Setup Guide

## Overview
This project uses environment variables to manage API URLs and other configuration settings. The API service is already configured to use environment variables - you just need to set up your local environment file.

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the root directory of this project (RealityProfrontend) by copying from the example:

**Option A: Copy the example file**
```bash
copy env.example .env.local
```

**Option B: Create manually**

Create a `.env.local` file with the following content:

```env
# Base URL for your backend API
NEXT_PUBLIC_API_BASE_URL=https://Robert.webnapps.net/api

# Firebase configuration (replace with your real values or delete if not used)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID 

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Realty Pro Agent ID
NEXT_PUBLIC_REALTY_PRO_AGENT_ID=NWM1307494
```

### 2. Update API URL

Replace the `NEXT_PUBLIC_API_BASE_URL` value with your actual API URL:

**Development:**
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

**Production:**
```env
NEXT_PUBLIC_API_BASE_URL=https://Robert.webnapps.net/api
```

### 3. How It Works

The API configuration in `src/services/Api.tsx` is already set up to use environment variables:

```typescript
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
```

- If `NEXT_PUBLIC_API_BASE_URL` is set in your `.env.local`, it will use that value
- If not set, it will fall back to the default URL

### 4. Environment Files Priority

Next.js loads environment variables in this order (highest to lowest priority):

1. `.env.local` - local overrides (never committed to git) ⭐ **Use this for your local development**
2. `.env.production` / `.env.development` - environment-specific
3. `.env` - default values

### 5. Important Notes

- ✅ `.env.local` is already ignored by `.gitignore` and will NOT be committed to git
- ✅ Always use `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in the browser
- ✅ `env.example` is provided as a template and IS committed to git (without sensitive data)
- ✅ Restart your development server after changing environment variables
- ✅ Never commit sensitive API keys or URLs to version control

### 6. Restart Development Server

After creating or modifying the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Additional Configuration

### Firebase Setup
If you're using Firebase, replace the placeholder values with your actual Firebase configuration from the Firebase Console.

### Google Maps API
Get your API key from [Google Cloud Console](https://console.cloud.google.com/) and replace `YOUR_GOOGLE_MAPS_API_KEY`.

## Troubleshooting

**Q: Changes to .env.local are not taking effect**
A: Make sure to restart your development server (`npm run dev`) after making changes.

**Q: Getting CORS errors**
A: Verify that your API URL is correct and the backend allows requests from your frontend origin.

**Q: API calls are going to the wrong URL**
A: 
1. Check that `.env.local` exists in the root directory (same level as package.json)
2. Verify the variable is named `NEXT_PUBLIC_API_BASE_URL` (with correct prefix)
3. Make sure you restarted the development server

**Q: Environment variables are undefined in the browser**
A: Next.js only exposes environment variables that start with `NEXT_PUBLIC_` to the browser. Server-side variables don't need this prefix.

## Security Best Practices

- ❌ Never commit `.env.local` or any file containing real API keys
- ❌ Never expose backend-only secrets with `NEXT_PUBLIC_` prefix
- ✅ Keep `env.example` updated with placeholder values for team reference
- ✅ Use different API keys for development and production
- ✅ Rotate API keys regularly

