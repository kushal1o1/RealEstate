import express from 'express';
import { updateUser,savePost, profilePosts, getNotificationNumber } from '../controllers/user.controller.js';
// import { getUser, updateUser, deleteUser, getUsers, savePost, profilePosts, getNotificationNumber } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { getSavedPostById, getMessageById } from '../controllers/test.controller.js';

const router = express.Router();

// router.get('/', getUsers);
// // router.get('/:id',verifyToken,getUser); //only for development 
router.put('/:id', verifyToken, updateUser);
// router.delete('/:id', verifyToken, deleteUser);
router.post('/save', verifyToken, savePost);
router.get('/profilePosts', verifyToken, profilePosts);
router.get('/notification', verifyToken, getNotificationNumber);

// Add routes for individual saved posts and messages
router.get('/saved-posts/:id', verifyToken, getSavedPostById);
router.get('/messages/:id', verifyToken, getMessageById);

export default router;