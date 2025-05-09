import prisma from "../lib/prisma.js";

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
        res.status(500).json({message: "Failed to get users"});
    }
}

export const updateUser =  async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    if (tokenUserId !== id) {
        return res.status(403).json({ message: "Not Authorized" });
        
    }
    const body= req.body;
    try{
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: body,
        });
        res.status(200).json(updatedUser);

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to get users"});
    }
}


export const deleteUser =  async (req, res) => {
    try{

    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Failed to get users"});
    }
}