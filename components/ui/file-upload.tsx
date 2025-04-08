import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { Progress } from "./progress";


const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface FileUploadProps {
  onFileUpload: (url: string, file: File) => void;
  label: string;
  className?: string;
  folderName: string;
  existingFile?: {
    url: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
  } | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, label, className, folderName, existingFile }) => {
  const [files, setFiles] = useState<File[]>(() => {
    if (existingFile) {
      // Create a File object from the existing file data
      return [new File([], existingFile.name, {
        type: existingFile.type,
        lastModified: existingFile.lastModified
      })];
    }
    return [];
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    if (existingFile) {
      setFiles([file]);
      onFileUpload(existingFile.url, file);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${folderName}`);
    formData.append("folder", `${folderName}`);
    formData.append("resource_type", "raw");
    
    setUploading(true);
    setUploadProgress(0);
  
    try {
      // ✅ Use XMLHttpRequest (XHR) for upload progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dfivs4n49/raw/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("Cloudinary Response:", response);
          if (response.secure_url) {
            setUploadProgress(100);
            onFileUpload(response.secure_url, file);
            setFiles([file]);
          }
        } else {
          console.error("Cloudinary Upload Error:", xhr.statusText);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        console.error("Cloudinary Upload Failed");
        setUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      setUploading(false);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      uploadToCloudinary(newFiles[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    accept: {
      'application/pdf': ['.pdf']
    },
    onDropRejected: (error) => console.log(error),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
      
      {existingFile && (
        <div className="mb-8">
          <iframe
            src={existingFile.url}
            className="w-full h-[600px] rounded-lg border border-gray-200"
            title="PDF Preview"
          />
        </div>
      )}

      {!existingFile && (
        <div className={className} {...getRootProps()}>
          <motion.div
            onClick={handleClick}
            whileHover="animate"
            className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden bg-white"
          >
            <input
              ref={fileInputRef}
              id="file-upload-handle"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
              className="hidden"
            />
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
              <GridPattern />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="relative z-20 font-sans font-bold text-gray-700 text-base">
                Upload file (PDF)
              </p>
              <p className="relative z-20 font-sans font-normal text-gray-500 text-base mt-2">
                Drag or drop your files here or click to upload
              </p>

              {uploading && (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <Progress value={uploadProgress} className="h-1" />
                  <p className="text-sm text-center text-gray-700 mt-2">{uploadProgress}%</p>
                </div>
              )}

              <div className="relative w-full mt-10 max-w-xl mx-auto">
                {files.length > 0 &&
                  files.map((file, idx) => (
                    <motion.div
                      key={"file" + idx}
                      layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                      className="relative overflow-hidden z-40 bg-white flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
                    >
                      <div className="flex justify-between w-full items-center gap-4">
                        <motion.p className="text-base text-gray-700 truncate max-w-xs">
                          {file.name}
                        </motion.p>
                        <motion.p className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-gray-600 bg-gray-50 shadow-input">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </motion.p>
                      </div>

                      <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-gray-600">
                        <motion.p className="px-1 py-0.5 rounded-md bg-gray-50">
                          {file.type}
                        </motion.p>
                        <motion.p>
                          modified {new Date(file.lastModified).toLocaleDateString()}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                {!files.length && (
                  <>
                    <motion.div
                      layoutId="file-upload"
                      variants={mainVariant}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={cn(
                        "relative group-hover/file:shadow-2xl z-40 bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                      )}
                    >
                      {isDragActive ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-600 flex flex-col items-center"
                        >
                          Drop it
                          <IconUpload className="h-4 w-4 text-gray-600" />
                        </motion.p>
                      ) : (
                        <IconUpload className="h-4 w-4 text-gray-600" />
                      )}
                    </motion.div>
                    <motion.div
                      variants={secondaryVariant}
                      className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 25;
  return (
    <div className="flex  bg-gray-50 flex-shrink-0 flex-wrap justify-center items-center gap-x-[0px] gap-y-[0px] scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-white shadow-[0px_0px_1px_rgba(0,0,0,0.1)]"
                  : "bg-gray-50 shadow-[0px_0px_2px_rgba(0,0,0,0.15)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
