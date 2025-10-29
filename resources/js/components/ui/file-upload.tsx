import { memo, useRef, useState, ChangeEvent } from "react";
import { FaFileAlt } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";

type FileUploadProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  accept?: string;
  text?: string;
  name: string;
  id: string;
  type: 1|2;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FileUpload = ({
  className = "",
  text='',
  accept,
  name="",
  id="",
  type= 1,
  onChange,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);  // <-- FIRE YOUR HOOK FIRST ✅

    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const url = URL.createObjectURL(file);
    const isImageOrVideo = file.type.startsWith("image/") || file.type.startsWith("video/");
    setPreviewUrl(isImageOrVideo ? url : null);
};


  return (
    <div className={`flex w-full items-center justify-center  border border-dashed bg-transparent rounded-lg p-2 overflow-hidden ${className}`}>
      <label
        htmlFor={id}
        className={` flex max-h-96 w-full cursor-pointer flex-col items-center justify-center  `}
      >
        {!fileName ? (
          <div className="flex flex-col items-center justify-center p-4">
            {type == 1 ? <AiFillPicture size={50} /> : <FaFileVideo size={50} />}
            <p className="mb-2 text-sm mt-2 ">
              {text}
            </p>
          </div>
        ) : previewUrl ? (
          <div className={`flex flex-col items-center justify-center gap-2 w-full relative`}>
            {fileName.endsWith(".mp4") || fileName.endsWith(".webm") ? (
              <video src={previewUrl} controls className={` rounded-lg max-h-92 ${className}`} />
            ) : (
              <img src={previewUrl} alt="preview" className={` rounded-lg max-h-92 ${className}`} />
            )}
            <p className="text-xs font-semibold text-center">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full relative">
            <FaFileAlt size={50} />
            <p className="text-xs font-semibold text-center ">{fileName}</p>
          </div>
        )}

        <input
          id={id}
          type="file"
          ref={fileInputRef}
          accept={accept}
          className="hidden"
          name={name}
          onChange={handleFileChange}
        />

      </label>
    </div>
  );
};

export default memo(FileUpload);
