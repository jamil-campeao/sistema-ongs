import { Router } from "express";
import { authenticateUserOrOng } from "../services/authentication.js";
import { searchOngsAndProjects } from "../controllers/search.controller.js";

const router = Router();

router.get("/", authenticateUserOrOng, searchOngsAndProjects);

export default router;