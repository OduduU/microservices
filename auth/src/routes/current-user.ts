import express from 'express';

import { currentUser } from '@outickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.json({ currentUser: req.currentUser || null });
});

export {router as currentUserRouter};
