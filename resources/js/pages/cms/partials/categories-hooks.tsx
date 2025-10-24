import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoriesModel } from "@/types/models";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; category?: CategoriesModel; errors: undefined, id?:number };


export function useFetchCategories() {
  return useQuery<CategoriesModel[]>({
    queryKey: ["categories"],             
    queryFn: async () => {
      const res = await axios.get("/categories");
      return res.data;
    },
    staleTime: 1000 * 60,        
  });
}

export function useGetCategory(id:number, options?: object) {
  return useQuery<CategoriesModel>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const res = await axios.get(`/categories/${id}/edit`);
      return res.data;
    },
    staleTime: 1000 * 60,
    enabled: id !== 0,  
    ...options,
  });
}

export const createCategory = async (payload: CategoriesModel): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>("/categories", payload);
  return data;
};

export function useCreateCategory() {
  return useMutation<ApiOk, AxiosError<ApiOk>, CategoriesModel>({
    mutationFn: createCategory,
  });
}

export const updateCategory = async ({id,payload,}: {id: number;payload: CategoriesModel;}): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>(`/categories/${id}`, payload);
  return data;
};

export function useUpdateCategory() {
  return useMutation<ApiOk, AxiosError<ApiOk>, { id: number; payload: CategoriesModel }>({
    mutationFn: updateCategory,
  });
}