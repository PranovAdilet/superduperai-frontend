import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Flex } from "@radix-ui/themes";
import { Header } from "@/widgets/header";
import { ImageViewerDialog, VideoViewerDialog } from "@/shared/ui";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Flex
            direction="column"
            height="100vh"
        >
            <Header />
            {children}
            <ImageViewerDialog />
            <VideoViewerDialog />
        </Flex>
    );
};

export default MainLayout;
