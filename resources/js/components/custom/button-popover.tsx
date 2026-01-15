import { useRef, useState, ReactNode } from "react";
import { TbFilterEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5"; // X icon
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"


type BottomPopoverProps = {
  children: ReactNode;
  width?: string; // e.g., "w-72"
};

export default function BottomPopover({
  children,
  width = "w-72",
}: BottomPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  return (
    <div className="relative inline-block" ref={ref}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            className="rounded-lg border text-white bg-teal-600"
          >
            <TbFilterEdit />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filter</p>
        </TooltipContent>
      </Tooltip>


      {open && (
        <div
          className={`absolute z-50 mt-2 ${width} rounded-lg border bg-white shadow-lg p-4 left-1/2 -translate-x-1/2`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <IoClose size={18} />
          </button>

          {children}
        </div>
      )}
    </div>
  );
}
