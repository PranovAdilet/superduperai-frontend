"use client";

export const useLogout = () => {
    const logout = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout?redirect_url=${window.location.origin}`;
    };

    return {
        logout,
    };
};
