import { Router } from 'express';
import {getOngs, getOngByID, deleteOngByID, putOng, postOng, getCNPJ, getMe, getOngProjects, PutPasswordOng, PostInviteUserToONG, getAllOngUserRelations, getProjectVolunteerRequestsForOng } from '../controllers/ongs.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/me", authenticateUserOrOng, getMe);
router.get("/:id/project-volunteer-requests", authenticateUserOrOng, getProjectVolunteerRequestsForOng);
router.get("/all-user-relations", authenticateUserOrOng, getAllOngUserRelations);
router.post("/invite-user", authenticateUserOrOng, PostInviteUserToONG);
router.get("/cnpj/:cnpj", getCNPJ);
router.get("/projects", authenticateUserOrOng, getOngProjects);
router.put("/editpassword", authenticateUserOrOng, PutPasswordOng);
router.get("/", authenticateUserOrOng, getOngs);
router.get("/:id", authenticateUserOrOng, getOngByID);
router.post("/", postOng);
router.put("/", authenticateUserOrOng, putOng);
router.delete("/:id", authenticateUserOrOng, deleteOngByID);

export default router;