import { create } from "zustand";

export type ModalType =
    | "sceneGenerateDialog"
    | "projectVideoExportDialog"
    | "imageViewerDialog"
    | "deleteDialog"
    | "videoViewerDialog"
    | "authDialog"
    | "projectVideoAnimateAllDialog"
    | "projectResultRatingDialog"
    | "entityCreateDialog"
    | "entitySelectDialog"
    | "shareDialog"
    | "lipsyncDialog"
    | "entityUpdateDialog";

type ModalStore<T> = {
    type: ModalType | null;
    data?: T;
    isOpen: boolean;

    open: (type: ModalType, data?: T) => void;
    close: () => void;
};

const useModalImplementation = create<ModalStore<any>>((set) => ({
    type: null,
    data: null,
    isOpen: false,
    open: (type, data) => {
        set({ isOpen: true, type, data });
    },
    close: () => {
        set({ type: null, isOpen: false, data: null });
    },
}));

export const useModal = useModalImplementation as {
    <T>(): ModalStore<T>;
    <T, U>(selector: (state: ModalStore<T>) => U): U;
};
