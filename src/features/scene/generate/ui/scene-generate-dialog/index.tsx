import { useState, type FC } from "react";
import { useSceneGenerate } from "../..";
import { useModal } from "@/shared/store";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { TextArea } from "@/shared/ui";

type ModalProps = {
    projectId: string;
    order: number;
};

export const SceneGenerateDialog: FC = () => {
    const { isOpen = true, type, close, data } = useModal<ModalProps>();
    const isModalOpen = isOpen && type === "sceneGenerateDialog";
    const { mutate: generate, isPending } = useSceneGenerate();
    const [prompt, setPrompt] = useState<string>("");
    const handleGenerate = () => {
        if (!data) return;
        generate(
            {
                requestBody: {
                    project_id: data.projectId,
                    order: data.order,
                    prompt: prompt,
                },
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
            <Dialog.Content>
                <Dialog.Title size="7">Add scene</Dialog.Title>

                <TextArea
                    placeholder="Describe what's happening in the scenes you want to see."
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                />

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
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
                            disabled={isPending}
                            onClick={handleGenerate}
                            loading={isPending}
                        >
                            Complete
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
