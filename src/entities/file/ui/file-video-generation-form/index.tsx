"use client";

import {
    GenerationConfigSelect,
    useGenerationConfigList,
} from "@/entities/generation-config";
import { GenerationTypeEnum } from "@/shared/api";
import { Select, SubscriptionRequirementWarning } from "@/shared/ui";
import { Badge, Flex } from "@radix-ui/themes";
import { useEffect, useMemo, type FC } from "react";

type Props = {
    vip?: boolean;
    generationConfig: string | null;
    onProRequired?: (value: boolean) => void;
    duration?: string | null;
    onDurationChange?: (value?: string | null) => void;
    onGenerationConfigChange: (value: string | null) => void;
    generationConfigTypes?: GenerationTypeEnum[];
};

const durationLabel = (name: string, price: number) => {
    return (
        <Flex
            gap="2"
            justify="between"
        >
            {name}
            <Badge color="cyan">{price} credits</Badge>
        </Flex>
    );
};

export const FileVideoGenerationForm: FC<Props> = ({
    vip,
    generationConfig,
    onGenerationConfigChange,
    onProRequired,
    duration,
    onDurationChange,
    generationConfigTypes = [
        GenerationTypeEnum.IMAGE_TO_VIDEO,
        GenerationTypeEnum.TEXT_TO_VIDEO,
    ],
}) => {
    const { data } = useGenerationConfigList({ limit: 100 });

    const selectedGenerationConfig = useMemo(
        () => data?.items.find((model) => model.name === generationConfig),
        [data, generationConfig],
    );

    const proRequired = useMemo(
        () => !vip && selectedGenerationConfig?.params.vip_required,
        [vip, selectedGenerationConfig],
    );

    useEffect(() => {
        if (proRequired) {
            onProRequired?.(true);
        } else {
            onProRequired?.(false);
        }
    }, [proRequired]);

    useEffect(() => {
        if (
            selectedGenerationConfig &&
            selectedGenerationConfig.params.available_durations?.length > 0
        ) {
            onDurationChange?.(
                `${selectedGenerationConfig.params.available_durations?.[0]}`,
            );
        } else {
            onDurationChange?.(null);
        }
    }, [selectedGenerationConfig]);

    return (
        <>
            <Flex
                direction="column"
                gap="3"
            >
                {proRequired && <SubscriptionRequirementWarning type="model" />}
                <GenerationConfigSelect
                    value={generationConfig}
                    onChange={onGenerationConfigChange}
                    types={generationConfigTypes}
                    label="Video Model"
                />
            </Flex>
            {selectedGenerationConfig &&
                selectedGenerationConfig.params.available_durations?.length >
                    0 && (
                    <Select
                        options={selectedGenerationConfig.params.available_durations.map(
                            (duration: number) => ({
                                value: duration.toString(),
                                label: durationLabel(
                                    `${duration}`,
                                    +selectedGenerationConfig.params
                                        .price_per_second * +duration,
                                ),
                            }),
                        )}
                        value={duration}
                        label="Duration"
                        onChange={onDurationChange}
                    />
                )}
        </>
    );
};
