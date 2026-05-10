"use client";
import type { ChangeEvent, FC, InputHTMLAttributes, ReactNode } from "react";
import { useRef } from "react";

export type UploadFiledProps = {
    onUpload: (files: File[]) => void;
    children: (handleClick: () => void) => ReactNode;
    multiple?: boolean;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "ref" | "type" | "onChange" | "children"
>;

export const UploadField: FC<UploadFiledProps> = ({
    children,
    onUpload,
    multiple,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        onUpload([...Array.from(files)]);
    };

    return (
        <>
            {children(handleClick)}

            <input
                ref={inputRef}
                className="sr-only"
                type="file"
                multiple={multiple}
                onChange={handleUpload}
            />
        </>
    );
};
