"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "./link";
import { Text } from "@radix-ui/themes";
import type { FC } from "react";

type Props = {
    route?: string;
    onClick?: () => void;
};
export const BackButton: FC<Props> = ({ route, onClick }) => {
    return (
        <Link
            onClick={onClick}
            className="flex gap-x-2 "
            color="gray"
            href={route}
        >
            <ArrowLeft />
            <Text>Back</Text>
        </Link>
    );
};
