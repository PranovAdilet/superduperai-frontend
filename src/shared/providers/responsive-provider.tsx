"use client";

import { useMemo, type FC, type PropsWithChildren } from "react";
import { useWindowSize } from "react-use";
import { Flex, Heading } from "@radix-ui/themes";
import { MonitorCheck } from "lucide-react";
import { Link } from "../ui";
import { useParams } from "next/navigation";
import { getPath } from "../config";

type Params = {
    projectId?: string;
};

export const ResponsiveProvider: FC<PropsWithChildren> = ({ children }) => {
    const { width } = useWindowSize();

    const params = useParams<Params>();

    const isDesktop = useMemo(() => width > 1000, [width]);

    const projectId = params.projectId;

    return (
        <>
            {isDesktop ? (
                children
            ) : (
                <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    width="100%"
                    height="100vh"
                    gap="4"
                >
                    <MonitorCheck size="60px" />
                    <Heading align="center">
                        This project can only be viewed and edited on a desktop
                        device.
                    </Heading>
                    {projectId && (
                        <Link
                            href={getPath("PREVIEW_PROJECT", { projectId })}
                            size="4"
                        >
                            Open preview mode instead
                        </Link>
                    )}
                </Flex>
            )}
        </>
    );
};
