import express from 'express';
import { 
    createPost, 
    getFeedPosts, 
    getUserPosts, 
    updatePost,
    deletePost,
    likePost, 
    addComment 
} from '../controllers/postController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', verifyToken, getFeedPosts);       // Get all posts 
router.get('/:userId/posts', verifyToken, getUserPosts); // Get user's posts

router.post('/', verifyToken, upload.single('picture'), createPost);

router.patch('/:id', verifyToken, updatePost); // Update post description
router.patch('/:id/like', verifyToken, likePost); //Like/unlike
router.post('/:id/comment', verifyToken, addComment);
router.delete('/:id', verifyToken, deletePost);

export default router;