import { z } from 'zod';

import type { skeinSchema } from '@/schemas/skein.schema';
import type { projectSchemaBase } from '@/schemas/project.schema';

// Brands
export interface Brand {
  id: number;
  name: string;
}

// Skeins
export interface SkeinItem {
  id: number;
  name: string;
  brand_id: number;
  brand: Brand;
  color: string;
  weight: number;
  yardage: string;
  yardage_unit: string;
  fibers?: string[];
  comment?: string;
}

export interface SkeinSuggestion {
  name: string;
  yardage: string;
  yardage_unit: string;
  fibers: string[];
}

export interface SkeinCreateData {
  name: string;
  brand_id: number;
  color: string;
  weight: number;
  yardage: string;
  yardage_unit: string;
  fibers?: string[];
  comment?: string;
}

export type SkeinFormData = z.infer<typeof skeinSchema>;

// Filters
export interface Filters {
  skipReserved?: boolean;
  colors?: string[];
  brand?: string[];
  fibers?: string[];
}

// Projects
export interface ProjectSkeinUsage {
  skein_id: number;
  weight_required: number;
}

export interface ProjectUsage {
  id: number;
  skeins: ProjectSkeinUsage[];
}

export interface ProjectItem {
  id: number;
  name: string;
  category: string;
  skeins: ProjectSkeinItem[];
}

interface ProjectSkeinItem {
  skein_id: number;
  weight_required: number;
  name: string;
  brand: Brand;
  color: string;
  weight: number;
  yardage: string;
  yardage_unit: string;
}

// Project Form
export type ProjectFormData = z.infer<typeof projectSchemaBase>;

