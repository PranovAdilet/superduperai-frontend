import type { FC } from "react";
import React from "react";
import { Flex } from "@radix-ui/themes";
import type { ITemplateRead } from "@/shared/api";
import { TemplateCard } from "@/entities/template";

type TemplateListProps = {
    templates?: ITemplateRead[];
};

export const TemplateList: FC<TemplateListProps> = ({ templates }) => {
    return (
        <Flex
            justify="center"
            wrap="wrap"
            gap="5"
        >
            {templates?.map((template) => (
                <TemplateCard
                    key={template.name}
                    template={template}
                />
            ))}
        </Flex>
    );
};
