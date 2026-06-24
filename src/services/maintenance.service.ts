import { MaintenanceRecord } from '../models/maintenance.model.js';

// Datos demo en memoria hasta que se conecte la BD (Prisma)
const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'mnt1',
    attraction_id: 'a1',
    type: 'preventive',
    status: 'completed',
    date: '2026-06-10',
    technician: 'Luis Castaño',
    description: 'Inspección eléctrica mensual y revisión de parámetros VFD.',
    duration_hours: 3,
    parts_replaced: [],
    observations: 'Todo en orden.',
  },
];

/**
 * MaintenanceService — consulta de registros de mantenimiento.
 */
export const MaintenanceService = {
  /**
   * Lista registros de mantenimiento.
   * Si se pasa `attractionId`, filtra por atracción.
   */
  findAll(attractionId?: string): MaintenanceRecord[] {
    if (attractionId) {
      return maintenanceRecords.filter(r => r.attraction_id === attractionId);
    }
    return maintenanceRecords;
  },
};
