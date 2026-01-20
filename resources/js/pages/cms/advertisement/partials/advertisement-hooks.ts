import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AdvertisementModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; advertisement?: AdvertisementModel; errors: undefined, id?: number };
type ApiValidationErrors = Record<string, string[]>;
type ApiError = {
  message?: string;
  errors?: ApiValidationErrors;
};


export function useFetchAdvertisements() {
  return useQuery<AdvertisementModel[]>({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await axios.get("/advertisements");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: (payload) =>
      axios.post<ApiOk>("/advertisements", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });
}

export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: number, payload: FormData }>({
    mutationFn: ({ id, payload }) =>
      axios.post<ApiOk>(`/update-advertisement/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });
}

export function useMoveAdvertisement() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { payload: FormData }>({
    mutationFn: ({ payload }) =>
      axios.post<ApiOk>(`/move-advertisement`, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });
}

export function useDeleteAdvertisement() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: number }>({
    mutationFn: ({ id }) =>
      axios.delete<ApiOk>(`/advertisements/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });
}

export function useToggleAdvertisementVisibility() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: number }>({
    mutationFn: ({ id }) =>
      axios.post<ApiOk>(`/toggle-advertisement-visibility/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  })
}