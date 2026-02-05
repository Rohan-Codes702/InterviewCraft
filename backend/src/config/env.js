import dotenv from 'dotenv';
dotenv.config();

// Helper to strip quotes from environment variables
const stripQuotes = (str) => {
  if (!str) return str;
  return str.replace(/^["']|["']$/g, '');
};

export const ENV = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000, 
    MONGO_URI: stripQuotes(process.env.MONGO_URI), 
    NODE_ENV: stripQuotes(process.env.NODE_ENV) || 'development',
    CLIENT_URL: stripQuotes(process.env.CLIENT_URL),
    CLERK_PUBLISHABLE_KEY: stripQuotes(process.env.CLERK_PUBLISHABLE_KEY),
    CLERK_SECRET_KEY: stripQuotes(process.env.CLERK_SECRET_KEY),
    STREAM_API_KEY: stripQuotes(process.env.STREAM_API_KEY),
    STREAM_API_SECRET: stripQuotes(process.env.STREAM_API_SECRET),
    SENTRY_DSN: stripQuotes(process.env.SENTRY_DSN),
    INNGEST_EVENT_KEY: stripQuotes(process.env.INNGEST_EVENT_KEY),
    INNGEST_SIGNING_KEY: stripQuotes(process.env.INNGEST_SIGNING_KEY),
};
