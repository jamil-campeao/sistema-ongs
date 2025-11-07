import { Router } from "express";
import { resetPassword, sendEmail } from "../controllers/forgotpassword.controller.js"

const router = Router();

router.post("/", resetPassword);
router.post("/send-email", sendEmail);

export default router;