import GuestLayout from "@/layouts/guest-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Spinner } from "@/components/ui/spinner";
import { useHandleChange } from "@/hooks/use-handle-change";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function LoginPage() {
    const { data, errors, handleChange, setErrors } = useHandleChange({
        email: "",
        password: "",
    });
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true)


        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        axios.post('/user-login', formData).then(
            (res) => {
                setProcessing(true)
                toast.error(res.data.status, {
                    theme: 'dark',
                    position: 'bottom-right'
                });
                window.location.href = '/dashboard';
            }
        ).catch(
            err => {
                setErrors(err.response.data.errors)
                toast.error(err.response.data.errors, {
                    theme: 'dark',
                    position: 'bottom-right'
                });
                if (err.response.data.status) {
                    setErrors((prev) => ({ ...prev, email: err.response.data.logs }));
                }
            }
        )

    };

    return (
        <GuestLayout title="Login Page">
            <form onSubmit={handleSubmit} className="grid gap-6 ">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="email@example.com"
                        onChange={handleChange}
                        value={String(data.email)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={String(data.password)}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="showPassword"
                        checked={Boolean(showPassword)}
                        onCheckedChange={(checked) => setShowPassword(Boolean(checked))}
                    />
                    <Label htmlFor="remember">Show Password</Label>
                </div>

                <Button onClick={handleSubmit} className="mt-2 w-full bg-teal-600 text-white hover:bg-gray-600" disabled={processing}>
                    {processing && <Spinner className="mr-2" />}
                    Log in
                </Button>
            </form>
            <ToastContainer />
        </GuestLayout>
    );
}

export default LoginPage;
