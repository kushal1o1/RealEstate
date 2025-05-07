import bcrypt from 'bcrypt';

export const register = async  (req, res) => {
    //db operations
    const { username, email, password } = req.body;

    //hash password
    const hashedPassword = await  bcrypt.hash(password, 10);
    console.log(hashedPassword);
    //save user to db

    
}

export const login = (req, res) => {
    //db operations
}

export const logout = (req, res) => {
    //db operations
}

