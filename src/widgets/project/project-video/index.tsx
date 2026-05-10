"use client";

import { useEffect, useMemo, useState, memo } from "react";
import type { FC, ReactNode } from "react";
import {
    ProjectVideoMusicBeats,
    ProjectVideoSettings,
    useProjectGetById,
} from "@/entities/project";
import { useSceneList } from "@/entities/scene";
import { useTaskStatus } from "@/entities/task";
import { useProjectUpdate } from "@/features/project";
import type { IProjectRead, IProjectVideoRead, ISceneRead } from "@/shared/api";
import { TaskTypeEnum } from "@/shared/api";
import { useWindowSize } from "react-use";
import type { MediaPrefetchFileType } from "@/shared/hooks";
import { useMediaPrefetch } from "@/shared/hooks";

import { Flex, Spinner, Text } from "@radix-ui/themes";
import { SuspenseQuery } from "@/shared/ui";
import { RemotionPlayer } from "@/remotion/player";
import { useSceneUpdate } from "@/features/scene";
import { useProjectVideoSyncToBeats } from "@/features/project-video";

type Props = {
    projectId: string;
    actionButton?: ReactNode;
    showPlayerSettings?: boolean;
};

type Scenes = ISceneRead[];

const ProjectVideoComponent: FC<Props> = ({
    projectId,
    actionButton,
    showPlayerSettings,
}) => {
    const {
        data,
        isLoading: isScenesLoading,
        refetch,
        isError,
    } = useSceneList({ projectId });

    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const { mutate: updatedProject, isPending } = useProjectUpdate();

    const { mutate: updateScene, isPending: isSceneUpdating } =
        useSceneUpdate();

    const { mutate: syncToBeats, isPending: isSyncing } =
        useProjectVideoSyncToBeats();
    const { isCompleted } = useTaskStatus(
        TaskTypeEnum.VIDEO_GENERATION_FLOW,
        project?.tasks,
    );

    const [scenes, setScenes] = useState<Scenes>();

    const { width } = useWindowSize();

    const isDekstop = width > 1000;

    const scenesMedia = useMemo(() => sceneToMediaFormatting(scenes), [scenes]);

    // const musicUrl = useMemo(() => {
    //     return project?.music?.file.url
    //         ? [{ url: project.music.file.url, type: FileTypeEnum.MUSIC }]
    //         : [];
    // }, [project?.music?.file.url]);

    const files = useMemo(() => [...scenesMedia], [scenesMedia]);
    const { loaded: isLoaded } = useMediaPrefetch({ files });

    const aspectRatio = useMemo(() => {
        if (!project) return;
        const videoProject = project as IProjectVideoRead;
        const value = videoProject.config.aspect_ratio ?? "16:9";
        const [numerator, denominator] = value.split(":").map(Number);
        return numerator / denominator;
    }, [project?.config?.aspect_ratio]);

    const handleProjectUpdate = (value: IProjectRead) => {
        updatedProject(value);
    };

    const handleSceneDurationUpdate = (scene: ISceneRead, duration: number) => {
        if (!scene.file_id) return;
        //TODO:При обновлении сцены ошибка с file_id, приходится его тоже передавать
        updateScene({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: scene.file_id,
                duration,
            },
        });
    };

    const handleSyncToBeats = (newBeat: string) => {
        //TODO:Добавить проверку на то, есть ли музыка
        syncToBeats({
            id: projectId,
            dynamic: Number(newBeat),
        });
    };

    useEffect(() => {
        if (!data) return;
        setScenes(data.items as ISceneRead[]);
    }, [data]);

    const isScenesGenerating = useMemo(() => {
        return scenes?.some((scene) => !scene.file?.url);
    }, [scenes, isCompleted]);

    const rating = useMemo(() => project?.rating, [project?.rating]);

    const music = useMemo(() => project?.music ?? null, [project?.music]);

    const isLoading =
        isSceneUpdating ||
        isScenesLoading ||
        isProjectLoading ||
        !scenes?.length ||
        isScenesGenerating;

    return (
        <>
            <Flex
                flexGrow="1"
                direction="column"
            >
                <SuspenseQuery
                    refetch={refetch}
                    isError={isError}
                    isLoading={isLoading}
                    fallbackLoading={
                        <Flex
                            width="100%"
                            height="100%"
                            justify="center"
                            align="center"
                            direction="column"
                            gap="4"
                        >
                            <Spinner />
                            {isScenesGenerating && (
                                <Text color="gray">Scenes generating...</Text>
                            )}
                        </Flex>
                    }
                >
                    <RemotionPlayer
                        aspectRatio={aspectRatio}
                        music={music}
                        scenes={scenes}
                        isLoading={!isLoaded}
                        projectRating={rating}
                    />
                </SuspenseQuery>
                <Flex
                    direction="column"
                    flexGrow="1"
                >
                    {project && showPlayerSettings && (
                        <ProjectVideoMusicBeats
                            projectId={projectId}
                            onSceneUpdate={handleSceneDurationUpdate}
                            isPending={isSyncing || isScenesLoading}
                        />
                    )}

                    <Flex
                        width="100%"
                        justify="between"
                    >
                        {project && isDekstop && showPlayerSettings && (
                            <ProjectVideoSettings
                                project={project}
                                onProjectUpdate={handleProjectUpdate}
                                onMusicBeatsChange={handleSyncToBeats}
                                isPending={isPending}
                                isSyncing={isSyncing || isScenesLoading}
                            />
                        )}
                        {actionButton && !isLoading && (
                            <Flex
                                p="6"
                                width="100%"
                            >
                                {actionButton}
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};

export const ProjectVideo = memo(ProjectVideoComponent);

const sceneToMediaFormatting = (scenes?: ISceneRead[]) => {
    if (!scenes) return [];
    const media: MediaPrefetchFileType[] = [];

    for (const scene of scenes) {
        if (scene.file?.url) {
            media.push({
                url: scene.file.url,
                type: scene.file.type,
            });
        }
        if (scene.voiceover?.url) {
            media.push({
                url: scene.voiceover.url,
                type: scene.voiceover.type,
            });
        }
        if (scene.sound_effect?.url) {
            media.push({
                url: scene.sound_effect.url,
                type: scene.sound_effect.type,
            });
        }
    }
    return media;
};
