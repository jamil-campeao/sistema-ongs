import { Router } from 'express';
import { authenticateUserOrOng } from "../services/authentication.js";
import { getInviteDetails, putRespondToInvite } from '../controllers/invites.controller.js';

const router = Router();

router.put("/:id/respond", authenticateUserOrOng, putRespondToInvite);
router.get("/:id", authenticateUserOrOng, getInviteDetails);

export default router;