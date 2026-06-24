/** Estado operativo de una atracción */
export type AttractionStatus = 'operational' | 'maintenance' | 'inactive' | 'inspection';

/** Especificaciones técnicas de la atracción (campo JSON libre) */
export interface TechnicalSpecs {
  [key: string]: unknown;
}

/** Entidad principal de dominio — Atracción del parque */
export interface Attraction {
  id: string;
  name: string;
  code: string;
  area: string;
  status: AttractionStatus;
  description: string;
  image?: string;
  capacity?: number;
  height_m?: number;
  duration_min?: number;
  total_plans?: number;
  pending_docs?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  technical_specs?: TechnicalSpecs;
}

/** DTO para crear una atracción */
export interface CreateAttractionDto {
  name: string;
  code: string;
  area: string;
  status: AttractionStatus;
  description?: string;
  image?: string;
  capacity?: number;
  height_m?: number;
  duration_min?: number;
  total_plans?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  technical_specs?: TechnicalSpecs;
}

/** DTO para actualizar una atracción (todos los campos opcionales) */
export type UpdateAttractionDto = Partial<CreateAttractionDto>;

