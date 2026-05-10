"use client";

import { Callout } from "@radix-ui/themes";
import { CircleAlert } from "lucide-react";
import { Link } from "./link";
import type { FC } from "react";
import { getPath } from "../config";

type Props = {
    type?: "model" | "quality" | "option";
};

export const SubscriptionRequirementWarning: FC<Props> = ({
    type = "model",
}) => {
    return (
        <Callout.Root color="yellow">
            <Callout.Icon>
                <CircleAlert />
            </Callout.Icon>
            <Callout.Text>
                You will need a{" "}
                <Link href={getPath("PAYMENT")}>PRO subscription</Link> to use
                this {type}.
            </Callout.Text>
        </Callout.Root>
    );
};
