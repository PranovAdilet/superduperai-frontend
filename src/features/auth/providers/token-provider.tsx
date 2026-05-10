"use client";

import type { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useCookie } from "react-use";
import { useAuthStore } from "@/shared/store";

const LOCALSTORAGE_TOKEN_KEY = "token";

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);

    const [cookieToken] = useCookie(LOCALSTORAGE_TOKEN_KEY);

    const setToken = useAuthStore((state) => state.setToken);

    const getToken = () => {
        return cookieToken ?? localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    };

    useEffect(() => {
        const token = getToken();

        if (token) {
            setToken(token);
        }

        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
};
