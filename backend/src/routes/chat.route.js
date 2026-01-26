import express from "express";
import { getStreamToken } from "../controllers/chat.controller.js";
import { protectRoutes } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get("/token",protectRoutes, getStreamToken);

export default router;