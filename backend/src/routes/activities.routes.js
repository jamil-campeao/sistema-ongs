import { Router } from 'express';
import { getActivities } from '../controllers/activities.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUserOrOng, getActivities);

export default router;