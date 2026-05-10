"use client";

import { useFileUpload } from "@/features/file";
import type { FileTypeEnum, IFileRead } from "@/shared/api";
import { UploadField } from "@/shared/ui";
import type { FC, InputHTMLAttributes, ReactNode } from "react";

type Props = {
    entityId?: string;
    sceneId?: string;
    projectId?: string;
    type?: FileTypeEnum;
    children: (handlerClick: () => void, loading?: boolean) => ReactNode;
    onUpload?: (file: IFileRead) => void;
    setImage?: (file: string) => void;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "ref" | "type" | "onChange" | "children"
>;

export const FileUploader: FC<Props> = ({
    onUpload,
    children,
    entityId,
    sceneId,
    projectId,
    type,
    ...props
}) => {
    const { mutateAsync: uploadFile, isPending } = useFileUpload();

    const handleUpload = async (files: File[]) => {
        const file = files[0];

        const uploadedFile = await uploadFile({
            entityId,
            sceneId,
            projectId,
            type,
            formData: { payload: file },
        });

        onUpload?.(uploadedFile);
    };

    return (
        <UploadField
            {...props}
            onUpload={handleUpload}
        >
            {(handleClick) => children(handleClick, isPending)}
        </UploadField>
    );
};
