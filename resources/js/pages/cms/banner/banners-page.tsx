import { BreadcrumbItem } from "@/types";
import { trimText } from "@/hooks/use-essential-functions";
import { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import PaginatedSearchTable from '@/components/custom/data-table';
import { BannerModel } from "@/types/models";
import { Head, Link } from "@inertiajs/react";
import { bannerTypes } from "@/types/default";
import { useFetchBanners, useDeleteBanner, useMoveBanner, useToggleBannerVisibility } from "./partials/banner-hooks";
import { IoAddCircle } from "react-icons/io5";
import { LuImageUpscale } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaArrowUp, FaArrowDown, FaTrash, FaEdit, FaEye, FaFlag } from "react-icons/fa";
import ViewBannerDialog from "@/components/custom/view-banner-dialog";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banners', href: '/view-banners' },
];

function BannersPage() {
    const { data, isFetching, refetch, error } = useFetchBanners();
    const [id, setId] = useState(0);
    const [showViewBannerDialog, setShowViewBannerDialog] = useState(false);
    const [banner, setBanner] = useState<BannerModel | null>(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const viewBannerDialog = (banner: BannerModel) => {
        setBanner(banner);
        setShowViewBannerDialog(true);
    }
    const deleteBanner = useDeleteBanner();
    const deleteBannerFn = () => {
        deleteBanner.mutate({ id }, {
            onSuccess: () => {
                toast.success("Banner Updated Successfully")
                setDeleteDialog(false)
            },
            onError: (err) => {
                if (err.message)
                    toast.error(err.message);
            }
        });
    }
    const moveBanner = useMoveBanner();
    const moveBannerFn = (id: number, type: number, order: number) => {
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

        moveBanner.mutate(
            { payload: formData },
            {
                onSuccess: ({ status }) => {
                    toast.success(`${status} ${type === 1 ? "Up!" : "Down!"}`);
                    refetch();
                },
                onError(error) {
                    if (error.message)
                        toast.error(error.message);
                },
            }
        );
    }

    const toggleBannerVisibility = useToggleBannerVisibility();
    const toggleBannerVisibilityFn = (id: number) => {
        toggleBannerVisibility.mutate({ id },
            {
                onSuccess: () => {
                    toast.success("Banner updated successfully");
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }

        );
    }

    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Banners" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-700 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <LuImageUpscale />
                            Banners Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link href="/banners/create" className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]'> <IoAddCircle /> Add Banner</Link>
                        </div>
                    </div>

                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white'>
                        <PaginatedSearchTable<BannerModel>
                            items={data ?? []}
                            headers={[
                                { name: "Order", position: "center" },
                                { name: "Title", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Type", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description} ${item.agency}`}
                            renderRow={(r) => (
                                <tr key={r.banner_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">
                                    <td >
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 rounded-lg duration-300  cursor-pointer text-lg' disabled={(data?.[0].order === r.order)} onClick={() => moveBannerFn(r.banner_id as number, 1, r.order as number)}>
                                                        <FaArrowUp className='text-teal-500 hover:scale-110 duration-300 text-[12px]' />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Move Up</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 text-lg rounded-lg duration-300  cursor-pointer' disabled={(data?.[data?.length - 1].order === r.order)} onClick={() => moveBannerFn(r.banner_id as number, 2, r.order as number)}>
                                                        <FaArrowDown className='text-teal-500 hover:scale-110  duration-300 text-[12px]' />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Move Down</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[12px]">{r.title}</td>
                                    <td className="px-6 py-1.5 text-[11.2px] text-justify">{r.description !== '' ? trimText(r.description as string, 255) : 'Not Set'}</td>
                                    <td className="px-6 py-1.5 text-start text-[11.2px]">{bannerTypes.find(b => b.code === r.type)?.label}</td>
                                    <td>
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' onClick={() => viewBannerDialog(r)} >
                                                        <FaEye className='text-[#0096cc] ' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Banner</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => toggleBannerVisibilityFn(r.banner_id as number)}>
                                                        <FaFlag className={r.is_banner == 1 ? 'text-yellow-500' : 'text-gray-400'} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{r.is_banner == 1 ? 'Hide Banner' : 'Show Banner'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' href={`/banners/${r.banner_id}/edit`}>
                                                        <FaEdit className='text-teal-600 ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Banner</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => {
                                                        setDeleteDialog(true)
                                                        setId(r.banner_id as number)
                                                    }}>
                                                        <FaTrash className='text-red-500' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Banner</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Banner"
                            onRefresh={() => refetch()}
                            isLoading={isFetching}
                        />
                    </div>
                </div>
            </div >
            <ConfirmationDialog show={deleteDialog} onClose={() => setDeleteDialog(false)} type={2} onConfirm={() => deleteBannerFn()} message={'Are you sure you want to delete this banner?'} />

            <ViewBannerDialog banner={banner} show={showViewBannerDialog} onClose={() => setShowViewBannerDialog(false)} />
        </>
    )
}


BannersPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BannersPage;
