import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PostsModel } from "@/types/models";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// type ApiOk = { status: string; category?: BannersModel; errors: undefined, id?: number };


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
  return useQuery<PaginatedResponse<PostsModel>>({
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
  return useMutation<PaginatedResponse<PostsModel>, Error, {
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