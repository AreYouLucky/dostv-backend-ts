import { Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { IoAddCircle } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import PaginatedSearchTable from '@/components/custom/data-table';
import { useFetchPrograms, useDeleteProgram, useMoveProgram, useToggleProgramVisibility } from './partials/programs-hooks';
import { ProgramsModel } from '@/types/models';
import { trimText, purifyDom } from '@/hooks/use-essential-functions';
import ImageLoader from '@/components/custom/image-loader';
import { MdPermMedia } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaTrash, FaEdit, FaArrowUp, FaArrowDown, FaEye } from "react-icons/fa";
import ConfirmationDialog from '@/components/custom/confirmation-dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { TiStarFullOutline } from "react-icons/ti";


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
];
function ProgramsPage() {
    const { data, isFetching, refetch, error } = useFetchPrograms();
    const [id, setId] = useState<number>(0);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)

    const deleteProgram = useDeleteProgram();
    const moveProgram = useMoveProgram();
    const toggleVisibility = useToggleProgramVisibility()

    const toggleVisibilityFn = (id: number) => {
        toggleVisibility.mutate({ id }, {
            onSuccess: () => {
                refetch()
            },
            onError(error) {
                if (error.message)
                    toast.error(error.message);
            },
        });
    }
    if (error) return alert('An error has occurred: ' + error.message);

    const openDeleteDialog = (id: number) => {
        setDeleteDialog(true)
        setId(id)

    }

    const confirmProgramDeletion = () => {
        deleteProgram.mutate(
            { id: id },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setDeleteDialog(false)
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        );
    }
    const moveProgramFn = (id: number, type: number, order: number) => {
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

        moveProgram.mutate(formData, {
            onSuccess: ({ status }) => {
                toast.success(`${status} ${type === 1 ? "Up!" : "Down!"}`);
                refetch()
            },
            onError(error) {
                if (error.message)
                    toast.error(error.message);
            },
        });
    };



    return (
        <>
            <Head title="Programs" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-700 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <MdPermMedia /> Programs Management Section
                        </div>
                        <div className="text-teal-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/program-form'}> <IoAddCircle /> Add Program</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white'>
                        <PaginatedSearchTable<ProgramsModel>
                            items={data ?? []}
                            headers={[
                                { name: "Order", position: "center" },
                                { name: "Title", position: "center" },
                                { name: "Banner", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Type", position: "center" },
                                { name: "Agency", position: "center" },
                                { name: "Seasons", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description} ${item.agency}`}
                            renderRow={(r) => (
                                <tr key={r.program_id} className="border-b  duration-300 hover:scale-102">
                                    <td >
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 rounded-lg duration-300  cursor-pointer text-lg' disabled={(data?.[0].order === r.order)} onClick={() => moveProgramFn(r.program_id as number, 1, r.order as number)}>
                                                        <FaArrowUp className='text-teal-500 hover:scale-110 duration-300 text-[12px]' />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Move Up</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className=' disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-teal-100 p-0 text-lg rounded-lg duration-300  cursor-pointer' onClick={() => moveProgramFn(r.program_id as number, 2, r.order as number)}
                                                        disabled={(data?.[data?.length - 1].order === r.order)}>
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
                                    <td >
                                        <div className='flex justify-center items-center relative h-full hover:scale-110 duration-300'>
                                            <ImageLoader
                                                src={`/storage/images/program_images/thumbnails/${r.image}`}
                                                alt="Program Banner"
                                                className="h-12 w-auto my-1 rounded"
                                            />

                                        </div>
                                    </td>

                                    <td className="px-6 py-1.5 text-[11px] text-justify">{r.description !== '' ?
                                        <div
                                            className="p-2 text-justify"
                                            dangerouslySetInnerHTML={{
                                                __html: purifyDom(trimText(r.description, 220) ?? ""),
                                            }}
                                        /> : 'Not Set'}</td>
                                    <td className="px-6 py-1.5 text-justify">{r.program_type}</td>
                                    <td className="px-6 py-1.5 text-center">{r.agency}</td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px]">
                                        <Link className="bg-teal-500 text-[11px] poppins-bold text-white px-4 py-1.5 w-fit rounded-md shadow-sm uppercase flex items-center gap-2" href={`/program-seasons/${r.program_id}/edit`}> <FaEye /> view</Link>
                                    </td>
                                    <td>
                                        <div className='px-6 py-1.5 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative'>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => toggleVisibilityFn(r.program_id as number)}>
                                                        <TiStarFullOutline className={r.is_banner == 1 ? 'text-blue-500' : 'text-gray-400'} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Banner Category</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' href={`/program-form/${r.code}`}>
                                                        <FaEdit className='text-teal-600 ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Program</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => openDeleteDialog(r.program_id as number)}>
                                                        <FaTrash className='text-red-500' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Program</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Program"
                            onRefresh={() => refetch()}
                            isLoading={isFetching}
                        />
                    </div>
                </div>
                <ConfirmationDialog show={deleteDialog} onClose={() => setDeleteDialog(false)} type={2} onConfirm={confirmProgramDeletion} message={'Are you sure you want to delete this program?'} />
            </div >
        </>
    )
}
ProgramsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default ProgramsPage;