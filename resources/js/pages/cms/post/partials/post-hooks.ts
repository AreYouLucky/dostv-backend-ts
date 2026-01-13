import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PostModel } from "@/types/models";
import { AxiosError } from "axios";

type ApiOk = { status: string; program?: PostModel; errors: undefined, id?: number };


type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export function useFetchPosts(page: number) {
  return useQuery<PaginatedResponse<PostModel>>({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await axios.get(`/posts?page=${page}`);
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useSearchPosts() {
  return useMutation<PaginatedResponse<PostModel>, Error, {
    title: string;
    program: string;
  }>({
    mutationFn: async ({ title, program }) => {
      const res = await axios.get('/search/post', {
        params: { title, program },
      });
      return res.data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, FormData>({
    mutationFn: (payload) =>
      axios
        .post<ApiOk>("/posts", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
