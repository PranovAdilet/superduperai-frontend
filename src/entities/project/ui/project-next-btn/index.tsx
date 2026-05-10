import type { ButtonProps } from "@radix-ui/themes";
import { Button, Text } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
    loading?: boolean;
    disabled?: boolean;
    label?: string;
    onClick?: () => void;
} & ButtonProps;

export const ProjectNextBtn: FC<Props> = ({
    loading,
    disabled,
    label = "NEXT",
    onClick,
    ...props
}) => {
    return (
        <Button
            variant="classic"
            size="2"
            loading={loading}
            disabled={disabled}
            onClick={onClick}
            className={clsx("w-[102px]", {
                [styles["next-pulse"]]: !disabled && !loading,
            })}
            {...props}
        >
            <Text
                weight="medium"
                size="4"
            >
                {label}
            </Text>
            <ArrowRight />
        </Button>
    );
};
