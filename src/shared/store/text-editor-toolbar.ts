"use client";

import { create } from "zustand";
import type { FabricEditor } from "@/shared/ui";

type TextEditorToolbarStore = {
    editor?: FabricEditor | null;
    setEditor: (editor?: FabricEditor | null) => void;
};

export const useTextEditorToolbarStore = create<TextEditorToolbarStore>(
    (set) => ({
        editor: null,
        setEditor: (editor) => {
            set({ editor });
        },
    }),
);
