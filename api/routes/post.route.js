import express from 'express';

const postRoute = express.Router();

postRoute.get('/test', (req, res) => {
    res.send('Post route is working!');
    }  );

export default postRoute;