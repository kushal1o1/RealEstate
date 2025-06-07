import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// export const getUsers =  async (req, res) => {
//     console.log("getUsers called")
//     try{
//        const users = await prisma.user.findMany();
//        res.status(200).json(users);
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({message: "Failed to get users"});
//     }
// }


// export const getUser =  async (req, res) => {
//     const { id } = req.params;
//     try{
//         const user = await prisma.user.findUnique(
//             {
//                 where: {
//                     id
//                 },
//             }
//         );
//         res.status(200).json(user);
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({message: "Failed to get user"});
//     }
// }

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    const { password, avatar, username, email, ...otherInputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized" });
    }

    try {
        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required!" });
        }

        // Check if username is being changed and if it already exists
        if (username) {
            const existingUsername = await prisma.user.findFirst({
                where: {
                    username,
                    id: { not: id } // Exclude current user
                }
            });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already exists!" });
            }
        }

        // Check if email is being changed and if it already exists
        if (email) {
            const existingEmail = await prisma.user.findFirst({
                where: {
                    email,
                    id: { not: id } // Exclude current user
                }
            });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists!" });
            }
        }

        // Validate password if provided
        if (password && password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                ...otherInputs,
                ...(hashedPassword && { password: hashedPassword }),
                ...(avatar && { avatar }),
            },
        });

        const { password: _, ...rest } = updatedUser;
        res.status(200).json(rest);

    } catch (err) {
        console.error(err);
        if (err.code === 'P2002') {
            // Prisma unique constraint violation
            const field = err.meta?.target?.[0];
            return res.status(400).json({ 
                message: field ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists!` 
                             : "Username or email already exists!"
            });
        }
        res.status(500).json({ message: "Failed to update profile! Please try again later." });
    }
}


// export const deleteUser =  async (req, res) => {
//     const { id } = req.params;
//     const tokenUserId = req.userId;
//     if (tokenUserId !== id) {
//         return res.status(403).json({ message: "Not Authorized" });
        
//     }
//     try{
//         await prisma.user.delete({
//             where: {
//                 id
//             },
//         });
//         res.status(200).json({message: "User deleted successfully"});

//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({message: "Failed to delete users"});
//     }
// }


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



export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const userPosts = await prisma.post.findMany({
            where: {
                userId: tokenUserId,
            },
        });

         const saved = await prisma.savedPost.findMany({
            where: {
                userId: tokenUserId,
                
            },
            include:{
                  post:true,

                },
        });
        const savedPosts = saved.map((item)=>item.post)
        res.status(200).json({
            userPosts,
            savedPosts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get profile posts" });
    }
}

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const number = await prisma.chat.count({
            where: {
                userIDs:{
                    has: tokenUserId,
                },
                NOT:{
                    seenBy:{
                        hasSome:[tokenUserId]
                    }
                }
            },
        });
        res.status(200).json(number);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get notification number" });
    }
}