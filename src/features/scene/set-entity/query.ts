import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SceneService } from "@/shared/api";
import { sceneKeys } from "@/entities/scene";

export const useSceneSetEntity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SceneService.sceneSetEntity,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
