import { Router } from 'express';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/users.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';

export const userRouter = Router();

userRouter.get('/', requireAuth, requireRole('admin'), listUsers);
userRouter.post('/', requireAuth, requireRole('admin'), imageUpload.single('avatar'), createUser);
userRouter.put('/:id', requireAuth, requireRole('admin'), imageUpload.single('avatar'), updateUser);
userRouter.delete('/:id', requireAuth, requireRole('admin'), deleteUser);
