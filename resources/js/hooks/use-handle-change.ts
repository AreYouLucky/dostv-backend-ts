import { useState, useCallback } from "react";

type FormValues = Record<string, string | number | boolean | File>;

type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useHandleChange<T extends FormValues>(initialValues: T) {
  const [item, setItem] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, files } = e.target as HTMLInputElement;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "file"
        ? files?.[0] || null 
        : e.target.value;

    setItem((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); 
  }, []);

  return { item, errors, setItem, setErrors, handleChange };
}


