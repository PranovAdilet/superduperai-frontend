"use client";

import { Card, Flex, Switch, Text } from "@radix-ui/themes";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useWindowSize } from "react-use";

type Props = {
    projectId?: string;
    autoMode?: boolean;
    onChange?: (value: boolean) => void;
    onUpdate?: (value: boolean) => void;
};

export const ProjectAutoModeSwitcher: FC<Props> = ({
    projectId,
    autoMode: value,
    onChange,
    onUpdate,
}) => {
    const [isAutoMode, setIsAutoMode] = useState(value ?? false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const { width } = useWindowSize();

    const isDesktop = useMemo(() => width > 1000, [width]);

    useEffect(() => {
        if (value === undefined || value === isAutoMode) return;
        setIsAutoMode(value);
    }, [value]);

    useEffect(() => {
        if (!projectId || value === undefined || value === isAutoMode) return;

        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                onUpdate?.(isAutoMode);
            }, 800),
        );
    }, [isAutoMode, projectId]);

    const handleChange = (value: boolean) => {
        setIsAutoMode(value);
        onChange?.(value);
    };

    return (
        <>
            {isDesktop && (
                <Card className="h-[32px] rounded-[6px] py-0">
                    <Flex
                        justify="center"
                        align="center"
                        className="h-full"
                        gap="2"
                    >
                        <Text
                            size="2"
                            color="lime"
                        >
                            Auto mode
                        </Text>
                        <Switch
                            checked={isAutoMode}
                            onCheckedChange={handleChange}
                        />
                    </Flex>
                </Card>
            )}
        </>
    );
};
