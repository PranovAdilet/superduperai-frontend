"use client";

import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { FabricCanvas, useFabricEditor, RangeSlider } from "@/shared/ui";
import { useSceneGetById, useSceneList } from "@/entities/scene";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useModal, useTextEditorToolbarStore } from "@/shared/store";
import { useSceneUpdate } from "@/features/scene";
import { debounce } from "lodash";
import { Textbox } from "fabric";
import { useMediaPrefetch, usePreloadImages } from "@/shared/hooks";
import { ArrowLeft } from "lucide-react";
import type { IProjectVideoConfig_Input } from "@/shared/api";
import { FileTypeEnum } from "@/shared/api";
import { useProjectGetById } from "@/entities/project";
import {
    SceneStoryboardToolbar,
    StoryboardSceneMediaList,
    StoryboardSceneSoundEffectList,
    StoryboardSceneVoiceoverList,
} from "@/widgets/scene";
import {
    FileGeneratingCard,
    FileSyncMedia,
    useFileList,
} from "@/entities/file";
import { LipsyncDialog } from "@/features/file/generate-video";
import { useFileDelete } from "@/features/file";
import { useMusicGetById } from "@/entities/music";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config";

type Props = {
    sceneId: string;
    projectId: string;
};

const StoryboardScenePage: FC<Props> = ({ projectId, sceneId }) => {
    const { push } = useRouter();

    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const aspectRatio: number = useMemo(() => {
        const config = project?.config as IProjectVideoConfig_Input | undefined;
        const value = config?.aspect_ratio ?? "1:1";
        const [width, height] = value.split(":").map(Number);
        return width / height;
    }, [project]);

    const height = useMemo(() => {
        if (aspectRatio <= 1) {
            return "100%";
        }
    }, [aspectRatio]);

    const width = useMemo(() => {
        if (aspectRatio >= 1) {
            return "100%";
        }
    }, [aspectRatio]);

    const {
        data: scene,
        isLoading,
        isSuccess,
    } = useSceneGetById({ id: sceneId });

    const { mutate: update } = useSceneUpdate();

    const { mutate: removeFile } = useFileDelete();

    const { data: files } = useFileList({
        projectId,
        sceneId,
        types: [FileTypeEnum.IMAGE, FileTypeEnum.VIDEO],
    });

    const { open } = useModal();

    const { editor: textEditor, setEditor } = useTextEditorToolbarStore();

    const handleBack = () => {
        if (textEditor) {
            editor?.canvas.discardActiveObject();
            editor?.canvas.renderAll();
        } else {
            push(
                getPath("PROJECT_VIDEO_EDIT_STORYBOARD_ROOT", {
                    projectId: projectId,
                }),
            );
        }
    };

    const debouncedUpdate = debounce(update, 400);

    const handleChange = () => {
        if (!scene) return;
        if (!scene.file_id) return;

        const updatedObjects = editor?.exportObjects();

        debouncedUpdate({
            id: sceneId,
            requestBody: {
                ...scene,
                file_id: scene.file_id,
                objects: updatedObjects,
            },
        });
    };

    const { handleReady, editor, selectedObjects } = useFabricEditor({
        onChange: handleChange,
    });

    useEffect(() => {
        if (selectedObjects.length === 0) {
            setEditor(null);
        } else if (selectedObjects[0] instanceof Textbox) {
            setEditor(editor);
        }
    }, [selectedObjects, editor]);

    const file = useMemo(() => {
        return scene?.file?.url;
    }, [scene?.file]);

    const loaded = usePreloadImages(file ? [file] : undefined);

    const isLoad =
        isLoading ||
        isProjectLoading ||
        !scene?.file ||
        (scene.file.type == FileTypeEnum.VIDEO ? false : !loaded);

    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    // const [volume, setVolume] = useState(1);

    // const handleVolumeChange = ([value]: [number]) => {
    //     const volumeInRange = value / 100;
    //     setVolume(volumeInRange);
    // };

    const [listType, setListType] = useState<string | null>("mediaList");

    const isGenerating = !scene?.file?.url;

    const playbackRate = useMemo(() => {
        if (
            !scene?.file?.duration ||
            !scene.voiceover?.duration ||
            scene.file.duration > scene.voiceover.duration
        )
            return 1;
        return scene.file.duration / scene.voiceover.duration;
    }, [scene?.file?.duration, scene?.voiceover?.duration]);

    const handleRemoveFile = () => {
        if (!scene || !files) return;
        if (!scene.file_id) return;

        removeFile({ id: scene.file_id });

        const fileId =
            files.items.find((item) => !!item.url)?.id ?? files.items[0].id;

        update({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: fileId,
            },
        });
    };

    const handleRegenerateFile = () => {
        if (
            scene?.file?.video_generation?.generation_config_name ===
            "comfyui/lip-sync"
        ) {
            open("lipsyncDialog");
        }
    };

    const voiceover = useMemo(() => {
        return scene?.file?.video_generation?.generation_config_name ===
            "comfyui/lip-sync"
            ? undefined
            : scene?.voiceover?.url;
    }, [scene]);

    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isSuccess) return;
        setDuration(+scene.duration!);
    }, [isSuccess]);

    const handleChangeDuration = (newDuration: number) => {
        if (!scene) return;
        if (!scene.file_id) return;
        update({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: scene.file_id,
                duration: newDuration,
            },
        });
    };
    const { data: music } = useMusicGetById(
        { id: project?.music_id ?? "" },
        { enabled: !!project?.music_id },
    );

    const { data: scenes } = useSceneList(
        { projectId: projectId },
        { enabled: !!music },
    );

    const sceneMusicTrim = useMemo(() => {
        if (!scenes?.items) return undefined;
        let startDuration = 0;
        let endDuration = 0;

        for (const item of scenes.items) {
            if (item.id !== scene?.id) {
                startDuration += +item.duration!;
            } else {
                endDuration = startDuration + +item.duration!;
                break;
            }
        }

        return { startDuration, endDuration };
    }, [scenes, scene?.id]);

    const filesScene: any = useMemo(() => {
        if (!scene || !project) return [];
        return [
            { url: scene.voiceover?.url, type: FileTypeEnum.AUDIO },
            { url: scene.sound_effect?.url, type: FileTypeEnum.AUDIO },
            { url: project.music?.file.url, type: FileTypeEnum.MUSIC },
            { url: scene.file?.url, type: FileTypeEnum.VIDEO },
        ].filter(({ url }) => url);
    }, [scene?.voiceover, scene?.sound_effect, scene?.file, project?.music]);

    const { loaded: isReady } = useMediaPrefetch({ files: filesScene });

    return (
        <Flex
            p="6"
            direction="column"
            gap="5"
            flexGrow="1"
        >
            <Flex
                // justify="between"
                align="center"
            >
                <button
                    onClick={handleBack}
                    className="flex gap-x-2 text-gray-400"
                >
                    <ArrowLeft />
                    <Text>Back</Text>
                </button>
                {scene && (
                    <Flex
                        align="center"
                        gap="3"
                        mr="9"
                        ml="auto"
                    >
                        <Text>Duration:</Text>
                        <Flex width="200px">
                            <RangeSlider
                                value={duration}
                                initialValue={scene.duration}
                                onChange={setDuration}
                                onDebouncedChange={handleChangeDuration}
                                max={30}
                            />
                        </Flex>
                    </Flex>
                )}
            </Flex>
            <Flex
                flexGrow="1"
                justify="center"
                align="center"
                gap="3"
            >
                {isLoad ? (
                    <>
                        <Spinner />
                        <Text
                            color="gray"
                            size="2"
                        >
                            Loading...
                        </Text>
                    </>
                ) : (
                    <Flex
                        flexGrow="1"
                        align="center"
                        justify="center"
                        direction="column"
                        height="100%"
                        gap="4"
                    >
                        <Flex
                            flexGrow="1"
                            flexBasis="0"
                            height="0"
                            width="100%"
                            gap="3"
                            justify="center"
                        >
                            <Flex
                                position="relative"
                                direction="column"
                                justify="center"
                                align="center"
                                flexGrow="1"
                                flexBasis="0"
                                width="0"
                            >
                                <Flex
                                    position="absolute"
                                    direction="column"
                                    justify="center"
                                    align="center"
                                    height={width}
                                    width={height}
                                    maxWidth="100%"
                                    maxHeight="100%"
                                    style={{ aspectRatio }}
                                >
                                    <Box
                                        position="absolute"
                                        height={height}
                                        width={width}
                                        style={{ aspectRatio }}
                                    >
                                        {isGenerating ? (
                                            <Flex
                                                position="relative"
                                                width="100%"
                                                height="100%"
                                            >
                                                <FileGeneratingCard
                                                    file={scene.file!}
                                                    onRegenerate={
                                                        handleRegenerateFile
                                                    }
                                                    onRemove={handleRemoveFile}
                                                />
                                            </Flex>
                                        ) : (
                                            <>
                                                <Flex
                                                    className="size-full bg-black"
                                                    justify="center"
                                                    align="center"
                                                >
                                                    {scene.file!.type ===
                                                    FileTypeEnum.VIDEO ? (
                                                        <FileSyncMedia
                                                            isReady={isReady}
                                                            musicTrim={
                                                                sceneMusicTrim
                                                            }
                                                            musicSrc={
                                                                music?.file.url
                                                            }
                                                            videoSrc={
                                                                scene.file!.url
                                                            }
                                                            voiceoverSrc={
                                                                voiceover
                                                            }
                                                            soundEffectSrc={
                                                                scene
                                                                    .sound_effect
                                                                    ?.url
                                                            }
                                                            isPlaying={
                                                                isPlaying
                                                            }
                                                            onEnded={
                                                                handleEnded
                                                            }
                                                            playbackRate={
                                                                playbackRate
                                                            }
                                                            duration={
                                                                scene.duration!
                                                            }
                                                        />
                                                    ) : (
                                                        // <Video
                                                        //     className="h-full"
                                                        //     src={
                                                        //         scene.file!.url
                                                        //     }
                                                        //     isPlaying={
                                                        //         isPlaying
                                                        //     }
                                                        //     onEnded={
                                                        //         handleEnded
                                                        //     }
                                                        //     volume={volume}
                                                        // />
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            className="max-h-full"
                                                            src={
                                                                scene.file!
                                                                    .url ?? ""
                                                            }
                                                            alt="Scene"
                                                        />
                                                    )}
                                                </Flex>
                                                <FabricCanvas
                                                    className="absolute left-0 top-0 size-full"
                                                    onReady={handleReady}
                                                    initialObjects={
                                                        scene.objects
                                                    }
                                                />
                                            </>
                                        )}
                                    </Box>
                                </Flex>
                            </Flex>
                            <SceneStoryboardToolbar
                                activeTool={listType}
                                editor={editor}
                                file={scene.file}
                                isPlaying={isPlaying}
                                projectId={projectId}
                                sceneId={sceneId}
                                togglePlay={togglePlay}
                                onChangeActiveTool={setListType}
                                actionDescription={scene.action_description}
                            />
                        </Flex>
                        <Flex
                            gap="4"
                            width="100%"
                            position="relative"
                            align="center"
                            height={listType !== null ? "150px" : "0"}
                            style={{
                                transition: "height 0.3s ease-in-out",
                            }}
                        >
                            {listType === "mediaList" ? (
                                <StoryboardSceneMediaList
                                    projectId={projectId}
                                    sceneId={sceneId}
                                />
                            ) : listType === "voiceover" ? (
                                <StoryboardSceneVoiceoverList
                                    projectId={projectId}
                                    sceneId={sceneId}
                                />
                            ) : listType === "soundEffect" ? (
                                <StoryboardSceneSoundEffectList
                                    projectId={projectId}
                                    sceneId={sceneId}
                                />
                            ) : (
                                <></>
                            )}
                        </Flex>
                    </Flex>
                )}
            </Flex>
            <LipsyncDialog
                sceneId={sceneId}
                projectId={projectId}
            />
        </Flex>
    );
};

export default StoryboardScenePage;
