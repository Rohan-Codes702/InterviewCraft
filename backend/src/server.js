import "../instrument.mjs";
import express from 'express';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import {clerkMiddleware}from '@clerk/express';
import { functions, inngest } from './config/inngest.js';
import {serve}from"inngest/express";
import chatRoutes from './routes/chat.route.js';
import * as Sentry from "@sentry/node";
import cors from 'cors';

const app=express();
app.use(express.json());
app.use(clerkMiddleware())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.get("/debug-sentry",function mainHandler(req,res){
    throw new Error("My first Sentry error!");
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

console.log("Mongo URI:", ENV.MONGO_URI);

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
