import express from "express";
import { getNotifications, markAsRead, markAllRead } from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/mark-all", verifyToken, markAllRead);
router.patch("/:id", verifyToken, markAsRead);

export default router;