"use client";

import { useEntityEventHandler } from "@/entities/entity";
import { useFileEventHandler } from "@/entities/file";
import {
    useProjectEventHandler,
    useProjectEvents,
} from "@/entities/project";
import { useProjectVideoEventHandler } from "@/entities/project-video";
import { useSceneEventHandler } from "@/entities/scene";
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
            useEntityEventHandler(projectId),
            useSceneEventHandler(projectId),
            useProjectVideoEventHandler(),
            useFileEventHandler(),
        ],
    });

    return children;
};

export default Layout;
