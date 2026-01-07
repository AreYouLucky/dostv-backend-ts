import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { ImFilePicture } from "react-icons/im";
import { useHandleChange } from "@/hooks/use-handle-change";
import { Head, usePage } from "@inertiajs/react";
import { PostModel } from "@/types/models";
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Post', href: '/view-posts' },
    { title: 'Post Form', href: '/post-form' },
];


function PostForm() {
    const { url: pageUrl } = usePage();
    const { props } = usePage<{ post?: PostModel | null }>();

    const post = props.post ?? null;

    const { item, errors, setItem, handleChange, setErrors } = useHandleChange({
        post_id: post?.post_id ?? 0,
        slug: post?.slug ?? '',
        title: post?.title ?? '',
        type: post?.type ?? '',
        program: post?.program ?? '',
        description: post?.description ?? '',
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
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-400/50 bg-white/50 overflow-auto p-8'>
                        <div className="md:cols-span-2 text-teal-700 poppins-bold md:text-lg text-sm flex items-center justify-start gap-5 md:col-span-3 mb-1 pb-2">
                            <ImFilePicture /> Post Management Form
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1 border-t border-teal-600/50"></div>
                            <span className="px-4 text-teal-600 text-sm poppins-semibold">Meta Section</span>
                            <div className="flex-1 border-t border-teal-600/50"></div>
                        </div>
                        <div className="grid md:grid-cols-3">
                            <div>

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
