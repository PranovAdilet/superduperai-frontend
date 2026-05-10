import { useMemo, type FC } from "react";
import { useLoraList } from "@/entities/lora";
import { Select } from "@/shared/ui";
import { useUserMe } from "@/entities/user";
import { LoraStatusEnum } from "@/shared/api";

type Props = {
    value: string | null;
    onChange?: (value: string | null) => void;
};

export const LoraSelect: FC<Props> = ({ value, onChange }) => {
    const { data: user } = useUserMe();

    const { data, isLoading } = useLoraList({
        limit: 100,
        userId: user?.id,
        status: LoraStatusEnum.COMPLETED,
    });

    const options = useMemo(() => {
        const result: {
            value: string | null;
            label: string;
        }[] =
            data?.items.map((lora) => ({
                value: lora.id,
                label: lora.name,
            })) ?? [];
        result.unshift({ value: null, label: "None" });
        return result;
    }, [data]);

    return (
        <Select
            label="Lora"
            className="w-full"
            value={value}
            onChange={onChange}
            options={options}
            isLoading={isLoading}
        />
    );
};
