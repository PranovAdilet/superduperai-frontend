import type { FC } from "react";
import React from "react";
import { Card, Text } from "@radix-ui/themes";

type Props = {
    prompt: string;
    index: number;
    onClick: (value: string) => void;
};

export const TemplateExamplePrompt: FC<Props> = ({
    prompt,
    index,
    onClick,
}) => {
    return (
        <Card asChild>
            <button
                onClick={() => {
                    onClick(prompt);
                }}
                className="flex-1"
            >
                <Text>{emojis[index]}</Text>
                <Text
                    mt="2"
                    size="2"
                    className="line-clamp-2"
                >
                    {prompt}
                </Text>
            </button>
        </Card>
    );
};

const emojis = ["🎸", "🔥", "⭐️"];
