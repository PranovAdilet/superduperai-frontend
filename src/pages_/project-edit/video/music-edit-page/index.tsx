"use client";

import { Box, Flex } from "@radix-ui/themes";
import { MusicCard, MusicUploadButton, useMusicList } from "@/entities/music";
import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
} from "@/entities/project";
import { MusicPlayer, SuspenseQuery, UploadField } from "@/shared/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useProjectUpdate } from "@/features/project";
import { type IMusicRead } from "@/shared/api";

import { useMusicUpload } from "@/features/music";
import { useProjectVideoSyncToBeats } from "@/features/project-video";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";

type Props = {
    projectId: string;
};

const defaultMusicBeat = 1;

const MusicEditPage: FC<Props> = ({ projectId }) => {
    const { push, prefetch } = useRouter();

    const { data: project, isSuccess } = useProjectGetById({ id: projectId });

    const { data, isLoading, isError, refetch } = useMusicList({
        orderBy: "created_at",
    });

    const [playingMusic, setPlayingMusic] = useState<IMusicRead | null>(
        project?.music ?? null,
    );

    const [selectedTrack, setSelectedTrack] = useState<IMusicRead | null>(
        project?.music ?? null,
    );

    const nextRoutePath = getPath("PROJECT_VIDEO_EDIT_VIDEO", { projectId });

    useEffect(() => {
        prefetch(nextRoutePath);
    }, [prefetch, projectId, nextRoutePath]);

    useEffect(() => {
        if (isSuccess) {
            setSelectedTrack(project.music);
            setPlayingMusic(project.music);
        }
    }, [isSuccess]);

    const handleSelect = (music: IMusicRead) => {
        if (music.id === selectedTrack?.id) {
            setPlayingMusic(null);
            setSelectedTrack(null);
            return;
        }
        setPlayingMusic(music);
        setSelectedTrack(music);
    };

    const { mutate: update } = useProjectUpdate(["update", projectId]);

    const { mutate: syncToBeats } = useProjectVideoSyncToBeats();

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!project) {
            return;
        }
        if (project.music_id === selectedTrack?.id) {
            return;
        }
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                update(
                    {
                        ...project,
                        music_id: selectedTrack?.id ?? null,
                    },
                    {
                        onSuccess: (data) => {
                            if (!data.music_id) return;
                            syncToBeats({
                                id: projectId,
                                dynamic: defaultMusicBeat,
                            });
                        },
                    },
                );
            }, 800),
        );
    }, [selectedTrack]);

    const handleNext = () => {
        push(nextRoutePath);
    };

    const { mutate: upload, isPending: isUploadPending } = useMusicUpload();

    const handleUpload = (file: File[]) => {
        upload({
            formData: {
                upload: file[0],
            },
        });
    };

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Flex
                    direction="column"
                    gapY="3"
                    p="6"
                >
                    <SuspenseQuery
                        isLoading={isLoading}
                        isError={isError}
                        refetch={refetch}
                    >
                        <UploadField
                            accept="audio/*"
                            onUpload={handleUpload}
                        >
                            {(onClick) => (
                                <MusicUploadButton
                                    onClick={onClick}
                                    isPending={isUploadPending}
                                />
                            )}
                        </UploadField>
                        {data?.items.map((music, index) => (
                            <MusicCard
                                key={index}
                                music={music}
                                isSelect={selectedTrack?.id === music.id}
                                onSelect={handleSelect}
                            />
                        ))}
                    </SuspenseQuery>
                </Flex>
            </ProjectStep.Root>
            <ProjectStep.Footer dense>
                <Flex
                    flexGrow="1"
                    direction="column"
                    pt="3"
                    pb="5"
                >
                    <Flex
                        align="center"
                        flexGrow="1"
                    >
                        <Box
                            flexGrow="1"
                            px="6"
                        >
                            <MusicPlayer music={playingMusic} />
                        </Box>
                        <Box p="6">
                            <ProjectNextBtn
                                label={!selectedTrack ? "SKIP" : "NEXT"}
                                onClick={handleNext}
                            />
                        </Box>
                    </Flex>
                </Flex>
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default MusicEditPage;
