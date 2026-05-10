import type { ReactNode } from "react";
import ProjectStepsPage from "@/pages_/project-edit/video/project-steps-page";
import type { PageProps } from "@/shared/types";
import { Box, Flex } from "@radix-ui/themes";
import { AutoModeProvider } from "@/shared/providers";

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
                >
                    <Box
                        overflowY="auto"
                        className="no-scrollbar"
                    >
                        <ProjectStepsPage {...params} />
                    </Box>
                </Flex>
                <Flex className="flex-1">
                    <AutoModeProvider projectId={params.projectId}>
                        {children}
                    </AutoModeProvider>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Layout;
