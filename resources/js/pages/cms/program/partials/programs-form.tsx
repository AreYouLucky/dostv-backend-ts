import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useHandleChange } from "@/hooks/use-handle-change";
import { programType } from "@/types/default"
import TextField from "@/components/ui/text-field"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react";
import { TfiLayoutMediaOverlayAlt2 } from "react-icons/tfi";
import FileUpload from "@/components/ui/file-upload";
import { useCreateProgram, useUpdateProgram } from "./programs-hooks";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import LoadingDialog from "@/components/custom/loading-dialog";
import { useState } from "react";
import { usePage } from '@inertiajs/react'
import { ProgramsModel } from "@/types/models";
import { Spinner } from "@/components/ui/spinner";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
    { title: 'Form', href: '/program-form' },
];


function ProgramsForm() {
    const { url } = usePage();
    const { props } = usePage<{ program?: ProgramsModel | null }>();
    const program = props.program ?? null;


    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        program_id: program?.program_id ?? 0,
        title: program?.title ?? "",
        description: program?.description ?? "",
        agency: program?.agency ?? "",
        image: program?.image ?? "",
        trailer: program?.trailer ?? "",
        date_started: program?.date_started ?? "",
        program_type: program?.program_type ?? "",
        image_file: "" as File | string,
        trailer_file: "" as File | string,
        code: program?.code ?? "",
    });
    const [message, setMessage] = useState('')
    const [successDialog, setSuccessDialog] = useState(false)

    const createProgram = useCreateProgram();
    const updateProgram = useUpdateProgram();


    const saveProgram = () => {
        const formData = new FormData();
        formData.append("title", item.title);
        formData.append("description", item.description);
        formData.append("agency", item.agency);
        formData.append("date_started", item.date_started);
        formData.append("program_type", item.program_type);
        if (item.image_file) {
            formData.append("image", item.image_file);
        }
        if (item.trailer_file) {
            formData.append("trailer", item.trailer_file);
        }
        createProgram.mutate(formData, {
            onSuccess: ({ status, program }) => {
                const base = url.split('?')[0]
                const newUrl = `${base}/${program?.code || ''}`
                window.history.pushState({}, '', newUrl)

                console.log(program)
                setItem({
                    program_id: program?.program_id || 0,
                    title: program?.title || "",
                    description: program?.description || "",
                    agency: program?.agency || "",
                    image: program?.image || "",
                    trailer: program?.trailer || "",
                    date_started: program?.date_started || "",
                    program_type: program?.program_type || "",
                    image_file: '',
                    trailer_file: '',
                    code: program?.code || ""
                });
                setMessage(status)
                setSuccessDialog(true)

            },
            onError: err => {
                setErrors(err.response?.data?.errors ?? {});
                toast.error("Check fields for errors!");
            },
        });
    };

    const editProgram = () => {
        const formData = new FormData();
        formData.append("title", item.title);
        formData.append("description", item.description);
        formData.append("agency", item.agency);
        formData.append("date_started", item.date_started);
        formData.append("program_type", item.program_type);
        if (item.image_file) {
            formData.append("image", item.image_file);
        }
        if (item.trailer_file) {
            formData.append("trailer", item.trailer_file);
        }
        updateProgram.mutate({ id: item.program_id, payload: formData }, {
            onSuccess: ({ status, program }) => {
                setItem({
                    program_id: program?.program_id || 0,
                    title: program?.title || "",
                    description: program?.description || "",
                    agency: program?.agency || "",
                    image: program?.image || "",
                    trailer: program?.trailer || "",
                    date_started: program?.date_started || "",
                    program_type: program?.program_type || "",
                    image_file: '',
                    trailer_file: '',
                    code: program?.code || ""
                });
                setMessage(status)
                setSuccessDialog(true)
            },
            onError: err => {
                setErrors(err.response?.data?.errors ?? {});
                toast.error("Check fields for errors!");
            },
        });
    }

    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5 ">

                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <TfiLayoutMediaOverlayAlt2 /> Programs Management Form
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-300 bg-white overflow-auto px-8 py-6'>
                        <div className="w-full grid md:grid-cols-3 gap-4 mt-2 ">
                            <div className="grid md:grid-cols-2 md:col-span-2 gap-4 h-fit">
                                <div className="md:col-span-2 gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2 mb-2">
                                    <Label htmlFor="image_file" className="text-gray-700 poppins-semibold">Program Trailer</Label>
                                    <FileUpload
                                        url={item?.trailer ? `/storage/videos/program_videos/trailer/${item.trailer}` : ''}
                                        type={1}
                                        id="trailer_file"
                                        name="trailer_file"
                                        accept="video/mp4,video/x-msvideo"
                                        text="Click to upload video"
                                        onChange={handleChange}
                                        className="text-gray-600 border-gray-300 shadow p-4"
                                    />
                                    <InputError message={errors.trailer as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-gray-700 poppins-semibold">Program Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        required
                                        onChange={handleChange}
                                        value={String(item.title)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.title as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="program_type" className="text-gray-700 poppins-semibold">Program Type</Label>
                                    <Select
                                        value={item.program_type}
                                        onValueChange={(value) =>
                                            setItem((prev) => ({ ...prev, program_type: value }))
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Choose Program Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programType.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.program_type as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="agency" className="text-gray-700 poppins-semibold"> Program Agency</Label>
                                    <Input
                                        id="agency"
                                        type="text"
                                        name="agency"
                                        required
                                        onChange={handleChange}
                                        value={String(item.agency)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.agency as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date_started" className="text-gray-700 poppins-semibold">Date Started</Label>
                                    <Input
                                        id="date_started"
                                        type="date"
                                        name="date_started"
                                        required
                                        onChange={handleChange}
                                        value={String(item.date_started)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.date_started as string} />
                                </div>
                            </div>

                            <div className="">
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                    <Label htmlFor="image_file" className="text-gray-700 poppins-semibold">Banner Image <span className="poppins-regular text-gray-600">(Aspect-Ratio 4:5)</span> </Label>
                                    <FileUpload
                                        type={2}
                                        url={item?.image ? `/storage/images/program_images/thumbnails/${item.image}` : ''}
                                        id="image_file"
                                        name="image_file"
                                        accept="image/png,image/jpeg"
                                        text="Click to upload image"
                                        onChange={handleChange}
                                        className="text-gray-600 border-gray-300 shadow p-4"
                                    />
                                    <InputError message={errors.image as string} />
                                </div>
                            </div>

                            <div className="md:col-span-3 grid gap-2 mt-2">
                                <Label htmlFor="description" className="text-gray-700 poppins-semibold">Program Description</Label>
                                <div className="max-h-screen rounded-lg">
                                    <TextField
                                        id="description"
                                        name="description"
                                        label="description"
                                        value={String(item.description)}
                                        onChange={handleChange}
                                        className="text-gray-700"
                                    />
                                </div>
                                <InputError message={errors.description as string} />
                            </div>
                            <Button className="bg-teal-600 w-fit poppins-bold" onClick={item.program_id == 0 ? saveProgram : editProgram}
                                disabled={createProgram.isPending || updateProgram.isPending}> {(createProgram.isPending || updateProgram.isPending) && <Spinner className="mr-2" />
                                }{item.program_id == 0 ? 'Add' : 'Update'} Program</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
            <LoadingDialog show={createProgram.isPending || updateProgram.isPending} message={'Uploading Program Details ...'} />

        </>



    )
}

ProgramsForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ProgramsForm;
