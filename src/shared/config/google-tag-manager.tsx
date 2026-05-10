"use client";

import { useUserMe } from "@/entities/user";
import {
    GoogleTagManager as GTManager,
    sendGTMEvent,
} from "@next/third-parties/google";
import { useEffect } from "react";
import { useAuthStore } from "../store";

export const GoogleTagManager = () => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? "";

    const googleTagManagerId = process.env.NODE_ENV === "production" ? id : "";

    const token = useAuthStore((state) => state.token);
    const { data: user } = useUserMe({ enabled: !!token, retry: false });

    useEffect(() => {
        if (!user) return;

        sendGTMEvent({
            event: "Login",
            userId: user.id,
        });
    }, [user]);

    return <GTManager gtmId={googleTagManagerId} />;
};
