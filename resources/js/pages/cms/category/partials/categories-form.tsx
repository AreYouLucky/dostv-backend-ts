import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { memo, useCallback } from "react"
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { useCreateCategory,useUpdateCategory } from "./categories-hooks";
import { useHandleChange } from "@/hooks/use-handle-change";
import { useEffect } from "react";
import { CategoriesModel} from "@/types/models";



type CategoriesFormProps = {
    show: boolean;
    onClose: () => void;
    data?: CategoriesModel;
}

function CategoriesForm(props: CategoriesFormProps) {
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({ category_id: 0, title: '', description: '', });
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();

    const createCategoryFn = () => {
        createCategory.mutate(
            { title: item.title, description: item.description },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    clearFields()
                    props.onClose()
                },
                onError: (err) => {
                    setErrors(err.response?.data?.errors ?? {});
                    toast.error('Check Fields for error!')
                },
            }
        );
    };

    const updateCategoryFn = () => {

        updateCategory.mutate(
            {
                id: props.data?.category_id ?? 0,
                payload: {
                    title: item.title,
                    description: item.description
                }
            },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    clearFields()
                    props.onClose();
                },
                onError: (err) => {
                    setErrors(err.response?.data?.errors ?? {});
                    toast.error('Check fields for error!');
                },
            }
        );
    }

    const clearFields = useCallback(() => {
        setItem({ category_id: 0, title: '', description: '' });
        setErrors({});
    }, [setItem, setErrors]);

    useEffect(() => {
        if (props.data?.category_id === 0) {
            clearFields();
        } else if (props.data) {
            setItem({
                category_id: props.data.category_id as number,
                title: props.data.title,
                description: props.data.description,
            });
        }
    }, [ props.data, setItem, clearFields]);

    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-gray-600 p-10 bg-white ">
                <DialogHeader>
                    <DialogTitle className="text-teal-600 poppins-bold text-center">{props.data?.category_id === 0 ? 'Add' : 'Edit'} Category Form </DialogTitle>
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
                            onChange={handleChange}
                            value={String(item.title)}
                            className="text-gray-600 border-gray-300"
                        />
                        <InputError message={errors.title as string} />
                    </div>
                    <div className="grid gap-2 ">
                        <Label htmlFor="description" className="text-gray-600 poppins-semibold">Category Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            onChange={handleChange}
                            value={String(item.description)}
                            className="text-gray-600 border-gray-300"
                        />
                        <InputError message={errors.description as string} />
                    </div>
                </div>
                <div className="w-full flex justify-start gap-2">
                    <Button className="bg-teal-600" disabled={createCategory.isPending || updateCategory.isPending} onClick={props.data?.category_id === 0 ? createCategoryFn : updateCategoryFn} >
                        {(createCategory.isPending || updateCategory.isPending) ? "Saving..." : props.data?.category_id === 0 ? "Add" : "Update"}
                    </Button>
                    <Button className="text-gray-50 bg-gray-700 text-sm" onClick={props.onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default memo(CategoriesForm)
