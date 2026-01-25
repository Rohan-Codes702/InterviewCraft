import express from 'express';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import {clerkMiddleware}from '@clerk/express';
import { functions, inngest } from './config/inngest.js';
import {serve}from"inngest/express";

const app=express();
app.use(express.json());
app.use(clerkMiddleware())


app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/',(req,res)=>{
    res.send("Hello Rohan!");
});
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
