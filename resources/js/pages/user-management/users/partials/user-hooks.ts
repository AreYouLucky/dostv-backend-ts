import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";


type ApiOk = {
    status: string;
    user: User;
    id?: number;
};

type ApiValidationErrors = Record<string, string[]>;
type ApiError = { message?: string; errors?: ApiValidationErrors };
export type MoveBannerType = {
    id: string;
    type: string;
};

export function useFetchUsers() {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get("/users");
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
    });
}
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>,  FormData>({
        mutationFn: (payload) => axios.post<ApiOk>('/users', payload).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}


export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
    mutationFn: (payload) =>
      axios.post<ApiOk>("/posts", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}


export function useUpdateUser(){
    const queryClient = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>, { id: number; payload: FormData }>({
        mutationFn: ({ payload, id }) => axios.post<ApiOk>(`/update-user/${id}`, payload).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { code: number; }>({
    mutationFn: ({ code }) =>
      axios.delete<ApiOk>(`/users/${code}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangeUserPassword() {
    return useMutation<ApiOk, AxiosError<ApiError>, { id: number; payload: FormData }>({
        mutationFn: ({ payload, id }) => axios.post<ApiOk>(`/change-user-password/${id}`, payload).then(res => res.data)
    });
}


