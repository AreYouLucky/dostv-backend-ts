import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ImageLoader from './image-loader';
import { AdvertisementModel } from '@/types/models';
import { purifyDom } from '@/hooks/use-essential-functions';
type ViewAdvertisementDialogProps = {
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    advertisement?: AdvertisementModel | null;
}


function ViewAdvertisementDialog(props: ViewAdvertisementDialogProps) {
    const advertisement = props.advertisement ?? null;
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-slate-8000  bg-white w-[90vw] md:w-200 md:max-w-200 lg:max-w-250 lg:w-250 max-w-[95vw] border-gray-700 p-6" >
                <DialogHeader>
                    <DialogTitle >
                        <span className='sr-only'> View Post Dialog </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        <span className='sr-only'> This just show the post view </span>
                    </DialogDescription>
                </DialogHeader>

                <div className='px-8 py-4 flex flex-col'>
                    <div>
                        <ImageLoader src={`/storage/images/advertisements/${advertisement?.thumbnail}`} alt={advertisement?.title ?? ''} className='rounded-lg' />
                    </div>
                    <div>
                        <p className="text-2xl py-1 font-bold inter-bold">{advertisement?.title}</p>
                    </div>
                    <div
                        className=" text-justify poppins-light max-h-[80vh] overflow-auto scroll-slim"
                        dangerouslySetInnerHTML={{
                            __html: purifyDom(advertisement?.description ?? ""),
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ViewAdvertisementDialog)