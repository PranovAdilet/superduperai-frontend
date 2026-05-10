"use client";

import { useModal } from "@/shared/store";
import { Dialog, Flex, Button, Text } from "@radix-ui/themes";

type Props<T> = {
    onDelete: (entity?: T) => void;
    isPending?: boolean;
    label?: string;
};

export const DeleteDialog = <T extends Record<string, any>>({
    onDelete,
    isPending,
    label,
}: Props<T>) => {
    const { isOpen, type, close, data } = useModal<T>();

    const isModalOpen = isOpen && type === "deleteDialog";

    const handleDelete = () => {
        onDelete(data);
    };

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
                    Delete {data?.name ?? label}
                </Dialog.Title>

                <Text
                    align="center"
                    mt="2"
                    as="p"
                >
                    Are you sure you want to delete this {label}?
                </Text>

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
                    <Flex
                        justify="center"
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
                            color="red"
                            size="3"
                            disabled={isPending}
                            onClick={handleDelete}
                            loading={isPending}
                        >
                            Delete
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
