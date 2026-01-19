import { BreadcrumbItem } from "@/types";
import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import PaginatedSearchTable from '@/components/custom/data-table';
import { AdvertisementModel } from "@/types/models";
import { Head, Link } from "@inertiajs/react";
import { useFetchAdvertisements } from "./partials/advertisement-hooks";
import { IoAddCircle } from "react-icons/io5";
import ImageLoader from "@/components/custom/image-loader";
import { FaPhotoVideo } from "react-icons/fa";
import { trimText } from "@/hooks/use-essential-functions";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Advertisements', href: '/view-advisements' },
];

function AdvertisementsPage() {
    const { data, isFetching, refetch, error } = useFetchAdvertisements();
    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            <FaPhotoVideo/>
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
        </>
    )
}


AdvertisementsPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default AdvertisementsPage;
