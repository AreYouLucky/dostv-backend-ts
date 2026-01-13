import * as React from "react"
import { cn } from "@/lib/utils"

interface TagsInputProps {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function TagsInput({
    value = "",
    onChange,
    placeholder = "Type and press enter",
    className,
}: TagsInputProps) {
    const [input, setInput] = React.useState("")
    const [tags, setTags] = React.useState<string[]>([])


    React.useEffect(() => {
        const parsed = value
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)

        setTags((prev) =>
            parsed.join(",") === prev.join(",") ? prev : parsed
        )
    }, [value])


    const updateParent = (next: string[]) => {
        setTags(next)
        onChange?.(next.join(", "))
    }

    const addTag = (tag: string) => {
        const clean = tag.trim()
        if (!clean || tags.includes(clean)) return

        updateParent([...tags, clean])
        setInput("")
    }

    const removeTag = (index: number) => {
        const next = tags.filter((_, i) => i !== index)
        updateParent(next)
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag(input)
        }

        if (e.key === "Backspace" && !input && tags.length) {
            removeTag(tags.length - 1)
        }
    }

    return (
        <div
            className={cn(
                "flex min-h-11 w-full flex-wrap items-center gap-1 rounded-lg border border-gray-300 bg-transparent px-2 py-1 text-[12.5px] shadow-sm focus-within:border-teal-500",
                className
            )}
        >
            {tags.map((tag, index) => (
                <span
                    key={tag}
                    className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-1 text-teal-50 poppins-regular font-medium hover:scale-102 duration-300"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-teal-50 hover:text-red-500 cursor-pointer"
                    >
                        ×
                    </button>
                </span>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="flex-1 min-w-[120px] bg-transparent px-1 py-1 text-gray-800 outline-none placeholder:text-gray-500"
            />
        </div>
    )
}
