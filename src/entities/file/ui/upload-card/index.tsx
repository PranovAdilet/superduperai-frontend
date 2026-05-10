import { Image } from "@/shared/ui";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { Download } from "lucide-react";
import type { FC, ReactNode } from "react";

type Props = {
    imageSrc?: string;
    loading?: boolean;
    label?: string;
    handleClick: () => void;
    children?: ReactNode;
};

export const UploadCard: FC<Props> = ({
    handleClick,
    imageSrc,
    label,
    loading,
    children,
}) => {
    if (loading) {
        return <Spinner />;
    }
    return (
        <>
            {imageSrc ? (
                <Image
                    height="100%"
                    width="100%"
                    src={imageSrc}
                    contain
                >
                    <Box
                        className="rounded-md bg-black/60"
                        position="absolute"
                        left="1"
                        top="1"
                        px="1"
                    >
                        <Text className="text-white">{label}</Text>
                    </Box>
                    <Flex
                        position="absolute"
                        bottom="1"
                        right="1"
                        gap="1"
                    >
                        {children}
                    </Flex>
                </Image>
            ) : (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    height="100%"
                    width="100%"
                    onClick={handleClick}
                >
                    <Download />
                    {label && <Text>{label}</Text>}
                </Flex>
            )}
        </>
    );
};
