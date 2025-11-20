import { Router } from "express";
import { authenticateUserOrOng } from "../services/authentication.js";
import { submitEmail } from "../controllers/email.controller.js";

const router = Router();
router.post("/submit", authenticateUserOrOng, submitEmail);

export default router;
