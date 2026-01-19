const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

type UploadsResponse = {
  items: {
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }[];
};

type PlaylistItemsResponse = {
  items: {
    contentDetails: {
      videoId: string;
    };
  }[];
  nextPageToken?: string;
};

type Video = {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
};

type VideosResponse = {
  items: Video[];
};


export async function getUploadsPlaylistId(
  channelId: string
): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
  );

  const data: UploadsResponse = await res.json();

  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

export async function getAllVideoIds(
  playlistId: string
): Promise<string[]> {
  const ids: string[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const res = await fetch(
      `${BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken ?? ""}&key=${API_KEY}`
    );

    const data: PlaylistItemsResponse = await res.json();

    ids.push(...data.items.map(item => item.contentDetails.videoId));

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return ids;
}

export async function getVideoStats(
  videoIds: string[]
): Promise<Video[]> {
  const results: Video[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);

    const res = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${chunk.join(
        ","
      )}&key=${API_KEY}`
    );

    const data: VideosResponse = await res.json();

    results.push(...data.items);
  }

  return results;
}
