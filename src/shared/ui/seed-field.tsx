"use client";
import * as Label from "@radix-ui/react-label";
import { Button, Flex, Text } from "@radix-ui/themes";
import { TextField } from "./text-field";
import { RefreshCw } from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";
import type { SelectLabelProps } from "./select";

export type SeedLabelProps = SelectLabelProps & {
    position?: "top" | "left";
};

type Props = {
    onChange: (seed: string) => void;
    value?: string;
    full?: boolean;
    label?: SeedLabelProps;
};

export const SeedField: FC<Props> = ({
    onChange,
    value,
    full,
    label = { position: "left" },
}) => {
    const randomSeed = String(
        Math.floor(Math.random() * 1_000_000_000_000) + 1,
    );

    const [seed, setSeed] = useState<string>(value ?? randomSeed);

    useEffect(() => {
        if (!value) return;
        setSeed(value);
    }, [value]);

    const handleRegenerateSeed = () => {
        setSeed(randomSeed);
        onChange(randomSeed);
    };

    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeed(e.target.value);
        onChange(e.target.value);
    };

    return (
        <Label.Root
            className={clsx("flex gap-3", {
                ["flex-col items-start"]: label.position === "top",
                ["items-center"]: label.position === "left",
                ["w-full"]: full,
            })}
        >
            <Text
                color={label.color}
                size={label.size}
            >
                Seed
            </Text>
            <Flex
                gap="3"
                width="100%"
            >
                <TextField
                    full
                    placeholder="Seed"
                    type="number"
                    value={seed}
                    onChange={handleSeedChange}
                />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="3"
                                color="gray"
                                className="border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 hover:text-lime-500"
                                onClick={handleRegenerateSeed}
                            >
                                <RefreshCw size="20px" />
                            </Button>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            </Flex>
        </Label.Root>
    );
};
