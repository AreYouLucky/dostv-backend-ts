import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FaCircleInfo } from "react-icons/fa6";
import { MdPermMedia } from "react-icons/md";
import { PiStarFourBold } from "react-icons/pi";
import BackgroundImg from './background-img';
import { BsCollectionPlayFill } from "react-icons/bs";
import { MdPageview } from "react-icons/md";
import { Button } from '../ui/button';
import { BannerModel } from '@/types/models';

type ViewPostDialogProps = {
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    banner?: BannerModel | null;
}


function ViewPostDialog(props: ViewPostDialogProps) {
    const banner = props.banner ?? null;
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-slate-800  bg-white w-[90vw] md:w-200 md:max-w-200 lg:max-w-300 lg:w-300 max-w-[95vw] border-gray-700" >
                <DialogHeader>
                    <DialogTitle >
                        <span className='sr-only'> View Banner Dialog </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        <span className='sr-only'> This just show the post view </span>
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[80vh] aspect-16/6 overflow-auto px-4 py-5 scroll-slim flex flex-col gap-4 mb-4 text-white'>
                    <BackgroundImg
                        imageSrc={`${banner?.bg && `/storage/images/banners/bgs/${banner?.bg}`}`}
                        fallbackSrc={`/storage/images/banners/${banner?.media}`}
                        className="aspect-16/6 w-full"
                    >
                        {
                            banner?.type !== 1 &&
                            <div className="grid grid-cols-5 gap-x-6 w-full h-full  aspect-16/6  p-8 bg-linear-to-b from-black/40 to-black">
                                <div className="flex flex-col  col-span-2 justify-center gap-2">
                                    <div className='h-fit  flex justify-start'>
                                        {banner?.icon ? (
                                            <img src={`/storage/images/banners/icons/${banner?.icon}`}
                                                className='object-contain w-60'
                                            />
                                        ) : (
                                            <h3 className='text-2xl poppins-bold'>{banner?.title}</h3>
                                        )}
                                    </div>
                                    <div className='mt-2'>
                                        <div className='flex flex-row pb-3 gap-2'>
                                            {banner?.highlight_text &&
                                                <div className='border-r px-2'>
                                                    <span className='text-[11px] pr-2 border border-red-500 px-2 py-1 rounded-xl poppins-semibold flex gap-2 flex-row items-center bg-red-500/50'> <FaCircleInfo /> {banner.highlight_text}</span>
                                                </div>
                                            }
                                            {
                                                banner?.type && [3, 4].includes(banner?.type) && (
                                                    <>
                                                        {banner?.episodes && <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 border-r items-center'> <MdPermMedia /> {banner.episodes} Episodes</span>}
                                                        <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 ml-2 items-center'> <PiStarFourBold /> Featured Program </span>
                                                    </>
                                                )
                                            }
                                        </div>
                                        <div className='poppins-light text-white text-[10.5px] text-justify pr-2'> {banner?.description}</div>
                                        <Button className='text-white mt-6  text-sm inter-semibold bg-[#00aeef]/90 rounded border-[#00aeef] border'>
                                            {banner?.type && [3, 4].includes(banner?.type) ? (
                                                <>
                                                    <BsCollectionPlayFill /> View Episodes
                                                </>
                                            ) : (
                                                <>
                                                    <MdPageview/> Browse Now
                                                </>
                                            )}
                                        </Button>
                                    </div>


                                </div>
                                <div className="flex items-center justify-center col-span-3">
                                    <div className=''>
                                        {banner?.type && [2, 3].includes(banner?.type) ? (
                                            <img src={`/storage/images/banners/${banner?.media}`}
                                                className='aspect-21/9 object-cover rounded-lg overflow-hidden shadow-md shadow-[#00aeef] -mt-6 hover:shadow-xl hover:scale-105 duration-300'
                                            />
                                        ) : (

                                            <div className='w-full h-full p-5'>
                                                <video
                                                    src={`/storage/videos/banners/${banner?.media}`}
                                                    autoPlay={true}
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                    className=" w-full h-full object-contain  rounded-lg overflow-hidden shadow-md shadow-[#000000] -mt-6 hover:shadow-xl hover:scale-105 duration-300 border-2 border-[#000000]"
                                                />
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </BackgroundImg>


                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ViewPostDialog)