import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate role if provided
    if (role && !['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: "Invalid role! Role must be either USER or ADMIN" });
    }

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'USER', // Default to USER if no role provided
      },
    });

    const { password: _, ...userInfo } = newUser;
    res.status(201).json({ message: "User created successfully", user: userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.role === 'ADMIN', // Set isAdmin based on role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;
    console.log(user.role);
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, //for development comment it
        maxAge: age,
        sameSite: "Lax",
      })
      .status(200)
      .json({
        ...userInfo,
        isAdmin: user.role === 'ADMIN' // Include isAdmin in response
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};