import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import { getUserData, updateUserTheme, updatePersonalInfo,getAllStudents } from '../controllers/userController.js';
import { sendFriendRequest, respondToRequest, getMyFriends, getPendingRequests , withdrawRequest, removeFriend
} from '../controllers/friendController.js'

const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.get('/data', userAuth, getUserData);

userRouter.put('/update-theme', userAuth, updateUserTheme);
userRouter.put('/update-personal-info', userAuth, updatePersonalInfo);

// 👇 NEW: Social & Explore Routes
userRouter.get('/explore', userAuth, getAllStudents);           
userRouter.post('/friend-request/send', userAuth, sendFriendRequest); 
userRouter.post('/friend-request/respond', userAuth, respondToRequest); 
userRouter.get('/friends', userAuth, getMyFriends);             
userRouter.get('/friends/pending', userAuth, getPendingRequests); 
userRouter.post('/friend-request/withdraw', userAuth, withdrawRequest); 
userRouter.post('/friend-request/remove', userAuth, removeFriend);

export default userRouter;