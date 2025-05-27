// import express from 'express';

// import { login, logout } from '../controllers/auth.controller.js';
import { shouldBeAdmin, shouldBeLoggedIn } from '../controllers/test.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';

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
    getMessageById,
    deleteMessage,
    getAllSavedPosts,
    getSavedPostById,
    deleteSavedPost,
    getAnalytics
} from '../controllers/test.controller.js';

const router = express.Router();

// All admin routes are protected by both verifyToken and verifyAdmin
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Users Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Posts Routes
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Chats Routes
router.get('/chats', getAllChats);
router.get('/chats/:id', getChatById);
router.delete('/chats/:id', deleteChat);

// Messages Routes
router.get('/messages', getAllMessages);
router.get('/messages/:id', getMessageById);
router.delete('/messages/:id', deleteMessage);

// Saved Posts Routes
router.get('/saved-posts', getAllSavedPosts);
router.get('/saved-posts/:id', getSavedPostById);
router.delete('/saved-posts/:id', deleteSavedPost);

// Analytics Routes
router.get('/analytics', getAnalytics);

export default router;