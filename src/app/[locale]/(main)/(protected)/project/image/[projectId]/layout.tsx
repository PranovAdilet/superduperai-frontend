"use client";

import { useFileEventHandler } from "@/entities/file";
import {
    useProjectEventHandler,
    useProjectEvents,
} from "@/entities/project";
import type { PageProps } from "@/shared/types";
import type { ReactNode } from "react";

type Params = {
    projectId: string;
};

type Props = {
    children: ReactNode;
} & PageProps<Params>;

const Layout = ({ children, params }: Props) => {
    const { projectId } = params;

    useProjectEvents({
        projectId,
        eventHandlers: [
            useProjectEventHandler(projectId),
            useFileEventHandler(),
        ],
    });

    return children;
};

export default Layout;
