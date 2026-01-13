import express from 'express';
import { register } from '../controllers/authController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);

export default router;