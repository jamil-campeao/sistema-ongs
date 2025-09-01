import { Router } from 'express';
import { getPosts, getPostByID, postPost, postLike, postComment, putPostByID, putCommentByID, deletePostByID, deleteLikeByID, deleteCommentByID } from '../controllers/posts.controller.js';
import { authenticateUserOrOng } from "../services/authentication.js";

const router = Router();

router.get("/", authenticateUserOrOng, getPosts);
router.get("/:id", authenticateUserOrOng, getPostByID);
router.post("/", authenticateUserOrOng, postPost);
router.post("/:postId/likes", authenticateUserOrOng, postLike);
router.post("/:postId/comments", authenticateUserOrOng, postComment);
router.put("/:id", authenticateUserOrOng, putPostByID);
router.put("/:postId/comments/:commentId", authenticateUserOrOng, putCommentByID);
router.delete("/:id", authenticateUserOrOng, deletePostByID);
router.delete("/:postId/likes/:likeId", authenticateUserOrOng, deleteLikeByID);
router.delete("/:postId/comments/:commentId", authenticateUserOrOng, deleteCommentByID);

export default router;