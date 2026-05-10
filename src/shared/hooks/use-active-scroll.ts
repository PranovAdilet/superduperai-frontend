"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useActiveScroll = (isReady = true) => {
    const activeRef = useRef<HTMLDivElement>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const pathname = usePathname();

    useEffect(() => {
        if (!isReady) return;

        const timeout = setTimeout(
            () => {
                if (activeRef.current) {
                    activeRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                    setIsFirstRender(false);
                }
            },
            isFirstRender ? 900 : 400,
        );

        return () => {
            clearTimeout(timeout);
        };
    }, [pathname, activeRef, isReady]);

    const isActiveCard = (path: string) => {
        if (!pathname) return false;
        return pathname.includes(path);
    };

    return { activeRef, isActiveCard };
};
