import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import VideoEmbed from './video-embed';
import { TestimonialModel } from '@/types/models';
import { purifyDom, convertLonghDate } from '@/hooks/use-essential-functions';
type ViewTestimonialDialogProps = {
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    testimonial?: TestimonialModel | null;
}


function ViewTestimonialDialog(props: ViewTestimonialDialogProps) {
    const testimonial = props.testimonial ?? null;
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-gray-50  bg-slate-900/95 w-[90vw] md:w-200 md:max-w-200 lg:max-w-250 lg:w-250 max-w-[95vw] border-gray-700" >
                <DialogHeader>
                    <DialogTitle >
                        <span className='sr-only'> View Testimonial </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        <span className='sr-only'> This just show the testimonial view </span>
                    </DialogDescription>
                </DialogHeader>

                <div className='px-8 py-8 flex flex-col'>
                    <div>
                        <VideoEmbed url={testimonial?.url ?? ""} platform={"YouTube"} height='400px' />
                    </div>
                    <div>
                        <p className="text-2xl pt-2 font-bold inter-bold">{testimonial?.title}</p>
                    </div>
                    {testimonial?.guest && <p className="text-[15px] px-2 poppins-semibold">with <span className='text-teal-400'>{testimonial?.guest}</span></p>}
                    <div
                        className=" text-justify poppins-light max-h-[80vh] overflow-auto scroll-slim mt-2"
                        dangerouslySetInnerHTML={{
                            __html: purifyDom(testimonial?.description ?? ""),
                        }}
                    />
                    <p className="text-[11px] poppins-semibold text-teal-500 px-2 py-2">{convertLonghDate(testimonial?.date_published as string)}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ViewTestimonialDialog)