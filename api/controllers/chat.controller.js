import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!chats || chats.length === 0) {
            return res.status(200).json({ message: "No chats till now" });
        }

        // Add lastMessage to each chat
        const chatsWithLastMessage = chats.map(chat => ({
            ...chat,
            lastMessage: chat.messages[0]?.text || null
        }));

        res.status(200).json(chatsWithLastMessage);
        
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).json({ message: "Failed to get chats" });
    }
}

export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                },
            },
            select: {
                id: true,
                userIDs: true,
                seenBy: true,
                propertyDetails: true,
                lastMessage: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    select: {
                        id: true,
                        text: true,
                        createdAt: true,
                        userId: true
                    }
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Get the receiver from the users array
        const receiver = chat.users.find(user => user.id !== tokenUserId);
        
        // Update seenBy
        await prisma.chat.update({
            where: {
                id: req.params.id,
            },
            data: {
                seenBy: {
                    set: [tokenUserId],
                },
            }
        });

        // Add receiver to the chat object
        const chatWithReceiver = {
            ...chat,
            receiver
        };

        res.status(200).json(chatWithReceiver);
        
    } catch (error) {
        console.error('Error getting chat:', error);
        res.status(500).json({ message: "Failed to get chat", error: error.message });
    }
}

export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
  
    const { receiverId, propertyDetails } = req.body;
  

    try {
        // Validate required fields
        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        // Check if chat already exists
        const existingChat = await prisma.chat.findFirst({
            where: {
                userIDs: {
                    hasEvery: [tokenUserId, receiverId],
                },
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        if (existingChat) {
          
            // Update existing chat with property details if provided
            if (propertyDetails) {
             
                const updatedChat = await prisma.chat.update({
                    where: { id: existingChat.id },
                    data: {
                        propertyDetails: {
                            id: propertyDetails.id,
                            title: propertyDetails.title,
                            price: propertyDetails.price,
                            image: propertyDetails.image,
                            address: propertyDetails.address
                        }
                    },
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        },
                        messages: {
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                });
                console.log('Updated chat with property details:', updatedChat);
                return res.status(200).json(updatedChat);
            }
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
        }

       
       

        const newChat = await prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: tokenUserId },
                        { id: receiverId }
                    ]
                },
                seenBy: [tokenUserId],
                propertyDetails: propertyDetails ? {
                    id: propertyDetails.id,
                    title: propertyDetails.title,
                    price: propertyDetails.price,
                    image: propertyDetails.image,
                    address: propertyDetails.address
                } : null
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        console.log('Created new chat:', newChat);
        res.status(200).json(newChat);
    } catch (error) {
        console.error('Chat creation error:', error);
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