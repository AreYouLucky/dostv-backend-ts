import { memo } from "react";
import { cn } from "@/lib/utils"

type selectInputProps = {
    id?: string
    name: string
    items: Record<string, string | number>[]
    itemValue: string
    itemName: string
    value: string | number
    defaultValue?: string
    className?: string
    isFocused?: boolean
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectInput = ({
    id,
    items,
    itemValue,
    itemName,
    name,
    value,
    className = '',
    isFocused,
    onChange,
    defaultValue = "",
}: selectInputProps) => {
    return (
        <div className={`relative ${className}`}>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={cn(
                    "border-gray-300 file:text-foreground text-gray-800 placeholder:text-gray-500 selection:bg-primary selection:text-gray-800 flex h-10 w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 pr-10", // ✅ ADD pr-10 here
                    "shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-teal-500  [&>option]:rounded-lg [&>option]:py-2 [&>option]:px-5",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    className
                )}
                autoFocus={isFocused}
            >
                <option className="text-gray-400 ">
                    {defaultValue === "" ? "Choose" : defaultValue}
                </option>
                {items.map((item) => (
                    <option key={item[itemValue]} value={item[itemValue]} className="rounded-lg hover:bg-teal-100">
                        {item[itemName]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default memo(SelectInput);
