import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ProgramsModel } from "@/types/models"
import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useHandleChange } from "@/hooks/use-handle-change";
import SelectInput from "@/components/ui/select-input"
import { programType } from "@/types/default"
import TextField from "@/components/ui/text-field"


type ProgramsFormProps = {
    show: boolean;
    onClose: () => void;
    data?: ProgramsModel;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/view-programs' },
    { title: 'Program Form', href: '/program-form' },
];


function ProgramsForm(props: ProgramsFormProps) {
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
        <div className="w-full grid md:grid-cols-2 gap-4 mt-2 ">
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
            <div className="md:col-span-2">

                <div className="max-h-[450px]  overflow-auto rounded-lg  p-2">
                    <TextField
                        id="title"
                        name="title"
                        label="Title"
                        value={String(item.title)}
                        onChange={handleChange}
                        className="text-gray-600"
                    />
                </div>
            </div>
        </div>

    )
}

ProgramsForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ProgramsForm;
