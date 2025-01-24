import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getConversation, getUsersForSideBar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/user', protectRoute , getUsersForSideBar);
router.get('/:id' , protectRoute , getConversation);

router.post('/send/:id', protectRoute ,sendMessage);
export default router;