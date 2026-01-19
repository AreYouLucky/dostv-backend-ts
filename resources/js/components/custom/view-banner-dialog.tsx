import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { MdPageview } from "react-icons/md";
import { GiAerialSignal } from "react-icons/gi";
import { MdPermMedia } from "react-icons/md";
import { PiStarFourBold } from "react-icons/pi";
import BackgroundImg from './background-img';
import BackgroundVideo from './background-video';
import { BsCollectionPlayFill } from "react-icons/bs";
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
            <DialogContent className="text-gray-50  bg-slate-900/95 w-[90vw] md:w-200 md:max-w-200 lg:max-w-300 lg:w-300 max-w-[95vw] border-gray-700" >
                <DialogHeader>
                    <DialogTitle >
                        <span className='sr-only'> View Banner Dialog </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        <span className='sr-only'> This just show the post view </span>
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[80vh] overflow-auto px-4 py-5 scroll-slim flex flex-col gap-4 mb-4 '>
                    {banner?.type && [1, 2, 3].includes(banner.type) ?
                        <BackgroundImg imageSrc={`/storage/images/banners/${banner?.media}`} className='aspect-21/9'>
                            {
                                banner?.type == 3 &&
                                <div className="bg-linear-to-t from-black/40 via-transparent to-black/40 aspect-21/9 " >
                                    <div className="bg-linear-to-r from-black/80  to-transparent aspect-21/9 grid grid-cols-5">
                                        <div className='p-16 flex items-end md:col-span-2'>
                                            <div>
                                                {banner.highlight_text &&
                                                    <div className="text-white w-fit text-[8px] border rounded-lg px-2 py-0.5 poppins-semibold flex items-center gap-1">
                                                        <GiAerialSignal />{banner.highlight_text.toUpperCase()}
                                                    </div>
                                                }
                                                <div className="text-white inter-bold font-extrabold text-3xl mt-3">{banner.title}</div>
                                                <div className='flex flex-row pt-1 pb-3'>
                                                    {banner.episodes && <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 border-r items-center'> <MdPermMedia /> {banner.episodes} Episodes</span>}
                                                    <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 ml-2 items-center'> <PiStarFourBold /> Featured Program </span>
                                                </div>
                                                <div className='poppins-light text-white text-[10.5px] text-justify'> {banner.description}</div>
                                                <Button className='text-white mt-6 bg-transparent border border-white text-sm inter-semibold'>
                                                    <BsCollectionPlayFill /> View Episodes
                                                </Button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                banner?.type == 2 &&
                                <div className="bg-linear-to-t from-black/40 via-transparent to-black/40 aspect-21/9 " >
                                    <div className="bg-linear-to-r from-black/80  to-transparent aspect-21/9 grid grid-cols-5">
                                        <div className='p-16 flex items-end md:col-span-2'>
                                            <div>
                                                <div className="text-white inter-bold font-extrabold text-3xl mt-3">{banner.title}</div>
                                                {banner.highlight_text && <div className='flex flex-row pt-1 pb-2'>
                                                    <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 items-center'>  <PiStarFourBold /> {banner.highlight_text.toUpperCase()}  <PiStarFourBold /> </span>
                                                </div>}
                                                <div className='poppins-light text-white text-[10.5px] text-justify'> {banner.description}</div>
                                                <Button className='text-white mt-4 bg-transparent border border-white text-sm inter-semibold '><MdPageview /> BROWSE NOW </Button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </BackgroundImg> :
                        <BackgroundVideo videoSrc={`/storage/videos/banners/${banner?.media}`} className=' aspect-21/9 p-0 overflow-hidden'>
                            {
                                banner?.type == 4 &&
                                <div className="bg-linear-to-t from-black/40 via-transparent to-black/40 aspect-21/9 " >
                                    <div className="bg-linear-to-r from-black/90  to-transparent aspect-21/9 grid grid-cols-5">
                                        <div className='p-16 flex items-end md:col-span-2'>
                                            <div>
                                                {banner.highlight_text &&
                                                    <div className="text-white w-fit text-[8px] border rounded-lg px-2 py-0.5 poppins-semibold flex items-center gap-1">
                                                        <GiAerialSignal />{banner.highlight_text.toUpperCase()}
                                                    </div>
                                                }
                                                <div className="text-white inter-bold font-extrabold text-3xl mt-3">{banner.title}</div>
                                                <div className='flex flex-row pt-1 pb-3'>
                                                    {banner.episodes && <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 border-r items-center'> <MdPermMedia /> {banner.episodes} Episodes</span>}
                                                    <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 ml-2 items-center'> <PiStarFourBold /> Featured Program </span>
                                                </div>
                                                <div className='poppins-light text-white text-[10.5px] text-justify'> {banner.description}</div>
                                                <Button className='text-white mt-6 bg-transparent border border-white text-sm inter-semibold'>
                                                    <BsCollectionPlayFill /> View Episodes
                                                </Button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                banner?.type == 6 &&
                                <div className="bg-linear-to-t from-black/40 via-transparent to-black/40 aspect-21/9 " >
                                    <div className="bg-linear-to-r from-black/90  to-transparent aspect-21/9 grid grid-cols-5">
                                        <div className='p-16 flex items-end md:col-span-2'>
                                            <div>
                                                <div className="text-white inter-bold font-extrabold text-3xl mt-3">{banner.title}</div>
                                                {banner.highlight_text && <div className='flex flex-row pt-1 pb-2'>
                                                    <span className='text-[11.5px] poppins-semibold flex gap-2 pr-2 items-center'>  <PiStarFourBold /> {banner.highlight_text.toUpperCase()}  <PiStarFourBold /> </span>
                                                </div>}
                                                <div className='poppins-light text-white text-[10.5px] text-justify'> {banner.description}</div>
                                                <Button className='text-white mt-4 bg-transparent border border-white text-sm inter-semibold '><MdPageview /> BROWSE NOW </Button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </BackgroundVideo>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ViewPostDialog)