import { useFetchRecentPost } from "./dashboard-hooks";
import { useState } from "react";
import { CardSkeleton } from "@/components/custom/card-skeleton";
import { convertShortDate } from "@/hooks/use-essential-functions";
import ImageLoader from "@/components/custom/image-loader";
import { PostModel } from "@/types/models";
import ViewPostDialog from "@/components/custom/view-post-dialog";
function RecentPost() {
    const { data, isFetching } = useFetchRecentPost();
    const [showPostDialog,setShowPostDialog] = useState(false);
    const [post,setPost] = useState<PostModel>();
    if (isFetching) {
        return <div className="aspect-square flex  flex-col rounded-2xl bg-white/80 shadow-md">
            <CardSkeleton type="postList" />
            <CardSkeleton type="postList" />
            <CardSkeleton type="postList" />
            <CardSkeleton type="postList" />
            <CardSkeleton type="postList" />

        </div>
    }

    if (!data || data.length === 0) {
        return <div className="text-sm text-gray-500">No recent posts available</div>;
    }

    return (
        <div className="w-full min-h-80 p-4 md:p-10 rounded-2xl bg-white/80 shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
            <h3 className="mb-4 text-[16px] uppercase tracking-wider text-teal-700 font-bold">
                Recent Posts
            </h3>

            <div className="flex flex-col gap-2">
                {data.map((post, index) => (
                    <div
                        key={index}
                        className="flex gap-4 py-4 pr-8 pl-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:scale-102 duration-300 transition-transform cursor-pointer"
                        onClick={()=>{
                            setPost(post)
                            setShowPostDialog(true)
                        }}
                    >
                        <div className="shrink-0 flex items-center">
                            <ImageLoader
                                src={`/storage/images/post_images/thumbnails/${post.thumbnail}`}
                                className="h-16 w-24 object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                            <h4 className="text-sm font-bold inter-bold text-gray-900 line-clamp-2">
                                {post.title}
                            </h4>
                            <p className="text-xs text-gray-600 poppins-light line-clamp-3 text-justify">
                                {post.excerpt}
                            </p>
                            <span className="text-[10px] poppins-semibold text-teal-600">
                                {convertShortDate(post.date_published as string)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <ViewPostDialog show={showPostDialog} onClose={() => setShowPostDialog(false)} post={post} />

        </div>
    );
}

export default RecentPost;
