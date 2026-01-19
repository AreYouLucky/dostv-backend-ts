import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BannerModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = {
  status: string;
  banner: BannerModel;
  id?: number;
};

type ApiValidationErrors = Record<string, string[]>;
type ApiError = { message?: string; errors?: ApiValidationErrors };
export type MoveBannerType = {
  id: string;
  type: string;
};

export function useFetchBanners() {
  return useQuery<BannerModel[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axios.get("/banners");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}




export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: (payload) =>
      axios.post<ApiOk>("/banners", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: string; payload: FormData }>({
    mutationFn: ({ payload, id }) =>
      axios.post<ApiOk>(`/update-banner/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: number}>({
    mutationFn: ({ id }) =>
      axios.delete<ApiOk>(`/banners/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useMoveBanner() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { payload: FormData }>({
    mutationFn: ({ payload}) =>
      axios.post<ApiOk>(`/move-banner`, payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useToggleBannerVisibility(){
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { id: number }>({
    mutationFn: ({ id }) =>
      axios.post<ApiOk>(`/toggle-banner-visibility/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  })
}

