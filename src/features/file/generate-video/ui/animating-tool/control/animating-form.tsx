import { FileVideoGenerationForm } from "@/entities/file";
import { useUserMe } from "@/entities/user";
import { useAuthStore, useModal } from "@/shared/store";
import { TextArea } from "@/shared/ui";
import { Flex, Button, Text } from "@radix-ui/themes";
import { ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type FC } from "react";

export type AnimatingDataProps = {
    prompt: string;
    generationConfig: string;
    duration?: number;
    negativePrompt?: string;
};

type Props = {
    prompt?: string;
    onComplete: (data: AnimatingDataProps) => void;
    loading?: boolean;
};

export const AnimatingForm: FC<Props> = ({ prompt, onComplete, loading }) => {
    const token = useAuthStore((state) => state.token);

    const { data: user } = useUserMe({ enabled: !!token });

    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/ltx",
    );

    const [duration, setDuration] = useState<null | string | undefined>("5");

    const [proRequired, setProRequired] = useState<boolean>(false);

    const [animatingPrompt, setAnimatingPrompt] = useState<string>(
        prompt ?? "move",
    );

    const [negativePrompt, setNegativePrompt] = useState<string>("");

    const [isOpenNegativePrompt, setIsOpenNegativePrompt] = useState(false);

    const handleClick = () => {
        if (!generationConfig) return;

        const durationValue = duration ? +duration : undefined;

        onComplete({
            prompt: animatingPrompt,
            generationConfig: generationConfig,
            duration: durationValue,
            negativePrompt,
        });
    };

    const disabled = useMemo(
        () => !animatingPrompt || proRequired,
        [animatingPrompt, proRequired],
    );

    const { close } = useModal();

    const pathname: string = usePathname();

    useEffect(() => {
        if (pathname.endsWith("/payment")) close();
    }, [pathname]);

    const handleOpenCloseNegitivePrompt = () => {
        setIsOpenNegativePrompt(!isOpenNegativePrompt);
    };

    return (
        <Flex
            width="100%"
            height="100%"
            direction="column"
            gap="3"
            justify="end"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <FileVideoGenerationForm
                vip={user?.vip}
                generationConfig={generationConfig}
                onGenerationConfigChange={setGenerationConfig}
                onProRequired={setProRequired}
                duration={duration}
                onDurationChange={setDuration}
            />

            <TextArea
                label="Prompt"
                size="3"
                className="max-h-[200px] grow"
                value={animatingPrompt}
                onChange={(e) => {
                    setAnimatingPrompt(e.target.value);
                }}
            />
            <Flex
                direction="column"
                gap="2"
                overflow="hidden"
            >
                <Flex
                    gap="2"
                    align="center"
                    role="button"
                    onClick={handleOpenCloseNegitivePrompt}
                >
                    <Text size="2">Negative Prompt</Text>
                    <ChevronsUpDown size="18px" />
                </Flex>
                <Flex
                    style={{
                        height: isOpenNegativePrompt ? "100px" : "0px",
                        transition: "height 0.5s ease-in-out",
                    }}
                    width="100%"
                >
                    <TextArea
                        size="3"
                        value={negativePrompt}
                        className="size-full "
                        onChange={(e) => {
                            setNegativePrompt(e.target.value);
                        }}
                    />
                </Flex>
            </Flex>

            <Button
                loading={loading}
                disabled={disabled}
                onClick={handleClick}
            >
                Animate
            </Button>
        </Flex>
    );
};
