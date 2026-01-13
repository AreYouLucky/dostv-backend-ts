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
import { purifyDom } from "@/hooks/use-essential-functions";
import { Checkbox } from "@/components/ui/checkbox";
import { MdPermMedia, MdOutlineContentPaste } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { platforms } from "@/types/default";
import VideoEmbed from "@/components/custom/video-embed";
import TextField from "@/components/ui/text-field";
import FileUpload from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TagsInput } from "@/components/custom/tags-input";
import { useCreatePost } from "./post-hooks";
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
    const post_categories = props.post?.categories ?? []


    const { item, errors, setItem, handleChange, handleArrayChange, setErrors } = useHandleChange({
        post_id: post?.post_id ?? 0,
        slug: post?.slug ?? '',
        title: post?.title ?? '',
        type: post?.type ?? '',
        program: post?.program ?? '',
        content: post?.content ?? '',
        featured_guest: post?.featured_guest ?? '',
        excerpt: post?.excerpt ?? '',
        episode: post?.episode ?? '',
        platform: post?.platform ?? '',
        url: post?.url ?? '',
        trailer: post?.trailer ?? '',
        banner: post?.banner ?? '',
        thumbnail: post?.thumbnail ?? '',
        agency: post?.agency ?? '',
        date_published: post?.date_published ?? '',
        status: post?.status ?? '',
        tags: post?.tags ?? '',
        thumbnail_image: "" as File | string,
        trailer_file: "" as File | string,
        banner_image: "" as File | string,
        categories: post?.categories ?? [],
    });

    const toggleCategory = (category: CategoriesModel, checked: boolean) => {
        const current = item.categories;

        const updated = checked
            ? [...current, category]
            : current.filter(c => c.category_id !== category.category_id);

        handleArrayChange("categories", updated);
    };

    const isChecked = (id?: number) =>
        item.categories.some(c => c.category_id === id);

    const createPost = useCreatePost();

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("post_id", String(item.post_id));
        formData.append("slug", String(item.slug));
        formData.append("title", String(item.title));
        formData.append("type", String(item.type));
        formData.append("program", String(item.program));
        formData.append("content", String(item.content));
        formData.append("featured_guest", String(item.featured_guest));
        formData.append("excerpt", String(item.excerpt));
        formData.append("episode", String(item.episode));
        formData.append("platform", String(item.platform));
        formData.append("url", String(item.url));
        formData.append("trailer", String(item.trailer));
        formData.append("banner_image", item.banner_image);
        formData.append("thumbnail_image", item.thumbnail_image);
        formData.append("agency", String(item.agency));
        formData.append("date_published", String(item.date_published));
        formData.append("status", String(item.status));
        formData.append("tags", String(item.tags));
        formData.append("categories", JSON.stringify(item.categories.map(c => c.category_id)));

        createPost.mutate(formData, {
            onSuccess: () => {
                window.location.href = '/view-posts';
            },
            onError: (error) => {
                if (error.response?.data.errors) {
                    setErrors(error.response.data.errors);
                }
            },
        });
    }

    return (
        <>
            <Head title="Program Form" />
            <div className="flex flex-col flex-1 min-h-0  px-2 py-4">
                <div className="flex flex-1 flex-col gap-y-5 gap-x-5 rounded-xl px-6 py-3">
                    <div className='bg-teal-600/90 w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-300/50  overflow-auto py-6 px-8'>
                        <div className="md:cols-span-2 text-gray-50 poppins-bold md:text-lg text-sm flex items-center justify-start gap-2 md:col-span-3 ">
                            <ImFilePicture /> Post Management Form
                        </div>
                    </div>
                    <div className=" w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-400/50 bg-white  overflow-auto py-10 px-8">
                        <div className="flex items-center pb-4">
                            <span className="px-4 text-teal-600 poppins-bold text-[18px]  flex flex-row gap-2 items-center justify-center"><IoDocumentTextOutline /> Meta Section </span>
                        </div>
                        <div className="grid md:grid-cols-4  gap-6 text-[12px] ">
                            <div className="md:col-span-3 grid md:grid-cols-3  gap-4 border-r px-4">
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
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="program_type" className="text-gray-600 poppins-semibold text-[13px]">Program Type</Label>
                                    <Select
                                        value={String(item.program)}
                                        onValueChange={(value) => {
                                            setItem((prev) => ({ ...prev, program: value }))
                                            setErrors((prev) => ({ ...prev, program: '' }))
                                        }
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
                                    <InputError message={errors.program} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="type" className="text-gray-600 poppins-semibold text-[13px]">Type</Label>
                                    <Select
                                        value={String(item.type)}
                                        onValueChange={(value) => {
                                            setErrors((prev) => ({ ...prev, type: '' }))
                                            setItem((prev) => ({ ...prev, type: value }))
                                        }
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

                                    <InputError message={errors.type} />
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
                                    <InputError message={errors.agency} />
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
                                    <InputError message={errors.episode} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="featured_guest" className="text-gray-600 poppins-semibold text-[13px]">Featured Guest</Label>
                                    <Input
                                        id="featured_guest"
                                        type="text"
                                        name="featured_guest"
                                        required
                                        onChange={handleChange}
                                        value={String(item.featured_guest)}
                                        className="text-gray-700 border-gray-300"
                                    />
                                    <InputError message={errors.featured_guest} />
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
                                    <InputError message={errors.date_published} />
                                </div>
                                <div className="grid gap-2 col-span-3">
                                    <Label htmlFor="tags" className="text-gray-600 poppins-semibold">
                                        Tags
                                    </Label>

                                    <TagsInput
                                        value={item.tags}
                                        onChange={(val) =>
                                            setItem((prev) => ({
                                                ...prev,
                                                tags: val,
                                            }))
                                        }
                                        placeholder="Add tags..."
                                    />
                                    <InputError message={errors.tags} />
                                </div>

                                <div className="grid gap-2 col-span-3">
                                    <Label htmlFor="excerpt" className="text-gray-600 poppins-semibold">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        name="excerpt"
                                        required
                                        onChange={handleChange}
                                        value={String(item.excerpt)}
                                        className="text-gray-600 border-gray-300"
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>
                            </div>
                            <div className="px-4">
                                <Label
                                    htmlFor="categories"
                                    className="text-gray-600 poppins-semibold"
                                >
                                    Categories
                                </Label>
                                <div className="mt-2">
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <Tooltip key={category.category_id}>
                                                <TooltipTrigger asChild>
                                                    <div className="flex flex-row items-center gap-3 mb-1.5 hover:scale-102 duration-300">
                                                        <Checkbox
                                                            id={`category-${category.category_id}`}
                                                            checked={isChecked(category.category_id)}
                                                            onCheckedChange={(checked) =>
                                                                toggleCategory(category, Boolean(checked))
                                                            }
                                                        />
                                                        <span>{category.title}</span>
                                                    </div>
                                                </TooltipTrigger>

                                                <TooltipContent side="right">
                                                    <div className="flex flex-col">
                                                        <span className="poppins-semibold">{category.title}</span>
                                                        <p>{category.description}</p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))
                                    ) : (
                                        <p className="p-4 text-center">No Categories available</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-400/50 bg-white  overflow-auto py-10 px-8">
                        <div className="flex items-center pb-4">
                            <span className="px-4 text-teal-600 text-sm poppins-bold text-[18px] flex flex-row gap-2 items-center justify-center">  <MdPermMedia /> Media Section</span>
                        </div>
                        <div className="px-4 grid md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="thumbnail_image" className="text-gray-700 poppins-semibold">Thumbnail </Label>
                                <FileUpload
                                    type={2}
                                    url={item?.thumbnail ? `/storage/images/posts/thumbnails/${item.thumbnail}` : ''}
                                    id="thumbnail_image"
                                    name="thumbnail_image"
                                    accept="image/png,image/jpeg"
                                    text="Click to upload image"
                                    onChange={handleChange}
                                    className="text-gray-600 border-gray-300 shadow p-4 "
                                />
                                <InputError message={errors.thumbnail_image} />
                            </div>
                            <div className="md:col-span-3">
                                <Label htmlFor="banner_image" className="text-gray-700 poppins-semibold">Banner Image <span className="poppins-regular text-gray-600">(Aspect-Ratio 4:5)</span> </Label>
                                <FileUpload
                                    type={2}
                                    url={item?.banner ? `/storage/images/posts/banners/${item.banner}` : ''}
                                    id="banner_image"
                                    name="banner_image"
                                    accept="image/png,image/jpeg"
                                    text="Click to upload image"
                                    onChange={handleChange}
                                    className="text-gray-600 border-gray-300 shadow p-4 "
                                />
                                <InputError message={errors.banner_image} />
                            </div>
                            <div className="md:col-span-2 rounded-lg border border-gray-300 p-4  ">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <Label htmlFor="url" className="text-gray-600 poppins-semibold text-[13px]">Video Url</Label>
                                        <Input
                                            id="url"
                                            type="text"
                                            name="url"
                                            required
                                            onChange={handleChange}
                                            value={String(item.url)}
                                            className="text-gray-700 border-gray-300 "
                                        />
                                        <InputError message={errors.url} />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="platform" className="text-gray-600 poppins-semibold text-[13px]">Platform</Label>
                                        <Select
                                            value={String(item.platform)}
                                            onValueChange={(value) =>
                                                setItem((prev) => ({ ...prev, platform: value }))
                                            }
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Choose Platform" className="text-[12px]" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {platforms.map((platform) => (
                                                    <SelectItem
                                                        value={platform.value ?? ''} key={platform.code}
                                                    >
                                                        {platform.value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.url} />
                                    </div>
                                    <div className="md:col-span-2 ">
                                        <VideoEmbed url={item.url}
                                            platform={item.platform}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex flex-col justify-start transition-all duration-300 ease-in-out">
                                <Label htmlFor="trailer_file" className="text-gray-700 poppins-semibold">Trailer Video </Label>
                                <FileUpload
                                    type={1}
                                    url={item?.trailer ? `/storage/videos/posts_videos/trailer/${item.trailer}` : ''}
                                    id="trailer_file"
                                    name="trailer_file"
                                    accept="video/mp4,video/x-msvideo"
                                    text="Click to Upload Trailer"
                                    onChange={handleChange}
                                    className="text-gray-600 border-gray-300 shadow p-4  min-h-[315px]"
                                />
                                <InputError message={errors.trailer_file} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-between item-center  shadow-sm border rounded-lg border-gray-400/50 bg-white  overflow-auto py-10 px-8">
                        <div className="flex items-center pb-4">
                            <span className="px-4 text-teal-600 text-sm poppins-bold text-[18px] flex flex-row gap-2 items-center justify-center"><MdOutlineContentPaste /> Content Section </span>
                        </div>
                        <Label htmlFor="content" className="text-gray-600 poppins-semibold mb-2 px-4">Program Content</Label>
                        <div className="max-h-screen rounded-lg px-4">
                            <TextField
                                id="content"
                                name="content"
                                label="content"
                                value={String(item.content)}
                                onChange={handleChange}
                                className="text-gray-700"
                            />
                            <InputError message={errors.content} />
                        </div>
                        <div className="px-4 pt-4">
                            <Button className="bg-teal-600 w-fit poppins-bold"
                                onClick={handleSubmit}
                            > <Spinner className="mr-2" />
                                {item.post_id == 0 ? 'Add' : 'Update'} Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


PostForm.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default PostForm;
