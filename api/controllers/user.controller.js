import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers =  async (req, res) => {
    console.log("getUsers called")
    try{
       const users = await prisma.user.findMany();
       res.status(200).json(users);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to get users"});
    }
}


export const getUser =  async (req, res) => {
    const { id } = req.params;
    try{
        const user = await prisma.user.findUnique(
            {
                where: {
                    id
                },
            }
        );
        res.status(200).json(user);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to get user"});
    }
}

export const updateUser =  async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    const {password,avatar,...inputs}= req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized" });
        
    }
    let hashedPassword = null;
    try{

        if (password) {
             hashedPassword = await bcrypt.hash(password, 10);
            
        }
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...inputs,
                ...(hashedPassword && { password: hashedPassword }),
                ...(avatar && { avatar }),
            },
        });

        const { password:_, ...rest } = updatedUser;
        res.status(200).json(rest);

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to update users"});
    }
}


export const deleteUser =  async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    if (tokenUserId !== id) {
        return res.status(403).json({ message: "Not Authorized" });
        
    }
    try{
        await prisma.user.delete({
            where: {
                id
            },
        });
        res.status(200).json({message: "User deleted successfully"});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to delete users"});
    }
}


export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get that post!" });
  }
};
