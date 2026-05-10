"use client";

import { useProjectGetById } from "@/entities/project";
import { ProjectVideoExportDialog } from "@/entities/project-video";
import { useTaskStatus } from "@/entities/task";
import { useProjectUpdate } from "@/features/project";
import { useProjectStoryboard2Video } from "@/features/project-video";
import type { IFileRead } from "@/shared/api";
import { TaskTypeEnum } from "@/shared/api";
import { ShareDialog } from "@/shared/ui";
import { ProjectVideo } from "@/widgets/project";
import { type FC } from "react";

type Props = {
    projectId: string;
};

const VideoEditPage: FC<Props> = ({ projectId }) => {
    const { data: project } = useProjectGetById({ id: projectId });

    const { mutate: updateProject } = useProjectUpdate();

    const { mutate: storyboard2Video, isPending } =
        useProjectStoryboard2Video();

    const { isPending: isRendering } = useTaskStatus(
        TaskTypeEnum.STORYBOARD2VIDEO_FLOW,
        project?.tasks,
    );

    const handleExport = (isPublic?: boolean) => {
        if (!project) return;
        storyboard2Video({ id: projectId });
        updateProject({ ...project, id: projectId, public: isPublic });
    };

    const handleDownload = (file: IFileRead) => {
        const link = document.createElement("a");
        link.href = file.url ?? "";
        link.download = file.id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <ProjectVideo
                projectId={projectId}
                showPlayerSettings
            />
            <ShareDialog projectId={projectId} />
            <ProjectVideoExportDialog
                isPending={isPending}
                isRendering={isRendering}
                onExport={handleExport}
                onDownload={handleDownload}
                isPublic={project?.public}
            />
        </>
    );
};

export default VideoEditPage;
