import { useMemo, type FC } from "react";
import { useVoiceList } from "@/entities/voice";
import { AudioPlayer, Select } from "@/shared/ui";
import { Flex } from "@radix-ui/themes";

type Props = {
    value: string | null;
    onChange?: (value: string | null) => void;
};

export const VoiceSelect: FC<Props> = ({ value, onChange }) => {
    const { data, isLoading } = useVoiceList({ limit: 100 });

    const options = useMemo(() => {
        const result: {
            value: string | null;
            label: string;
        }[] =
            data?.items.map((voice) => ({
                value: voice.name,
                label: voice.name,
            })) ?? [];
        result.unshift({ value: null, label: "Default" });
        return result;
    }, [data]);

    const activeVoice = useMemo(
        () => data?.items.find((voice) => voice.name === value),
        [data, value],
    );

    return (
        <Flex
            gap="5"
            width="100%"
        >
            <Select
                label="Voice"
                className="w-full"
                value={value}
                onChange={onChange}
                options={options}
                isLoading={isLoading}
            />
            <Flex align="end">
                <AudioPlayer src={activeVoice?.preview_url} />
            </Flex>
        </Flex>
    );
};
