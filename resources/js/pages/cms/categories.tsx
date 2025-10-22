import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PaginatedSearchTable from '@/components/shell/data-table';
import { sampleItems, type Row } from './sample-data';
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/categories' },

];
// type Row = { id: number; title: string; date: string };

function Categories() {
    return (
        <>
            <Head title="Categories" />
            <div className='flex h-full flex-1 flex-col gap-3 overflow-x-auto rounded-xl px-6 py-5'>
                <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-teal-600/50 '>
                    <div className="text-teal-600 poppins-bold text-lg flex items-center">
                        Categories Management Section
                    </div>
                    <div className="text-gray-500 poppins-bold text-lg">
                        <Button className='bg-teal-600'>Add Category</Button>
                    </div>
                </div>
                <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-teal-600/50 overflow-auto'>
                    <PaginatedSearchTable<Row>
                        items={sampleItems} // pass array directly
                        headers={[
                            { name: "Title", position: "left" },
                            { name: "Date", position: "center" },
                            { name: "Status" },
                            { name: "Assignee" },
                            { name: "Tags" },
                        ]}
                        // Optional: customize search text
                        // searchBy={(item) => `${item.title} ${item.date}`}
                        renderRow={(r) => (
                            <tr key={r.id} className="border-b">
                                <td className="px-6 py-3">{r.title}</td>
                                <td className="px-6 py-3 text-center">{r.date}</td>
                                <td className="px-6 py-3">{r.status}</td>
                                <td className="px-6 py-3">{r.assignee}</td>
                                <td className="px-6 py-3">{r.tags.join(", ")}</td>
                            </tr>
                        )}
                        itemsPerPage={10}
                        searchPlaceholder='🔍 Search Category'
                    // Optional: show Refresh button (fetch in parent, then pass new items)
                    // onRefresh={() => refetchInParent()}
                    // isLoading={loadingFromParent}
                    />
                </div>
            </div>
        </>
    );
}

Categories.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Categories;
