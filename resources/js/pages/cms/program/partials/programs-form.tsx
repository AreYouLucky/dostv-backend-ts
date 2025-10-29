import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useHandleChange } from "@/hooks/use-handle-change";
import SelectInput from "@/components/ui/select-input"
import { programType } from "@/types/default"
import TextField from "@/components/ui/text-field"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react";
import { TfiLayoutMediaOverlayAlt2 } from "react-icons/tfi";
import FileUpload from "@/components/ui/file-upload";
import { useCreateProgram, useUpdateProgram } from "./programs-hooks";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import { useState } from "react";

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
    { title:  'Form', href: '/program-form' },
];


function ProgramsForm() {
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        program_id: 0,
        title: '',
        description: '',
        agency: '',
        image: '',
        trailer: '',
        date_started: '',
        program_type: '',
        image_file: '',
        trailer_file: '',
        code: ''
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

    const editProgram = () =>{
        console.log('test')
        console.log('this asdasdas',item)
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
        updateProgram.mutate({id:item.program_id, payload:formData}, {
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
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-8'>
                        <div className="w-full grid md:grid-cols-3 gap-4 mt-2 ">
                            <div className="text-teal-700 poppins-bold md:text-xl text-sm flex items-center justify-start gap-5 md:col-span-3 mb-1 pb-4  border-b">
                                <TfiLayoutMediaOverlayAlt2 /> Programs Management Form
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
                                    className="text-gray-700 border-teal-600"
                                />
                                <InputError message={errors.title as string} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="program_type" className="text-gray-700 poppins-semibold">Program Type</Label>
                                <SelectInput
                                    id="program_type"
                                    name="program_type"
                                    items={programType}
                                    itemValue="code"
                                    itemName="value"
                                    value={item.program_type}
                                    onChange={handleChange}
                                    defaultValue="Select program type"
                                    className="text-gray-700 border-teal-600"
                                />

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
                                    className="text-gray-700 border-teal-600"
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
                                    className="text-gray-700 border-teal-600"
                                />
                                <InputError message={errors.date_started as string} />
                            </div>
                            <div className="md:col-span-2">

                            </div>
                            <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                <Label htmlFor="image_file" className="text-gray-700 poppins-semibold">Banner Image <span className="poppins-regular text-gray-600">(Aspect-Ratio 4:5)</span> </Label>
                                <FileUpload
                                    type={1}
                                    id="image_file"
                                    name="image_file"
                                    accept="image/png,image/jpeg"
                                    text="Click to upload image"
                                    onChange={handleChange}
                                    className="text-gray-600 border-teal-600 shadow p-4"
                                />
                                <InputError message={errors.image as string} />
                            </div>
                            <div className="md:col-span-2 gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                <Label htmlFor="image_file" className="text-gray-700 poppins-semibold">Program Trailer</Label>
                                <FileUpload
                                    type={2}
                                    id="trailer_file"
                                    name="trailer_file"
                                    accept="video/mp4,video/x-msvideo"
                                    text="Click to upload video"
                                    onChange={handleChange}
                                    className="text-gray-600 border-teal-600 shadow p-4"
                                />
                                <InputError message={errors.trailer as string} />
                            </div>
                            <div className="md:col-span-3 grid gap-2 mt-2">
                                <Label htmlFor="description" className="text-gray-700 poppins-semibold">Program Description</Label>
                                <div className="max-h-screen  overflow-auto border border-teal-600 rounded-lg">
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
                            disabled={createProgram.isPending || updateProgram.isPending}>{item.program_id == 0 ? 'Add' : 'Update' } Program</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
        </>



    )
}

ProgramsForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ProgramsForm;
