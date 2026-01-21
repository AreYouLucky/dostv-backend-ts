import { BreadcrumbItem } from "@/types";
import { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import PaginatedSearchTable from '@/components/custom/data-table';
import { AdvertisementModel } from "@/types/models";
import { Head, Link } from "@inertiajs/react";
import { useFetchAdvertisements, useMoveAdvertisement, useDeleteAdvertisement, useToggleAdvertisementVisibility } from "./partials/advertisement-hooks";
import { IoAddCircle } from "react-icons/io5";
import ImageLoader from "@/components/custom/image-loader";
import { FaPhotoVideo } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaArrowUp, FaArrowDown, FaTrash, FaEdit, FaEye, FaFlag } from "react-icons/fa";
import { trimText } from "@/hooks/use-essential-functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import ViewAdvertisementDialog from "@/components/custom/view-advertisement-dialog";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Advertisements', href: '/view-advisements' },
];

function AdvertisementsPage() {
    const { data, isFetching, refetch, error } = useFetchAdvertisements();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [id, setId] = useState(0);
    const [advertisement, setAdvertisement] = useState<AdvertisementModel | null>(null);
    const [viewDialog, setViewDialog] = useState(false);
    const moveAdvertisement = useMoveAdvertisement();
    const moveAdvertisementFn = (id: number, type: number, order: number) => {
        if (!data || data.length === 0) {
            toast.error("No program data available.");
            return;
        }
        const formData = new FormData();
        formData.append("id", String(id));
        formData.append("type", String(type));
        const maxLength = data.length;
        if (type === 2 && data[maxLength - 1]?.order === order) {
            toast.error("Cannot move program any further!");
            return;
        }
        if (type === 1 && data[0]?.order === order) {
            toast.error("Cannot move program any further!");
            return;
        }

        moveAdvertisement.mutate(
            { payload: formData },
            {
                onSuccess: ({ status }) => {
                    toast.success(`${status} ${type === 1 ? "Up!" : "Down!"}`);
                    refetch();
                },
                onError(err) {
                    if (err.message)
                        toast.error(err.message);
                },
            }
        );

    }

    const viewAdvertisementDialog = (advertisement: AdvertisementModel) => {
        setAdvertisement(advertisement);
        setViewDialog(true);
    }

    const deleteAdvertisement = useDeleteAdvertisement();
    const deleteAdvertisementFn = () => {
        deleteAdvertisement.mutate({ id }, {
            onSuccess: () => {
                toast.success("Advertisement Deleted Successfully")
                setDeleteDialog(false)
            },
            onError: (err) => {
                if (err.message)
                    toast.error(err.message);
            }
        });
    }

    const toggleAdvertisement = useToggleAdvertisementVisibility();
    const toggleAdvertisementVisibility = (id: number) => {
        toggleAdvertisement.mutate({ id }, {
            onSuccess: () => {
                toast.success("Advertisement visibility successfully toggled")
            },
            onError: (err) => {
                if (err.message)
                    toast.error(err.message);
            }
        })
    }
    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            <FaPhotoVideo />
                            Advertisement Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/advertisements/create'}> <IoAddCircle /> Add Advertisement</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white/50'>
                        <PaginatedSearchTable<AdvertisementModel>
                            items={data ?? []}
                            headers={[
                                { name: "Title", position: "center" },
                                { name: "Thumbnail", position: "center" },
                                { name: "url", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Order", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description}`}
                            renderRow={(r) => (
                                <tr key={r.advertisement_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[11.2px]">{r.title}</td>
                                    <td >
                                        <div className='flex justify-center items-center relative h-full hover:scale-110 duration-300'>
                                            <ImageLoader
                                                src={`/storage/images/advertisements/${r.thumbnail}`}
                                                alt="Program Banner"
                                                className="h-12 w-auto my-1 rounded"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[11.2px]">{r.url ? r.url : 'Not Set'}</td>
                                    <td className="px-6 py-1.5 poppins-semibold text-teal-800 text-[11.2px] text-justify">{r.description ? trimText(r.description, 150) : 'Not Set'}</td>
                                    <td>
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 rounded-lg duration-300  cursor-pointer text-lg' disabled={(data?.[0].order === r.order)} onClick={() => moveAdvertisementFn(r.advertisement_id as number, 1, r.order as number)}>
                                                        <FaArrowUp className='text-teal-500 hover:scale-110 duration-300' />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Move Up</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 text-lg rounded-lg duration-300  cursor-pointer' disabled={(data?.[data?.length - 1].order === r.order)} onClick={() => moveAdvertisementFn(r.advertisement_id as number, 2, r.order as number)}>
                                                        <FaArrowDown className='text-teal-500 hover:scale-110  duration-300' />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Move Down</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' onClick={() => viewAdvertisementDialog(r)} >
                                                        <FaEye className='text-[#0096cc] ' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Advertisement</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => toggleAdvertisementVisibility(r.advertisement_id as number)}>
                                                        <FaFlag className={r.is_banner == 1 ? 'text-yellow-500' : 'text-gray-400'} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{r.is_banner == 1 ? 'Hide Advertisement' : 'Show Advertisement'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' href={`/advertisements/${r.advertisement_id}/edit`}>
                                                        <FaEdit className='text-teal-600 ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Advertisement</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => {
                                                        setDeleteDialog(true)
                                                        setId(r.advertisement_id as number)
                                                    }}>
                                                        <FaTrash className='text-red-500' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Advertisement</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Advertisement"
                            onRefresh={() => refetch()}
                            isLoading={isFetching}
                        />
                    </div>
                </div>
            </div >
            <ConfirmationDialog show={deleteDialog} onClose={() => setDeleteDialog(false)} type={2} onConfirm={() => deleteAdvertisementFn()} message={'Are you sure you want to delete this advertisement?'} />
            <ViewAdvertisementDialog advertisement={advertisement} show={viewDialog} onClose={() => setViewDialog(false)} />


        </>
    )
}


AdvertisementsPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default AdvertisementsPage;
