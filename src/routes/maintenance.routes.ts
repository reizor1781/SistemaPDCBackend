import { Router } from 'express';
import { listMaintenance } from '../controllers/maintenance.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const maintenanceRouter = Router();

maintenanceRouter.get('/', requireAuth, requireRole('admin', 'engineer', 'technician'), listMaintenance);
