import type { EntityData } from "@/entities/entity";
import { EntityForm } from "@/entities/entity";
import { useEntityCreate } from "@/features/entity";
import type { EntityTypeEnum } from "@/shared/api";
import { useModal } from "@/shared/store";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { X } from "lucide-react";
import { type FC } from "react";
import { useWindowSize } from "react-use";

type ModalProps = {
    type: EntityTypeEnum;
};

export const EntityCreateDialog: FC = () => {
    const { isOpen = true, type, close, data } = useModal<ModalProps>();
    const isModalOpen = isOpen && type === "entityCreateDialog";
    const { mutate: create, isPending } = useEntityCreate();
    const { width } = useWindowSize();

    const handleSubmit = (formData: EntityData) => {
        create(
            {
                ...formData,
                type: data!.type,
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
            <Dialog.Content width={width < 768 ? "100%" : "500px"}>
                <Dialog.Title size="7">
                    <Flex justify="between">
                        <Text>Create {data?.type}</Text>
                        <button onClick={close}>
                            <X />
                        </button>
                    </Flex>
                </Dialog.Title>

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
                    <EntityForm
                        type={data?.type}
                        onSubmit={handleSubmit}
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
                            form={EntityForm.ID}
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
