import GuestLayout from "@/layouts/guest-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Spinner } from "@/components/ui/spinner";
import { useHandleChange } from "@/hooks/use-handle-change";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { useFormSubmit } from "@/hooks/auth-form-submission";

function LoginPage() {
    const { item, errors, handleChange, setErrors } = useHandleChange({
        email: "",
        password: "",
    });
    const { handleSubmit, processing } = useFormSubmit({
        url: "/request-login",
    });
    const [showPassword, setShowPassword] = useState(false);


    return (
        <GuestLayout title="Login">
            <form onSubmit={(e) => handleSubmit(e, item, setErrors)} className="grid gap-6 ">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-50">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="email@example.com"
                        onChange={handleChange}
                        value={String(item.email)}
                        className="text-gray-500 bg-gray-50"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password" className="text-gray-50">Password</Label>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={String(item.password)}
                        className="text-gray-500 bg-gray-50"

                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="showPassword"
                        checked={Boolean(showPassword)}
                        onCheckedChange={(checked) => setShowPassword(Boolean(checked))}
                    />
                    <Label htmlFor="remember" className="text-gray-50">Show Password</Label>
                </div>

                <Button type="submit" className="mt-2 w-full bg-teal-600 text-white hover:bg-gray-600" disabled={processing}>
                    {processing && <Spinner className="mr-2" />}
                    Log in
                </Button>
            </form>
            <ToastContainer />
        </GuestLayout>
    );
}

export default LoginPage;
