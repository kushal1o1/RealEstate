import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);
    try {
        const posts = await prisma.post.findMany({
            where:{
                city :query.city || undefined,
                property:query.property || undefined,
                type:query.type || undefined,
                bedroom : parseInt(query.bedroom) || undefined,
                price:{
                    lte:parseInt(query.maxPrice) || 1000000000,
                    gte:parseInt(query.minPrice) || 0,
                },
                type:query.type || undefined,


            }
        });
        res.status(200).json(posts);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "GetPosts:Failed to get Posts" });
        
    }
}
export const getPost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique(
            {
                where: {
                    id: req.params.id
                },
            include:{
                postDetail:true,
                user:{
                    select:{
                        username:true,
                        avatar:true,
                    }
                }


            }
            }   
        );

        res.status(200).json(post);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "getPost:Failed to get Posts" });
        
    }
}
export const addPost = async (req, res) => {
    const body = req.body;
    const  tokenUserId = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
               ...body.postData,
                userId: tokenUserId,
                postDetail:{
                    create:body.postDetail
                }

            }
        });

        res.status(200).json(newPost);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "addPost:Failed to get Posts" });
        
    }
}

export const updatePost = async (req, res) => {
    try {

        res.status(200).json();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "UpdatePost:Failed to get Posts" });
        
    }
}
export const deletePost = async (req, res) => {
    const tokenUserId = req.userId;
    const  id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });
        if (post.userId !== tokenUserId) {
            return res.status(403).json(
                {
                    message:"Not authorized to delete this post"
                }
            );
        }
        await prisma.post.delete({
            where: {
                id
            }
        });

        
        res.status(200).json(
            {
                message:"Post deleted successfully"
            }
        );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "deletePost:Failed to get Posts" });
        
    }
}