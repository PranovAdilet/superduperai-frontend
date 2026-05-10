"use client";

import { Button, Text } from "@radix-ui/themes";
import type { FC, InputHTMLAttributes } from "react";

type Props = {
    loading?: boolean;
    children?: string;
    onClick: () => void;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "ref" | "type" | "onChange" | "children"
>;

export const UploadButton: FC<Props> = ({ loading, onClick, children }) => {
    return (
        <Button
            onClick={onClick}
            loading={loading}
            variant="classic"
            color="gray"
            size="2"
            className="rounded-2xl p-5 py-6"
        >
            <Text
                weight="medium"
                size="3"
            >
                {children}
            </Text>
        </Button>
    );
};
