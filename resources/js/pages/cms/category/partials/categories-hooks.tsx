import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoriesModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; category?: CategoriesModel; errors: undefined, id?: number };


export function useFetchCategories() {
  return useQuery<CategoriesModel[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/categories");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}

export function useGetCategory(id: number, options?: object) {
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
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, CategoriesModel>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export const updateCategory = async ({ id, payload, }: { id: number; payload: CategoriesModel; }): Promise<ApiOk> => {
  const { data } = await axios.put<ApiOk>(`/categories/${id}`, payload);
  return data;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, { id: number; payload: CategoriesModel }>({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export const deleteCategory = async ({ id }: { id: number; }): Promise<ApiOk> => {
  const { data } = await axios.delete<ApiOk>(`/categories/${id}`);
  return data;
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, { id: number }>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export const toggleCategory = async ({ payload }: { payload: { id: number } }): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>('/toggle-category', payload as object);
  return data;
};

export function useToggleCategory() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, { payload: { id: number } }>({
    mutationFn: toggleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}