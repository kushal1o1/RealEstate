import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const shouldBeLoggedIn = (req, res) => {

        res.status(200).json(
            {
                message:"You are authenticated!",
            }
        );
    }

    
export const shouldBeAdmin = (req, res,next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json(
        {
        message:"token:Not authenticated!"
    });
    jwt.verify(token, process.env.JWT_SECRET_KEY,async (err, payload) => {
        if (err) return res.status(403).json(
            {
                message:"Token is not valid!"
            }
        );
    console.log(payload.isAdmin);

        if (!payload.isAdmin) return res.status(403).json(
            {
                message:"admin:Not authorized!"
            }
        );
        // res.status(200).json(
        //     {
        //         message:"You are authenticated!",
        //     }
        // );
        next();
    });

}


// export const getAllData = async (req, res) => {
//     try {
//         const users = await prisma.user.findMany();
//         const posts = await prisma.post.findMany();
//         const chats = await prisma.chat.findMany();
//         const messages = await prisma.message.findMany();
//         const savedPosts = await prisma.savedPost.findMany();

//         res.status(200).json({ users, posts, chats, messages, savedPosts });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Failed to get all data!" });
//     }
// };

// controllers/adminController.js


// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalPosts = await prisma.post.count();
        const totalChats = await prisma.chat.count();
        const totalMessages = await prisma.message.count();
        const totalSavedPosts = await prisma.savedPost.count();
        
        const recentUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        });

        const recentPosts = await prisma.post.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });

        const rentPosts = await prisma.post.count({ where: { type: 'rent' } });
        const salePosts = await prisma.post.count({ where: { type: 'sale' } });

        res.status(200).json({
            totalUsers,
            totalPosts,
            totalChats,
            totalMessages,
            totalSavedPosts,
            recentUsers,
            recentPosts,
            rentPosts,
            salePosts
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get dashboard stats!" });
    }
};

// Users CRUD
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const users = await prisma.user.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                posts: true,
                savedPosts: true,
                _count: {
                    select: {
                        posts: true,
                        savedPosts: true,
                        chats: true
                    }
                }
            }
        });

        const total = await prisma.user.count({ where });

        res.status(200).json({
            users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get users!" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                posts: {
                    include: {
                        postDetail: true,
                        savedPosts: true
                    }
                },
                savedPosts: {
                    include: {
                        post: true
                    }
                },
                chats: {
                    include: {
                        messages: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get user!" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete user!" });
    }
};

// Posts CRUD
export const getAllPosts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            type = '', 
            property = '', 
            city = '',
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;
        
        const skip = (page - 1) * limit;

        let where = {};
        
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (type && type !== '') where.type = type;
        if (property && property !== '') where.property = property;
        if (city && city !== '') where.city = { contains: city, mode: 'insensitive' };

        const posts = await prisma.post.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                postDetail: true,
                savedPosts: true,
                _count: {
                    select: {
                        savedPosts: true
                    }
                }
            }
        });

        const total = await prisma.post.count({ where });

        res.status(200).json({
            posts,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts!" });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                user: true,
                postDetail: true,
                savedPosts: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get post!" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({
            where: { id }
        });
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post!" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const post = await prisma.post.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                postDetail: true
            }
        });

        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update post!" });
    }
};

// Chats Management
export const getAllChats = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        const chats = await prisma.chat.findMany({
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            }
        });

        const total = await prisma.chat.count();

        res.status(200).json({
            chats,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chats!" });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await prisma.chat.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.chat.delete({
            where: { id }
        });
        res.status(200).json({ message: "Chat deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete chat!" });
    }
};

// Messages Management
export const getAllMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', chatId = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        let where = {};
        
        if (search) {
            where.text = { contains: search, mode: 'insensitive' };
        }
        
        if (chatId && chatId !== '') {
            where.chatId = chatId;
        }

        const messages = await prisma.message.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                chat: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        const total = await prisma.message.count({ where });

        res.status(200).json({
            messages,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get messages!" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.message.delete({
            where: { id }
        });
        res.status(200).json({ message: "Message deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete message!" });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await prisma.message.findUnique({
            where: { id },
            include: {
                chat: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found!" });
        }

        // Get the user who sent the message
        const user = await prisma.user.findUnique({
            where: { id: message.userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true
            }
        });

        // Add user info to the message object
        const messageWithUser = {
            ...message,
            user
        };

        res.status(200).json(messageWithUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get message!" });
    }
};

// Saved Posts Management
export const getAllSavedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId = '', postId = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        let where = {};
        if (userId && userId !== '') where.userId = userId;
        if (postId && postId !== '') where.postId = postId;

        const savedPosts = await prisma.savedPost.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        address: true,
                        city: true,
                        type: true,
                        property: true,
                        images: true
                    }
                }
            }
        });

        const total = await prisma.savedPost.count({ where });

        res.status(200).json({
            savedPosts,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get saved posts!" });
    }
};

export const deleteSavedPost = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.savedPost.delete({
            where: { id }
        });
        res.status(200).json({ message: "Saved post deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete saved post!" });
    }
};

export const getSavedPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const savedPost = await prisma.savedPost.findUnique({
            where: { id },
            include: {
                post: {
                    include: {
                        postDetail: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        if (!savedPost) {
            return res.status(404).json({ message: "Saved post not found!" });
        }

        // Get the user who saved the post
        const user = await prisma.user.findUnique({
            where: { id: savedPost.userId },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true
            }
        });

        // Add user info to the saved post object
        const savedPostWithUser = {
            ...savedPost,
            user
        };

        res.status(200).json(savedPostWithUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get saved post!" });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const { timeRange = 'week' } = req.query;
        const now = new Date();
        let startDate;

        // Calculate start date based on time range
        switch (timeRange) {
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'week':
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
        }

        // Get user growth data
        const userGrowth = await prisma.user.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            _count: true,
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Get property listings data
        const propertyListings = await prisma.post.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            _count: true,
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Get message trends data
        const messageTrends = await prisma.message.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            _count: true,
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Get revenue data (example - adjust based on your actual revenue tracking)
        const revenue = await prisma.post.groupBy({
            by: ['createdAt', 'type'],
            where: {
                createdAt: {
                    gte: startDate
                },
                type: {
                    in: ['sale', 'rent']
                }
            },
            _sum: {
                price: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Get property types distribution
        const propertyTypes = await prisma.post.groupBy({
            by: ['property'],
            _count: true,
            orderBy: {
                _count: {
                    property: 'desc'
                }
            }
        });

        // Get top locations
        const topLocations = await prisma.post.groupBy({
            by: ['city'],
            _count: true,
            orderBy: {
                _count: {
                    city: 'desc'
                }
            },
            take: 5
        });

        // Format the data for the frontend
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        };

        const formatAnalyticsData = (data, dateField = 'createdAt') => {
            return data.map(item => ({
                date: formatDate(item[dateField]),
                count: item._count
            }));
        };

        const formatRevenueData = (data) => {
            const sales = data.filter(item => item.type === 'sale');
            const rentals = data.filter(item => item.type === 'rent');
            
            return {
                sales: sales.map(item => ({
                    date: formatDate(item.createdAt),
                    amount: item._sum.price || 0
                })),
                rentals: rentals.map(item => ({
                    date: formatDate(item.createdAt),
                    amount: item._sum.price || 0
                }))
            };
        };

        res.status(200).json({
            userGrowth: formatAnalyticsData(userGrowth),
            propertyListings: formatAnalyticsData(propertyListings),
            messageTrends: formatAnalyticsData(messageTrends),
            revenue: formatRevenueData(revenue),
            propertyTypes: propertyTypes.map(item => ({
                type: item.property,
                count: item._count
            })),
            topLocations: topLocations.map(item => ({
                city: item.city,
                count: item._count
            }))
        });
    } catch (err) {
        console.error('Error fetching analytics data:', err);
        res.status(500).json({ message: "Failed to fetch analytics data" });
    }
};

