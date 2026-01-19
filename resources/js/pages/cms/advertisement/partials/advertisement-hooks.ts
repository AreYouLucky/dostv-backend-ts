import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AdvertisementsModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; category?: AdvertisementsModel; errors: undefined, id?: number };


export function useFetchAdvertisements() {
  return useQuery<AdvertisementsModel[]>({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const res = await axios.get("/advertisements");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  });
}