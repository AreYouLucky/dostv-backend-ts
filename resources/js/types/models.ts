export interface CategoriesModel {
  category_id?: number;
  title: string;
  description: string;
  is_banner?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export const emptyCategory: CategoriesModel = {
  category_id: 0,
  title: "",
  description: "",
  is_banner: 0,
  is_active: 0,
} as const;


export interface ProgramsModel {
  program_id?: number;
  code: string;
  title: string;
  description: string;
  agency: string;
  image: string;
  trailer: string;
  date_started: string;
  program_type: string;
  order: number;
  is_banner?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export const emptyProgram: ProgramsModel = {
  program_id: 0,
  code: '',
  title: '',
  description: '',
  agency: '',
  image: '',
  trailer: '',
  date_started: '',
  program_type: '',
  order: 0,
  is_banner: 0,
  is_active: 0,
} as const;