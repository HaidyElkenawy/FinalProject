import express from 'express';
import { 
    createPost, 
    getFeedPosts, 
    getUserPosts, 
    updatePost,
    deletePost,
    likePost, 
    addComment, 
    deleteComment, getPost
} from '../controllers/postController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/user/:userId', verifyToken, getUserPosts); 
router.get('/', verifyToken, getFeedPosts);       

router.post('/', verifyToken, upload.single('picture'), createPost);

router.patch('/:id', verifyToken, updatePost);         
router.patch('/:id/like', verifyToken, likePost);      
router.post('/:id/comment', verifyToken, addComment); 
router.delete('/:id', verifyToken, deletePost);   
router.delete('/:id/comment/:commentId', verifyToken, deleteComment);

router.get('/:id', verifyToken, getPost);

export default router;