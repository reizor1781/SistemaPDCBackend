import { Router } from 'express';
import {
  createAttraction,
  deleteAttraction,
  getAttraction,
  listAttractions,
  updateAttraction,
} from '../controllers/attractions.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';

export const attractionRouter = Router();

attractionRouter.get('/', requireAuth, listAttractions);
attractionRouter.get('/:id', requireAuth, getAttraction);
attractionRouter.post(
  '/',
  requireAuth,
  requireRole('admin', 'engineer'),
  imageUpload.single('image'),
  createAttraction,
);
attractionRouter.put(
  '/:id',
  requireAuth,
  requireRole('admin', 'engineer'),
  imageUpload.single('image'),
  updateAttraction,
);
attractionRouter.delete('/:id', requireAuth, requireRole('admin', 'engineer'), deleteAttraction);

