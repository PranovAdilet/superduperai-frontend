"use client";

import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Select, TextArea } from "@/shared/ui";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import {
    type IFileRead,
    type IAudioGenerationRead,
    AudioTypeEnum,
    FileTypeEnum,
} from "@/shared/api";

import { FileUploader, useFileGenerateAudio } from "@/features/file";
import { UploadButton } from "@/entities/file";
import { VoiceSelect } from "@/entities/voice";

type Props = {
    projectId?: string;
    sceneId?: string;
    audioType: AudioTypeEnum;
    initialValue?: IAudioGenerationRead;
    onComplete?: (file?: IFileRead) => void;
};

export const FileAudioGenerate: FC<Props> = ({
    projectId,
    sceneId,
    audioType,
    initialValue,
    onComplete,
}) => {
    const { mutateAsync: generateAudio, isPending: isGenerating } =
        useFileGenerateAudio();

    const [audioPrompt, setAudioPrompt] = useState(initialValue?.prompt ?? "");

    const [voice, setVoice] = useState<string | null>(
        initialValue?.voice_name ?? null,
    );

    const [duration, setDuration] = useState<number>(10);

    const handleGenerate = async () => {
        try {
            const file = await generateAudio({
                requestBody: {
                    project_id: projectId,
                    scene_id: sceneId,
                    config: {
                        ...initialValue,
                        type: audioType,
                        prompt: audioPrompt,
                        voice_name: voice,
                        duration: duration,
                    },
                },
            });
            onComplete?.(file);
        } catch (error: unknown) {
            console.error("Failed to generate audio:", error);
        }
    };

    const handleDurationChange = (value: string | null) => {
        setDuration(value ? parseInt(value) : 1);
    };

    const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setAudioPrompt(e.target.value);
    };

    const handleUpload = (file: IFileRead) => {
        onComplete?.(file);
    };

    return (
        <Flex
            flexGrow="1"
            gap="5"
        >
            <Flex
                className="flex-1"
                gap="5"
                direction="column"
            >
                <TextArea
                    full
                    label="Audio Prompt"
                    value={audioPrompt}
                    onChange={handlePromptChange}
                    disabled={isGenerating}
                    className="grow rounded-3xl"
                />

                {audioType === AudioTypeEnum.VOICEOVER && (
                    <VoiceSelect
                        value={voice}
                        onChange={setVoice}
                    />
                )}

                {audioType === AudioTypeEnum.SOUND_EFFECT && (
                    <Select
                        label="Duration"
                        value={duration ? duration.toString() : null}
                        options={[
                            { value: "1", label: "1 second" },
                            { value: "2", label: "2 seconds" },
                            { value: "3", label: "3 seconds" },
                            { value: "4", label: "4 seconds" },
                            { value: "5", label: "5 seconds" },
                            { value: "6", label: "6 seconds" },
                            { value: "7", label: "7 seconds" },
                            { value: "8", label: "8 seconds" },
                            { value: "9", label: "9 seconds" },
                            { value: "10", label: "10 seconds" },
                        ]}
                        onChange={handleDurationChange}
                    />
                )}

                <Button
                    loading={isGenerating}
                    variant="classic"
                    size="2"
                    className="rounded-2xl p-5 py-6"
                    onClick={handleGenerate}
                >
                    <Text
                        weight="medium"
                        size="3"
                    >
                        Generate Audio
                    </Text>
                </Button>

                <Flex
                    align="center"
                    gap="4"
                >
                    <Separator size="4" />
                    <Text>OR</Text>
                    <Separator size="4" />
                </Flex>

                <FileUploader
                    projectId={projectId}
                    sceneId={sceneId}
                    type={
                        audioType === AudioTypeEnum.VOICEOVER
                            ? FileTypeEnum.VOICEOVER
                            : FileTypeEnum.SOUND_EFFECT
                    }
                    onUpload={handleUpload}
                >
                    {(handleClick, isPending) => (
                        <UploadButton
                            onClick={handleClick}
                            loading={isPending}
                            disabled={isGenerating}
                        >
                            Upload Own Audio
                        </UploadButton>
                    )}
                </FileUploader>
            </Flex>
        </Flex>
    );
};
