import type { EntityData } from "@/entities/entity";
import { EntityForm } from "@/entities/entity";
import { useEntityUpdate } from "@/features/entity";
import type { IEntityRead, IEntityUpdate } from "@/shared/api";
import { useModal } from "@/shared/store";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { X } from "lucide-react";
import { type FC } from "react";
import { useWindowSize } from "react-use";

type Props = {
    entity?: IEntityRead;
    onEntityUpdate?: (entities: IEntityRead) => void;
};

export const EntityUpdateDialog: FC<Props> = ({ entity, onEntityUpdate }) => {
    const { isOpen = true, type, close } = useModal();
    const isModalOpen = isOpen && type === "entityUpdateDialog";
    const { mutate: update, isPending } = useEntityUpdate();
    const { width } = useWindowSize();

    const handleSubmit = (data: EntityData) => {
        update(data as IEntityUpdate, {
            onSuccess: (e) => {
                close();
                onEntityUpdate?.(e);
            },
        });
    };

    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content width={width < 768 ? "100%" : "500px"}>
                <Dialog.Title size="7">
                    <Flex justify="between">
                        <Text>Edit {entity?.type}</Text>
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
                        type={entity?.type}
                        onSubmit={handleSubmit}
                        entity={entity}
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
                            Save
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
