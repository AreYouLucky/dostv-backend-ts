import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoriesModel } from "@/types/models";



export function useFetchCategories() {
  return useQuery<CategoriesModel[]>({
    queryKey: ["categories"],             
    queryFn: async () => {
      const res = await axios.get("/categories");
      return res.data;
    },
    staleTime: 1000 * 60,        
  });
}