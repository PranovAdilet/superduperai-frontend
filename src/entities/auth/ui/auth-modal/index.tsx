"use client";

import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config";
import { useModal } from "@/shared/store";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";

export const AuthDialog = () => {
    const { isOpen, type, close } = useModal();

    const isAuthModalOpen = isOpen && type === "authDialog";

    const { push } = useRouter();

    const onSignIn = () => {
        push(getPath("HOME"));
    };

    return (
        <Dialog.Root
            open={isAuthModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content>
                <Dialog.Title
                    align="center"
                    className="text-xl md:text-2xl"
                >
                    Sign In Required
                </Dialog.Title>

                <Text
                    align="center"
                    mt="2"
                    as="p"
                >
                    Please sign in for edit this video.
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
                            size="3"
                            onClick={onSignIn}
                        >
                            Sign In
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
