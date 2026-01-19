import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { PostModel } from '@/types/models';
import VideoEmbed from './video-embed';
import BackgroundImg from './background-img';
import { purifyDom } from '@/hooks/use-essential-functions';
import VideoWithThumbnail from './video-player';
import { FaPlay } from "react-icons/fa";
type ViewPostDialogProps = {
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    post?: PostModel | null;
}


function ViewPostDialog(props: ViewPostDialogProps) {
    const post = props.post ?? null;
    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    function popTags(text: string) {
        const array = text.split(",");
        return <>{array.map((item) => <span className=' bg-linear-to-r from-teal-800 to-teal-600 text-[11px] rounded-lg px-2 py-1 ml-1 '>{item}</span>)}</>
    }
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-gray-50  bg-slate-900/95 w-[90vw] md:w-200 md:max-w-200 lg:max-w-250 lg:w-250 max-w-[95vw] border-gray-700" >
                <DialogHeader>
                    <DialogTitle >
                        <span className='sr-only'> View Post Dialog </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        <span className='sr-only'> This just show the post view </span>
                    </DialogDescription>
                </DialogHeader>
                {post?.type == 'video' ?
                    <div className='max-h-[80vh] overflow-auto px-4 scroll-slim flex flex-col gap-4 mb-4'>
                        <div className='w-full rounded-lg my-2'>
                            <div className="mb-4 inter-semibold text-lg">
                                Teaser Preview
                            </div>
                            <BackgroundImg
                                imageSrc={`/storage/images/post_images/thumbnails/${post?.thumbnail}`}
                                className=" w-full border-2 border-gray-500 rounded-lg overflow-hidden"
                            >
                                <div className=" text-white bg-black/80 w-full inset-0 grid md:grid-cols-2 py-4">
                                    <div className='flex items-center'>
                                        <div className="px-8 py-4">
                                            <p className="text-[11px] poppins-semibold text-teal-500">{formatDate(post?.date_published as string)}</p>
                                            <p className="text-2xl py-1 font-bold inter-bold">{post?.title}</p>
                                            {post?.post_program?.title && (
                                                <div className="text-[11px] mb-4 px-2 py-1 bg-linear-to-r from-slate-900 to-slate-700 rounded poppins-semibold w-fit">{post.post_program.title}</div>
                                            )}
                                            {post?.guest && <p className="text-[12px]">with {post?.guest}</p>}
                                            <p className="text-xs text-justify poppins-light">{post?.excerpt}</p>
                                            <div className='w-full mt-5'>
                                                <Button className=' bg-teal-700 rounded-2xl border inter-bold leading-loose px-8 py-3'>
                                                    <FaPlay /> WATCH NOW
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='px-4 py-2 flex justify-center items-center relative'>
                                        <VideoWithThumbnail
                                            videoSrc={`/storage/videos/post_videos/trailers/${post?.trailer}`}
                                            thumbnailSrc={`/storage/images/post_images/banners/${post?.banner}`}
                                            thumbnailFallbackSrc={`/storage/images/post_images/thumbnails/${post?.thumbnail}`}
                                            delay={3000}
                                            className=" w-auto my-1 rounded border border-gray-500"
                                        />
                                        {post?.trailer && <span className='absolute right-3 top-0 bg-teal-700 px-3 py-1 rounded text-sm poppins-semibold'>Teaser Video </span>}

                                    </div>
                                </div>
                            </BackgroundImg>
                        </div>

                        <div className=" inter-semibold text-lg mt-8">
                            Post Preview
                        </div>
                        <div className='w-full mb-2  border rounded-lg p-8'>
                            <div className='mt-2 '>
                                <VideoEmbed url={post?.url as string}
                                    platform={post?.platform as string}
                                    height="400"
                                />
                            </div>
                            <div className='w-full py-2 mt-2 relative'>
                                <p className="text-2xl font-bold inter-bold relative">{post?.title}</p>
                                {post?.post_program?.title && (
                                    <div className="text-[11px] mb-2 px-2 py-1 bg-linear-to-r from-slate-900 to-slate-700 rounded poppins-semibold w-fit">{post.post_program.title}</div>
                                )}
                                {post?.guest && <p className="text-[12px]">with {post?.guest}</p>}
                                {/* {post?.agency && <span className=' bg-gray-700 text-[11px] rounded px-2 py-1 '>{post?.agency}</span>} */}
                                <div
                                    className="text-justify poppins-light text-[12px] mt-2"
                                    dangerouslySetInnerHTML={{
                                        __html: purifyDom(post?.content ?? ""),
                                    }}
                                />
                                <p className="text-[12px] poppins-semibold text-teal-500">{formatDate(post?.date_published as string)}</p>
                            </div>
                            <p className='text-sm poppins-semibold mt-6 mb-2'>Tags : {popTags(post?.tags as string)}</p>

                        </div>
                    </div> :
                    <div className='w-full'>
                        <p className="px-4 text-xl font-bold inter-bold relative mb-1">{post?.title}</p>
                        {post?.post_program?.title && (
                            <div className=" ml-4 mb-2 text-[11px] px-2 py-1 bg-linear-to-r from-teal-900 to-teal-600 rounded poppins-semibold w-fit">{post.post_program.title}</div>
                        )}

                        <div
                            className="p-2 text-justify poppins-light max-h-[80vh] overflow-auto px-4 scroll-slim"
                            dangerouslySetInnerHTML={{
                                __html: purifyDom(post?.content ?? ""),
                            }}
                        />
                    </div>
                }

            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ViewPostDialog)