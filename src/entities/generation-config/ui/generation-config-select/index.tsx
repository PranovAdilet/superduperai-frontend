import type { FC } from "react";
import { useMemo } from "react";

import { useGenerationConfigList } from "@/entities/generation-config";
import type { GenerationTypeEnum } from "@/shared/api";
import { Badge, Flex } from "@radix-ui/themes";
import type { SelectLabelProps } from "@/shared/ui";
import { Select } from "@/shared/ui";

type Props = {
    value: string | null;
    onChange?: (value: string | null) => void;
    types?: GenerationTypeEnum[];
    label?: string;
    labelProps?: SelectLabelProps;
};

const configLabel = (name: string, price: number, badge?: "BASE" | "PRO") => {
    return (
        <Flex
            gap="2"
            justify="between"
        >
            {name}
            <Badge color="cyan">{price} credits per sec.</Badge>
            {badge && (
                <Badge color={badge === "BASE" ? "lime" : "yellow"}>
                    {badge}
                </Badge>
            )}
        </Flex>
    );
};

export const GenerationConfigSelect: FC<Props> = ({
    value,
    onChange,
    types = [],
    label = "Image model",
    labelProps,
}) => {
    const { data, isLoading } = useGenerationConfigList({ limit: 100 });

    const configs = useMemo(() => {
        return data?.items.filter((model) => types.includes(model.type)) ?? [];
    }, [data]);

    const options = useMemo(() => {
        return configs.map((config) => ({
            value: config.name,
            label: configLabel(
                config.label ?? config.name,
                +(config.params.price_per_second ?? 1),
                config.params.vip_required ? "PRO" : "BASE",
            ),
        }));
    }, [configs]);

    return (
        <Select
            label={label}
            className={"w-full"}
            value={value}
            onChange={onChange}
            options={options}
            isLoading={isLoading}
            labelProps={labelProps}
        />
    );
};
