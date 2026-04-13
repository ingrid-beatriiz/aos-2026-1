import { Router } from "express";
import { SessionController } from "../controllers/index.js";

const router = Router();

router.get("/", SessionController.getSession);

export default router;