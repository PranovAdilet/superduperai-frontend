import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import type { FC, PropsWithChildren } from "react";

type ProjectStepType = FC<PropsWithChildren> & {
    Root: FC<PropsWithChildren>;
    Footer: FC<PropsWithChildren & { dense?: boolean }>;
};

const Root: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Box
            flexGrow="1"
            flexBasis="0"
            height="0"
        >
            <ScrollArea>{children}</ScrollArea>
        </Box>
    );
};

const Footer: FC<PropsWithChildren & { dense?: boolean }> = ({
    children,
    dense,
}) => {
    return (
        <Flex
            justify="end"
            p={dense ? undefined : "6"}
        >
            {children}
        </Flex>
    );
};

const ProjectStep: ProjectStepType = ({ children }: PropsWithChildren) => {
    return (
        <Flex
            direction="column"
            flexGrow="1"
            height="100%"
            maxHeight="100%"
        >
            {children}
        </Flex>
    );
};

ProjectStep.Root = Root;

ProjectStep.Footer = Footer;

export { ProjectStep };
