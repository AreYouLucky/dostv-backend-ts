import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Post', href: '/view-posts' },
    { title: 'Form', href: '/post-form' },
];


function PostForm() {
    return (
        <>
            <Head title="Program Form" />

        </>
    )
}


PostForm.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default PostForm;
