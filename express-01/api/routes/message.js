import { Router } from "express";
import { MessageController } from "../controllers/index.js";

const router = Router();

router.get("/", MessageController.getAll);
router.get("/:messageId", MessageController.getById);
router.post("/", MessageController.create);
router.put("/:messageId", MessageController.update);
router.delete("/:messageId", MessageController.remove);

export default router;