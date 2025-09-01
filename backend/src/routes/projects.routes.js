import { Router } from 'express';
import { getProjects, getProjectsByID, postProject, putProjectByID, deleteProjectByID, getVolunteerStatus, postRequestVolunteer, respondToVolunteerRequest } from '../controllers/projects.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUserOrOng, getProjects);
router.get("/:id/volunteer-status", authenticateUserOrOng, getVolunteerStatus);
router.get("/:id", authenticateUserOrOng, getProjectsByID);
router.post("/:id/volunteer", authenticateUserOrOng, postRequestVolunteer);
router.post("/", authenticateUserOrOng, postProject);
router.put("/:id", authenticateUserOrOng, putProjectByID);
router.delete("/:id", authenticateUserOrOng, deleteProjectByID);
router.patch('/:requestId/respond', authenticateUserOrOng, respondToVolunteerRequest);

export default router;