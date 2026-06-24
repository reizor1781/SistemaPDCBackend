/** Tipo de mantenimiento */
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive' | 'inspection';

/** Estado del mantenimiento */
export type MaintenanceStatus = 'completed' | 'in_progress' | 'scheduled' | 'cancelled';

/** Entidad de dominio — Registro de mantenimiento */
export interface MaintenanceRecord {
  id: string;
  attraction_id: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  date: string;
  technician: string;
  description: string;
  duration_hours?: number;
  parts_replaced?: string[];
  observations?: string;
  next_action?: string;
}

/** DTO para crear un registro de mantenimiento */
export interface CreateMaintenanceDto {
  attraction_id: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  date: string;
  technician: string;
  description: string;
  duration_hours?: number;
  parts_replaced?: string[];
  observations?: string;
  next_action?: string;
}
