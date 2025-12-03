import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BannersModel } from "@/types/models";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// type ApiOk = { status: string; category?: BannersModel; errors: undefined, id?: number };


export function useFetchBanners() {
  return useQuery<BannersModel[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axios.get("/banners");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}