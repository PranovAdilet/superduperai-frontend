"use client";

import type { IProjectRead } from "@/shared/api";
import { DataTypeEnum, ProjectTypeEnum } from "@/shared/api";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { type ReactNode, useMemo, type FC } from "react";

import { useProjectDataStatus } from "../../hooks/helpers";
import { DateLabel, Image } from "@/shared/ui";
import { useFileById } from "@/entities/file";
import logo from "@/../public/logo.svg";
import { getPath } from "@/shared/config/routes";

type Props = {
    project: IProjectRead;
    onClick: (routePath: string) => void;
    isDekstop?: boolean;
    actionsList?: ReactNode;
};

export const MyProjectCard: FC<Props> = ({
    project,
    onClick,
    isDekstop,
    actionsList,
}) => {
    const data = useProjectDataStatus(project);

    const { data: file } = useFileById(
        { id: project.data[0]?.value?.file_id },
        { enabled: !!project.data[0]?.value?.file_id },
    );

    const handleClick = () => {
        let routePath = getPath("PROJECT_VIDEO_EDIT_SCRIPT", {
            projectId: project.id,
        });

        if (
            project.type === ProjectTypeEnum.MEDIA ||
            project.type === ProjectTypeEnum.IMAGE
        ) {
            routePath = getPath("PROJECT_IMAGE_DETAIL", {
                projectId: project.id,
            });
        }

        if (data?.type === DataTypeEnum.STORYBOARD) {
            if (isDekstop) {
                routePath = getPath("PROJECT_VIDEO_EDIT_VIDEO", {
                    projectId: project.id,
                });
            } else {
                routePath = getPath("PREVIEW_PROJECT", {
                    projectId: project.id,
                });
            }
        }

        if (data?.type === DataTypeEnum.ENTITIES_JSON) {
            routePath = getPath("PROJECT_VIDEO_EDIT_ENTITIES", {
                projectId: project.id,
            });
        }

        if (data?.type === DataTypeEnum.SCRIPT) {
            routePath = getPath("PROJECT_VIDEO_EDIT_STYLE", {
                projectId: project.id,
            });
        }

        onClick(routePath);
    };

    const thumbnail = useMemo(() => {
        return project.thumbnail_url ?? file?.thumbnail_url;
    }, [project.thumbnail_url, file?.thumbnail_url]);

    return (
        <Card
            key={project.id}
            onClick={handleClick}
            className="relative w-full cursor-pointer pl-3"
        >
            {actionsList}
            <Flex
                justify="between"
                flexGrow="1"
            >
                <Flex
                    flexGrow="1"
                    gap="3"
                >
                    <Flex
                        width="160px"
                        height="160px"
                    >
                        <Image
                            className="rounded-lg"
                            src={thumbnail ?? logo}
                        />
                    </Flex>
                    <Flex
                        direction="column"
                        gap="2"
                        flexBasis="0"
                        flexGrow="1"
                        width="0"
                    >
                        <Box flexGrow="1">
                            <Text
                                as="p"
                                className="line-clamp-3"
                            >
                                {project.config?.prompt}
                            </Text>
                        </Box>
                        <Text
                            color="gray"
                            size="2"
                            as="p"
                            align="right"
                        >
                            <DateLabel isoDate={project.created_at} />
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};
