import { UserActionModel } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ActionFilter = {
    from?: string;
    to?: string;
    user?: number;
  };    

export function useFetchActivities(
  filters: ActionFilter
) {
  return useQuery<UserActionModel[]>({
    queryKey: ['user-activities', filters],

    queryFn: async () => {
      const res = await axios.get('/user-activities', {
        params: {
          ...filters,
        },
      });
      return res.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}