import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import PaginatedSearchTable from '@/components/custom/data-table';
import { Head, usePage } from "@inertiajs/react";
import BottomPopover from "@/components/custom/button-popover";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useFetchActivities } from "./partials/activities-hooks";
import { useHandleChange } from "@/hooks/use-handle-change";
import { UserActionModel } from "@/types/models";
import { convertLonghDate } from "@/hooks/use-essential-functions";
import { type User } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FiSearch, FiActivity } from "react-icons/fi";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ExcelJS from 'exceljs';




const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Activities', href: '/users-management' },
];
function ActivitiesPage() {
    const { props } = usePage<{ users?: User[] }>();
    const users = props.users ?? [];

    const { item, handleChange, setItem } = useHandleChange({
        from: '',
        to: '',
        user: 0,
    });
    const { data, refetch, isFetching } = useFetchActivities(item);
    const getInitials = useInitials();
    const handleRefresh = () => {
        setItem({ from: '', to: '', user: 0 });
        refetch();
    };



    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Activity", key: "activity", width: 30 },
            { header: "Date", key: "date", width: 25 },
        ];

        data?.forEach((r) => {
            worksheet.addRow({
                name: r.name,
                activity: r.action,
                date: convertLonghDate(r.created_at as string),
            });
        });

        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users-activities.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-700 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <FiActivity />
                            System  Activities
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white'>
                        <div className="flex  pt-4 pb-2 px-6 justify-between">
                            <div className="flex flex-row gap-x-1 items-center">
                                <div className=" min-w-60 ">
                                    <Select
                                        value={item.user !== null && item.user !== undefined ? String(item.user) : undefined}
                                        onValueChange={(value) => {
                                            setItem((prev) => ({
                                                ...prev,
                                                user: Number(value),
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="border-gray-500 flex  gap-2">
                                            <div className="flex flex-row gap-2 item-center">
                                                <FiSearch className="text-gray-400 text-sm" />
                                                <SelectValue placeholder="Select User" />
                                            </div>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value={String(0)}>All</SelectItem>
                                            {users.map((user) => (
                                                <SelectItem key={user.user_id} value={String(user.user_id)}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <BottomPopover>
                                        <div className="flex flex-col gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="from" className="text-gray-600 poppins-semibold text-[13px]">Start Date</Label>
                                                <Input
                                                    id="from"
                                                    type="date"
                                                    name="from"
                                                    required
                                                    onChange={handleChange}
                                                    value={String(item.from)}
                                                    className="text-gray-700 border-gray-300"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="to" className="text-gray-600 poppins-semibold text-[13px]">End Date</Label>
                                                <Input
                                                    id="to"
                                                    type="date"
                                                    name="to"
                                                    required
                                                    onChange={handleChange}
                                                    value={String(item.to)}
                                                    className="text-gray-700 border-gray-300"
                                                />
                                            </div>

                                        </div>
                                    </BottomPopover>
                                </div>
                                <div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={handleRefresh}
                                                className=" bg-teal-600 text-gray-50"
                                                type="button"
                                                disabled={isFetching}
                                            >
                                                {isFetching ? <Spinner className="" /> : <IoRefreshCircleOutline />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" >
                                            Refresh
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <div>
                                <Button className="bg-teal-700" onClick={exportToExcel}>
                                    Download
                                </Button>
                            </div>
                        </div>
                        <PaginatedSearchTable<UserActionModel>
                            hasSearch={false}
                            items={data ?? []}
                            headers={[
                                { name: "Name", position: "center" },
                                { name: "Activity", position: "center" },
                                { name: "Date", position: "center" },
                            ]}
                            searchBy={(item) => `${item.email} ${item.name} ${item.avatar}`}
                            renderRow={(r) => (
                                <tr key={r.user_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">
                                    <td className="px-10 py-1.5 flex justify-start items-center gap-4 poppins-semibold text-teal-700">
                                        <Avatar className="h-10 w-10 border-3 border-teal-700">
                                            <AvatarImage src={r.avatar && `/storage/${r.avatar}`} alt={r.name} />
                                            <AvatarFallback className="rounded-full bg-neutral-200 text-black inter-bold text-xl">
                                                {getInitials(r.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {r.name}
                                    </td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px]  ">{r.action}</td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px] uppercase ">{convertLonghDate(r.created_at as string)}</td>
                                </tr>
                            )}
                            itemsPerPage={10}
                            searchPlaceholder="Search Account..."
                            onRefresh={() => refetch()}
                            isLoading={isFetching}
                        />
                    </div>
                </div>
            </div >
        </>
    );
}

ActivitiesPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ActivitiesPage;
