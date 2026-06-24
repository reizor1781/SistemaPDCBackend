/** Estado de un plano eléctrico */
export type PlanStatus = 'draft' | 'review' | 'approved' | 'obsolete';

/** Tipo/categoría de un plano */
export type PlanType =
  | 'power_diagram'
  | 'control_diagram'
  | 'single_line'
  | 'plc_diagram'
  | 'communication'
  | 'grounding'
  | 'lighting'
  | 'mechanical'
  | 'hydraulic'
  | 'pneumatic';

/** Revisión histórica de un plano */
export interface PlanRevision {
  version: string;
  author: string;
  description: string;
  fileUrl: string;
  fileSizeKb: number;
  createdAt: string;
}

/** Entidad principal de dominio — Plano eléctrico */
export interface ElectricalPlan {
  id: string;
  attraction_id: string;
  plan_number: string;
  title: string;
  type: PlanType;
  status: PlanStatus;
  current_version: string;
  author?: string;
  reviewer?: string;
  approver?: string;
  file_url: string;
  file_size_kb: number;
  pages: number;
  tags: string[];
  description?: string;
  revisions: PlanRevision[];
  comments: unknown[];
  created_date: string;
  updated_date: string;
}

/** DTO para crear un plano */
export interface CreatePlanDto {
  attraction_id: string;
  plan_number?: string;
  title: string;
  type?: PlanType;
  description?: string;
  author?: string;
}

/** DTO para actualizar un plano */
export type UpdatePlanDto = Partial<Omit<ElectricalPlan, 'id' | 'created_date'>>;
