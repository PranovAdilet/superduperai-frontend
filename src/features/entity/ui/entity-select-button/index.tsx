"use client";

import type { FC, ReactNode } from "react";
import { useEntityUpdate } from "../../update";
import { type IEntityRead, type IFileRead } from "@/shared/api";

type Props = {
    children: (
        update: (file: IFileRead) => void,
        isPending: boolean,
    ) => ReactNode;
    entity?: IEntityRead;
};

export const EntitySelectButton: FC<Props> = ({ children, entity }) => {
    const { mutate: update, isPending } = useEntityUpdate();

    const handleClick = (file: IFileRead) => {
        if (!entity) return;
        if (!entity.config) return;

        update({
            ...entity,
            file_id: file.id,
            config: {
                ...entity.config,
            },
        });
    };

    return <>{children(handleClick, isPending)}</>;
};
