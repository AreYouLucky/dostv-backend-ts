import { useQuery } from "@tanstack/react-query";
import { PostModel } from "@/types/models";
import axios from "axios";


type PostProps = {
    total: number | null;
    published: number | null;
    draft: number | null;
    trashed: number | null;
}

type CountProps = {
    total: number | null;
    active: number | null;
    inactive: number | null;
}
export type ContentCountData = {
  post: PostProps;
  category: CountProps;
  banner: CountProps;
  advertisement: CountProps;
  testimonial: CountProps;
};

type YtVideo = {
  video_id: string|null;
  title: string|null;
  description: string|null;
  view_count: number|null;
  thumbnail: string|null;
}
type TopCount = {
  top_10_most_viewed : YtVideo[] | null
}


export function useFetchContentCount() {
  return useQuery<ContentCountData>({
    queryKey: ["content-count"],
    queryFn: async () => {
      const res = await axios.get("/content-count");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
export type ProgramCountData = {
  title: string;
  post_categories_count: number;
}

export function useFetchProgramCount(){
  return useQuery<ProgramCountData[]>({
    queryKey: ["program-count"],
    queryFn: async () => {
      const res = await axios.get("/program-count");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useFetchRecentPost(){
  return useQuery<PostModel[]>({
    queryKey: ["recent-post"],
    queryFn: async () => {
      const res = await axios.get("/get-recent-post");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useFetchTopYoutubeViews(){
  return useQuery<TopCount[]>({
    queryKey: ["top-youtube"],
    queryFn: async () => {
      const res = await axios.get("/youtube/top-videos/2025");
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}


