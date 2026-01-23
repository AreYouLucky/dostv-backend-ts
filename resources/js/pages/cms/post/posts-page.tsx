import { ReactNode } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import PaginatedSearchTable from '@/components/custom/data-table-server';
import { IoAddCircle } from "react-icons/io5";
import { useFetchPosts, useDeletePost, useUpdatePostStatus, useTogglePostFeatured, useRestorePost } from "./partials/post-hooks";
import ImageLoader from "@/components/custom/image-loader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { postStatus } from "@/types/default";
import { purifyDom } from "@/hooks/use-essential-functions";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaTrash, FaEdit, FaEye, FaPhotoVideo } from "react-icons/fa";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import BottomPopover from "@/components/custom/button-popover";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { trimText } from "@/hooks/use-essential-functions";
import { useHandleChange } from "@/hooks/use-handle-change";
import { PostModel, ProgramsModel } from "@/types/models";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import ViewPostDialog from "@/components/custom/view-post-dialog";
import { TiStarFullOutline } from "react-icons/ti";
import { MdOutlineRestore } from "react-icons/md";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/view-posts' },
];


function Posts() {
    const { props } = usePage<{ programs?: ProgramsModel[] }>();
    const programs = props.programs ?? [];
    const [page, setPage] = useState(1);
    const [post, setPost] = useState<PostModel>();
    const [showPostDialog, setShowPostDialog] = useState(false);
    const [loadingSlug, setLoadingSlug] = useState('');
    const { item, setItem } = useHandleChange({ title: '', program: '', type: '', status: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [code, setCode] = useState('');

    const onFilterChange = () => {
        setPage(1);
    };
    const debouncedTitle = useDebounce(item.title, 1000);
    const queryFilters = {
        ...item,
        title: debouncedTitle,
    };
    const { data, isFetching, refetch } = useFetchPosts(page, queryFilters);
    const handleRefresh = () => {
        setPage(1);
        setItem({ title: '', program: '', type: '', status: '' });
        refetch();
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        const parsed = new URL(url, window.location.origin);
        const pageParam = parsed.searchParams.get("page");
        const newPage = Number(pageParam || 1);
        if (!Number.isNaN(newPage)) { setPage(newPage); }
    };

    const deletePost = useDeletePost();
    const showDeleteDialog = (code: string) => {
        setCode(code);
        setDeleteDialog(true);
    }
    const handleDelete = () => {
        deletePost.mutate(
            { code: code },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setDeleteDialog(false)
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        );
    }

    const updatePostStatus = useUpdatePostStatus();
    const updatePostStatusFn = (value: string, code: string) => {
        setLoadingSlug(code);
        const formData = new FormData();
        formData.append('status', value);
        formData.append('code', code);
        console.log(value, code)
        updatePostStatus.mutate(
            { payload: formData },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                    setLoadingSlug('');
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        );
    }

    const viewPostDialog = (post: PostModel) => {
        setPost(post);
        setShowPostDialog(true);
    }

    const togglePostFeatured = useTogglePostFeatured();
    const toggleFeatured = (slug: string) => {
        togglePostFeatured.mutate(
            { slug: slug },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        )
    }

    const restorePost = useRestorePost();
    const restorePostFn = (slug: string) => {
        restorePost.mutate(
            { slug: slug },
            {
                onSuccess: (res) => {
                    toast.success(res.status);
                },
                onError: (err) => {
                    if (err.message)
                        toast.error(err.message);
                }
            }
        )
    }

    return (
        <>
            <Head title="Posts" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-700 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <FaPhotoVideo />Posts Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/posts/create'}> <IoAddCircle /> Add Post</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center shadow-md border rounded-lg border-gray-400/50 overflow-x-hidden overflow-y-auto bg-white flex-col p-6'>
                        <div className="flex w-full relative">
                            <div className=" relative items-center flex flex-row gap-0.5 mb-3">
                                <Search className="absolute left-2.5 top-3 text-teal-500" size={16} />
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Search Title"
                                    value={item.title}
                                    onChange={(e) => { setItem(prev => ({ ...prev, title: e.target.value })); onFilterChange() }}
                                    className="min-w-[250px] h-10 border-teal-600 shadow-none ps-8"
                                />
                                <BottomPopover width="min-w-[500px]">
                                    <div className="grid md:grid-cols-2 gap-4 p-4">
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="program_type" className="text-gray-600 poppins-semibold text-[11px]">Program</Label>
                                            <Select
                                                value={String(item.program)}
                                                onValueChange={(value) => {
                                                    setItem((prev) => ({ ...prev, program: value }))
                                                    onFilterChange()
                                                }}
                                            >
                                                <SelectTrigger className="border-gray-300">
                                                    <SelectValue placeholder="" className="text-[11px]" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {programs.map((program) => (
                                                        <Tooltip key={program.program_id} >
                                                            <TooltipTrigger asChild>
                                                                <SelectItem
                                                                    value={String(program.program_id)}
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
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="type" className="text-gray-600 poppins-semibold text-[11px]">Type</Label>
                                            <Select
                                                value={String(item.type)}
                                                onValueChange={(value) => {
                                                    setItem((prev) => ({ ...prev, type: value }))
                                                    onFilterChange()
                                                }}

                                            >
                                                <SelectTrigger className="border-gray-300">
                                                    <SelectValue placeholder="" className="text-[9px]" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="video">Video</SelectItem>
                                                    <SelectItem value="blog">Blog</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="status" className="text-gray-600 poppins-semibold text-[11px]">Status</Label>
                                            <Select
                                                value={String(item.status)}
                                                onValueChange={(value) => {
                                                    setItem((prev) => ({ ...prev, status: value }))
                                                    onFilterChange()
                                                }
                                                }
                                            >
                                                <SelectTrigger className="border-gray-300">
                                                    <SelectValue placeholder="" className="text-[12px]" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {postStatus.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </BottomPopover>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleRefresh}
                                            className=" bg-teal-600 text-gray-50"
                                            type="button"
                                            disabled={isFetching}
                                        >
                                            {isFetching ? <Spinner className="mr-2" /> : <IoRefreshCircleOutline />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" >
                                        Refresh
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <PaginatedSearchTable<PostModel>
                                items={data?.data ?? []}
                                headers={[
                                    { name: "Title", position: "center" },
                                    { name: "Thumbnail", position: "center" },
                                    { name: "Description", position: "center" },
                                    { name: "Type", position: "center" },
                                    { name: "Agency", position: "center" },
                                    { name: "Status", position: "center" },
                                    { name: "Actions", position: "center" },
                                ]}
                                renderRow={(post) => (
                                    <tr key={post.post_id} className="text-gray-800  border-b p-2 ">
                                        <td className="px-6 py-3 text-start poppins-semibold text-teal-800 text-[11.4px]">{post.title}</td>
                                        <td >
                                            <div className='flex justify-center items-center relative h-full hover:scale-110 duration-300'>
                                                <ImageLoader
                                                    src={`/storage/images/post_images/thumbnails/${post.thumbnail}`}
                                                    alt="Program Banner"
                                                    className="h-12 w-auto my-1 rounded"
                                                />

                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-[11.2px] text-justify wrap-break-words">{post.description !== '' ? trimText(String(post.description), 180) : 'Not Set'}</td>
                                        <td className="px-6 py-3 text-center">
                                            {post.type}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {post.agency}
                                        </td>
                                        <td className="px-6 py-3 text-center text-xs">
                                            <Select
                                                value={post.status as string}
                                                onValueChange={(value) => updatePostStatusFn(value, post.slug as string)}
                                            >
                                                <SelectTrigger className="px-2 py-2 h-fit text-[10px] border-gray-100   shadow-2xs">
                                                    {loadingSlug === post.slug ? (
                                                        <span className="animate-pulse text-gray-400">Updating…</span>
                                                    ) : (
                                                        <SelectValue placeholder="Select Post Status" className="text-[10px] text-white" />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent >

                                                    {item.status === 'trashed' ? <SelectItem value={'trashed'}>
                                                        trashed
                                                    </SelectItem> : <>
                                                        <SelectItem value={'published'}>
                                                            published
                                                        </SelectItem>
                                                        <SelectItem value={'drafted'}>
                                                            drafted
                                                        </SelectItem>
                                                    </>}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        {item.status === 'trashed' ?
                                            <td className="px-6 py-3 text-center">
                                                <Button className="flex text-xs items-center gap-1 flex-row bg-teal-700" onClick={() => restorePostFn(post.slug as string)} ><MdOutlineRestore/>Restore</Button>
                                            </td> :
                                            <td className="px-6 py-3 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative items-center justify-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' onClick={() => viewPostDialog(post)} >
                                                            <FaEye className='text-[#0096cc] ' />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View Post</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => toggleFeatured(post.slug as string)}>
                                                            <TiStarFullOutline className={post.is_featured == 1 ? 'text-yellow-500' : 'text-gray-400'} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{post.is_featured == 1 ? 'Remove Featured' : 'Featured Post'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip></Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg'
                                                            href={`/posts/${post.slug}/edit`} >
                                                            <FaEdit className='text-teal-600 ' />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Edit Post</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0' onClick={() => showDeleteDialog(post.slug as string)}>
                                                            <FaTrash className='text-red-500' />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete Post</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                        }
                                    </tr>
                                )}
                                itemsPerPage={data?.per_page ?? 10}
                                currentPage={data?.current_page}
                                nextPageUrl={data?.next_page_url ?? null}
                                prevPageUrl={data?.prev_page_url ?? null}
                                total={data?.total ?? 0}
                                onPageChange={handlePageChange}
                                isLoading={isFetching}
                                searchPlaceholder="Search posts..."
                            />
                        </div>

                    </div>
                </div>
            </div >
            <ConfirmationDialog show={deleteDialog} onClose={() => setDeleteDialog(false)} type={2} onConfirm={handleDelete} message={'Are you sure you want to delete this post?'} />
            <ViewPostDialog show={showPostDialog} onClose={() => setShowPostDialog(false)} post={post} />
        </>
    )
}

Posts.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Posts;
