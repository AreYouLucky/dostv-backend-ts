import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PaginatedSearchTable from '@/components/custom/data-table';
import { Button } from "@/components/ui/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import CategoriesForm from './partials/categories-form';
import { useFetchCategories } from './partials/categories-hooks';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { CategoriesModel, emptyCategory } from '@/types/models';
import ConfirmationDialog from '@/components/custom/confirmation-dialog';
import { useDeleteCategory, useToggleCategory } from './partials/categories-hooks';
import { toast } from 'sonner';
import { TiStarFullOutline } from "react-icons/ti";
import { TbCategoryFilled } from "react-icons/tb";
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/view-categories' },
];


function CategoriesPage() {
    const { data, isFetching, refetch, error } = useFetchCategories();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoriesModel>(emptyCategory)
    const [id, setId] = useState<number>(0);
    const deleteCategory = useDeleteCategory();
    const toggleCategory = useToggleCategory();
    const openModal = () => {
        setShowDialog(true)
    }
    
    const closeModal = () => {
        setCategory(emptyCategory)
        setShowDialog(false)
    }
    
    const openEditModal = (item: CategoriesModel) => {
        setCategory(item)
        setShowDialog(true)
    }
    
    const openDeleteDialog = (id: number) => {
        setShowDeleteDialog(true)
        setId(id)
        
    }
    
    const toggleBanner = (id: number) => {
        toggleCategory.mutate({
            payload: { id }  
        });
    }
    
    const confirmCategoryDeletion = () => {
        deleteCategory.mutate(
            { id: id },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setShowDeleteDialog(false)
                },
            }
        );
    }
    if (error) return alert('An error has occurred: ' + error.message);
    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-600 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            <TbCategoryFilled/>Categories Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Button className='bg-teal-600' onClick={openModal}> <IoAddCircle /> Add Category</Button>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white/50'>
                        <PaginatedSearchTable<CategoriesModel>
                            items={data ?? []}
                            headers={[
                                { name: "Title", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description}`}
                            renderRow={(r) => (
                                <tr key={r.category_id} className="border-b  duration-200 hover:scale-101">
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800">{r.title}</td>
                                    <td className="px-6 py-1.5 text-center text-[13px] text-gray-700">{r.description}</td>
                                    <td className="px-6 py-1.5 flex flex-row">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={()=>toggleBanner(r.category_id as number)}>
                                                    <TiStarFullOutline className={r.is_banner == 1 ? 'text-blue-500' : 'text-gray-400'} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Banner Category</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => openEditModal(r)}>
                                                    <FaEdit className='text-teal-600 ' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit Category</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => openDeleteDialog(r.category_id as number)}>
                                                    <FaTrash className='text-red-500' />
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
                            isLoading={isFetching}
                        />
                    </div>
                </div>
            </div>
            <CategoriesForm show={showDialog} onClose={closeModal} data={category} />
            <ConfirmationDialog show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} type={2} onConfirm={confirmCategoryDeletion} message={'Are you sure you want to delete this category?'} />
        </>
    );
}

CategoriesPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default CategoriesPage;
