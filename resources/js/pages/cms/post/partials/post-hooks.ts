import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PostModel } from "@/types/models";
import { AxiosError } from "axios";

type ApiValidationErrors = Record<string, string[]>;

type ApiOk = {
  status: string;
  post: PostModel;
  id?: number;
};

type ApiError = {
  message?: string;
  errors?: ApiValidationErrors;
};

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

type PostFilters = {
  title: string | '';
  program: string | '';
  type: string | '';
  status: string | '';
}

export function useFetchPosts(
  page: number,
  filters: PostFilters
) {
  return useQuery<PaginatedResponse<PostModel>>({
    queryKey: ['posts', page, filters],

    queryFn: async () => {
      const res = await axios.get('/posts', {
        params: {
          page,
          ...filters,
        },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
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


export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { code: string; payload: FormData }>({
    mutationFn: ({ payload, code }) =>
      axios.post<ApiOk>(`/update-post/${code}`, payload, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { code: string; }>({
    mutationFn: ({ code }) =>
      axios.delete<ApiOk>(`/posts/${code}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePostStatus() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { payload: FormData }>({
    mutationFn: ({ payload }) =>
      axios.post<ApiOk>(`/update-post-status`, payload, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useTogglePostFeatured() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiError>, { slug: string }>({
    mutationFn: ({ slug }) =>
      axios.post<ApiOk>(`/toggle-post-featured/${slug}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

