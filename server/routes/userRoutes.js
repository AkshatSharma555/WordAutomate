import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import { getUserData, updateProfilePic, deleteProfilePic, updateUserTheme, updatePersonalInfo } from '../controllers/userController.js';

const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/update-pic', userAuth, upload.single('image'), updateProfilePic);
userRouter.delete('/delete-pic', userAuth, deleteProfilePic);
userRouter.put('/update-theme', userAuth, updateUserTheme);
userRouter.put('/update-personal-info', userAuth, updatePersonalInfo);

export default userRouter;