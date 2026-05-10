"use client";

import { SearchField, Tabs } from "@/shared/ui";
import { StyleQueryList, useStyleList } from "@/entities/style";
import type { FC } from "react";
import { useState } from "react";
import { type IStyleRead } from "@/shared/api";
import { Flex, Text } from "@radix-ui/themes";
import { ProjectStep, useProjectGetById } from "@/entities/project";
import { useActiveScroll } from "@/shared/hooks";

type Props = {
    projectId?: string;
    onStyleChange?: (style: string | null) => void;
    style: string | null;
    dense?: boolean;
};

enum ImageModelTypeEnum {
    FLUX = "flux",
    SDXL = "sdxl",
}

export const StylesList: FC<Props> = ({
    projectId,
    onStyleChange,
    style: selectedStyle,
    dense,
}) => {
    const { data: project, isLoading: isProjectLoading } = useProjectGetById(
        {
            id: projectId!,
        },
        {
            enabled: !!projectId,
        },
    );

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [modelType, setModelType] = useState<ImageModelTypeEnum>(
        (project?.config?.image_model_type ??
            ImageModelTypeEnum.FLUX) as ImageModelTypeEnum,
    );

    const modelTypeOptions = [
        { value: ImageModelTypeEnum.FLUX, label: "FLUX" },
        { value: ImageModelTypeEnum.SDXL, label: "SDXL" },
    ];

    const {
        data: styles,
        isLoading,
        isError,
        isSuccess: isStylesSuccess,
        refetch,
    } = useStyleList({
        limit: 100,
        searchText: searchQuery,
        tags: [modelType],
        excludeTags: [project?.template_name ?? "", "lora"],
    });

    const {
        data: recomendedStyles,
        isLoading: isRecomendedLoading,
        isError: isRecomendedError,
        refetch: recomendedRefetch,
    } = useStyleList(
        {
            limit: 100,
            searchText: searchQuery,
            tags: [modelType, project?.template_name ?? ""],
        },
        {
            enabled: !!project?.template_name,
        },
    );

    const {
        data: loraStyles,
        isLoading: isLoraLoading,
        isError: isLoraError,
        refetch: loraRefetch,
    } = useStyleList({
        limit: 100,
        searchText: searchQuery,
        tags: [modelType, "lora"],
    });

    const handleModelTypeChange = (value: ImageModelTypeEnum) => {
        setModelType(value);
    };

    const handleSelectStyle = (style: IStyleRead) => {
        const newStyle = selectedStyle === style.name ? null : style.name;
        onStyleChange?.(newStyle);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const { activeRef } = useActiveScroll(isStylesSuccess);

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Flex
                    p={dense ? "3" : "6"}
                    direction="column"
                    gap="6"
                >
                    <Flex
                        justify="between"
                        align="center"
                        gap="4"
                    >
                        <Text
                            size="6"
                            weight="bold"
                        >
                            Choose a style
                        </Text>
                        <Flex
                            gap="3"
                            align="center"
                        >
                            <Tabs
                                variant="switch"
                                loading={isProjectLoading}
                                value={modelType}
                                onValueChange={handleModelTypeChange}
                                options={modelTypeOptions}
                            />
                            <SearchField
                                placeholder="Search styles..."
                                onSearch={handleSearch}
                            />
                        </Flex>
                    </Flex>
                    <StyleQueryList
                        items={recomendedStyles?.items}
                        isError={isRecomendedError}
                        isLoading={isRecomendedLoading || isLoading}
                        refetch={recomendedRefetch}
                        activeRef={activeRef}
                        heading="Recomended"
                        onSelect={handleSelectStyle}
                        selectedStyle={selectedStyle}
                        skeletonLength={4}
                    />
                    <StyleQueryList
                        items={loraStyles?.items}
                        isError={isLoraError}
                        isLoading={isLoraLoading}
                        refetch={loraRefetch}
                        activeRef={activeRef}
                        heading="Lora"
                        onSelect={handleSelectStyle}
                        selectedStyle={selectedStyle}
                    />
                    <StyleQueryList
                        items={styles?.items}
                        isError={isError}
                        isLoading={isLoading}
                        refetch={refetch}
                        activeRef={activeRef}
                        heading="All"
                        onSelect={handleSelectStyle}
                        selectedStyle={selectedStyle}
                    />
                </Flex>
            </ProjectStep.Root>
        </ProjectStep>
    );
};
