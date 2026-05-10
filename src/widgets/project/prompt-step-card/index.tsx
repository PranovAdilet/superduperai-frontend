"use client";

import { ProjectStepCard, useProjectGetById } from "@/entities/project";
import { getPath } from "@/shared/config";
import { Box, Flex, Skeleton, Text } from "@radix-ui/themes";
import { type FC } from "react";

type Props = {
    projectId: string;
    active?: boolean;
};

export const PromptStepCard: FC<Props> = ({ projectId, active }) => {
    const { data: project, isLoading } = useProjectGetById({ id: projectId });

    const href = getPath("PROJECT_VIDEO_EDIT_PROMPT", { projectId });

    return (
        <ProjectStepCard
            active={active}
            title="IDEA"
            actionBtn={
                <span
                    className="font-medium hover:underline"
                    style={{
                        color: "var(--accent-a11)",
                        textDecorationThickness: "1px",
                        textDecorationColor:
                            "color-mix(in oklab, var(--accent-a5), var(--gray-a6))",
                    }}
                >
                    EDIT
                </span>
            }
            loading={isLoading}
            loadingFallback={
                <Skeleton
                    height="16px"
                    width="90%"
                />
            }
            id="step0"
            route={href}
        >
            <Flex px="3">
                <Box
                    flexGrow="1"
                    flexBasis="0"
                    width="0"
                >
                    <Text
                        color="gray"
                        wrap="pretty"
                        className="line-clamp-2"
                    >
                        {project?.config?.prompt}
                    </Text>
                </Box>
            </Flex>
        </ProjectStepCard>
    );
};
