import { Router } from 'express';
import { authenticateUserOrOng } from "../services/authentication.js";
import { deleteContributionByID, getContributionsUser, postContributionUser, putContributionByID, getContributions } from '../controllers/contributions.controller.js';

const router = Router();
router.put("/:id", authenticateUserOrOng, putContributionByID);
router.get("/", authenticateUserOrOng, getContributionsUser);
router.get("/all", authenticateUserOrOng, getContributions);
router.post("/", authenticateUserOrOng, postContributionUser);
router.delete("/:id", authenticateUserOrOng, deleteContributionByID);

export default router;