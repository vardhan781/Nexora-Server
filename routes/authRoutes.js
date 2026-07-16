import express from "express";
import { login, me } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me);

export default authRouter;
