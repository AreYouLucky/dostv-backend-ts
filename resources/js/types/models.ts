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
  code?: string;
  title: string;
  description: string;
  agency: string;
  image: string | null;
  trailer: string | null;
  date_started: string | null;
  program_type: string;
  trailer_file?: File;
  image_file?: File;
  order?: number;
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


export interface BannersModel {
  banner_id?: number | null;
  title: string | null;
  img?: string | null;
  highlight_text: string | null;
  url?: string | null;
  type: number | null;
  [key: string | number]: unknown;
}



export interface PostModel {
  post_id: number | null;
  slug: string | null;
  title: string | null;
  type: string | null;
  program: string | null;
  description: string | null;
  excerpt: string | null;
  episode: string | null;
  content: string | null;
  platform: string | null;
  url: string | null;
  image: string | null;
  trailer: string | null;
  trailer_file: string | File | null;
  banner: string | null;
  banner_image: string | File | null;
  thumbnail: string | null;
  thumbnail_image: File | string | null;
  guest: string | null;
  agency: string | null;
  date_published: string | null;
  is_featured: number | null;
  feature_guest: string | null;
  status: string | null;
  tags: string | null;
  featured_guest: string | null;
  categories: CategoriesModel[];
}


export interface advertisementsModel {
  advertisement_id: number | null;
  title: string | null;
  thumbnail: string | null;
  url: string | null;
  slug: string | null;
  description: string | null;
  excerpt: string | null;
  is_redirect: number | null;
  is_active: string | null;
}