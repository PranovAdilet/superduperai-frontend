"use client";

export const useLogin = () => {
    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login?redirect_url=${window.location.origin}`;
    };

    return {
        login,
    };
};
