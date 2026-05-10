import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useFileGenerateVideo } from "../../query";
import { useSceneGetById } from "@/entities/scene";
import { useSceneUpdate } from "@/features/scene";
import { FileTypeEnum, ReferenceTypeEnum } from "@/shared/api";
import { useModal } from "@/shared/store";

type Props = {
    projectId: string;
    sceneId: string;
};

export const LipsyncDialog: FC<Props> = ({ projectId, sceneId }) => {
    const { mutate: generateVideo, isPending: isGenerating } =
        useFileGenerateVideo();
    const { mutate: updateScene, isPending: isSceneUpdating } =
        useSceneUpdate();
    const { isOpen = true, close, type } = useModal();

    const { data: scene, isLoading } = useSceneGetById({ id: sceneId });

    const isModalOpen = isOpen && type === "lipsyncDialog";

    const canLipsync = useMemo(
        () => scene?.voiceover_id && scene.file?.type === FileTypeEnum.VIDEO,
        [scene],
    );

    const handleGenerate = useCallback(() => {
        if (!canLipsync || !scene) return;

        generateVideo(
            {
                requestBody: {
                    project_id: projectId,
                    scene_id: sceneId,
                    config: {
                        generation_config_name: "comfyui/lip-sync",
                        references: [
                            {
                                type: ReferenceTypeEnum.SOURCE,
                                reference_id: scene.file_id!,
                            },
                            {
                                type: ReferenceTypeEnum.VOICE,
                                reference_id: scene.voiceover_id!,
                            },
                        ],
                        duration: 5,
                    },
                },
            },
            {
                onSuccess: (data) => {
                    updateScene({
                        id: sceneId,
                        requestBody: { ...scene, file_id: data.id },
                    });
                    close();
                },
            },
        );
    }, [
        canLipsync,
        scene,
        generateVideo,
        projectId,
        sceneId,
        updateScene,
        close,
    ]);

    const isDisabled =
        !canLipsync || isLoading || isGenerating || isSceneUpdating;
    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content width="340px">
                <Dialog.Title size="7">Lipsync for Scene</Dialog.Title>

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
                    <Flex>
                        {!canLipsync ? (
                            <Text>
                                You need to select both a video and a voiceover
                                to enable lipsync.
                            </Text>
                        ) : (
                            <Text>Ready to generate lipsync.</Text>
                        )}
                    </Flex>
                    <Flex
                        justify="end"
                        gap="2"
                    >
                        <Button
                            color="gray"
                            size="3"
                            onClick={close}
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="lime"
                            size="3"
                            onClick={handleGenerate}
                            loading={isGenerating}
                            disabled={isDisabled}
                            aria-label="Submit Lipsync Generation"
                        >
                            Generate
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
