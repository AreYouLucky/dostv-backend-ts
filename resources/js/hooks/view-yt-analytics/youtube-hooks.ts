import { useEffect, useState } from "react";
import {
  getUploadsPlaylistId,
  getAllVideoIds,
  getVideoStats,
} from "./youtube";


export interface YouTubeVideo {
  id: string;
  title: string;
  views: number;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubeVideoStats {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
  };
}

export function useTopVideos(channelId: string) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopVideos() {
      try {
        const uploadsId = await getUploadsPlaylistId(channelId);
        const videoIds = await getAllVideoIds(uploadsId);
        const stats = await getVideoStats(videoIds);

        const top10 = stats
          .map((v: YouTubeVideoStats) => ({
            id: v.id,
            title: v.snippet.title,
            views: Number(v.statistics.viewCount),
            thumbnail: v.snippet.thumbnails.medium.url,
            publishedAt: v.snippet.publishedAt,
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);

        setVideos(top10);
      } catch (error) {
        console.error("YouTube API error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopVideos();
  }, [channelId]);

  return { videos, loading };
}
