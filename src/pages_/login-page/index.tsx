"use client";

import { Flex, Spinner, Text } from "@radix-ui/themes";
import { useAuthStore } from "@/shared/store";
import type { FC } from "react";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLogin, useLogout } from "@/features/auth";
import { getPath } from "@/shared/config/routes";
import { useUserMe } from "@/entities/user";

const LoginPage: FC = () => {
    const token = useAuthStore((state) => state.token);
    const { isLoading, isError } = useUserMe({
        enabled: !!token,
        retry: false,
    });

    const { replace } = useRouter();
    const { login } = useLogin();
    const { logout } = useLogout();

    useEffect(() => {
        if (isLoading) return;

        if (token && isError) {
            logout();
        } else if (token) {
            const redirectPath = localStorage.getItem("redirect_path") as any;
            if (redirectPath) {
                localStorage.removeItem("redirect_path");
                replace(redirectPath as string);
            } else {
                const defaultLoginRedirectPath = getPath(
                    "PROJECT_VIDEO_CREATE",
                );
                replace(defaultLoginRedirectPath);
            }
        } else {
            setTimeout(() => {
                login();
            }, 200);
        }
    }, [token, isLoading, isError]);

    return (
        <Flex
            align={"center"}
            justify={"center"}
            height={"100vh"}
            direction={"column"}
            gap={"2"}
        >
            <Spinner />
            <Text
                size={"4"}
                color={"gray"}
            >
                Authorization
            </Text>
        </Flex>
    );
};

export default LoginPage;
