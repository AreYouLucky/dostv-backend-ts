const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Testimonials', href: '/view-testimonials' },
    { title: 'Form', href: '/testimonials/create' },
];
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Textarea } from "@/components/ui/text-area";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { MdRecordVoiceOver } from "react-icons/md";
import { Spinner } from "@/components/ui/spinner";
import TextField from "@/components/ui/text-field";
import { useHandleChange } from "@/hooks/use-handle-change";
import { TestimonialModel } from "@/types/models";
import { MdCloudUpload } from "react-icons/md";
import LoadingDialog from "@/components/custom/loading-dialog";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import { useState } from "react";
import { useCreateTestimonial, useUpdateTestimonial } from "./testimonial-hooks";

function TestimonialForm() {
    const { props } = usePage<{ testimonial?: TestimonialModel | null }>();
    const testimonial = props.testimonial ?? null;
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        testimonial_id: testimonial?.testimonial_id ?? 0,
        title: testimonial?.title ?? '',
        thumbnail: testimonial?.thumbnail ?? '',
        thumbnail_image: "" as File | string,
        guest: testimonial?.guest ?? '',
        slug: testimonial?.slug ?? '',
        url: testimonial?.url ?? '',
        description: testimonial?.description ?? '',
        excerpt: testimonial?.excerpt ?? '',
        date_published: testimonial?.date_published ?? '',

    });
    const [successDialog, setSuccessDialog] = useState(false);
    const [message, setMessage] = useState("");

    const createFormData = () => {
        const formData = new FormData();
        formData.append("title", String(item.title));
        formData.append("url", String(item.url));
        formData.append("guest", String(item.guest));
        formData.append("description", String(item.description));
        formData.append("excerpt", String(item.excerpt));
        formData.append("date_published", String(item.date_published));
        if (item.thumbnail_image instanceof File) {
            formData.append("thumbnail_image", item.thumbnail_image);
        }
        return formData;
    }

    const createTestimonial = useCreateTestimonial()
    const createTestimonialFn = () => {
        const data = createFormData()
        createTestimonial.mutate(data,
            {
                onSuccess: (data) => {
                    toast.success("Testimonial created successfully");
                    setSuccessDialog(true);
                    setMessage("Testimonial created successfully");
                    const newUrl = `/testimonials/${data.testimonial?.testimonial_id}/edit`;
                    window.history.pushState({}, "", newUrl);
                    setItem((prev) => ({
                        ...prev,
                        testimonial_id: data.testimonial?.testimonial_id as number
                    }))
                },
                onError: (error) => {
                    {
                        setErrors(error.response?.data?.errors ?? {});
                        if (error.message)
                            toast.error(error.message);
                    }
                }
            }
        );

    }

    const updateTestimonial = useUpdateTestimonial()
    const updateAdvertisementFn = () => {
        const formData = createFormData()
        updateTestimonial.mutate({ id: item.testimonial_id, payload: formData }, {
            onSuccess: (data) => {
                toast.success("Testimonial updated successfully");
                setMessage(data.status)
                setSuccessDialog(true);
            },
            onError: (err) => {
                if (err.message)
                    toast.error(err.message);
                if (err.response?.data?.errors)
                    setErrors(err.response?.data?.errors ?? {});
            },
        })
    }


    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-1 gap-x-5 rounded-xl px-6 py-5 ">
                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <MdRecordVoiceOver /> Testimonial Management Form
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-300 bg-white overflow-auto p-8'>
                        <div className="w-full grid md:grid-cols-3 gap-4">
                            <div className="border-r md:col-span-2 border-gray-300 grid md:grid-cols-2 gap-4 pl-4 pr-8 py-4 h-fit">
                                <div className="grid gap-2">
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
                                <div className="grid gap-2">
                                    <Label htmlFor="date_published" className="text-gray-700 poppins-semibold">Date Published</Label>
                                    <Input
                                        id="date_published"
                                        type="date"
                                        name="date_published"
                                        required
                                        onChange={handleChange}
                                        value={String(item.date_published ?? '')}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.date_published as string} />
                                </div>
                                <div className="grid gap-2 ">
                                    <Label htmlFor="guest" className="text-gray-700 poppins-semibold">Guest</Label>
                                    <Input
                                        id="guest"
                                        type="text"
                                        name="guest"
                                        required
                                        onChange={handleChange}
                                        value={String(item.guest ?? '')}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.guest as string} />
                                </div>
                                <div className="grid gap-2 ">
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
                                <div className="grid gap-2 md:col-span-2">
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
                                    url={item?.thumbnail ? `/storage/images/testimonials/${item.thumbnail}` : ''}
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
                                onClick={() => item.testimonial_id !== 0 ? updateAdvertisementFn() : createTestimonialFn()}>
                                    {createTestimonial.isPending || updateTestimonial.isPending ? <Spinner /> : <MdCloudUpload/>}
                                {item.testimonial_id !== 0 ? "Update" : "Create"} Testimonial
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
            <LoadingDialog show={false} message={'Uploading Testimonial Details ...'} />
        </>
    )

}
TestimonialForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default TestimonialForm;