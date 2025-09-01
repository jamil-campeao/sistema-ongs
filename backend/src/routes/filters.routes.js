import { Router } from "express";
import { authenticateUserOrOng } from "../services/authentication.js";
import { getFilterProjects, getFilterActivities, getFilterPosts, getFilterUsers, getFilterOngs } from "../controllers/filters.controller.js";

const router = Router();

router.get("/projects", authenticateUserOrOng, getFilterProjects);
router.get("/activities", authenticateUserOrOng, getFilterActivities);
router.get("/posts", authenticateUserOrOng, getFilterPosts);
router.get("/users", authenticateUserOrOng, getFilterUsers);
router.get("/ongs", authenticateUserOrOng, getFilterOngs);

export default router;