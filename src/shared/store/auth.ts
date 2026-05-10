"use client";

import { create } from "zustand";
import { OpenAPI } from "../api";

type AuthStore = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    setToken: (token) => {
        OpenAPI.TOKEN = token ?? undefined;
        set({ token });
    },
}));
