"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import type { Canvas } from "fabric";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { cursorName } from "./inpainting-tools";
import { SeedField, TextArea } from "@/shared/ui";
import { FileVideoGenerationForm } from "@/entities/file";
import { useUserMe } from "@/entities/user";
import { useAuthStore } from "@/shared/store";
import { GenerationTypeEnum } from "@/shared/api";

type Props = {
    canvas?: Canvas | null;
    onComplete?: (prompt: string, mask: File, generationConfig: string) => void;
    loading?: boolean;
    seed: string;
    onSeedChange: (value: string) => void;
};

export const InpaintingForm: FC<Props> = ({
    canvas,
    onComplete,
    loading,
    seed,
    onSeedChange,
}) => {
    const token = useAuthStore((state) => state.token);

    const { data: user } = useUserMe({ enabled: !!token });

    const [disabled, setDisabled] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/flux/inpainting",
    );
    const [proRequired, setProRequired] = useState<boolean>(false);

    useEffect(() => {
        if (!canvas) return;
        const updateDisable = () => {
            const filteredCanvas = canvas
                .getObjects()
                .filter((obj) => obj.get("name") !== cursorName);
            setDisabled(!filteredCanvas.length);
        };

        canvas.on("object:added", updateDisable);
        canvas.on("object:removed", updateDisable);

        return () => {
            canvas.off("object:added", updateDisable);
            canvas.off("object:removed", updateDisable);
            setDisabled(true);
        };
    }, [canvas]);

    const handleClick = () => {
        if (!canvas || !onComplete) return;

        canvas.getElement().toBlob((blob) => {
            if (!blob) return;
            onComplete(
                prompt,
                new File([blob], "mask.png"),
                generationConfig ?? "comfyui/flux/inpainting",
            );
        }, "image/png");
    };

    return (
        <Flex
            width="100%"
            height="100%"
            direction="column"
            gap="3"
            justify="end"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <FileVideoGenerationForm
                generationConfig={generationConfig}
                onGenerationConfigChange={setGenerationConfig}
                onProRequired={setProRequired}
                vip={user?.vip}
                generationConfigTypes={[GenerationTypeEnum.IMAGE_TO_IMAGE]}
            />
            <SeedField
                onChange={onSeedChange}
                value={seed}
            />

            <Text>Prompt</Text>
            <TextArea
                size="3"
                className="max-h-[200px] grow"
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                }}
                autoFocus
            />

            <Button
                loading={loading}
                disabled={disabled || proRequired}
                onClick={handleClick}
            >
                Inpaint
            </Button>
        </Flex>
    );
};
