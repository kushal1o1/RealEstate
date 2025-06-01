import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

console.log("post controller");
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city ? { 
          contains: query.city,
          mode: 'insensitive' // This makes the search case-insensitive
        } : undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        bathroom: parseInt(query.bathroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
        postDetail: query.amenities ? {
          amenities: {
            contains: query.amenities,
            mode: 'insensitive'
          }
        } : undefined
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
export const getPost = async (req, res) => {
    const id = req.params.id;
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
        let userId;
        const token =req.cookies.token;
        if(!token){
            userId = null;

        }
        else{
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                 userId = null;
                }
                else{
                userId = decoded.id;
                }
            
        })}
         const saved = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    userId,
                    postId:id
                }
            }
        });
        res.status(200).json({...post, isSaved: saved ? true : false});
        
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
    const body = req.body;
    const  tokenUserId = req.userId;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (post.userId !== tokenUserId) {
            return res.status(403).json(
                {
                    message:"Not authorized to update this post"
                }
            );
        }
        const updatedPost = await prisma.post.update({
            where: {
                id: req.params.id
            },
            data: {
                ...body.postData,
                postDetail:{
                    update:body.postDetail
                }
            }
        });
        res.status(200).json(updatedPost);

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