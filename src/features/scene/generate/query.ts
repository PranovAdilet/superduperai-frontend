import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SceneService } from "@/shared/api";
import { sceneKeys } from "@/entities/scene";

type ISceneGenerate = Parameters<typeof SceneService.sceneGenerate>[0];

export const useSceneGenerate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ISceneGenerate) =>
            SceneService.sceneGenerate(payload),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: sceneKeys.list._def });
        },
        onError: async () => {
            await queryClient.invalidateQueries({
                queryKey: sceneKeys.list._def,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: sceneKeys.list._def,
            });
        },
    });
};
