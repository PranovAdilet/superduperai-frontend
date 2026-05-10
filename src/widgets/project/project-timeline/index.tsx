"use client";
import { useSceneList } from "@/entities/scene";
import {
    type IFileRead,
    DataTypeEnum,
    FileTypeEnum,
    TaskTypeEnum,
} from "@/shared/api";

import {
    Scene,
    TimelineComponent,
    StateManager,
    useStore,
    useTimelineEvents,
    eventBus,
    MenuList,
    MenuItem,
    ControlItem,
    ControlList,
    HistoryButtons,
    SCENE_LOAD,
    Button,
    useTimelineHotkeys,
    useItemsHotkeys,
} from "super-timeline";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import type { MediaPrefetchFileType } from "@/shared/hooks";
import { useMediaPrefetch } from "@/shared/hooks";
import { useProjectData, useProjectGetById } from "@/entities/project";
import "./styles.css";
import "super-timeline/style.css";
import { useProjectTimeline2Video } from "@/features/project-video/timeline2video";
import { useGenerateTimeline } from "@/features/project";
import { useDataUpdate } from "@/features/data";
import { isEqual } from "lodash";
import { Spinner } from "@radix-ui/themes";
import { ArrowLeft, Download } from "lucide-react";
import { ProjectVideoExportDialog } from "@/entities/project-video";
import { useTaskStatus } from "@/entities/task";
import { useAuthStore, useModal } from "@/shared/store";
import { AuthDialog } from "@/entities/auth";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config";

type Props = {
    projectId: string;
};

const stateManager = new StateManager();

export const ProjectTimeline: FC<Props> = ({ projectId }) => {
    const { push } = useRouter();

    const { data: scenes } = useSceneList({ projectId });

    const { data: project } = useProjectGetById({ id: projectId });

    const { mutate: generateTimeline, isPending: isGenerating } =
        useGenerateTimeline();

    const { mutate: timeline2video, isPending } = useProjectTimeline2Video();

    const timeline = useProjectData(project, DataTypeEnum.TIMELINE);

    useTimelineEvents();
    useTimelineHotkeys();
    useItemsHotkeys();
    const handleTimeline2Video = () => {
        timeline2video({ id: projectId });
    };

    const { mutate: updateTimeline } = useDataUpdate(false);

    const {
        playerRef,
        trackItemsMap,
        tracks,
        trackItemDetailsMap,
        trackItemIds,
    } = useStore();

    const [data, setData] = useState<any>([]);

    const { isPending: isRendering } = useTaskStatus(
        TaskTypeEnum.TIMELINE2VIDEO_FLOW,
        project?.tasks,
    );

    useEffect(() => {
        if (!data) return;
        eventBus.dispatch(SCENE_LOAD, {
            payload: data,
        });
    }, [data]);

    useEffect(() => {
        if (!timeline) return;
        const timer = setTimeout(() => {
            setData(timeline.value);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [timeline]);

    useEffect(() => {
        if (!project || timeline) return;
        handleGenerateTimeline();
    }, [timeline, project]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleUpdateTimeline();
        }, 1500);
        return () => {
            clearTimeout(timer);
        };
    }, [trackItemsMap, trackItemDetailsMap, tracks, trackItemIds]);

    const handleGenerateTimeline = () => {
        generateTimeline({ id: projectId });
    };

    const handleDownload = (file: IFileRead) => {
        const link = document.createElement("a");
        link.href = file.url ?? "";
        link.download = file.id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpdateTimeline = () => {
        if (!timeline || !project) return;

        if (
            !isEqual(timeline.value, {
                ...timeline.value,
                trackItemDetailsMap,
                tracks,
                trackItemIds,
                trackItemsMap,
            })
        ) {
            updateTimeline({
                id: timeline.id,
                value: {
                    ...timeline.value,
                    trackItemDetailsMap,
                    tracks,
                    trackItemIds,
                    trackItemsMap,
                },
            });
        }
    };

    const handleBack = () => {
        push(getPath("PROJECT_VIDEO_EDIT_VIDEO", { projectId }));
    };

    const scenesMedia = useMemo(
        () => sceneToMediaFormatting(scenes?.items),
        [scenes],
    );

    const musicUrl = useMemo(() => {
        return project?.music?.file.url
            ? [{ url: project.music.file.url, type: FileTypeEnum.MUSIC }]
            : [];
    }, [project?.music?.file.url]);

    const files = useMemo(
        () => [...scenesMedia, ...musicUrl],
        [scenesMedia, musicUrl],
    );

    const { loaded: _isLoaded } = useMediaPrefetch({ files });

    const open = useModal((state) => state.open);
    const token = useAuthStore((state) => state.token);

    const handleOpenExportDialog = () => {
        if (!token) {
            open("authDialog", AuthDialog);
            return;
        }
        open("projectVideoExportDialog", ProjectVideoExportDialog);
    };

    return (
        <div className="relative flex size-full flex-col">
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "320px 1fr 320px",
                }}
                className="pointer-events-none absolute inset-x-0 top-0 z-[205] flex h-[72px] items-center px-2"
            >
                <div className="pointer-events-auto flex h-14 items-center gap-2">
                    <div className="flex h-12 items-center bg-background px-1.5">
                        <Button
                            className="flex gap-2 text-muted-foreground"
                            variant="ghost"
                            onClick={handleBack}
                        >
                            <ArrowLeft /> Back
                        </Button>
                    </div>

                    <HistoryButtons />
                </div>
                <div></div>
                <div className="pointer-events-auto flex h-14 items-center justify-end gap-2">
                    <div className="flex h-12 items-center gap-2 rounded-md bg-background px-2.5">
                        <Button
                            onClick={handleGenerateTimeline}
                            className="min-w-[166px] bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                        >
                            {isGenerating ? <Spinner /> : "Regenerate Timeline"}
                        </Button>
                        <Button
                            className="flex size-9 gap-1 border border-border"
                            size="icon"
                            variant="secondary"
                            onClick={handleOpenExportDialog}
                        >
                            <Download width={18} />
                        </Button>
                    </div>
                </div>
            </div>

            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    flex: 1,
                    overflow: "hidden",
                }}
            >
                <MenuList />
                <MenuItem />
                <ControlList />
                <ControlItem />
                <Scene />
            </div>
            <div className=" w-full ">
                {playerRef && <TimelineComponent stateManager={stateManager} />}
            </div>
            <AuthDialog />
            <ProjectVideoExportDialog
                isPending={isPending}
                isRendering={isRendering}
                onExport={handleTimeline2Video}
                onDownload={handleDownload}
                isPublic={project?.public}
            />
        </div>
    );
};

const sceneToMediaFormatting = (scenes?: any[]) => {
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
