import * as Sentry from "@sentry/node";
import { ENV } from "./src/config/env.js";

Sentry.init({
  dsn: ENV.SENTRY_DSN || "",
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: ENV.NODE_ENV || "development",
  includeLocalVariables: true,

  // Setting this option to true will send default PII data to Sentry.
  sendDefaultPii: true,
});

console.log("✅ Sentry initialized");