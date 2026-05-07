import { Router } from "express";
import { SessionController } from "../controllers/index.js";

const router = Router();

router.get("/", SessionController.getSession);
router.post("/", SessionController.createSession);

export default router;