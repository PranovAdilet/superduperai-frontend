import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SceneService } from "@/shared/api";
import { sceneKeys } from "@/entities/scene";

export const useSceneDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SceneService.sceneDelete,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
