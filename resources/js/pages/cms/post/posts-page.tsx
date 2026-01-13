import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import PaginatedSearchTable from '@/components/custom/data-table-server';
import { IoAddCircle } from "react-icons/io5";
import { useFetchPosts, useSearchPosts } from "./partials/post-hooks";
import ImageLoader from "@/components/custom/image-loader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { postStatus } from "@/types/default";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaTrash, FaEdit, FaEye,FaPhotoVideo  } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { trimText } from "@/hooks/use-essential-functions";
import { useHandleChange } from "@/hooks/use-handle-change";
import { PostModel } from "@/types/models";



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Posts', href: '/view-posts' },
];


function Posts() {
    const [page, setPage] = useState(1);
    const { item, handleChange } = useHandleChange({ title: '', program: '' });
    const {
        data: postsData,
        isLoading: isPostsLoading,
        isFetching: isPostsFetching,
        error,
    } = useFetchPosts(page);

    const searchPosts = useSearchPosts();

    const handleSearch = () => {
        setPage(1);
        searchPosts.mutate({
            title: item.title ?? '',
            program: item.program ?? '',
        });
    };


    const hasSearch = searchPosts.isSuccess;

    const posts = hasSearch
        ? searchPosts.data?.data ?? []
        : postsData?.data ?? [];

    const data = hasSearch ? searchPosts.data : postsData;

    const isLoading =
        isPostsLoading ||
        isPostsFetching ||
        searchPosts.isPending;


    const handlePageChange = (url: string | null) => {
        if (!url) return;

        const parsed = new URL(url, window.location.origin);
        const pageParam = parsed.searchParams.get("page");
        const newPage = Number(pageParam || 1);

        if (!Number.isNaN(newPage)) {
            setPage(newPage);
        }
    };




    const updatePostStatus = () => {

    }

    if (error) return alert('An error has occurred: ' + error.message);

    return (
        <>
            <Head title="Posts" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-600 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <FaPhotoVideo/>Posts Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/posts/create'}> <IoAddCircle /> Add Post</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center shadow-md border rounded-lg border-gray-400/50 overflow-x-hidden overflow-y-auto bg-white flex-col p-6'>
                        <div className="flex w-full relative">
                            <div className=" relative items-center">
                                <Search className="absolute left-2.5 top-3 text-teal-500" size={16} />
                                <Input
                                    placeholder="Search Title"
                                    value={item.title}
                                    onChange={handleChange}
                                    className="min-w-[250px] h-10 border-teal-600 shadow-none ps-8"
                                />
                                <button onClick={handleSearch}></button>
                            </div>
                        </div>
                        <div>
                            <PaginatedSearchTable<PostModel>
                                items={posts}
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
                                    <tr key={post.post_id} className="text-gray-800 hover:scale-102 duration-300 border-b p-2 ">
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
                                                onValueChange={updatePostStatus}
                                            >
                                                <SelectTrigger className="px-2 py-0 text-xs border-gray-100 shadow-2xs">
                                                    <SelectValue placeholder="Select Post Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {postStatus.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-6 py-3 text-center poppins-bold text-xl text-teal-800 gap-1 flex relative">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' >
                                                        <FaEye className='text-[#0096cc] ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Post</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg' >
                                                        <FaEdit className='text-teal-600 ' />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Program</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0'>
                                                        <FaTrash className='text-red-500' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Program</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                )}
                                itemsPerPage={data?.per_page ?? 10}
                                currentPage={data?.current_page}
                                nextPageUrl={data?.next_page_url ?? null}
                                prevPageUrl={data?.prev_page_url ?? null}
                                total={data?.total ?? 0}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                                searchPlaceholder="Search posts..."
                            />
                        </div>

                    </div>
                </div>
            </div >

        </>
    )
}

Posts.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Posts;
