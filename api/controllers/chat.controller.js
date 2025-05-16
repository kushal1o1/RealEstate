import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats =await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome: [tokenUserId]
                }
            }
        })
        console.log(chats);
        if (!chats || chats.length === 0) {
            return res.status(200).json({ message: "No chats till now" });
        }
        for (const chat of chats) {
            const receiverId = chat.userIDs.find(id => id !== tokenUserId);
            const receiver = await prisma.user.findUnique({
                where:{
                    id: receiverId,
                },
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                }
            });
            chat.receiver = receiver;
        }

        res.status(200).json(chats);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get chats " });
        
    }
}

export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chat = await prisma.chat.findUnique({
            where:{
                id: req.params.id,
                userIDs:{
                    hasSome: [tokenUserId]
                },
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt: 'asc'
                    },
                },
            },
        });
        await prisma.chat.update({
            where:{
                id: req.params.id,
            },
            data:{
                seenBy:{
                    set: [tokenUserId],
                },
            }
        })
        res.status(200).json(chat);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get chat" });
        
    }
}

export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    const receiverId = req.body.receiverId;
    try {
        // Check if chat already exists
        const existingChat = await prisma.chat.findFirst({
            where: {
                userIDs: {
                    hasEvery: [tokenUserId, receiverId],
                },
            },
        });

        if (existingChat) {
            return res.status(200).json({ message: "Chat already exists" });
        }

        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, receiverId],
            },
        });
        res.status(200).json(newChat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add chat" });
    }
}

export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat =await prisma.chat.update({
            where:{
                id: req.params.id,
                userIDs:{
                    hasSome: [tokenUserId]
                },
            },
            data:{
                seenBy:{
                    set: [tokenUserId],
                },
            }
        })
        res.status(200).json(chat);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to read chat" });
        
    }
}