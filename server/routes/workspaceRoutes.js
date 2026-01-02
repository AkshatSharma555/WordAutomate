import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getWorkspaceStats, fetchWorkspaceFiles, markAsSeen } from '../controllers/workspaceController.js';

const workspaceRouter = express.Router();

// Get Analytics Numbers
workspaceRouter.get('/stats', userAuth, getWorkspaceStats);

// Get Files List (Inbox/Sent)
workspaceRouter.get('/files', userAuth, fetchWorkspaceFiles);

// Update Read Status
workspaceRouter.post('/read', userAuth, markAsSeen);

export default workspaceRouter;