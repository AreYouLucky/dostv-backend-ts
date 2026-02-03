import { memo, useEffect, useCallback } from "react";
import { type User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
import InputError from "@/components/input-error";
import { useHandleChange } from "@/hooks/use-handle-change";
import { Input } from "@/components/ui/input";
import { useCreateUser, useUpdateUser } from "./user-hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { IoIosSave } from "react-icons/io";

type UserFormProps = {
  show: boolean;
  onClose: () => void;
  data?: User;
};

function UserForm(props: UserFormProps) {
  const data: User | null = props.data ?? null;

  const { item, errors, handleChange, setErrors, setItem } = useHandleChange({
    id: 0,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: null as string | null,
    avatarFile: "" as File | string,
  });

  const resetForm = useCallback(() => {
    setItem({
      id: 0,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      avatar: null,
      avatarFile: "",
    });
    setErrors({});
  }, [setItem, setErrors]);

  const closeForm = () => {
    resetForm();
    props.onClose();
    window.location.reload();
  };

  const createFormData = () => {
    const formData = new FormData();

    // fixed: use &&, not ||
    if (item.id !== null && item.id !== 0) {
      formData.append("id", item.id.toString());
    }

    if (item.avatarFile instanceof File) {
      formData.append("avatar", item.avatarFile);
    }
    formData.append("name", item.name);
    formData.append("email", item.email);
    formData.append("password", item.password);
    formData.append("password_confirmation", item.password_confirmation);

    return formData;
  };

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const createUserFn = () => {
    const formData = createFormData();
    createUser.mutate(formData, {
      onSuccess: () => {
        toast.success("Account created successfully!");
        closeForm(); // use centralized close + reset
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
          toast.error("Check fields for errors!");
        }
      },
    });
  };

  const updateUserFn = () => {
    const formData = createFormData();
    updateUser.mutate(
      { payload: formData, id: item.id as number },
      {
        onSuccess: () => {
          toast.success("Account updated successfully!");
          closeForm(); // use centralized close + reset
        },
        onError: (error) => {
          if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
            toast.error("Check fields for errors!");
          }
        },
      }
    );
  };

  useEffect(() => {
    if (!props.show) return;

    if (data?.user_id && data.user_id !== 0) {
      setItem({
        id: data.user_id,
        name: data.name ?? "",
        email: data.email ?? "",
        password: "",
        password_confirmation: "",
        avatar: data.avatar ?? null,
        avatarFile: "",
      });
    } else {
      resetForm();
    }
  }, [props.show, data, setItem, resetForm]);

  return (
    <>
      <Dialog
        open={props.show}
        onOpenChange={(open) => {
          if (!open) {
            closeForm();
          }
        }}
      >
        <DialogContent className="text-gray-600 p-10 bg-white min-w-[90vw] md:min-w-250">
          <DialogHeader>
            <DialogTitle className="text-teal-600 poppins-bold text-center sr-only">
              User Form
            </DialogTitle>
            <DialogDescription className="text-xs text-center ">
              <span className="sr-only">Fill all the fields to proceed</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 p-4">
            {/* Avatar */}
            <div className="gap-2 flex flex-col justify-start transition-all duration-300 ease-in-out">
              <Label
                htmlFor="avatarFile"
                className="text-gray-700 poppins-semibold"
              >
                Profile Picture
              </Label>
              <FileUpload
                type={2}
                url={item?.avatar ? `/storage/${item.avatar}` : ""}
                id="avatarFile"
                name="avatarFile"
                accept="image/png,image/jpeg"
                text="Click to Upload Profile Picture"
                onChange={handleChange}
                className="text-gray-600 border-gray-300 shadow p-4 h-full"
              />
              <InputError message={errors?.avatar ?? ""} />
            </div>

            {/* Fields */}
            <div className="grid gap-4 h-fit">
              {/* Name */}
              <div className="gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out">
                <Label
                  htmlFor="name"
                  className="text-gray-700 poppins-semibold"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  value={String(item.name ?? "")}
                  className="text-gray-700 border-gray-300"
                />
                <InputError message={errors.name as string} />
              </div>

              {/* Email */}
              <div className="gap-2 h-full flex flex-col justify-start transition-all duration-300 ease-in-out">
                <Label
                  htmlFor="email"
                  className="text-gray-700 poppins-semibold"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  value={String(item.email ?? "")}
                  className="text-gray-700 border-gray-300"
                />
                <InputError message={errors.email as string} />
              </div>

              {/* Password fields: only for create mode */}
              {(item.id === null || item.id === 0) && (
                <>
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
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white poppins-semibold"
                onClick={() => (item.id === 0 ? createUserFn() : updateUserFn())}
                disabled={createUser.isPending || updateUser.isPending}
              >
                {createUser.isPending || updateUser.isPending ? (
                  <Spinner />
                ) : (
                  <IoIosSave />
                )}
                {item.id === 0 ? "Create" : "Update"} Account
              </Button>
              <Button
                className="bg-gray-500 hover:bg-teal-700 text-white poppins-semibold"
                onClick={closeForm}
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

export default memo(UserForm);
