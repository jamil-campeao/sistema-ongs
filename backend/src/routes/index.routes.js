import { Router } from "express";
import loginRoutes from "./login.routes.js";
import usersRoutes from "./users.routes.js";
import ongsRoutes from "./ongs.routes.js";
import projectsRoutes from "./projects.routes.js";
import activitiesRoutes from "./activities.routes.js";
import postsRoutes from "./posts.routes.js";
import filtersRoutes from "./filters.routes.js";
import contributionsRoutes from "./contributions.routes.js";
import invitesRoutes from "./invites.routes.js";
import searchRoutes from "./search.routes.js";
import forgotPasswordRoutes from "./forgotpassword.routes.js";
import emailRoutes from "./email.routes.js";

const router = Router();

router.use("/api/v1/login", loginRoutes);
router.use("/api/v1/users", usersRoutes);
router.use("/api/v1/ongs", ongsRoutes);
router.use("/api/v1/projects", projectsRoutes);
router.use("/api/v1/activities", activitiesRoutes);
router.use("/api/v1/posts", postsRoutes);
router.use("/api/v1/filters", filtersRoutes);
router.use("/api/v1/contributions", contributionsRoutes);
router.use("/api/v1/invites", invitesRoutes);
router.use("/api/v1/search-results", searchRoutes);
router.use("/api/v1/forgot-password", forgotPasswordRoutes);
router.use("/api/v1/email", emailRoutes);

export default router;
