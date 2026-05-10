"use client";

import type { FC } from "react";
import type { ITemplateRead } from "@/shared/api";
import { Box, Card, Text } from "@radix-ui/themes";
import { Image, Link } from "@/shared/ui";
import { getPath } from "@/shared/config/routes";

type IProps = {
    template: ITemplateRead;
};

export const TemplateCard: FC<IProps> = ({ template }) => {
    return (
        <Card
            className="p-0"
            asChild
        >
            <Link
                color="gray"
                href={getPath("PROJECT_VIDEO_CREATE_TEMPLATE", {
                    templateName: template.name,
                })}
            >
                <Box
                    width="240px"
                    height="144px"
                    position="relative"
                >
                    <Image src={template.thumbnail} />
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        style={{
                            background:
                                "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%)",
                        }}
                    ></Box>

                    <Box
                        position="absolute"
                        left="16px"
                        bottom="12px"
                    >
                        <Text
                            size="4"
                            className="text-white"
                            weight="medium"
                        >
                            {template.title}
                        </Text>
                    </Box>
                </Box>
            </Link>
        </Card>
    );
};
