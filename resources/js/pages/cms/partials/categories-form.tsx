import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { memo } from "react"
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { useCreateCategory } from "./categories-hooks";
import { useHandleChange } from "@/hooks/use-handle-change";
import { useQueryClient } from '@tanstack/react-query'
import { useGetCategory } from "./categories-hooks";
import { useEffect } from "react";


type CategoriesFormProps = {
    show: boolean;
    onClose: () => void;
    category_id: number;
}

function CategoriesForm(props: CategoriesFormProps) {
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        category_id: 0,
        title: '',
        description: '',
    });
    console.log(props.category_id)

    const { data } = useGetCategory(props.category_id, {
        enabled: props.category_id !== 0,
    });
    useEffect(() => {
        if (props.category_id === 0) {
            setItem({ category_id: 0, title: '', description: '' });
            setErrors({});
        } else if (data) {
            console.log(data)
            setItem({
                category_id: data.category_id as number,
                title: data.title,
                description: data.description,
            });
        }
    }, [props.category_id, data, setItem, setErrors]);

    const createCategory = useCreateCategory();
    const queryClient = useQueryClient()
    const saveCategory = () => {
        createCategory.mutate(
            { title: item.title, description: item.description },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setItem({ category_id: 0, title: '', description: '' });
                    setErrors({});
                    queryClient.invalidateQueries({ queryKey: ["categories"] });
                    props.onClose()
                },
                onError: (err) => {
                    setErrors(err.response?.data?.errors ?? {});
                    toast.error('Check Fields for error!')
                },
            }
        );
    };
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-gray-600 p-10 ">
                <DialogHeader>
                    <DialogTitle className="text-teal-600 poppins-bold text-center">{props.category_id === 0 ? 'Add' : 'Edit'} Category Form </DialogTitle>
                    <DialogDescription className="text-xs text-center">
                        Fill all the fields to proceed
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col pb-4 pt-2 gap-4 ">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-gray-600 poppins-semibold">Category Title</Label>
                        <Input
                            id="title"
                            type="title"
                            name="title"
                            required
                            autoComplete="title"
                            onChange={handleChange}
                            value={String(item.title)}
                            className="text-gray-600 border-teal-600"
                        />
                        <InputError message={errors.title as string} />
                    </div>
                    <div className="grid gap-2 ">
                        <Label htmlFor="description" className="text-gray-600 poppins-semibold">Category Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            autoComplete="description"
                            onChange={handleChange}
                            value={String(item.description)}
                            className="text-gray-600 border-teal-600"
                        />
                        <InputError message={errors.description as string} />
                    </div>
                </div>
                <div className="w-full flex justify-start gap-2">
                    <Button className="bg-teal-600" disabled={createCategory.isPending} onClick={saveCategory} >
                        {createCategory.isPending ? "Saving..." : props.category_id === 0 ? "Add" : "Update"}
                    </Button>
                    <Button className="text-gray-50 bg-gray-700 text-sm" onClick={props.onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default memo(CategoriesForm)



