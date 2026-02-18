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
    refetchOnWindowFocus: false
  });
}

export function useGetProgram(id: number, options?: object) {
  return useQuery<ProgramsModel>({
    queryKey: ["programs", id],
    queryFn: async () => {
      const res = await axios.get(`/programs/${id}/edit`);
      return res.data;
    },
    staleTime: 1000 * 60,
    enabled: id !== 0,
    ...options,
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



export const deleteProgram = async ({ id }: { id: number; }): Promise<ApiOk> => {
  const { data } = await axios.delete<ApiOk>(`/programs/${id}`);
  return data;
};

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, { id: number }>({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}


export const moveProgram = async (payload: FormData): Promise<ApiOk> => {
  const { data } = await axios.post<ApiOk>("/move-program", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export function useMoveProgram() {
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, FormData>({
    mutationFn: moveProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}


export function useToggleProgramVisibility(){
  const queryClient = useQueryClient();
  return useMutation<ApiOk, AxiosError<ApiOk>, { id: number }>({
    mutationFn: ({ id }) =>
      axios.post<ApiOk>(`/toggle-program-visibility/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  })
}