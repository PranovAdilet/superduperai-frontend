import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileService } from "@/shared/api";
import { fileKeys } from "@/entities/file";

export const useFileDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: FileService.fileDelete,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: fileKeys._def });
        },
    });
};
