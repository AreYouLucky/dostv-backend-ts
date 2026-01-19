const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banners', href: '/view-banners' },
    { title: 'Form', href: '/banner-form' },
];

import AppLayout from "@/layouts/app-layout";
import { FaPhotoVideo } from "react-icons/fa";
import { Head } from "@inertiajs/react";


function BannersForm() {

    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5 ">
                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <FaPhotoVideo /> Banner Management Form
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-300 bg-white overflow-auto p-8'>

                    </div>
                </div>
            </div>
        </>
    )

}
BannersForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BannersForm;