import { Router } from 'express';
import { deletePlan, getPlan, listPlans, updatePlan, uploadPlan, addComment, resolveComment, deleteComment } from '../controllers/plans.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { pdfUpload } from '../middleware/upload.js';

export const planRouter = Router();

planRouter.get('/', requireAuth, listPlans);
planRouter.get('/:id', requireAuth, getPlan);
planRouter.post(
  '/',
  requireAuth,
  requireRole('admin', 'engineer'),
  pdfUpload.single('file'),
  uploadPlan,
);
planRouter.put('/:id', requireAuth, requireRole('admin', 'engineer'), updatePlan);
planRouter.delete('/:id', requireAuth, requireRole('admin', 'engineer'), deletePlan);

// Comentarios
planRouter.post('/:id/comments', requireAuth, addComment);
planRouter.patch('/:id/comments/:commentId/resolve', requireAuth, resolveComment);
planRouter.delete('/:id/comments/:commentId', requireAuth, deleteComment);
