import axios from "axios";
import { ProgramsModel } from "@/types/models";
import { useMutation, useQueryClient ,useQuery} from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; program?: ProgramsModel; errors: undefined, id?: number };
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

export const createProgram = async (payload: FormData): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>("/programs", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, FormData>({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export const updateProgram = async ({id,payload,}: {
  id: number;
  payload: FormData; }): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>(`/update-program/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiOk,AxiosError<ApiOk>,
    { id: number; payload: FormData }
  >({
    mutationFn: ({ id, payload }) => updateProgram({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}
