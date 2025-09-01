import { Router } from 'express';
import { postLogin } from '../controllers/login.controller.js';

const router = Router();

router.post("/", postLogin);

export default router;