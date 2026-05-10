"use client";

import { useFileById } from "@/entities/file";
import { TaskStatusEnum } from "@/shared/api";
import { useMemo } from "react";

type Props = {
    fileId?: string | null;
};

export const useFileError = ({ fileId }: Props) => {
    const { data: file } = useFileById(
        { id: fileId ?? "" },
        { enabled: !!fileId },
    );
    const fileError = useMemo(() => {
        return file?.tasks?.find(
            (task) => task.status === TaskStatusEnum.ERROR,
        );
    }, [file]);

    const isLipsync = useMemo(() => {
        return file?.video_generation?.generation_config_name === "comfyui/lip-sync"
    }, [file]);

    return { fileError, isLipsync };
};
