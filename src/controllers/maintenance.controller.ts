import { NextFunction, Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenance.service.js';

/**
 * Controlador de Mantenimiento.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica vive en MaintenanceService.
 */

export async function listMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const attractionId = req.query.attraction_id as string | undefined;
    const data = await MaintenanceService.findAll(attractionId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
