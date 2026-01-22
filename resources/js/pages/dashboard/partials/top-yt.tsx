import { Crown, PlayCircle } from "lucide-react";
import { useFetchTopYoutubeViews } from "./dashboard-hooks";
import { CardSkeleton } from "@/components/custom/card-skeleton";
import { trimText } from "@/hooks/use-essential-functions";

type YtVideo = {
  video_id: string | null;
  title: string | null;
  description: string | null;
  view_count: number | null;
  thumbnail: string | null;
};

type TopCount = {
  top_10_most_viewed: YtVideo[] | null;
};

function formatViews(views: number | null) {
  if (views == null) return "-";
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views.toLocaleString()} views`;
}

function TopYouTube() {
  const { data, isFetching } = useFetchTopYoutubeViews() as {
    data: TopCount | undefined;
    isFetching: boolean;
  };

  if (isFetching) {
    return (
      <div className="rounded-2xl bg-white/80 shadow-md p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} type="postList" />
        ))}
      </div>
    );
  }

  if (!data?.top_10_most_viewed?.length) {
    return (
      <div className="rounded-2xl bg-white/80 shadow-md p-6 text-sm text-gray-500">
        No YouTube data available.
      </div>
    );
  }

  const [topOne, ...rest] = data.top_10_most_viewed;

  return (
    <div className="w-full h-full p-4 md:p-7 rounded-2xl bg-white/90 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-teal-50 text-teal-700">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-wide text-slate-800 uppercase">
              Top 10 YouTube Videos
            </h3>
            <p className="text-[11px] text-slate-500">
              Ranked by view count
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-medium tracking-wide text-slate-600 uppercase">
          This Year
        </span>
      </div>
      {topOne && (
        <a
          href={`https://www.youtube.com/watch?v=${topOne.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 flex gap-3 items-stretch group shadow-sm hover:scale-102 duration-200 transition-transform"
        >
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 blur-xl bg-yellow-300/30 rounded-full scale-125" />
            <div className="relative w-12 h-12 rounded-full bg-yellow-200 border-2 border-yellow-600 flex flex-col items-center justify-center font-extrabold text-slate-900 inter-bold text-xl shadow-md">
              <Crown className="w-4 h-4 text-yellow-600 mb-0.5" />
              <span className="-mt-0.5 inter-bold">1</span>
            </div>
            <span className="mt-1 text-[10px] text-yellow-100 tracking-wide uppercase">
              Top Video
            </span>
          </div>

          <div className="flex gap-3 flex-1">
            <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img
                src={topOne.thumbnail ?? ""}
                alt={topOne.title ?? ""}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 border rounded-xl"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-white/90 drop-shadow" />
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <h4 className="font-semibold text-[13px] leading-snug line-clamp-2">
                  {topOne.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-200 line-clamp-2">
                  {trimText(topOne.description as string, 90)}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                  {formatViews(topOne.view_count)}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-300 border border-white/10 px-2 py-0.5 rounded-full ">
                  Open on YouTube
                </span>
              </div>
            </div>
          </div>
        </a>
      )}
      <div className="flex-1  overflow-y-auto pr-1 space-y-2">
        {rest.slice(0, 9).map((video, index) => (
          <a
            key={video.video_id ?? index}
            href={`https://www.youtube.com/watch?v=${video.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/60 group hover:scale-102 duration-200 transition-transform"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-teal-700 flex items-center justify-center text-xs inter-bold ">
                {index + 2}
              </div>
            </div>
            <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-200">
              <img
                src={video.thumbnail ?? ""}
                alt={video.title ?? ""}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-800 leading-snug line-clamp-2">
                {trimText(video.title as string, 60)}
              </p>
              <span className="mt-1 text-[11px] text-slate-500 rounded-xl bg-gray-100 py-0.5 px-2">
                {formatViews(video.view_count)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default TopYouTube;
