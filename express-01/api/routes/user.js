import { Router } from "express";
import { UserController } from "../controllers/index.js";

const router = Router();

router.get("/", UserController.getAll);
router.get("/:userId", UserController.getById);
router.post("/", UserController.create);
router.put("/:userId", UserController.update);
router.delete("/:userId", UserController.remove);

export default router;