import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import LoadingDialog from "@/components/custom/loading-dialog";
import { useState } from "react";
import { usePage } from '@inertiajs/react'
import { ProgramsModel, BannerModel } from "@/types/models";
import { Spinner } from "@/components/ui/spinner";
import ImageLoader from "@/components/custom/image-loader";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { Textarea } from "@/components/ui/text-area";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { useHandleChange } from "@/hooks/use-handle-change";
import { Head } from "@inertiajs/react";
import { PiImagesBold } from "react-icons/pi";
import AppLayout from "@/layouts/app-layout";
import { purifyDom } from "@/hooks/use-essential-functions";
import { bannerTypes } from "@/types/default";
import { useCreateBanner, useUpdateBanner } from "./banner-hooks";
import { FaUpload } from "react-icons/fa";
import { stripHtml } from "@/hooks/use-essential-functions";
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banners', href: '/view-banners' },
    { title: 'Form', href: '/banner-form' },
];

function BannersForm() {
    const { props } = usePage<{ programs?: ProgramsModel[] | null, banner?: BannerModel | null }>();
    const [successDialog, setSuccessDialog] = useState(false);
    const [message, setMessage] = useState("");
    const programs = props.programs ?? null;
    const banner = props.banner ?? null;
    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        banner_id: banner?.banner_id ?? 0,
        title: banner?.title ?? '',
        media: banner?.media ?? '',
        media_file: "" as File | string,
        code: banner?.code ?? '',
        highlight_text: banner?.highlight_text ?? '',
        episodes: banner?.episodes ?? '',
        description: banner?.description ?? '',
        url: banner?.url ?? '',
        type: banner?.type ?? null,
    });

    const createFormData = () => {
        const formData = new FormData();
        formData.append("banner_id", item.banner_id.toString());
        formData.append("title", item.title);
        formData.append("media", item.media_file);
        formData.append("code", item.code);
        formData.append("highlight_text", item.highlight_text);
        formData.append("episodes", item.episodes);
        formData.append("description", item.description);
        formData.append("url", item.url);
        formData.append("type", item.type?.toString() ?? '');
        return formData
    }

    const createBanner = useCreateBanner();
    const createBannerFn = () => {
        const data = createFormData();
        createBanner.mutate(data, {
            onSuccess: (data) => {
                const newUrl = `/banners/${data.banner.banner_id}/edit`;
                window.history.pushState({}, "", newUrl);
                setItem((prev) => ({
                    ...prev,
                    banner_id: data.banner.banner_id as number
                }))
                toast.success("Banner Created Successfully")
                setMessage("Banner Created Successfully")
                setSuccessDialog(true)
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                    toast.error("Check fields for errors!");
                }
                if (error.message)
                    toast.error(error.message);
            }
        })
    }

    const updateBanner = useUpdateBanner();
    const updateBannerFn = () => {
        const data = createFormData();
        updateBanner.mutate({ id: item.banner_id.toString(), payload: data }, {
            onSuccess: () => {
                toast.success("Banner Updated Successfully")
                setMessage("Banner Updated Successfully")
                setSuccessDialog(true)
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                    toast.error("Check fields for errors!");
                }
                if (error.message)
                    toast.error(error.message);
            }
        })
    }



    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-1 gap-x-5 rounded-xl px-6 py-5 ">
                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <PiImagesBold /> Banner Management Form
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-300 bg-white/70 overflow-auto p-8'>
                        <div className="w-full grid md:grid-cols-3 gap-4 mt-2 ">
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-gray-700 poppins-semibold">Banner Template</Label>
                                <Select
                                    value={item.type?.toString() ?? ""}
                                    onValueChange={(value) =>
                                        setItem((prev) => ({ ...prev, type: Number(value) }))
                                    }
                                >
                                    <SelectTrigger className="border-gray-300">
                                        <SelectValue placeholder="Choose Template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bannerTypes.map((type) => (
                                            <SelectItem
                                                key={type.code}
                                                value={type.code.toString()}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type as string} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title" className="text-gray-700 poppins-semibold">Banner Title</Label>
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
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-4 w-full">
                            {
                                item.type && [1, 2, 3].includes(item.type) &&
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2 md:col-span-3">
                                    <Label htmlFor="media_file" className="text-gray-700 poppins-semibold">Banner Image <span className="poppins-regular text-gray-600">(Aspect-Ratio 4:5)</span> </Label>
                                    <FileUpload
                                        type={2}
                                        url={item?.media ? `/storage/images/banners/${item.media}` : ''}
                                        id="media_file"
                                        name="media_file"
                                        accept="image/png,image/jpeg"
                                        text="Click to upload image banner"
                                        onChange={handleChange}
                                        className="text-gray-600 border-gray-300 shadow p-4"
                                    />
                                    <InputError message={errors.media_file as string} />
                                </div>
                            }
                            {
                                item.type && [4, 5, 6].includes(item.type) &&
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2 md:col-span-3">
                                    <Label htmlFor="media_file" className="text-gray-700 poppins-semibold">Banner Video <span className="poppins-regular text-gray-600">(Aspect-Ratio 4:5)</span> </Label>
                                    <FileUpload
                                        type={1}
                                        url={item?.media ? `/storage/videos/banners/${item.media}` : ''}
                                        id="media_file"
                                        name="media_file"
                                        accept="video/mp4,video/x-msvideo"
                                        text="Click to upload video banner"
                                        onChange={handleChange}
                                        className="text-gray-600 border-gray-300 shadow p-4"
                                    />
                                    <InputError message={errors.media as string} />
                                </div>
                            }
                            {
                                item.type && [3, 4].includes(item.type) &&
                                <div className="grid gap-1">
                                    <Label htmlFor="code" className="text-gray-600 poppins-semibold text-[13px]">Program Type</Label>
                                    <Select
                                        value={String(item.code ?? '')}
                                        onValueChange={(value) => {
                                            const selectedProgram = programs?.find(
                                                (program) => program.code === value
                                            );
                                            if (!selectedProgram) return;
                                            setItem((prev) => ({
                                                ...prev,
                                                code: value,
                                                episodes: selectedProgram.episode_count as string ?? 0,
                                                description: stripHtml(selectedProgram.description) ?? '',
                                            }));

                                            setErrors((prev) => ({ ...prev, program: '' }));
                                        }}
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Choose Program Type" className="text-[12px]" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programs && programs.map((program) => (
                                                <Tooltip key={program.program_id} >
                                                    <TooltipTrigger asChild>
                                                        <SelectItem
                                                            value={program.code ?? ''}
                                                        >
                                                            {program.title}
                                                        </SelectItem>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" >
                                                        <div className="flex flex-row">
                                                            <div className="flex flex-col">
                                                                <ImageLoader
                                                                    src={`/storage/images/program_images/thumbnails/${program.image}`}
                                                                    alt="Program Banner"
                                                                    className="h-12 w-auto my-1 rounded"
                                                                />
                                                                <p className="poppins-semibold text-[11px]">
                                                                    {program.title}
                                                                </p>
                                                                <p className="text-[10px] poppins-thin">
                                                                    {program.agency ?? ''}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className="p-2 text-justify"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: purifyDom(program.description ?? ""),
                                                                }}
                                                            />
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.code} />
                                </div>
                            }
                            {
                                item.type && [3, 4].includes(item.type) &&
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                    <Label htmlFor="episodes" className="text-gray-700 poppins-semibold">Episodes</Label>
                                    <Input
                                        id="episodes"
                                        type="text"
                                        name="episodes"
                                        required
                                        onChange={handleChange}
                                        value={String(item.episodes)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.episodes as string} />
                                </div>
                            }
                            {
                                item.type && [2, 3, 4, 6].includes(item.type) &&
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                    <Label htmlFor="highlight_text" className="text-gray-700 poppins-semibold">Text Highlight</Label>
                                    <Input
                                        id="highlight_text"
                                        type="text"
                                        name="highlight_text"
                                        placeholder="e.g. Airing, Hot, Live"
                                        required
                                        onChange={handleChange}
                                        value={String(item.highlight_text)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.highlight_text as string} />
                                </div>
                            }
                            {
                                item.type && [2, 6].includes(item.type) &&
                                <div className=" gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                    <Label htmlFor="url" className="text-gray-700 poppins-semibold">Url</Label>
                                    <Input
                                        id="url"
                                        type="text"
                                        name="url"
                                        required
                                        onChange={handleChange}
                                        value={String(item.url)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.url as string} />
                                </div>
                            }
                            {
                                item.type && [2, 3, 4, 6].includes(item.type) &&
                                <div className="md:col-span-3 gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out mt-2">
                                    <Label htmlFor="description" className="text-gray-600 poppins-semibold">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        required
                                        onChange={handleChange}
                                        value={String(item.description)}
                                        className="text-gray-600 border-gray-300"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            }
                        </div>
                        <div className="mt-4">
                            <Button className="bg-teal-600 w-fit poppins-bold flex flex-row items-center justify-center"
                                onClick={() => item.banner_id !== 0 ? updateBannerFn() : createBannerFn()}>
                                {createBanner.isPending || updateBanner.isPending ? <Spinner className="mr-1" /> : <FaUpload className="mr-1" />}
                                {item.banner_id == 0 ? 'Add' : 'Update'} Banner
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
            <LoadingDialog show={createBanner.isPending || updateBanner.isPending} message={'Uploading Banner Details ...'} />
        </>
    )

}
BannersForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default BannersForm;

