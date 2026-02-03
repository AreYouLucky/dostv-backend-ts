import { ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import PaginatedSearchTable from '@/components/custom/data-table';
import { Head } from "@inertiajs/react";
import { FaHouseUser } from "react-icons/fa";
import { type User } from "@/types";
import { useFetchUsers, useDeleteUser } from "./partials/user-hooks";
import { IoAddCircle } from "react-icons/io5";
import UserForm from "./partials/user-form";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { FaTrash, FaEdit } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { MdOutlineLockReset } from "react-icons/md";
import ConfirmationDialog from "@/components/custom/confirmation-dialog";
import PasswordForm from "./partials/password-form";


import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Account Management', href: '/users-management' },
];
function UsersPage() {
    const { data, refetch, isFetching } = useFetchUsers();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [user, setUser] = useState<User>({
        user_id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        avatar: '',
    });
    const getInitials = useInitials();
    const handleUpdateForm = (data: User) => {
        setUser(data);
        setShowForm(true)
    }

    const deleteUser = useDeleteUser();
    const handleDeleteForm = () => {
        deleteUser.mutate({ code: id }, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                refetch();
                toast.success("Account deleted successfully!");
            },
        });
    }
    const changePassword = (id: number) => {
        setId(id);
        setShowPasswordForm(true);
    }
    return (
        <>
            <Head title="User Management" />
            <div className="flex flex-col flex-1 min-h-0  ">
                <div className="flex flex-1 flex-col gap-y-3 gap-x-5 rounded-xl px-6 py-5">
                    <div className='w-full flex justify-between item-center px-6 py-4 shadow-sm border rounded-lg border-gray-400/50 bg-white'>
                        <div className="text-teal-700 poppins-bold md:text-base text-sm flex items-center gap-2">
                            <FaHouseUser />
                            Account Management Section
                        </div>
                        <div className="text-gray-500 poppins-bold text-lg">
                            <Button onClick={() => setShowForm(true)} className='bg-teal-600 text-gray-50 inline-flex  h-9 px-4 py-2 has-[>svg]:px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow]'> <IoAddCircle /> Add Account</Button>
                        </div>
                    </div>
                    <div className='w-full flex justify-between item-center  shadow-md border rounded-lg border-gray-400/50 overflow-auto p-2 bg-white'>
                        <PaginatedSearchTable<User>
                            items={data ?? []}
                            headers={[
                                { name: "Name", position: "center" },
                                { name: "Email", position: "center" },
                                { name: "Role", position: "center" },
                                { name: "Actions", position: "center" },
                            ]}
                            searchBy={(item) => `${item.email} ${item.name} ${item.avatar}`}
                            renderRow={(r) => (
                                <tr key={r.user_id} className="border-b  duration-300 hover:scale-101 cursor-pointer">
                                    <td className="px-8 py-1.5 flex justify-center items-center gap-4 poppins-semibold text-teal-700">
                                        <Avatar className="h-10 w-10 border-3 border-teal-700">
                                            <AvatarImage src={r.avatar && `/storage/${r.avatar}`} alt={r.name} />
                                            <AvatarFallback className="rounded-full bg-neutral-200 text-black inter-bold text-xl">
                                                {getInitials(r.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {r.name}
                                    </td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px]  ">{r.email}</td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[12px] uppercase ">{r.role}</td>
                                    <td className="px-6 py-1.5 text-center text-gray-800 text-[13px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    className='bg-transparent shadow-none hover:bg-teal-100 px-2 rounded-lg py-2 text-lg'
                                                    onClick={() => handleUpdateForm(r)}>
                                                    <FaEdit className='text-teal-600 ' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit User</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0'
                                                    onClick={() => changePassword(r.user_id as number)}>
                                                    <MdOutlineLockReset className='text-yellow-500' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>ChangePassword</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className='bg-transparent shadow-none hover:bg-teal-100 px-0'
                                                    onClick={() => { setId(r.user_id as number); setShowDeleteDialog(true) }}>
                                                    <FaTrash className='text-red-500' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete User</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </td>


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
            <UserForm
                onClose={() => { setShowForm(false) }}
                show={showForm}
                data={user} />
            <ConfirmationDialog show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} type={2} onConfirm={handleDeleteForm} message={'Are you sure you want to delete this account?'} />
            <PasswordForm show={showPasswordForm} onClose={() => setShowPasswordForm(false)} id={id} />


        </>
    );
}

UsersPage.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default UsersPage;
