import { BreadcrumbItem } from "@/types";
import { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import PaginatedSearchTable from '@/components/custom/data-table';
import {TestimonialModel } from "@/types/models";
import { Head, Link } from "@inertiajs/react";
import { IoAddCircle } from "react-icons/io5";
import { MdRecordVoiceOver } from "react-icons/md";
import ImageLoader from "@/components/custom/image-loader";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaTrash, FaEdit, FaEye, FaFlag } from "react-icons/fa";
import { trimText } from "@/hooks/use-essential-functions";
import { toast } from "sonner";
import { useFetchTestimonials, useDeleteTestimonial, useToggleTestimonialVisibility} from "./partials/testimonial-hooks";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import ViewTestimonialDialog from "@/components/custom/view-testimonial-dialog";
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Testimonials', href: '/view-testimonials' },
];

function TestimonialsPage() {
    const { data, isFetching, refetch, error } = useFetchTestimonials();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [id, setId] = useState(0);
    const [testimonial, setTestimonial] = useState<TestimonialModel | null>(null);
    const [viewDialog, setViewDialog] = useState(false);
    
    const deleteTestimonial = useDeleteTestimonial();
    const deleteTestimonialFn = () => {
        deleteTestimonial.mutate({ id },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setDeleteDialog(false);
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        );
    }
    const toggleTestimonialVisibility = useToggleTestimonialVisibility();
    const toggleTestimonialVisibilityFn = (id:number) =>{
        toggleTestimonialVisibility.mutate({id},
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        );
    }

    const viewDialogFn = (testimonial: TestimonialModel) => {
        setTestimonial(testimonial);
        setViewDialog(true);
    }

    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            <MdRecordVoiceOver />
                            Testimonials Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/testimonials/create'}> <IoAddCircle /> Add Testimonial</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white/50'>
                        <PaginatedSearchTable<TestimonialModel>
                            items={data ?? []}
                            headers={[
                                { name: "Title", position: "center" },
                                { name: "Thumbnail", position: "center" },
                                { name: "Guest", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description}`}
                            renderRow={(r) => (
                                <tr key={r.testimonial_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[11.2px]">{r.title}</td>
                                    <td >
                                        <div className='flex justify-center items-center relative h-full hover:scale-110 duration-300'>
                                            <ImageLoader
                                                src={`/storage/images/testimonials/${r.thumbnail}`}
                                                alt="Program Banner"
                                                className="h-12 w-auto my-1 rounded"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[11.2px]">{r.guest ? r.guest : 'Not Set'}</td>
                                    <td className="px-6 py-1.5 poppins-semibold text-teal-800 text-[11.2px] text-justify">{r.description ? trimText(r.description, 150) : 'Not Set'}</td>
                                    <td>
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg'  
                                                        onClick={()=>viewDialogFn(r)}>
                                                        <FaEye className='text-[#0096cc] ' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Testimonial</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' 
                                                        onClick={() => toggleTestimonialVisibilityFn(r.testimonial_id as number)}>
                                                        <FaFlag className={r.is_banner == 1 ? 'text-yellow-500' : 'text-gray-400'} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{r.is_banner == 1 ? 'Hide Testimonial' : 'Show Testimonial'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' href={`/testimonials/${r.testimonial_id}/edit`}>
                                                        <FaEdit className='text-teal-600 ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Testimonial</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => {
                                                        setDeleteDialog(true)
                                                        setId(r.testimonial_id as number)
                                                    }}>
                                                        <FaTrash className='text-red-500' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Testimonial</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Testimonial"
                            onRefresh={() => refetch()}
                            isLoading={isFetching}
                        />
                    </div>
                </div>
            </div >
            <ConfirmationDialog show={deleteDialog} onClose={() => setDeleteDialog(false)} type={2} onConfirm={() => deleteTestimonialFn()} message={'Are you sure you want to delete this testimonial?'} />
            <ViewTestimonialDialog show={viewDialog} onClose={() => setViewDialog(false)} testimonial={testimonial} />
        </>
    )
}


TestimonialsPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default TestimonialsPage;
