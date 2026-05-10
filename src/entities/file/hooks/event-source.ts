"use client";

import { useEffect } from "react";
import { useFileEventSourceStore } from "@/entities/file";
import type { EventHandler } from "@/shared/utils";

type Props = {
    fileId: string;
    eventHandlers: EventHandler[];
};

export const useFileEvents = ({ fileId, eventHandlers }: Props) => {
    const { initConnection, removeHandlers } = useFileEventSourceStore();

    useEffect(() => {
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const url = `${baseUrl}/api/v1/events/file.${fileId}`;

        initConnection(url, eventHandlers);

        return () => {
            removeHandlers(eventHandlers);
        };
    }, [fileId]);
};
