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
import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { trimText } from "@/hooks/use-essential-functions";
import { useHandleChange } from "@/hooks/use-handle-change";
import { PostsModel } from "@/types/models";



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
        error: postsError,
    } = useFetchPosts(page);

    const {
        data: searchData,
        isLoading: isSearchLoading,
        isFetching: isSearchFetching,
        error: searchError,
    } = useSearchPosts(item.title, item.program);

    const hasSearch = !!item.title || !!item.program;

    const posts = hasSearch
        ? searchData?.data ?? []
        : postsData?.data ?? [];
    const data = hasSearch ? searchData : postsData;

    const isLoading = hasSearch ? isSearchLoading : isPostsLoading;
    const isFetching = hasSearch ? isSearchFetching : isPostsFetching;
    const error = hasSearch ? searchError : postsError;


    const handlePageChange = (url: string | null) => {
        if (!url) return;
        const parsed = new URL(url, window.location.origin);
        const pageParam = parsed.searchParams.get("page");
        const newPage = Number(pageParam || 1);
        if (!Number.isNaN(newPage)) {
            setPage(newPage);
        }
    };

    if (error) return alert('An error has occurred: ' + error.message);

    return (
        <>
            <Head title="Categories" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white/50'>
                        <div className="text-teal-700 poppins-bold md:text-lg text-sm flex items-center gap-2">
                            Posts Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Link className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]' href={'/program-form'}> <IoAddCircle /> Add Posts</Link>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white/50 flex-col'>
                        <div className="flex w-full px-5 pt-5 relative">
                            <div className=" relative items-center">
                                <Search className="absolute left-2.5 top-3 text-teal-500" size={16} />
                                <Input
                                    placeholder="Search Title"
                                    value={item.title}
                                    onChange={handleChange}
                                    className="min-w-[250px] h-10 border-teal-600 shadow-none ps-8"
                                />
                            </div>
                        </div>
                        <div>
                            <PaginatedSearchTable<PostsModel>
                                items={posts}
                                headers={[
                                    { name: "Title", position: "center" },
                                    { name: "Thumbnail", position: "center" },
                                    { name: "Description", position: "center" },
                                    { name: "Type", position: "center" },
                                    { name: "Agency", position: "center" },
                                    { name: "Actions", position: "center" },
                                ]}
                                renderRow={(post) => (
                                    <tr key={post.post_id} className="text-gray-800">
                                        <td className="px-6 py-1.5 text-start poppins-semibold text-teal-800 text-[11.4px]">{post.title}</td>
                                        <td >
                                            <div className='flex justify-center items-center relative h-full hover:scale-110 duration-300'>
                                                <ImageLoader
                                                    src={`/storage/images/program_images/thumbnails/${post.thumbnail}`}
                                                    alt="Program Banner"
                                                    className="h-12 w-auto my-1 rounded"
                                                />

                                            </div>
                                        </td>
                                        <td className="px-6 py-1.5 text-[11.2px] text-justify">{post.description !== '' ? trimText(String(post.description), 255) : 'Not Set'}</td>
                                        <td className="px-6 py-1.5 text-center">
                                            {post.type}
                                        </td>
                                        <td className="px-6 py-1.5 text-center">
                                            {post.agency}
                                        </td>
                                    </tr>
                                )}
                                // Important: use server-side pagination props from Laravel
                                itemsPerPage={data?.per_page ?? 10}
                                currentPage={data?.current_page}
                                nextPageUrl={data?.next_page_url ?? null}
                                prevPageUrl={data?.prev_page_url ?? null}
                                total={data?.total ?? 0}
                                onPageChange={handlePageChange}
                                isLoading={isLoading || isFetching}
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
