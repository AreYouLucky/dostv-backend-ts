const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Advertisements', href: '/view-advertisements' },
    { title: 'Form', href: '/advertisements/create' },
];
import AppLayout from "@/layouts/app-layout";
import { FaPhotoVideo } from "react-icons/fa";
import { Head, usePage } from "@inertiajs/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Textarea } from "@/components/ui/text-area";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner";
import TextField from "@/components/ui/text-field";
import { useHandleChange } from "@/hooks/use-handle-change";
import { AdvertisementModel } from "@/types/models";
import { useCreateAdvertisement, useUpdateAdvertisement } from "./advertisement-hooks";
import { MdCloudUpload } from "react-icons/md";
import LoadingDialog from "@/components/custom/loading-dialog";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import { useState } from "react";

function BannersForm() {
    const { props } = usePage<{ advertisement?: AdvertisementModel | null }>();
    const advertisement = props.advertisement ?? null;
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        advertisement_id: advertisement?.advertisement_id ?? 0,
        title: advertisement?.title ?? '',
        thumbnail: advertisement?.thumbnail ?? '',
        thumbnail_image: "" as File | string,
        url: advertisement?.url ?? '',
        is_redirect: advertisement?.is_redirect ?? '',
        slug: advertisement?.slug ?? '',
        description: advertisement?.description ?? '',
        excerpt: advertisement?.excerpt ?? '',
    });
    const [successDialog,setSuccessDialog] = useState(false);
    const [message,setMessage] = useState("");

    const createFormData = () => {
        const formData = new FormData();
        formData.append("title", String(item.title));
        formData.append("url", String(item.url));
        formData.append("is_redirect", String(item.is_redirect));
        formData.append("description", String(item.description));
        formData.append("excerpt", String(item.excerpt));
        if (item.thumbnail_image instanceof File) {
            formData.append("thumbnail_image", item.thumbnail_image);
        }
        return formData;
    }
    const createAdvertisement = useCreateAdvertisement();
    const createAdvertisementFn = () => {
        const data = createFormData()
        createAdvertisement.mutate(data, {
            onSuccess: (data) => {
                toast.success("Advertisement created successfully");
                const newUrl = `/advertisements/${data.advertisement?.advertisement_id}/edit`;
                window.history.pushState({}, "", newUrl);
                setItem((prev) => ({
                    ...prev,
                    advertisement_id: data.advertisement?.advertisement_id as number
                }))
                setMessage(data.status)
                setSuccessDialog(true);

            },
            onError: (err) => {
                toast.error("Failed to create advertisement");
                setErrors(err.response?.data?.errors ?? {});
            },
        })
    }
    const updateAdvertisement = useUpdateAdvertisement();  
    const updateAdvertisementFn = () => {
        const formData = createFormData()
        updateAdvertisement.mutate({ id: item.advertisement_id, payload: formData }, {
            onSuccess: (data) => {
                toast.success("Advertisement updated successfully");
                setMessage(data.status)
                setSuccessDialog(true);
            },
            onError: (err) => {
                toast.error("Failed to update advertisement");
                setErrors(err.response?.data?.errors ?? {});
            },
        })
    }


    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5 ">
                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <FaPhotoVideo /> Advertisement Management Form
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-300 bg-white overflow-auto p-8'>
                        <div className="w-full grid md:grid-cols-3 gap-4">
                            <div className="border-r md:col-span-2 border-gray-300 grid md:grid-cols-3 gap-4 pl-4 pr-8 py-4 h-fit">
                                <div className="grid gap-2">
                                    <Label htmlFor="type" className="text-gray-700 poppins-semibold">Type</Label>
                                    <Select
                                        value={item.is_redirect?.toString() ?? ""}
                                        onValueChange={(value) =>
                                            setItem((prev) => ({ ...prev, is_redirect: Number(value) }))
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Choose Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Redirect to URL
                                            </SelectItem>
                                            <SelectItem value="0">
                                                View from Website
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.is_redirect as string} />
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="title" className="text-gray-700 poppins-semibold">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        required
                                        onChange={handleChange}
                                        value={String(item.title ?? '')}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.title as string} />
                                </div>
                                {
                                    item.is_redirect == 1 &&
                                    <div className="grid gap-2 md:col-span-3">
                                        <Label htmlFor="url" className="text-gray-700 poppins-semibold">Url</Label>
                                        <Input
                                            id="url"
                                            type="text"
                                            name="url"
                                            required
                                            onChange={handleChange}
                                            value={String(item.url ?? '')}
                                            className="text-gray-700 border-gray-300"
                                        />
                                        <InputError message={errors.url as string} />
                                    </div>
                                }
                                <div className="grid gap-2 md:col-span-3">
                                    <Label htmlFor="excerpt" className="text-gray-600 poppins-semibold">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        name="excerpt"
                                        required
                                        onChange={handleChange}
                                        value={String(item.excerpt ?? '')}
                                        className="text-gray-600 border-gray-300"
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>

                            </div>
                            <div className="px-4">
                                <Label htmlFor="thumbnail_image" className="text-gray-700 poppins-semibold">Thumbnail </Label>
                                <FileUpload
                                    type={2}
                                    url={item?.thumbnail ? `/storage/images/advertisements/${item.thumbnail}` : ''}
                                    id="thumbnail_image"
                                    name="thumbnail_image"
                                    accept="image/png,image/jpeg"
                                    text="Click to upload image"
                                    onChange={handleChange}
                                    className="text-gray-600 border-gray-300 shadow px-8 "
                                />
                                <InputError message={errors.thumbnail_image} />
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <Label htmlFor="description" className="text-gray-600 poppins-semibold mb-2 px-4">Description</Label>
                            <div className="max-h-screen rounded-lg px-4">
                                <TextField
                                    id="description"
                                    name="description"
                                    label="description"
                                    value={String(item.description)}
                                    onChange={handleChange}
                                    className="text-gray-700"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                        <div className="m-4">
                            <Button className="w-fit bg-teal-600 hover:bg-teal-700 text-white poppins-semibold  text-sm px-4 py-2 rounded-md"
                                onClick={() => item.advertisement_id !== 0 ? updateAdvertisementFn() : createAdvertisementFn()}>
                                    {createAdvertisement.isPending || updateAdvertisement.isPending ? <Spinner /> : <MdCloudUpload/>}
                                {item.advertisement_id !== 0 ? "Update" : "Create"} Advertisement 
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
            <LoadingDialog show={createAdvertisement.isPending || updateAdvertisement.isPending} message={'Uploading Program Details ...'} />
        </>
    )

}
BannersForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BannersForm;