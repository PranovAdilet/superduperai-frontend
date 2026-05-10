import { FileVideoGenerationForm } from "@/entities/file";
import { useUserMe } from "@/entities/user";
import { useProjectVideoAnimateAll } from "@/features/project-video";
import { useAuthStore, useModal } from "@/shared/store";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState, type FC } from "react";

type ModalProps = {
    projectId: string;
};

export const ProjectVideoAnimateAllDialog: FC = () => {
    const { isOpen = true, type, close, data } = useModal<ModalProps>();
    const token = useAuthStore((state) => state.token);
    const isModalOpen = isOpen && type === "projectVideoAnimateAllDialog";
    const { mutate: animateAll, isPending } = useProjectVideoAnimateAll();

    const { data: user } = useUserMe({ enabled: !!token });

    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/ltx",
    );

    const [duration, setDuration] = useState<null | string | undefined>("5");

    const [proRequired, setProRequired] = useState<boolean>(false);

    const handleAnimateAll = () => {
        if (!data || !generationConfig) return;

        const durationFormat = duration ? +duration : 5;

        animateAll(
            {
                id: data.projectId,
                generationConfigName: generationConfig,
                duration: durationFormat,
            },
            {
                onSuccess: () => {
                    close();
                },
            },
        );
    };

    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content width="340px">
                <Dialog.Title size="7">Animate all scenes</Dialog.Title>

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
                    <FileVideoGenerationForm
                        vip={user?.vip}
                        generationConfig={generationConfig}
                        onGenerationConfigChange={setGenerationConfig}
                        onProRequired={setProRequired}
                        duration={duration}
                        onDurationChange={setDuration}
                    />
                    <Flex
                        justify="end"
                        gap="2"
                    >
                        <Button
                            color="gray"
                            size="3"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="lime"
                            size="3"
                            disabled={isPending || proRequired}
                            onClick={handleAnimateAll}
                            loading={isPending}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
