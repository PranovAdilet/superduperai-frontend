"use client";

import { useAuthStore, useModal } from "@/shared/store";
import {
    Box,
    Button,
    Dialog,
    Flex,
    Progress,
    Spinner,
    Text,
} from "@radix-ui/themes";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useProjectVideoRenderStore } from "@/entities/project-video";
import type { IFileRead } from "@/shared/api";
import { useUserMe } from "@/entities/user";
import { SubscriptionRequirementWarning } from "@/shared/ui";
import { usePlayerSettingsStore } from "@/remotion/store";

type Props = {
    isPublic?: boolean;
    isRendering: boolean;
    isPending: boolean;
    showWatermark?: boolean;
    onShowWatermarkChange?: (value: boolean) => void;
    onDownload: (file: IFileRead) => void;
    onExport: (
        isPublic?: boolean, // {
        //     resolution,
        //     frameRate,
        // }: {
        //     resolution: string;
        //     frameRate: string;
        // }
    ) => void;
};

export const ProjectVideoExportDialog: FC<Props> = ({
    onExport,
    onDownload,
    isPending,
    isPublic: isProjectPublic,
    isRendering,
    showWatermark: showProjectWatermark,
    onShowWatermarkChange,
}) => {
    const { isOpen, type, close } = useModal();
    const token = useAuthStore((state) => state.token);
    const { progress, result, setState } = useProjectVideoRenderStore();
    const { data: user } = useUserMe({ enabled: !!token });

    const setPlayerState = usePlayerSettingsStore((state) => state.setState);

    // const [frameRate, setFrameRate] = useState("30");
    // const [resolution, setResolution] = useState("720p");

    const [isPublic, setIsPublic] = useState(true);
    const [showWatemark, setShowWatemark] = useState(true);

    useEffect(() => {
        if (!isProjectPublic) return;
        setIsPublic(isProjectPublic);
    }, [isProjectPublic]);

    useEffect(() => {
        if (showProjectWatermark == null) return;
        setShowWatemark(showProjectWatermark);
    }, [showProjectWatermark]);

    const handlePublicClick = () => {
        setIsPublic(!isPublic);
    };

    const handleWatemarkClick = () => {
        if (user?.vip) {
            setPlayerState({ showWatemark: !showWatemark });
            onShowWatermarkChange?.(!showWatemark);
        }
        setShowWatemark(!showWatemark);
    };

    const isModalOpen = isOpen && type == "projectVideoExportDialog";

    const handleExport = () => {
        onExport(isPublic);
        setState({ result: null });
    };
    const handleDownload = () => {
        if (!result) return;
        onDownload(result);
    };

    useEffect(() => {
        if (!result || !progress) return;
        onDownload(result);
        setState({ progress: null });
        close();
    }, [result]);

    const exportText = useMemo(() => {
        if (!isRendering) {
            return "Confirm and export →";
        }
        if (progress === 100) {
            return "Downloading...";
        }
        return progress === null ? "Preparing..." : `Rendering... ${progress}%`;
    }, [isRendering, progress]);

    const isDisabled = useMemo(() => {
        return !isPublic || !showWatemark ? !user?.vip : false;
    }, [isPublic, showWatemark, user]);

    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content>
                <Dialog.Title
                    size="7"
                    align="center"
                >
                    Export Your Video
                </Dialog.Title>

                <Flex
                    flexGrow="1"
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="2"
                >
                    <Flex
                        width="100%"
                        gap="5"
                        py="5"
                    >
                        {!isRendering ? (
                            <>
                                <Flex
                                    align="center"
                                    gap="5"
                                >
                                    <Flex
                                        direction="column"
                                        gap="3"
                                    >
                                        <CheckLayout
                                            isTrue={isPublic}
                                            onClick={handlePublicClick}
                                            title="Public"
                                        />
                                        <CheckLayout
                                            isTrue={showWatemark}
                                            onClick={handleWatemarkClick}
                                            title="Watemark"
                                        />
                                    </Flex>
                                    {(!isPublic || !showWatemark) &&
                                        !user?.vip && (
                                            <SubscriptionRequirementWarning type="option" />
                                        )}
                                </Flex>
                                {/* <Flex
                                    direction="column"
                                    gap="2"
                                    className="flex-1"
                                >
                                    <Text as="p">Resolution</Text>
                                    <Box className="rounded-xl bg-zinc-950">
                                        <Tabs
                                            full
                                            variant="switch"
                                            value={resolution}
                                            onValueChange={setResolution}
                                            options={[
                                                {
                                                    value: "720p",
                                                    label: "720p",
                                                },
                                                {
                                                    value: "1080p",
                                                    label: "1080p",
                                                },
                                            ]}
                                        />
                                    </Box>
                                </Flex>
                                <Flex
                                    direction="column"
                                    gap="2"
                                    className="flex-1"
                                >
                                    <Text as="p">Frame rate</Text>
                                    <Box className="rounded-xl bg-zinc-950">
                                        <Tabs
                                            full
                                            value={frameRate}
                                            onValueChange={setFrameRate}
                                            variant="switch"
                                            options={[
                                                { value: "30", label: "30" },
                                                { value: "60", label: "60" },
                                            ]}
                                        />
                                    </Box>
                                </Flex> */}
                            </>
                        ) : (
                            <Flex
                                flexGrow="1"
                                justify="center"
                            >
                                {progress !== null ? (
                                    <Progress value={progress} />
                                ) : (
                                    <Spinner />
                                )}
                            </Flex>
                        )}
                    </Flex>

                    <Flex
                        justify="between"
                        gap="3"
                    >
                        <Box flexGrow="1">
                            {result && (
                                <Button
                                    color="gray"
                                    variant="solid"
                                    onClick={handleDownload}
                                >
                                    Download latest
                                </Button>
                            )}
                        </Box>
                        <Button
                            variant="solid"
                            onClick={handleExport}
                            disabled={isDisabled || isRendering}
                            loading={isPending}
                        >
                            {exportText}
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

type LayoutProps = {
    isTrue: boolean;
    onClick: () => void;
    title: string;
};

const CheckLayout: FC<LayoutProps> = ({ isTrue, onClick, title }) => {
    return (
        <Flex
            gap="3"
            align="center"
            role="button"
            onClick={onClick}
        >
            <Text className="w-[80px]">{title}</Text>
            <Flex
                p="2"
                className="rounded-xl border border-gray-600"
            >
                <Text
                    className="w-[40px] text-center"
                    weight="medium"
                >
                    {isTrue ? "Yes" : "No"}
                </Text>
            </Flex>
        </Flex>
    );
};
