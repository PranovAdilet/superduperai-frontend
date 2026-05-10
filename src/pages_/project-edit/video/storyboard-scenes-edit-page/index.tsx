"use client";

import { useTextEditorToolbarStore } from "@/shared/store";
import { TextEditorToolbar } from "@/shared/ui";
import { SceneStoryboardList } from "@/widgets/scene";
import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { type FC } from "react";

type Props = { projectId: string };

const StoryboardScenesEditPage: FC<Props> = ({ projectId }) => {
    const { editor } = useTextEditorToolbarStore();

    const params = useParams();
    const sceneId = params.sceneId as string | undefined;

    return (
        <Flex
            direction="column"
            width="100%"
        >
            <Flex
                flexGrow="1"
                height="100%"
                maxHeight="100%"
                direction="column"
            >
                <Box
                    flexGrow="1"
                    flexBasis="0"
                    height="0"
                >
                    <ScrollArea>
                        <Flex pr="4">
                            {editor ? (
                                <TextEditorToolbar />
                            ) : (
                                <SceneStoryboardList
                                    projectId={projectId}
                                    sceneId={sceneId}
                                />
                            )}
                        </Flex>
                    </ScrollArea>
                </Box>
            </Flex>
        </Flex>
    );
};

export default StoryboardScenesEditPage;
