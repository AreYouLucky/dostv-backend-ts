import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { ImFilePicture } from "react-icons/im";
import { useHandleChange } from "@/hooks/use-handle-change";
import { Head, usePage } from "@inertiajs/react";
import { PostModel, ProgramsModel, CategoriesModel } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import ImageLoader from "@/components/custom/image-loader";
import { trimText, purifyDom } from "@/hooks/use-essential-functions";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Post', href: '/view-posts' },
    { title: 'Post Form', href: '/posts/create' },
];



function PostForm() {
    const { url: pageUrl } = usePage();
    const { props } = usePage<{ programs?: ProgramsModel[] | null, categories?: CategoriesModel[] | null, post?: PostModel | null }>();
    const programs = props.programs ?? [];
    const post = props.post ?? null;
    const categories = props.categories ?? [];


    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        post_id: post?.post_id ?? 0,
        slug: post?.slug ?? '',
        title: post?.title ?? '',
        type: post?.type ?? '',
        program: post?.program ?? '',
        description: post?.description ?? '',
        featured_guest: post?.featured_guest ?? '',
        excerpt: post?.excerpt ?? '',
        episode: post?.episode ?? '',
        content: post?.content ?? '',
        platform: post?.platform ?? '',
        url: post?.url ?? '',
        trailer: post?.trailer ?? '',
        banner: post?.banner ?? '',
        thumbnail: post?.thumbnail ?? '',
        guest: post?.guest ?? '',
        agency: post?.agency ?? '',
        date_published: post?.date_published ?? '',
        status: post?.status ?? '',
        tags: post?.tags ?? '',
        categories: post?.categories ?? [],
    });

    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5 ">
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-400/50  overflow-auto p-8'>
                        <div className="md:cols-span-2 text-gray-600 poppins-bold md:text-base text-sm flex items-center justify-start gap-2 md:col-span-3 mb-1 pb-2">
                            <ImFilePicture /> Post Management Form
                        </div>
                        <div className="flex items-center pb-6">
                            <div className="flex-1 border-t border-gray-600/50"></div>
                            <span className="px-4 text-gray-600 text-sm poppins-semibold text-[13px]">Meta Section</span>
                            <div className="flex-1 border-t border-gray-600/50"></div>
                        </div>
                        <div className="grid md:grid-cols-3  gap-3 text-[12px]">
                            <div className="md:col-span-2 grid md:grid-cols-3  gap-4 ">
                                <div className="grid gap-1 md:col-span-2">
                                    <Label htmlFor="title" className="text-gray-600 poppins-semibold text-[13px]">Title</Label>
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
                                <div className="grid gap-1">
                                    <Label htmlFor="program_type" className="text-gray-600 poppins-semibold text-[13px]">Program Type</Label>
                                    <Select
                                        value={String(item.program)}
                                        onValueChange={(value) =>
                                            setItem((prev) => ({ ...prev, program: value }))
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Choose Program Type" className="text-[12px]" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programs.map((program) => (
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
                                    <InputError message={errors.program_type as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="type" className="text-gray-600 poppins-semibold text-[13px]">Type</Label>
                                    <Select
                                        value={String(item.type)}
                                        onValueChange={(value) =>
                                            setItem((prev) => ({ ...prev, type: value }))
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Choose Post Type" className="text-[12px]" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="blog">Blog</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.type as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="agency" className="text-gray-600 poppins-semibold text-[13px]">Agency</Label>
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
                                <div className="grid gap-1">
                                    <Label htmlFor="episode" className="text-gray-600 poppins-semibold text-[13px]">Episode</Label>
                                    <Input
                                        id="episode"
                                        type="text"
                                        name="episode"
                                        required
                                        onChange={handleChange}
                                        value={String(item.episode)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.episode as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="feature_guest" className="text-gray-600 poppins-semibold text-[13px]">Featured Guest</Label>
                                    <Input
                                        id="feature_guest"
                                        type="text"
                                        name="feature_guest"
                                        required
                                        onChange={handleChange}
                                        value={String(item.featured_guest)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.feature_guest as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="date_published" className="text-gray-600 poppins-semibold text-[13px]">Date Published</Label>
                                    <Input
                                        id="date_published"
                                        type="date"
                                        name="date_published"
                                        required
                                        onChange={handleChange}
                                        value={String(item.featured_guest)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.date_published as string} />
                                </div>

                                <div className="grid gap-2 col-span-3">
                                    <Label htmlFor="description" className="text-gray-600 poppins-semibold">Excerpt</Label>
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
                            <div>
                                categoriessdadsads
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


PostForm.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default PostForm;
