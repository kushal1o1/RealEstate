import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const { text, isSystemMessage } = req.body;
    
    try {
        // Validate chat exists and user is part of it
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId]
                },
            },
            select: {
                id: true,
                propertyDetails: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        if (!chat) {
            return res.status(403).json({ message: "Chat not Found" });
        }

        // For system messages, we'll use the first user in the chat as the sender
        const systemMessageUserId = chat.users[0]?.id;

        // Create message with proper chat relation and required userId
        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: isSystemMessage ? systemMessageUserId : tokenUserId,
            }
        });

        // Update chat with new message and seen status
        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                seenBy: [tokenUserId],
                lastMessage: text,
            }
        });

        // If this is a system message and we have property details, add them to the message
        if (isSystemMessage && chat.propertyDetails) {
            const propertyInfo = chat.propertyDetails;
            const systemMessage = await prisma.message.update({
                where: { id: message.id },
                data: {
                    text: `${text}\nProperty Link: /post/${propertyInfo.id}\nProperty Image: ${propertyInfo.image}`
                }
            });
            return res.status(200).json(systemMessage);
        }

        // Get user info for the response
        const userInfo = chat.users.find(user => user.id === (isSystemMessage ? systemMessageUserId : tokenUserId));
        const messageWithUser = {
            ...message,
            user: userInfo
        };

        res.status(200).json(messageWithUser);
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: "Failed to add message", error: error.message });
    }
}