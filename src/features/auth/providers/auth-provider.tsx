"use client";

import type { FC, PropsWithChildren } from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store";
import { getPath } from "@/shared/config";
import { useRouter } from "@/i18n/navigation";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const { replace } = useRouter();

    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token) {
            localStorage.setItem("redirect_path", window.location.pathname);
            replace(getPath("HOME"));
        }
    }, [token]);

    return <>{children}</>;
};
