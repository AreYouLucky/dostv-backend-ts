import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import Loader from './loaders/loader'

type LoadingDialogProp = {
    show: boolean;
    message: string;
}
function LoadingDialog(props: LoadingDialogProp) {
    return (
        <Dialog open={props.show}>
            <DialogContent className="text-gray-600 p-4 bg-white/90">
                <DialogTitle >
                    <span className='sr-only'> Loading</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-center">
                    <span className='sr-only'> Loading Dialog </span>
                </DialogDescription>
                <Loader />

                <div className="animate-bounce text-center pb-3 poppins-semibold text-teal-700">
                    {props.message}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(LoadingDialog)