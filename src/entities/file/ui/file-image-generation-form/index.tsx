"use client";

import {
    GenerationConfigSelect,
    useGenerationConfigList,
} from "@/entities/generation-config";
import { useUserMe } from "@/entities/user";
import { GenerationTypeEnum, QualityTypeEnum } from "@/shared/api";
import type { SeedLabelProps, SelectLabelProps } from "@/shared/ui";
import {
    AspectRatios,
    SeedField,
    SubscriptionRequirementWarning,
    Tabs,
} from "@/shared/ui";
import { Flex, Text } from "@radix-ui/themes";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type FC,
    type ReactNode,
} from "react";

type FileImageGenerationFormContextType = {
    dense?: boolean;
    proRequired?: boolean;
    qualityDisabled?: boolean;
    onChangeQualityDisabled?: (value: boolean) => void;
    onChangeProRequired?: (value: boolean) => void;
    vip?: boolean;
};

const FileImageGenerationFormContext =
    createContext<FileImageGenerationFormContextType>({});

type RootProps = {
    children: ReactNode;
    dense?: boolean;
    onProRequired?: (value: boolean) => void;
};

const Root: FC<RootProps> = ({ children, dense, onProRequired }) => {
    const { data: user } = useUserMe();

    const [qualityDisabled, setQualityDisabled] = useState(false);
    const [proRequired, setProRequired] = useState(false);

    useEffect(() => {
        onProRequired?.(proRequired);
    }, [proRequired, onProRequired]);

    const handleProRequiredChange = (newValue: boolean) => {
        setProRequired(newValue);
        onProRequired?.(newValue);
    };

    return (
        <FileImageGenerationFormContext.Provider
            value={{
                dense,
                proRequired,
                vip: user?.vip,
                qualityDisabled,
                onChangeQualityDisabled: setQualityDisabled,
                onChangeProRequired: handleProRequiredChange,
            }}
        >
            <Flex
                direction="column"
                gap="3"
            >
                {children}
            </Flex>
        </FileImageGenerationFormContext.Provider>
    );
};

type SeedProps = {
    value?: string;
    onChange?: (value: string) => void;
    label?: SeedLabelProps;
};

const Seed: FC<SeedProps> = ({ value, onChange, label }) => {
    if (!value || !onChange) return null;

    return (
        <SeedField
            value={value}
            onChange={onChange}
            label={label}
            full
        />
    );
};

type AspectRatioProps = {
    value?: string;
    onChange?: (value: string) => void;
    label?: boolean;
};

const AspectRatio: FC<AspectRatioProps> = ({ value, onChange, label }) => {
    const { dense } = useContext(FileImageGenerationFormContext);

    if (!value || !onChange) return null;

    return (
        <AspectRatios
            onClick={onChange}
            active={value}
            dense={dense}
            label={label}
        />
    );
};

type QualityProps = {
    value?: QualityTypeEnum;
    onChange?: (value: QualityTypeEnum) => void;
    label?: boolean;
};

const Quality: FC<QualityProps> = ({ value, onChange, label }) => {
    const { vip, onChangeQualityDisabled } = useContext(
        FileImageGenerationFormContext,
    );

    const showQualityWarning = useMemo(() => {
        return !vip && value === QualityTypeEnum.FULL_HD;
    }, [vip, value]);

    useEffect(() => {
        onChangeQualityDisabled?.(showQualityWarning);
    }, [showQualityWarning, onChangeQualityDisabled]);

    if (!value || !onChange) return null;

    return (
        <Flex
            direction="column"
            gap="3"
        >
            {label && <Text color="gray">Resolution</Text>}
            <Tabs
                variant="switch"
                value={value}
                onValueChange={onChange}
                options={qualityTypes}
                full
            />
        </Flex>
    );
};

type GenerationConfigProps = {
    value?: string | null;
    onChange?: (value: string | null) => void;
    labelProps?: SelectLabelProps;
};

const GenerationConfig: FC<GenerationConfigProps> = ({
    value,
    onChange,
    labelProps,
}) => {
    const { proRequired, qualityDisabled, onChangeProRequired, vip } =
        useContext(FileImageGenerationFormContext);
    const { data } = useGenerationConfigList({ limit: 100 });

    const isVipRequired: boolean = useMemo(() => {
        if (!value || vip || !data?.items) return false;
        return data.items.find((item) => item.name === value)?.params
            .vip_required;
    }, [value, vip, data]);

    useEffect(() => {
        onChangeProRequired?.(isVipRequired);
    }, [isVipRequired]);

    if (!value || !onChange) return null;

    return (
        <Flex
            direction="column"
            gap="3"
            width="100%"
        >
            <GenerationConfigSelect
                value={value}
                onChange={onChange}
                types={[GenerationTypeEnum.TEXT_TO_IMAGE]}
                labelProps={labelProps}
            />
            {proRequired && <SubscriptionRequirementWarning type="model" />}
            {qualityDisabled && (
                <SubscriptionRequirementWarning type="quality" />
            )}
        </Flex>
    );
};

const qualityTypes = [
    {
        value: QualityTypeEnum.HD,
        label: "HD",
    },
    {
        label: "Full HD",
        value: QualityTypeEnum.FULL_HD,
    },
];

export const FileImageGenerationForm = {
    Root,
    Seed,
    AspectRatio,
    Quality,
    GenerationConfig,
};
