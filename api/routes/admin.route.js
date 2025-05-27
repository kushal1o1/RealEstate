// import express from 'express';

// import { login, logout } from '../controllers/auth.controller.js';
import { shouldBeAdmin, shouldBeLoggedIn } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

// const router = express.Router();

// // router.post('/register',register);

// router.post('/login', login);

// router.post('/logout',logout);

// router.get('/should-be-logged-in',verifyToken,shouldBeLoggedIn);

// router.get('/should-be-admin',shouldBeAdmin,verifyToken);

// router.get('/get-all-data',shouldBeAdmin,verifyToken);



// export default router;


// routes/admin.js
import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    deleteUser,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
    getAllChats,
    getChatById,
    deleteChat,
    getAllMessages,
    deleteMessage,
    getAllSavedPosts,
    deleteSavedPost,
    getAnalytics
} from '../controllers/test.controller.js';

const router = express.Router();

// Dashboard
router.get('/dashboard-stats',shouldBeAdmin,verifyToken, getDashboardStats);

// Users Routes
router.get('/users',shouldBeAdmin,verifyToken, getAllUsers);
router.get('/users/:id',shouldBeAdmin,verifyToken, getUserById);
router.delete('/users/:id',shouldBeAdmin,verifyToken, deleteUser);

// Posts Routes
router.get('/posts',shouldBeAdmin,verifyToken, getAllPosts);
router.get('/posts/:id',shouldBeAdmin,verifyToken, getPostById);
router.put('/posts/:id',shouldBeAdmin,verifyToken, updatePost);
router.delete('/posts/:id',shouldBeAdmin,verifyToken, deletePost);

// Chats Routes
router.get('/chats',shouldBeAdmin,verifyToken, getAllChats);
router.get('/chats/:id',shouldBeAdmin,verifyToken, getChatById);
router.delete('/chats/:id',shouldBeAdmin,verifyToken, deleteChat);

// Messages Routes
router.get('/messages',shouldBeAdmin,verifyToken, getAllMessages);
router.delete('/messages/:id',shouldBeAdmin,verifyToken, deleteMessage);

// Saved Posts Routes
router.get('/saved-posts',shouldBeAdmin,verifyToken, getAllSavedPosts);
router.delete('/saved-posts/:id',shouldBeAdmin,verifyToken, deleteSavedPost);

// Analytics Routes
router.get('/analytics', shouldBeAdmin, verifyToken, getAnalytics);

export default router;