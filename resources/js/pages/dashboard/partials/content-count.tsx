import { useFetchContentCount } from "./dashboard-hooks";
import { CardSkeleton } from "@/components/custom/card-skeleton";
function ContentCount() {
    const { data, isLoading } = useFetchContentCount();
    if (isLoading) {
        return (
            <div className="aspect-square flex  flex-col rounded-2xl bg-white/80 shadow-md">
                <CardSkeleton type="content" />;
            </div>
        );
    }

    if (!data) {
        return <div>No data available</div>;
    }
    return (
        <>
            <div className="w-full h-full p-4 md:px-8 md:py-8 rounded-2xl bg-white/80 shadow-md hover:shadow-lg transition-transform flex flex-col justify-center gap-4 hover:scale-102 duration-200">
                <div>
                    <p className="text-[12px] uppercase tracking-widest text-teal-700 font-bold">
                        Content Overview
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline flex-col">
                        <span className="text-6xl font-extrabold text-slate-900 leading-none">
                            {data.post.total}
                        </span>
                        <span className="text-[13px] font-semibold text-slate-600 px-2">
                            Total Posts
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <span className="rounded-full bg-teal-600 px-3 py-1 text-white poppins-semibold">
                            Ads: {data.advertisement.total}
                        </span>
                        <span className="rounded-full bg-teal-600 px-3 py-1 text-white poppins-semibold">
                            Banners: {data.banner.total}
                        </span>
                        <span className="rounded-full bg-teal-600 px-3 py-1 text-white poppins-semibold">
                            Categories: {data.category.total}
                        </span>
                        <span className="rounded-full bg-teal-600 px-3 py-1 text-white poppins-semibold">
                            Testimonials: {data.testimonial.total}
                        </span>
                    </div>
                </div>

                <div className="h-px w-full bg-linear-to-r from-teal-400 via-teal-400" />
                <div className="space-y-3 text-xs text-slate-600">
                    {/* Posts */}
                    <div className="flex items-center justify-between  bg-white/70 p-3 border-b">
                        <span className="font-semibold text-slate-800 text-[14px] inter-bold">Posts</span>
                        <div className="flex gap-2 text-[12px] font-semibold">
                            <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-emerald-700">
                                Published {data.post.published}
                            </span>
                            <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-yellow-700">
                                Draft {data.post.draft}
                            </span>
                            <span className="rounded-full bg-rose-200 px-2 py-0.5 text-rose-700">
                                Trash {data.post.trashed}
                            </span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center justify-between bg-white/70 p-3 border-b">
                        <span className="font-semibold text-slate-800 text-[14px] inter-semibold">Categories</span>
                        <div className="flex gap-2 text-[12px] font-semibold">
                            <span className="rounded-full bg-blue-400 px-2 py-0.5 text-white">
                                Active {data.category.active}
                            </span>
                            <span className="rounded-full bg-slate-400 px-2 py-0.5 text-white">
                                Inactive {data.category.inactive}
                            </span>
                        </div>
                    </div>

                    {/* Banners */}
                    <div className="flex items-center justify-between bg-white/70 p-3 border-b">
                        <span className="font-semibold text-slate-800 text-[14px] inter-semibold">Banners</span>
                        <div className="flex gap-2 text-[12px] font-semibold">
                            <span className="rounded-full bg-blue-400 px-2 py-0.5 text-white">
                                Active {data.banner.active}
                            </span>
                            <span className="rounded-full bg-slate-400 px-2 py-0.5 text-white">
                                Inactive {data.banner.inactive}
                            </span>
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="flex items-center justify-between bg-white/70 p-3 border-b">
                        <span className="font-semibold text-slate-800 text-[14px] inter-semibold">Testimonials</span>
                        <div className="flex gap-2 text-[12px] font-semibold">
                            <span className="rounded-full bg-blue-400 px-2 py-0.5 text-white">
                                Active {data.testimonial.active}
                            </span>
                            <span className="rounded-full bg-slate-400 px-2 py-0.5 text-white">
                                Inactive {data.testimonial.inactive}
                            </span>
                        </div>
                    </div>

                    {/* Advertisements */}
                    <div className="flex items-center justify-between bg-white/70 p-3 border-b">
                        <span className="font-semibold text-slate-800 text-[14px] inter-semibold">Advertisements</span>
                        <div className="flex gap-2 text-[12px] font-semibold">
                            <span className="rounded-full bg-blue-400 px-2 py-0.5 text-white">
                                Active {data.advertisement.active}
                            </span>
                            <span className="rounded-full bg-slate-400 px-2 py-0.5 text-white">
                                Inactive {data.advertisement.inactive}
                            </span>
                        </div>
                    </div>

                </div>
            </div>


        </>
    );
}

export default ContentCount;
