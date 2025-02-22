import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};


interface FileUploadProps {
  onFileUpload: (url: string) => void; // Sends Cloudinary URL instead of File
  label: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, label }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Answerpaper"); // ✅ Required
    formData.append("folder", "Autograde"); // ✅ Allowed in unsigned upload
  
    setUploading(true);
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dfivs4n49/image/upload", {
        method: "POST",
        body: formData,
      });
  
      const responseText = await response.text();
      console.log("Cloudinary Response:", responseText); // ✅ Debugging
  
      const data = JSON.parse(responseText);
  
      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
  
      if (data.secure_url) {
        onFileUpload(data.secure_url); // ✅ Sends Cloudinary URL back
        setFiles([file]); // ✅ Display file in UI
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };
  
  

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      uploadToCloudinary(newFiles[0]); // ✅ Upload first selected file
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{label}</h2>
      <div className="w-full" {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            accept="application/pdf" // ✅ Restrict to PDF
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Upload file (PDF)
            </p>
            <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
              Drag or drop your files here or click to upload
            </p>

            {uploading && (
              <p className="text-sm text-blue-500 dark:text-blue-400 mt-2">Uploading...</p>
            )}

            <div className="relative w-full mt-10 max-w-xl mx-auto">
              {files.length > 0 &&
                files.map((file, idx) => (
                  <motion.div
                    key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                      "shadow-sm"
                    )}
                  >
                    <div className="flex justify-between w-full items-center gap-4">
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout
                        className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                        {file.name}
                      </motion.p>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout
                        className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              {!files.length && (
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center">
                      Drop it
                      <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
