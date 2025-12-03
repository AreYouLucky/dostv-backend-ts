import { BreadcrumbItem } from "@/types";
import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import PaginatedSearchTable from '@/components/custom/data-table';
import { BannersModel } from "@/types/models";
import { Head, Link} from "@inertiajs/react";
import { useFetchBanners } from "./partials/banner-hooks";
import { IoAddCircle } from "react-icons/io5";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banners', href: '/view-banners' },
];

function BannersPage() {
    const { data, isFetching, refetch, error } = useFetchBanners();
    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            Banners Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/program-form'}> <IoAddCircle /> Add Banner</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white/50'>
                        <PaginatedSearchTable<BannersModel>
                            items={data ?? []}
                            headers={[
                                { name: "Title", position: "center" },
                                { name: "Banner", position: "center" },
                                { name: "Code", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Type", position: "center" },
                                { name: "Agency", position: "center" },
                                { name: "Order", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description} ${item.agency}`}
                            renderRow={(r) => (
                                <tr key={r.banner_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">

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
        </>
    )
}


BannersPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BannersPage;
