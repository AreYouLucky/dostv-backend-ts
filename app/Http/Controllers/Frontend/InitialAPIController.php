<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Program;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use App\Models\Advertisement;

class InitialAPIController extends Controller
{
    public function loadBanners()
    {
        return Banner::where('is_active', 1)->orderBy('order', 'desc')->get();
    }

    public function loadPrograms()
    {
        return Program::select('code', 'title', 'description', 'image', 'program_type')
            ->where('is_active', 1)
            ->where('is_banner', 1)
            ->orderBy('order', 'desc')
            ->get();
    }


    public function mostViewedAllTime()
    {
        $apiKey    = config('services.youtube.key');
        $channelId = config('services.youtube.channel_id');

        if (! $apiKey || ! $channelId) {
            return response()->json([
                'message' => 'YouTube API key or channel ID not configured.',
            ], 500);
        }

        $cacheKey = "youtube_most_viewed_all_time_{$channelId}";

        $data = Cache::remember($cacheKey, now()->addDay(), function () use ($apiKey, $channelId) {

            /** 1️⃣ Get uploads playlist ID */
            $channel = Http::get('https://www.googleapis.com/youtube/v3/channels', [
                'key'  => $apiKey,
                'id'   => $channelId,
                'part' => 'contentDetails',
            ])->json();

            $uploadsPlaylistId = data_get(
                $channel,
                'items.0.contentDetails.relatedPlaylists.uploads'
            );

            if (! $uploadsPlaylistId) {
                throw new \Exception('Uploads playlist not found.');
            }

            /** 2️⃣ Get ALL video IDs from uploads playlist */
            $videoIds  = collect();
            $pageToken = null;

            do {
                $playlist = Http::get('https://www.googleapis.com/youtube/v3/playlistItems', [
                    'key'        => $apiKey,
                    'playlistId' => $uploadsPlaylistId,
                    'part'       => 'contentDetails',
                    'maxResults' => 50,
                    'pageToken'  => $pageToken,
                ])->json();

                $videoIds = $videoIds->merge(
                    collect($playlist['items'] ?? [])
                        ->pluck('contentDetails.videoId')
                        ->filter()
                );

                $pageToken = $playlist['nextPageToken'] ?? null;
            } while ($pageToken);

            /** 3️⃣ Fetch video stats in chunks */
            $videos = collect();

            $videoIds->unique()->chunk(50)->each(function ($chunk) use ($apiKey, &$videos) {
                $response = Http::get('https://www.googleapis.com/youtube/v3/videos', [
                    'key'  => $apiKey,
                    'id'   => $chunk->join(','),
                    'part' => 'snippet,statistics',
                ]);

                if (! $response->successful()) {
                    return;
                }

                foreach ($response->json()['items'] ?? [] as $item) {
                    $videos->push([
                        'video_id'     => $item['id'],
                        'title'        => $item['snippet']['title'] ?? '',
                        'description'  => $item['snippet']['description'] ?? '',
                        'published_at' => $item['snippet']['publishedAt'] ?? null,
                        'view_count'   => (int) data_get($item, 'statistics.viewCount', 0),
                        'thumbnail'    => data_get($item, 'snippet.thumbnails.high.url')
                            ?? data_get($item, 'snippet.thumbnails.default.url'),
                    ]);
                }
            });

            return $videos
                ->sortByDesc('view_count')
                ->values();
        });

        return response()->json([
            'as_of'        => now()->toDateTimeString(),
            'channel_id'   => $channelId,
            'total_videos' => $data->count(),
            'top_videos'   => $data->take(10)->values(),
        ]);
    }


    public function loadAdvertisements()
    {
        return Advertisement::select('title', 'excerpt', 'thumbnail', 'url')->where('is_active', 1)->orderBy('order', 'desc')->get();
    }
}
