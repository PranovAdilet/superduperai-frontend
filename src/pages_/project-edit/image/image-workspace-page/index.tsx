"use client";

import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import type { FC } from "react";
import { useState } from "react";
import { DataTypeEnum, FileTypeEnum } from "@/shared/api";
import { useProjectData, useProjectGetById } from "@/entities/project";
import { SceneStoryboardToolbar } from "@/widgets/scene";
import { FileGeneratingCard, useFileById } from "@/entities/file";
import { ProjectImageMediaList } from "@/widgets/project/project-image-media-list";
import { Video } from "@/shared/ui";

type Props = {
    projectId: string;
};

const ImageWorkspacePage: FC<Props> = ({ projectId }) => {
    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const imageData = useProjectData(project, DataTypeEnum.IMAGE);

    const { data: file, isLoading } = useFileById(
        {
            id: imageData?.value?.file_id,
        },
        {
            enabled: !!imageData?.value?.file_id,
        },
    );

    const isLoad = isLoading || isProjectLoading || !file;

    const [activeTool, setActiveTool] = useState<string | null>("mediaList");

    const [isPlaying, setIsPlaying] = useState(false);

    const isGenerating = !file?.url;

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <Flex
            p="6"
            direction="column"
            gap="5"
            flexGrow="1"
        >
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
                            width="100%"
                            gap="3"
                            justify="center"
                        >
                            <Flex
                                direction="column"
                                justify="center"
                                align="center"
                                position="relative"
                                flexGrow="1"
                            >
                                <Box
                                    flexGrow="1"
                                    flexBasis="0"
                                    height="0"
                                    position="relative"
                                >
                                    {isGenerating ? (
                                        <Flex
                                            position="relative"
                                            width="100%"
                                            height="100%"
                                        >
                                            <FileGeneratingCard file={file} />
                                        </Flex>
                                    ) : (
                                        <>
                                            <Flex
                                                className="size-full bg-black"
                                                justify="center"
                                                align="center"
                                            >
                                                {file.type ===
                                                FileTypeEnum.VIDEO ? (
                                                    <Video
                                                        src={file.url}
                                                        width="100%"
                                                        height="100%"
                                                        isPlaying={isPlaying}
                                                        onEnded={() => {
                                                            setIsPlaying(false);
                                                        }}
                                                    />
                                                ) : (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        className="max-h-full"
                                                        src={file.url ?? ""}
                                                        alt="Scene"
                                                    />
                                                )}
                                                {}
                                            </Flex>
                                        </>
                                    )}
                                </Box>
                            </Flex>
                            <SceneStoryboardToolbar
                                file={file}
                                activeTool={activeTool}
                                projectId={projectId}
                                onChangeActiveTool={setActiveTool}
                                isPlaying={isPlaying}
                                togglePlay={togglePlay}
                            />
                        </Flex>
                        <Flex
                            gap="4"
                            width="100%"
                            position="relative"
                            align="center"
                            height={activeTool !== null ? "150px" : "0"}
                            style={{
                                transition: "height 0.3s ease-in-out",
                            }}
                        >
                            {activeTool === "mediaList" ? (
                                <ProjectImageMediaList projectId={projectId} />
                            ) : (
                                <></>
                            )}
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default ImageWorkspacePage;
