import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PaginatedSearchTable from '@/components/shell/data-table';
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from 'lucide-react';
import CategoriesForm from './partials/categories-form';
import { CategoriesModel } from '@/types/models';
import { useFetchCategories } from './partials/categories-hooks';
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/categories' },
];
import { useHandleChange } from '@/hooks/use-handle-change';


function Categories() {
    const { data, isLoading, refetch } = useFetchCategories();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { item, errors,setItem, handleChange, setErrors } = useHandleChange({
        id: 0,
        title: '',
        description: '',
    });

    const openModal = () => {
        setItem({
        id: 0,
        title: '',
        description: '',
    })
        setShowDialog(true)
    }

    return (
        <>
            <Head title="Categories" />
            <div className='flex h-full flex-1 flex-col gap-3 overflow-x-auto rounded-xl px-6 py-5'>
                <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-teal-600/50 '>
                    <div className="text-teal-600 poppins-bold text-lg flex items-center">
                        Categories Management Section
                    </div>
                    <div className="text-gray-500 poppins-bold text-lg">
                        <Button className='bg-teal-600' onClick={openModal}> <Plus /> Add Category</Button>
                    </div>
                </div>
                <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-teal-600/50 overflow-auto'>
                    <PaginatedSearchTable<CategoriesModel>
                        items={data ?? []}
                        headers={[
                            { name: "Title", position: "center" },
                            { name: "Description", position: "center" },
                            { name: "Actions", position: "center" },
                        ]}
                        searchBy={(item) => `${item.title} ${item.description}`}
                        renderRow={(r) => (
                            <tr key={r.id} className="border-b">
                                <td className="px-6 py-3 text-center">{r.title}</td>
                                <td className="px-6 py-3 text-center">{r.description}</td>
                                <td className="px-6 py-3 text-center">

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button className='bg-transparent shadow-none hover:bg-teal-100 p-1'>
                                                <Pencil className='text-teal-500 ' strokeWidth={2} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Category</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button className='bg-transparent shadow-none hover:bg-teal-100'>
                                                <Trash className='text-red-500' strokeWidth={2} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Category</p>
                                        </TooltipContent>
                                    </Tooltip>


                                </td>
                            </tr>
                        )}
                        itemsPerPage={10}
                        searchPlaceholder="Search Category"
                        onRefresh={() => refetch()}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <CategoriesForm show={showDialog} onClose={() => setShowDialog(false)} item={item} handleChange={handleChange} setError={setErrors} errors={errors}/>
        </>
    );
}

Categories.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Categories;
