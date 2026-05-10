import StoryboardScenesEditPage from "@/pages_/project-edit/video/storyboard-scenes-edit-page";
import type { PageProps } from "@/shared/types";
import { Box, Flex } from "@radix-ui/themes";
import type { ReactNode } from "react";
import React from "react";

type Params = {
    projectId: string;
};

type Props = {
    children: ReactNode;
} & PageProps<Params>;

const Layout = ({ children, params }: Props) => {
    return (
        <Flex
            justify="center"
            flexGrow="1"
            flexBasis="0"
            height="0"
            pl="6"
        >
            <Flex
                justify="center"
                flexGrow="1"
                maxWidth="1440px"
            >
                <Flex
                    flexBasis="27%"
                    direction="column"
                    height="100%"
                >
                    <Box
                        overflowY="auto"
                        className="no-scrollbar"
                        height="100%"
                    >
                        <Flex
                            py="6"
                            height="100%"
                            width="400px"
                        >
                            <StoryboardScenesEditPage {...params} />
                        </Flex>
                    </Box>
                </Flex>
                <Flex className="flex-1">{children}</Flex>
            </Flex>
        </Flex>
    );
};

export default Layout;
