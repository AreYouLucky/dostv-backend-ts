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

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
    { title: 'Form', href: '/program-form' },
];


function ProgramsForm() {
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        program_id: 0,
        code: '',
        title: '',
        description: '',
        agency: '',
        image: '',
        trailer: '',
        date_started: '',
        program_type: '',
    });

    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 '>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-5">
                            <TfiLayoutMediaOverlayAlt2 /> Programs Management Form
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto px-8 py-8 '>
                        <div className="w-full grid md:grid-cols-3 gap-3 mt-2 ">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-gray-600 poppins-regular">Program Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    onChange={handleChange}
                                    value={String(item.title)}
                                    className="text-gray-600 border-teal-600"
                                />
                                <InputError message={errors.title as string} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="program_type" className="text-gray-600 poppins-regular">Program Type</Label>
                                <SelectInput
                                    id="program_type"
                                    name="program_type"
                                    items={programType}
                                    itemValue="code"
                                    itemName="value"
                                    value={item.program_type}
                                    onChange={handleChange}
                                    defaultValue="Select program type"
                                    className="text-gray-600 border-teal-600"
                                />

                                <InputError message={errors.program_type as string} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="agency" className="text-gray-600 poppins-regular"> Program Agency</Label>
                                <Input
                                    id="agency"
                                    type="text"
                                    name="agency"
                                    required
                                    onChange={handleChange}
                                    value={String(item.agency)}
                                    className="text-gray-600 border-teal-600"
                                />
                                <InputError message={errors.agency as string} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date_started" className="text-gray-600 poppins-regular">Date Started</Label>
                                <Input
                                    id="date_started"
                                    type="date"
                                    name="date_started"
                                    required
                                    onChange={handleChange}
                                    value={String(item.date_started)}
                                    className="text-gray-600 border-teal-600"
                                />
                                <InputError message={errors.date_started as string} />
                            </div>
                            <div className="md:col-span-3">
                                <Label htmlFor="description" className="text-gray-600 poppins-regular">Description</Label>
                                <div className="max-h-[450px]  overflow-auto border border-teal-600 rounded-lg">
                                    <TextField
                                        id="description"
                                        name="description"
                                        label="description"
                                        value={String(item.description)}
                                        onChange={handleChange}
                                        className="text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.description as string} />
                            </div>
                            <Button className="bg-teal-600 w-fit">Add Program</Button>
                        </div>
                    </div>
                </div>
            </div>


        </>



    )
}

ProgramsForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ProgramsForm;
