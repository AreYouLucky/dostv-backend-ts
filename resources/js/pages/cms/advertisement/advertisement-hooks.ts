import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoriesModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; category?: CategoriesModel; errors: undefined, id?: number };


export function useFetchCategories() {
  return useQuery<CategoriesModel[]>({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await axios.get("/advertisements");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}