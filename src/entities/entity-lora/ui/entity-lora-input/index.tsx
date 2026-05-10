import { LoraSelect } from "@/entities/lora";
import type { IEntityLoraCreate, IEntityLoraUpdate } from "@/shared/api";
import { TextField } from "@/shared/ui";
import { Flex } from "@radix-ui/themes";
import { useEffect, useState, type FC } from "react";

type Props = {
    value: (IEntityLoraUpdate & IEntityLoraCreate) | null;
    onChange: (value: (IEntityLoraUpdate & IEntityLoraCreate) | null) => void;
};

export const EntityLoraInput: FC<Props> = ({ value, onChange }: Props) => {
    const [lora, setLora] = useState<string | null>(value?.lora_id ?? null);
    const [weight, setWeight] = useState<string>(String(value?.weight ?? "1"));

    useEffect(() => {
        if (!lora) return;
        if (!weight) return;
        if (value?.lora_id === lora && value.weight === Number(weight)) return;
        onChange({
            id: value?.id ?? null,
            lora_id: lora,
            weight: Number(weight),
        });
    }, [value, lora, weight, onChange]);

    return (
        <Flex gap="2">
            <LoraSelect
                value={lora}
                onChange={setLora}
            />
            <TextField
                label="Weight"
                type="number"
                value={weight}
                onChange={(e) => {
                    setWeight(e.target.value);
                }}
            />
        </Flex>
    );
};
