import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ContentCount from './partials/content-count';
import CategoryPieChart from './partials/category-pie-chart';
import { MdDashboard } from "react-icons/md";
import RecentPost from './partials/recent-post';
import TopYouTube from './partials/top-yt';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

function Dashboard() {


    return (
        <>
            <Head title="Dashboard" />
            <div className='py-4 px-8 flex flex-col gap-4 mb-8'>
                <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm rounded-lg bg-teal-700'>
                    <div className="text-white poppins-bold md:text-base text-sm flex items-center gap-2">
                        <MdDashboard /> System's Dashboard
                    </div>
                </div>
                <div className="grid md:grid-cols-5 gap-4">
                    <div className='md:col-span-2'>
                        <ContentCount />
                    </div>
                    <div className='md:col-span-3 rounded-2xl bg-white/80 min-h-40  shadow-md hover:shadow-lg transition-shadow duration-200'>
                        <CategoryPieChart />
                    </div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                    <div className='md:col-span-2'>
                        <RecentPost />
                    </div>
                    <div className='md:col-span-1'>
                        <TopYouTube />
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Dashboard;
