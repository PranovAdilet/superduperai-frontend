"use client";

import type { FC } from "react";
import { Button, Flex, Separator } from "@radix-ui/themes";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { useModal } from "@/shared/store";

type Props = {
    projectId: string;
    order: number;
    position: "top" | "bottom";
};

export const SceneGenerateButton: FC<Props> = ({
    projectId,
    order,
    position,
}) => {
    const { open } = useModal();

    const handleClick = () => {
        open("sceneGenerateDialog", { projectId, order });
    };

    return (
        <Button
            className={clsx(styles.button, {
                [styles.top]: position === "top",
                [styles.bottom]: position === "bottom",
            })}
            onClick={handleClick}
            variant="ghost"
        >
            <Flex
                gap="4"
                justify="center"
                align="center"
                className="w-full"
            >
                <Separator
                    color="lime"
                    className="grow"
                />
                <span>Add scene</span>
                <Separator
                    color="lime"
                    className="grow"
                />
            </Flex>
        </Button>
    );
};
