import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MusicService } from "@/shared/api";
import { musicKeys } from "@/entities/music";

export const useMusicUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: MusicService.musicCreate,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: musicKeys._def });
        },
    });
};
