import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/post.js";
// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

export default router;
