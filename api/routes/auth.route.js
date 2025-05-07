import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
    // Handle user registration logic here
    res.send('User registered successfully!');
}
);

router.post('/login', (req, res) => {
    // Handle user login logic here
    res.send('User logged in successfully!');
}
);

router.post('/logout', (req, res) => {
    // Handle user logout logic here
    res.send('User logged out successfully!');
}   
);

export default router;