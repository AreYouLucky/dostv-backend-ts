import { useState, useCallback } from "react";

type FormValues = Record<string, string | number | boolean>;
type FormErrors = Record<string, string>; 

export function useHandleChange<T extends FormValues>(initialValues: T) {
  const [item, setItem] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, type } = e.target;
      const value =
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setItem((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  return { item, errors, setItem, setErrors, handleChange };
}
