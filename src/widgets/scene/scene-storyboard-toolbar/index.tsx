"use client";

import { animatingTool, inpaintingTool } from "@/features/file";
import type { IFileRead } from "@/shared/api";
import { FileTypeEnum } from "@/shared/api";
import { useFileViewer } from "@/shared/hooks";
import { useModal } from "@/shared/store";
import type { FabricEditor } from "@/shared/ui";
import { Button, Flex, Tooltip } from "@radix-ui/themes";
import {
    AudioLines,
    AudioWaveform,
    Download,
    Image,
    MicVocal,
    Palette,
    Pause,
    Play,
    Sparkles,
    Type,
} from "lucide-react";

import type { FC } from "react";

type Props = {
    file?: IFileRead | null;
    actionDescription?: string;
    editor?: FabricEditor;
    isPlaying?: boolean;
    togglePlay?: () => void;

    activeTool: string | null;
    onChangeActiveTool: (value: string | null) => void;

    projectId: string;
    sceneId?: string;
};

export const SceneStoryboardToolbar: FC<Props> = ({
    file,
    actionDescription,
    editor,
    isPlaying,
    activeTool,
    projectId,
    sceneId,
    togglePlay,
    onChangeActiveTool,
}) => {
    const handleAddText = () => {
        editor?.addText("Text", {
            fill: "white",
        });
    };

    const handleDownload = () => {
        if (!file?.url) return;
        const imageUrl = file.url;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = file.id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleChangeTool = (value: string) => {
        const newValue = activeTool === value ? null : value;
        onChangeActiveTool(newValue);
    };

    const { zoomImage } = useFileViewer();

    const open = useModal((state) => state.open);

    const handleInpainting = () => {
        if (!file) return;

        if (file.type !== FileTypeEnum.IMAGE) return;

        const tool = inpaintingTool({
            file,
            projectId,
            sceneId,
            isActive: true,
            onGenerating: () => {
                onChangeActiveTool("mediaList");
            },
        });

        zoomImage(file, [tool]);
    };

    const handleAnimating = () => {
        if (!file) return;

        if (file.type !== FileTypeEnum.IMAGE) return;

        const tool = animatingTool({
            animatingPrompt: actionDescription ?? "",
            file,
            projectId,
            sceneId,
            isActive: true,
            onGenerating: () => {
                onChangeActiveTool("mediaList");
            },
        });

        zoomImage(file, [tool]);
    };

    const handleToolClick = (tool: any) => {
        if (tool.type) {
            tool.onClick(tool.type);
        } else {
            tool.onClick();
        }
    };

    const handeLipsync = () => {
        open("lipsyncDialog");
    };

    const tools = [
        {
            icon: <Download />,
            content: "Download",
            onClick: handleDownload,
            hidden: !file?.url,
        },

        {
            icon: <Image />,
            type: "mediaList",
            content: "Edit media",
            onClick: handleChangeTool,
            hidden: !sceneId,
        },

        {
            icon: <MicVocal />,
            type: "voiceover",
            content: "Voiceover",
            onClick: handleChangeTool,
            hidden: !sceneId,
        },
        {
            icon: <AudioLines />,
            type: "soundEffect",
            content: "Sound effect",
            onClick: handleChangeTool,
            hidden: !sceneId,
        },
        {
            icon: <Sparkles />,
            type: "animating",
            content: "Animating",
            onClick: handleAnimating,
            hidden: file?.type !== FileTypeEnum.IMAGE,
        },
        {
            icon: <Palette />,
            type: "inpainting",
            content: "Inpainting",
            onClick: handleInpainting,
            hidden: file?.type !== FileTypeEnum.IMAGE,
        },
        {
            icon: <AudioWaveform />,
            type: "lipsync",
            content: "Lip sync",
            onClick: handeLipsync,
        },
        {
            icon: <Type />,
            content: "Add text",
            onClick: handleAddText,
            hidden: !sceneId,
        },
        {
            icon: isPlaying ? <Pause /> : <Play />,
            content: isPlaying ? "Pause" : "Play",
            onClick: togglePlay,
            hidden: file?.type !== FileTypeEnum.VIDEO,
        },
    ];

    const visibleTools = tools.filter((tool) => !tool.hidden);

    return (
        <Flex
            direction="column"
            gap="3"
            justify="center"
        >
            {visibleTools.map((tool, index) => (
                <Tooltip
                    content={tool.content}
                    key={index}
                >
                    <Button
                        onClick={() => {
                            handleToolClick(tool);
                        }}
                        variant="outline"
                        style={{
                            width: "48px",
                            height: "48px",
                        }}
                        color={activeTool === tool.type ? "lime" : "gray"}
                    >
                        {tool.icon}
                    </Button>
                </Tooltip>
            ))}
        </Flex>
    );
};
