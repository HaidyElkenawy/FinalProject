import express from "express";
import { getUser, updateUser , searchAll } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();
router.get("/search", verifyToken, searchAll);
router.get("/:id", verifyToken, getUser);

router.put("/:id", verifyToken, upload.single("profilePicture"), updateUser);


export default router;