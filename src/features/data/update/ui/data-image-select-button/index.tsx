"use client";

import type { FC, ReactNode } from "react";
import type { IDataRead, IFileRead } from "@/shared/api";
import { useDataUpdate } from "../..";

type Props = {
    children: (
        handleClick: (file: IFileRead) => void,
        isPending: boolean,
    ) => ReactNode;
    data?: IDataRead;
};

export const DataImageSelectButton: FC<Props> = ({ children, data }) => {
    const { mutate: update, isPending } = useDataUpdate();

    const handleClick = (file: IFileRead) => {
        if (!data) return;
        update({
            id: data.id,
            value: { file_id: file.id },
        });
    };

    return <>{children(handleClick, isPending)}</>;
};
