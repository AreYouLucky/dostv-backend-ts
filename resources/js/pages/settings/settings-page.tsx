import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { IoIosSettings } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { useHandleChange } from "@/hooks/use-handle-change";
import { FaRegSave } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import ConfirmationDialog from '@/components/custom/confirmation-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/Settings' },
];

function SettingsPage() {
    const { auth } = usePage<SharedData>().props;
    const user: User = auth.user;
    const { item, errors, handleChange, setItem, setErrors } = useHandleChange({
        email: user.email ?? '',
        name: user.name ?? '',
        password: '',
        password_confirmation: '',
    });
    const getInitials = useInitials();
    const [successDialog, setSuccessDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>(user);
    const [tab, setTab] = useState<'profile' | 'password'>('profile');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const updatePassword = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('password', item.password);
        formData.append('password_confirmation', item.password_confirmation);
        axios.post('/update-password', formData).then(
            (res) => {
                setItem((prev) => ({ ...prev, password: '', password_confirmation: '' }))
                setMessage(res.data.status)
                setSuccessDialog(true)
                setLoading(false)
            }
        ).catch((err)=>{
            setErrors(err.response.data.errors)
            setLoading(false)
        })
    }
    const updateProfile = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('email', item.email);
        axios.post('/update-profile',formData).then(
            (res) => {
                setMessage(res.data.status)
                setCurrentUser({...currentUser, name: item.name, email: item.email})
                setSuccessDialog(true)
                setLoading(false)
            }
        ).catch((err)=>{
            setErrors(err.response.data.errors)
            setLoading(false)
        })
    }


    return (
        <>
            <Head title="Settings" />

            <div className="py-6 px-8 flex flex-col gap-4">
                <div className="w-full flex items-center justify-between px-6 py-4 rounded-lg shadow-sm bg-teal-700">
                    <h1 className="text-white poppins-bold flex items-center gap-2 text-lg md:text-xl">
                        <IoIosSettings /> Profile Settings
                    </h1>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-linear-to-br from-teal-900 to-teal-600 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex justify-center items-center p-6 gap-4">
                        <Avatar className="h-28 w-28">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-full bg-neutral-200 text-black inter-bold text-4xl">
                                {getInitials(currentUser.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center text-white">
                            <p className="text-xl font-semibold inter-semibold truncate uppercase">{currentUser.name}</p>
                            <p className="text-gray-200 text-sm truncate">{currentUser.email}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-2xl shadow-md hover:shadow-lg py-10 px-16 flex flex-col">
                        <div className="flex border-b mb-6">
                            <button
                                onClick={() => setTab('profile')}
                                className={`px-4 py-2 -mb-px font-semibold border-b-2 transition cursor-pointer ${tab === 'profile'
                                    ? 'border-teal-700 text-teal-700'
                                    : 'border-transparent text-gray-500 hover:text-teal-600'
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setTab('password')}
                                className={`px-4 py-2 -mb-px font-semibold border-b-2 transition cursor-pointer ${tab === 'password'
                                    ? 'border-teal-700 text-teal-700'
                                    : 'border-transparent text-gray-500 hover:text-teal-600'
                                    }`}
                            >
                                Password
                            </button>
                        </div>

                        {tab === 'profile' && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={String(item.name ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.name as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={String(item.email ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.email as string} />
                                </div>
                                <Button className="self-start mt-2 bg-teal-600 py-2" onClick={updateProfile} disabled={loading}><FaRegSave /> Save Profile</Button>
                            </div>
                        )}

                        {tab === 'password' && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="password" className="text-gray-700">New Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={String(item.password ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.password as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="password_confirmation" className="text-gray-700">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={String(item.password_confirmation ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.password_confirmation as string} />
                                </div>
                                <Button className="self-start mt-2 md:col-span-2 bg-teal-600 py-2" onClick={updatePassword} disabled={loading}><FaRegSave /> Save Password</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />

        </>
    );
}

SettingsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default SettingsPage;
