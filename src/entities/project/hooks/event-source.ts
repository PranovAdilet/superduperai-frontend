"use client";

import { useEffect } from "react";
import { useProjectEventSourceStore } from "@/entities/project";
import type { EventHandler } from "@/shared/utils";

type Props = {
    projectId: string;
    eventHandlers: EventHandler[];
};

export const useProjectEvents = ({ projectId, eventHandlers }: Props) => {
    const { initConnection, removeHandlers } = useProjectEventSourceStore();

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const url = `${baseUrl}/api/v1/events/project.${projectId}`;

        initConnection(url, eventHandlers);

        return () => {
            removeHandlers(eventHandlers);
        };
    }, [projectId]);
};

