"use client";

import type { IFileRead } from "@/shared/api";
import { Button, Flex } from "@radix-ui/themes";
import { SquarePen, Trash2 } from "lucide-react";
import type { FC, InputHTMLAttributes, ReactNode } from "react";
import { useEffect, useState } from "react";
import { FileUploader } from "../file-uploader";
import { UploadCard } from "@/entities/file";

type Props = {
    src?: string;
    label?: string;
    children?: (handlerClick: () => void, loading?: boolean) => ReactNode;
    onUpload?: (file: IFileRead) => void;
    onClear?: () => void;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "ref" | "type" | "onChange" | "children"
>;

export const ImageUploader: FC<Props> = ({
    label,
    src,
    onUpload,
    onClear,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(src);

    useEffect(() => {
        setImageSrc(src);
    }, [src]);

    const handleClear = () => {
        setImageSrc(undefined);
        onClear?.();
    };

    const handleUpload = (uploadedFile: IFileRead) => {
        onUpload?.(uploadedFile);
        setImageSrc(uploadedFile.url ?? "");
    };

    return (
        <FileUploader
            onUpload={handleUpload}
            {...props}
        >
            {(handleClick, isPending) => (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    height="100%"
                    width="100%"
                    className={
                        "m-0 overflow-hidden rounded-lg border border-dashed border-gray-500 p-0"
                    }
                >
                    <UploadCard
                        handleClick={handleClick}
                        label={label}
                        imageSrc={imageSrc}
                        loading={isPending}
                    >
                        {onClear && (
                            <Button
                                variant="ghost"
                                onClick={handleClear}
                                className="m-0 bg-black/60 p-1"
                            >
                                <Trash2 color="white" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            onClick={handleClick}
                            className="m-0 bg-black/60 p-1"
                        >
                            <SquarePen color="white" />
                        </Button>
                    </UploadCard>
                </Flex>
            )}
        </FileUploader>
    );
};
