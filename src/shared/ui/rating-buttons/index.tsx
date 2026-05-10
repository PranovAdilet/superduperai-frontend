"use client";

import { Flex } from "@radix-ui/themes";
import { Star } from "lucide-react";
import type { FC } from "react";

type Props = {
    rating: number | null;
    onChange: (value: number | null) => void;
    dense?: boolean;
};

export const RatingButtons: FC<Props> = ({ onChange, rating, dense }) => {
    const handleRate = (value: number) => {
        const newValue = rating === value ? 0 : value;
        onChange(newValue);
    };
    return (
        <Flex
            gap="2"
            justify="center"
        >
            {[...Array(10)].map((_, index) => (
                <StarButton
                    value={index + 1}
                    onClick={handleRate}
                    rating={rating}
                    key={index}
                    dense={dense}
                />
            ))}
        </Flex>
    );
};

const StarButton = ({
    value,
    rating,
    dense,
    onClick,
}: {
    value: number;
    rating: number | null;
    onClick: (value: number) => void;
    dense?: boolean;
}) => {
    return (
        <button
            onClick={() => {
                onClick(value);
            }}
            aria-label={`Rate ${value} stars`}
        >
            <Star
                size={dense ? "12px" : "18px"}
                fill={value <= (rating ?? 0) ? "gold" : undefined}
                color={value <= (rating ?? 0) ? "gold" : undefined}
            />
        </button>
    );
};
