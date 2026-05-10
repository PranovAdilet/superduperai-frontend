"use client";

import { create } from "zustand";

type ScriptStore = {
    script: string;
    setScript: (script: string) => void;
};

export const useScriptStore = create<ScriptStore>((set) => ({
    script: "",
    setScript: (script: string) => {
        set({ script });
    },
}));
