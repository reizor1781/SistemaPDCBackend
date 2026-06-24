import { Router } from 'express';
import { login, me, updateMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/me', requireAuth, me);
authRouter.put('/me', requireAuth, imageUpload.single('avatar'), updateMe);
