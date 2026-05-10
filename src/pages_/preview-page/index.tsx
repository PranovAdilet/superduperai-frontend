"use client";

import type { FC } from "react";
import { ProjectVideo } from "@/widgets/project";
import { Button, Flex, Text } from "@radix-ui/themes";
import { AuthDialog } from "@/entities/auth";
import { useAuthStore, useModal } from "@/shared/store";

import {
    ProjectVideoAnimateAllDialog,
    useProjectStoryboard2Video,
} from "@/features/project-video";
import {
    ProjectVideoExportDialog,
    useProjectVideoEventHandler,
} from "@/entities/project-video";
import { useTaskStatus } from "@/entities/task";
import type { IFileRead } from "@/shared/api";
import { TaskTypeEnum } from "@/shared/api";
import { useProjectGetById, useProjectEvents } from "@/entities/project";
import { useWindowSize } from "react-use";
import { ShareDialog } from "@/shared/ui";
import { useUserMe } from "@/entities/user";
import { Sparkles } from "lucide-react";
import { useProjectUpdate } from "@/features/project";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";

type Props = {
    projectId: string;
};

export const PreviewPage: FC<Props> = ({ projectId }) => {
    useProjectEvents({
        projectId,
        eventHandlers: [useProjectVideoEventHandler()],
    });

    const { open } = useModal();

    const { token } = useAuthStore();

    const { data: user } = useUserMe({ enabled: !!token });

    const { width } = useWindowSize();

    const { data: project } = useProjectGetById({ id: projectId });

    const { mutate: updateProject } = useProjectUpdate();

    const { mutate: storyboard2Video, isPending } =
        useProjectStoryboard2Video();

    const { isPending: isRendering } = useTaskStatus(
        TaskTypeEnum.STORYBOARD2VIDEO_FLOW,
        project?.tasks,
    );

    const { push } = useRouter();

    const handleOpen = () => {
        if (!token) {
            open("authDialog", AuthDialog);
        } else {
            push(getPath("PROJECT_VIDEO_EDIT_VIDEO", { projectId }));
        }
    };

    const handleOpenExportDialog = () => {
        if (!token) {
            open("authDialog", AuthDialog);
            return;
        }
        open("projectVideoExportDialog", ProjectVideoExportDialog);
    };

    const handleOpenShareDialog = () => {
        open("shareDialog", ShareDialog);
    };

    const handleExport = () => {
        storyboard2Video({ id: projectId });
    };

    const handleDownload = (file: IFileRead) => {
        const link = document.createElement("a");
        link.href = file.url ?? "";
        link.download = file.id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isDekstop = width > 1000;

    const handleAnimateAll = () => {
        open("projectVideoAnimateAllDialog", { projectId });
    };

    const handleShowWatermarkChange = (showWatermark: boolean) => {
        if (!project) return;
        updateProject({
            ...project,
            config: {
                ...project.config,
                watermark: showWatermark,
            },
        });
    };
    return (
        <>
            <ProjectVideo
                projectId={projectId}
                actionButton={
                    <Flex
                        gap="3"
                        justify="center"
                        width="100%"
                    >
                        {user?.admin && (
                            <Button
                                size="2"
                                color="gray"
                                onClick={handleAnimateAll}
                            >
                                <Sparkles size="16px" />
                                <Text size="4">Animate all</Text>
                            </Button>
                        )}
                        <Button
                            onClick={handleOpenShareDialog}
                            color="gray"
                        >
                            <Text size="4">SHARE </Text>
                        </Button>
                        <Button onClick={handleOpenExportDialog}>
                            <Text size="4">EXPORT </Text>
                        </Button>

                        {isDekstop && (
                            <Button onClick={handleOpen}>
                                <Text size="4">EDIT </Text>
                            </Button>
                        )}
                    </Flex>
                }
            />
            <AuthDialog />

            <ShareDialog />
            <ProjectVideoExportDialog
                isPending={isPending}
                isRendering={isRendering}
                onExport={handleExport}
                onDownload={handleDownload}
                showWatermark={project?.config?.watermark}
                onShowWatermarkChange={handleShowWatermarkChange}
            />
            <ProjectVideoAnimateAllDialog />
        </>
    );
};

export default PreviewPage;
