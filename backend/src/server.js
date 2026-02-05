import "../instrument.mjs";
import express from 'express';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { functions, inngest } from './config/inngest.js';
import { serve } from "inngest/express";
import chatRoutes from './routes/chat.route.js';
import * as Sentry from "@sentry/node";
import cors from 'cors';
import { verifyBearerToken } from './middleware/auth.middleware.js';

const app=express();

// 1. CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Authorization-Clerk'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// 2. Clerk Middleware (Global) - MUST be after JSON parser
app.use(clerkMiddleware())

// 3. Bearer token verification middleware (for API authentication)
app.use(verifyBearerToken);

// 4. Logger & Debugger
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const auth = getAuth(req);
  
  const logEntry = {
    method: req.method,
    url: req.url,
    hasAuthHeader: !!authHeader,
    authHeaderPreview: authHeader ? authHeader.substring(0, 15) + "..." : "NONE",
    clerkUserId: auth?.userId || "NOT_FOUND",
    timestamp: new Date().toISOString()
  };
  
  console.log("[REQUEST]", JSON.stringify(logEntry));
  next();
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/chat/debug-auth", (req, res) => {
  console.log("[DEBUG-AUTH] Complete request headers:", req.headers);
  
  const auth = getAuth(req);
  const authHeader = req.headers.authorization;
  
  console.log("[DEBUG-AUTH] Auth from getAuth():", auth);
  console.log("[DEBUG-AUTH] Bearer token in header:", {
    present: !!authHeader,
    value: authHeader ? authHeader.substring(0, 50) + "..." : null,
    startsWithBearer: authHeader?.startsWith('Bearer ')
  });
  console.log("[DEBUG-AUTH] req.auth object:", req.auth);
  
  res.json({ 
    auth: {
      fromGetAuth: auth,
      fromReqAuth: req.auth
    },
    headers: { 
      authorization: !!req.headers.authorization,
      authHeaderFull: req.headers.authorization,
      authHeaderStart: req.headers.authorization ? req.headers.authorization.substring(0, 50) + "..." : null,
      allHeaders: Object.keys(req.headers)
    },
    env: { 
      hasSecret: !!ENV.CLERK_SECRET_KEY, 
      hasPub: !!ENV.CLERK_PUBLISHABLE_KEY,
      secretStart: ENV.CLERK_SECRET_KEY ? ENV.CLERK_SECRET_KEY.substring(0, 10) + "..." : null,
      pubStart: ENV.CLERK_PUBLISHABLE_KEY ? ENV.CLERK_PUBLISHABLE_KEY.substring(0, 10) + "..." : null
    }
  });
});

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

console.log("--- Server Config ---");
console.log("Port:", ENV.PORT);
console.log("Clerk Pub Key:", ENV.CLERK_PUBLISHABLE_KEY ? `Len: ${ENV.CLERK_PUBLISHABLE_KEY.length} (${ENV.CLERK_PUBLISHABLE_KEY.substring(0, 10)}...${ENV.CLERK_PUBLISHABLE_KEY.slice(-5)})` : "MISSING");
console.log("Clerk Sec Key:", ENV.CLERK_SECRET_KEY ? `Len: ${ENV.CLERK_SECRET_KEY.length} (${ENV.CLERK_SECRET_KEY.substring(0, 10)}...${ENV.CLERK_SECRET_KEY.slice(-5)})` : "MISSING");
if (ENV.CLERK_PUBLISHABLE_KEY?.includes("'") || ENV.CLERK_PUBLISHABLE_KEY?.includes('"')) {
  console.warn("CRITICAL: Clerk Publishable Key contains quotes! This will break authentication.");
}
console.log("----------------------");

const startServer=async()=>{
    try{
        await connectDB();  
        app.listen(ENV.PORT,()=>{
            console.log(`Server started on port ${ENV.PORT}`);
        });
    }catch(err){
        console.error("Error starting server:",err);    
    }
};
startServer();

export default app;
