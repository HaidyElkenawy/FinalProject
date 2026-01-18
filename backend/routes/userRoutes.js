import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Import your multer upload setup

const router = express.Router();

router.get("/:id", verifyToken, getUser);

// ADD THIS ROUTE:
router.put("/:id", verifyToken, upload.single("profilePicture"), updateUser);

export default router;