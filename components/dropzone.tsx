import React, { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { FileWithPreview } from "@/types";

import {
  useDropzone,
  FileWithPath,
  FileRejection,
  Accept,
} from "react-dropzone";
import {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import toast from "react-hot-toast";
import { formatBytes } from "@/lib/utils";
import { PageCard } from "./page-card";

interface DropzoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  accept?: Accept;
  maxSize?: number;
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  maxFiles?: number;
  file: FileWithPreview[];
  setFile: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  disabled: boolean;
  icon?: boolean;
  caption?: string;
  ifAlwaysVisible?: boolean;
}

export const Dropzone = <TFieldValues extends FieldValues>({
  accept = {
    "image/jpeg": [],
    "image/png": [],
  },
  maxFiles = 1,
  name,
  maxSize = 1024 * 1024 * 2,
  setValue,
  file,
  setFile,
  className,
  disabled,
  icon = true,
  caption = "Drop your Image here or Click to Select Image",
  ifAlwaysVisible = true,
}: DropzoneProps<TFieldValues>) => {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        setFile((prevFiles) => [
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) }),
          ),
        ]);
      });

      if (rejectedFiles.length > 0) {
        if (rejectedFiles.length > 1) {
          toast.error("Only one file is allowed");
        } else {
          rejectedFiles.forEach(({ errors }) => {
            if (errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${formatBytes(maxSize)}`,
              );
            } else errors[0]?.message && toast.error(errors[0].message);
          });
        }

        return;
      }
    },
    [maxSize, setFile],
  );

  useEffect(() => {
    setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles,
    accept,
    disabled,
  });
  useEffect(() => {
    return () => {
      if (!file) return;
      file.forEach((f) => URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDropZoneUI = () => (
    <div className={className}>
      <div className="lg:text-md flex cursor-pointer flex-col items-center justify-center gap-4 text-center text-sm ">
        {icon && <Upload />}
        {isDragActive ? <p>Drop the files here ...</p> : <p>{caption}</p>}
      </div>
    </div>
  );

  return (
    <>
      <div {...getRootProps({})}>
        <input {...getInputProps()} />
        {ifAlwaysVisible && renderDropZoneUI()}

        {!ifAlwaysVisible &&
          (file.length > 0 ? (
            <>
              <PageCard
                src={file[0]?.preview}
                alt={file[0]?.name}
                closeBtn={true}
                onClick={() => {
                  setFile([]);
                }}
              />
            </>
          ) : (
            renderDropZoneUI()
          ))}
      </div>
    </>
  );
};
