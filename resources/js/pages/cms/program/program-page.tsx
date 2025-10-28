import React, { useState } from 'react'
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaginatedSearchTable from '@/components/custom/data-table';
import { useFetchPrograms } from './partials/programs-hooks';
import { ProgramsModel, emptyProgram } from '@/types/models';
import { trimText, convertShortDate } from '@/hooks/use-essential-functions';
import ImageLoader from '@/components/custom/image-loader';
import { MdPermMedia } from "react-icons/md";
import ProgramsForm from './partials/programs-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
];
function ProgramPage() {
    const { data, isPending, refetch, error } = useFetchPrograms();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [program, setProgram] = useState<ProgramsModel>(emptyProgram)

    if (error) return alert('An error has occurred: ' + error.message);

    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 '>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            <MdPermMedia /> Programs Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Button className='bg-teal-600' onClick={() => { setShowDialog(true) }}> <Plus /> Add Program</Button>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2'>
                        <PaginatedSearchTable<ProgramsModel>
                            items={data ?? []}
                            headers={[
                                { name: "Title", position: "center" },
                                { name: "Banner", position: "center" },
                                { name: "Code", position: "center" },
                                { name: "Description", position: "center" },
                                { name: "Started", position: "center" },
                                { name: "Type", position: "center" },
                                { name: "Agency", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.title} ${item.description} ${item.agency}`}
                            renderRow={(r) => (
                                <tr key={r.program_id} className="border-b  duration-200 hover:scale-101">
                                    <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800">{r.title}</td>
                                    <td >
                                        <div className='flex justify-center items-center relative h-full'>
                                            <ImageLoader
                                                src="/storage/images/logos/download.jpg"
                                                alt="Program Banner"
                                                className="h-12 w-auto my-1 rounded"
                                            />

                                        </div>
                                    </td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px]">{r.code}</td>
                                    <td className="px-6 py-1.5 text-[11px] text-justify">{r.description !== '' ? trimText(r.description, 255) : 'Not Set'}</td>
                                    <td className="px-6 py-1.5 text-[11px] text-justify">{convertShortDate(r.date_started)}</td>
                                    <td className="px-6 py-1.5 text-justify">{r.program_type}</td>
                                    <td className="px-6 py-1.5 text-center">{r.agency}</td>
                                    <td className="px-6 py-1.5 text-justify"><Button onClick={() => setProgram(r)}>sample</Button></td>

                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Program"
                            onRefresh={() => refetch()}
                            isLoading={isPending}
                        />
                    </div>
                </div>
            </div >
            <ProgramsForm show={showDialog} onClose={() => { setShowDialog(false) }} data={program} />
        </>
    )
}

ProgramPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ProgramPage;