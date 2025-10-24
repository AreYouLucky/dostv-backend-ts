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

export const emptyItem: CategoriesModel = {
  category_id: 0,
  title: "",
  description: "",
  is_banner: 0,
  is_active: 0,
} as const;;