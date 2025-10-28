import axios from "axios";
import { ProgramsModel } from "@/types/models";
import { useMutation, useQueryClient ,useQuery} from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; category?: ProgramsModel; errors: undefined, id?: number };
export function useFetchPrograms() {
  return useQuery<ProgramsModel[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await axios.get("/programs");
      return res.data;
    },
    staleTime: 1000 * 60,
  });
}

export const createProgram = async (payload: ProgramsModel): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>("/programs", payload);
  return data;
};

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, ProgramsModel>({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

