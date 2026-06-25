export type ManualCategory =
  | 'operation'
  | 'maintenance';

export type ManualStatus = 'active' | 'draft' | 'review' | 'obsolete';

export interface AttractionManual {
  id: string;
  attraction_id: string;
  manual_number: string;
  title: string;
  category: ManualCategory;
  status: ManualStatus;
  current_version: string;
  author?: string;
  file_url: string;
  file_size_kb: number;
  pages: number;
  tags: string[];
  description?: string;
  created_date: string;
  updated_date: string;
}

export interface CreateManualDto {
  attraction_id: string;
  manual_number?: string;
  title: string;
  category?: ManualCategory;
  status?: ManualStatus;
  current_version?: string;
  author?: string;
  description?: string;
}

export type UpdateManualDto = Partial<Omit<AttractionManual, 'id' | 'created_date'>>;
