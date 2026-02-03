import { memo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { useHandleChange } from "@/hooks/use-handle-change";
import { Input } from "@/components/ui/input";
import { useChangeUserPassword } from "./user-hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { IoIosSave } from "react-icons/io";

type PasswordFormProps = {
    show: boolean;
    onClose: () => void;
    id: number;
};

function PasswordForm(props: PasswordFormProps) {

    const { item, errors, handleChange, setErrors } = useHandleChange({
        password: "",
        password_confirmation: "",

    });

    const changeUserPassword = useChangeUserPassword();
    const changeUserPasswordFn = () => {
        const formData = new FormData();
        formData.append("password", item.password);
        formData.append("password_confirmation", item.password_confirmation);

        changeUserPassword.mutate({ id: props.id ?? 0, payload:formData }, {
            onSuccess: () => {
                props.onClose();
                toast.success("Password Successfully Updated!");
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                    toast.error("Check fields for errors!");
                }
            },
        });
    }




    return (
        <>
            <Dialog
                open={props.show}
                onOpenChange={props.onClose}
            >
                <DialogContent className="text-gray-600 p-10 bg-white min-w-[90vw] md:min-w-100">
                    <DialogHeader>
                        <DialogTitle className="text-teal-600 poppins-bold text-center sr-only">
                            User Form
                        </DialogTitle>
                        <DialogDescription className="text-xs text-center ">
                            <span className="sr-only">Fill all the fields to proceed</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6">
                        <div className="gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out">
                            <Label
                                htmlFor="password"
                                className="text-gray-700 poppins-semibold"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                onChange={handleChange}
                                value={String(item.password ?? "")}
                                className="text-gray-700 border-gray-300"
                            />
                            <InputError message={errors.password as string} />
                        </div>

                        <div className="gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-gray-700 poppins-semibold"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                required
                                onChange={handleChange}
                                value={String(item.password_confirmation ?? "")}
                                className="text-gray-700 border-gray-300"
                            />
                            <InputError
                                message={errors.password_confirmation as string}
                            />
                        </div>


                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                className="bg-teal-600 hover:bg-teal-700 text-white poppins-semibold"
                                onClick={changeUserPasswordFn}
                                disabled={changeUserPassword.isPending}
                            >
                                {changeUserPassword.isPending  ? (
                                    <Spinner />
                                ) : (
                                    <IoIosSave />
                                )}
                                 Change Password
                            </Button>
                            <Button
                                className="bg-gray-500 hover:bg-teal-700 text-white poppins-semibold"
                                onClick={props.onClose}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default memo(PasswordForm);
