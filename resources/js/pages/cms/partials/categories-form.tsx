import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { memo } from "react"
import { CategoriesModel } from "@/types/models";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

interface CategoriesFormProps {
    show: boolean;
    onClose: () => void;
    item: CategoriesModel;
    setItem?: React.Dispatch<React.SetStateAction<CategoriesModel>>;
    setErrors?: React.Dispatch<React.SetStateAction<CategoriesModel>>;
    errors: CategoriesModel;
    handleChange: () => void;

}

function CategoriesForm({ show, onClose, item, setItem, setErrors, handleChange, errors }: CategoriesFormProps) {
     const saveCategory = ()=>{
        toast.success("Event has been created")
        console.log('sample')
    }
    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="text-gray-600 ">
                <DialogHeader>
                    <DialogTitle className="text-teal-600 poppins-semibold">{item.id === 0 ? 'Add' : 'Edit'} Category Form </DialogTitle>
                    <DialogDescription className="text-xs">
                        Fill all the fields to proceed
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col border-t py-4 gap-4 border-teal-600">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-teal-600 ">Category Title</Label>
                        <Input
                            id="title"
                            type="title"
                            name="title"
                            required
                            autoComplete="title"
                            onChange={handleChange}
                            value={String(item.title)}
                            className="text-gray-500 border-teal-600"
                        />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2 ">
                        <Label htmlFor="description" className="text-teal-600 ">Category Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            autoComplete="description"
                            onChange={handleChange}
                            value={String(item.description)}
                            className="text-gray-500 border-teal-600"
                        />
                        <InputError message={errors.description} />
                    </div>
                </div>
                <div className="w-full flex justify-start gap-2">
                    <Button className="text-gray-50 bg-teal-600 text-sm" onClick={saveCategory}>{item.id ===0  ? 'Add': 'Edit' }</Button>
                    <Button className="text-gray-50 bg-gray-700 text-sm" onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default memo(CategoriesForm)



