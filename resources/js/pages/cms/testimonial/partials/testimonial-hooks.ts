import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TestimonialModel } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApiOk = { status: string; testimonial?: TestimonialModel; errors: undefined, id?: number };
type ApiValidationErrors = Record<string, string[]>;
type ApiError = {
  message?: string;
  errors?: ApiValidationErrors;
};

export function useFetchTestimonials(){
    return useQuery<TestimonialModel[]>({
        queryKey: ["testimonials"],
        queryFn: async () => {
            const res = await axios.get("/testimonials");
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
    });
}

export function useCreateTestimonial(){
    const queryClient = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>, FormData>({
        mutationFn: (payload) =>
            axios.post<ApiOk>("/testimonials", payload,).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    })
}

export function useUpdateTestimonial(){
    const queryClient = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>, {id:number, payload:FormData}>({
        mutationFn: ({id, payload}) =>
            axios.post<ApiOk>(`/update-testimonial/${id}`, payload, {headers: { "Content-Type": "multipart/form-data" }}).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    })
}   

export function useDeleteTestimonial(){
    const queryClient = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>, {id:number}>({
        mutationFn: ({id}) =>
            axios.delete<ApiOk>(`/testimonials/${id}`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    })
}

export function useToggleTestimonialVisibility(){
    const useQuery = useQueryClient();
    return useMutation<ApiOk, AxiosError<ApiError>, {id:number}>({
        mutationFn: ({id}) =>
            axios.post<ApiOk>(`/toggle-testimonial-visibility/${id}`).then((res) => res.data),
        onSuccess: () => {
            useQuery.invalidateQueries({ queryKey: ["testimonials"] });
        },
    })
}