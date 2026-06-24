import { MaintenanceService } from '../services/maintenance.service.js';
/**
 * Controlador de Mantenimiento.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica vive en MaintenanceService.
 */
export async function listMaintenance(req, res, next) {
    try {
        const attractionId = req.query.attraction_id;
        const data = await MaintenanceService.findAll(attractionId);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
