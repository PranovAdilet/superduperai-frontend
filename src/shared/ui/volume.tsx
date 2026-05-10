"use client";

import type { SliderProps } from "@radix-ui/themes";
import { Flex, Grid, Slider } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { TextField } from "./text-field";
import { useDebounce } from "react-use";

type SliderRadixProps = Omit<SliderProps, "value" | "onChange">;

type Props = {
    value: number;
    initialValue?: number;
    onChange?: (v: number) => void;
    onDebouncedChange?: (v: number) => void;
    disableInput?: boolean;
    step?: number;
} & SliderRadixProps;

export const RangeSlider = ({
    value,
    initialValue,
    onChange,
    onDebouncedChange,
    disableInput,
    min = 0,
    max = 100,
    step = 1,
    ...props
}: Props) => {
    const [localValue, setLocalValue] = useState(value);

    useDebounce(
        () => {
            if (localValue === initialValue) return;
            onDebouncedChange?.(localValue);
        },
        700,
        [localValue],
    );

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <Flex
            gap="2"
            flexGrow="1"
        >
            <Grid
                style={{
                    gridTemplateColumns: "1fr 40px",
                }}
                gap="12px"
                align="center"
                width="100%"
            >
                <Slider
                    {...props}
                    value={[localValue]}
                    onValueChange={(event) => {
                        const newValue = event[0];
                        setLocalValue(newValue);
                        onChange?.(newValue);
                    }}
                    min={min}
                    max={max}
                    step={step}
                />
                <TextField
                    full
                    className="w-12 pr-1 text-center text-sm"
                    type="number"
                    disabled={disableInput}
                    onChange={(event) => {
                        const newValue = Number(event.target.value);
                        if (newValue >= min && newValue <= max) {
                            setLocalValue(newValue);
                            onChange?.(newValue);
                        }
                    }}
                    value={localValue}
                />
            </Grid>
        </Flex>
    );
};
