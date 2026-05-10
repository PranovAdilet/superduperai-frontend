"use client";

import { useEffect, useState } from "react";
import type { Step } from "react-joyride";
import Joyride from "react-joyride";

type Props = {
    steps: Step[];
    id: string;
} & Omit<React.ComponentProps<typeof Joyride>, "steps">;

export const JoyrideOnbording = ({ id, ...props }: Props) => {
    const [isShowOnbording, setIsShowOnbording] = useState(false);

    useEffect(() => {
        const isShow = localStorage.getItem(id);
        if (isShow) return;
        setIsShowOnbording(true);
        localStorage.setItem(id, "true");
    }, []);

    return (
        <Joyride
            run={isShowOnbording}
            {...props}
        />
    );
};
