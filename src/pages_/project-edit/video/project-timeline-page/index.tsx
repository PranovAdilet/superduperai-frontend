"use client";

import { useFileList } from "@/entities/file";
import { useMusicList } from "@/entities/music";
import { ProjectTimeline } from "@/widgets/project/project-timeline";
import { useEffect, type FC } from "react";
import type { IAudio, ItemType, IVideo, IImage } from "super-timeline";
import { useDataStore } from "super-timeline";
import { FileTypeEnum } from "@/shared/api";
import { useSceneList } from "@/entities/scene";
import { useProjectEvents } from "@/entities/project";
import { useProjectVideoEventHandler } from "@/entities/project-video";

type Props = {
    projectId: string;
};

export const ProjectTimelinePage: FC<Props> = ({ projectId }) => {
    const { data: files } = useFileList({ projectId });
    const { data: scenes } = useSceneList({ projectId });
    const { data: musics } = useMusicList();

    const setState = useDataStore((state) => state.setState);

    useProjectEvents({
        projectId,
        eventHandlers: [useProjectVideoEventHandler()],
    });

    useEffect(() => {
        const images: IImage[] = [];
        const videos: IVideo[] = [];
        const audios: IAudio[] = [];

        musics?.items.map((item) => {
            if (!item.file.url) return;
            audios.push({
                id: item.id,
                details: {
                    src: item.file.url,
                },
                name: item.artist ?? "Unknown",
                type: "audio" as ItemType,

                display: { from: 0, to: 5000 },
            });
        });

        scenes?.items.forEach((item) => {
            if ("voiceover" in item && item.voiceover?.url) {
                audios.push({
                    id: item.id,
                    details: {
                        src: item.voiceover.url,
                        text: item.voiceover.audio_generation?.prompt ?? "",
                    },
                    name: item.voiceover.audio_generation?.prompt ?? "",
                    type: "audio" as ItemType,
                    display: { from: 0, to: 5000 },
                });
            }
            if ("sound_effect" in item && item.sound_effect?.url) {
                audios.push({
                    id: item.id,
                    details: {
                        src: item.sound_effect.url,
                        text: item.sound_effect.audio_generation?.prompt ?? "",
                    },
                    name: item.sound_effect.audio_generation?.prompt ?? "",
                    type: "audio" as ItemType,
                    display: { from: 0, to: 5000 },
                });
            }
        });

        files?.items.forEach((item) => {
            if (item.type === FileTypeEnum.IMAGE && item.url) {
                images.push({
                    id: item.id,
                    details: {
                        src: item.url,
                        width: 100,
                        height: 100,
                    },
                    type: "image",
                    preview: item.thumbnail_url ?? undefined,
                    display: {
                        from: 0,
                        to: 10000,
                    },
                });
                return;
            }
            if (item.type === FileTypeEnum.VIDEO && item.url) {
                const duration = item.duration ? item.duration * 1000 : 5000;
                videos.push({
                    id: item.id,
                    preview: item.thumbnail_url ?? undefined,
                    details: {
                        src: item.url,
                        duration,
                        width: 100,
                        height: 100,
                    },
                    type: "video",
                    trim: {
                        from: 0,
                        to: duration,
                    },
                    display: {
                        from: 0,
                        to: duration,
                    },
                });
            }
        });

        setState({
            audios,
            images,
            videos,
        });
    }, [files, musics, scenes]);
    return <ProjectTimeline projectId={projectId} />;
};

export default ProjectTimelinePage;
