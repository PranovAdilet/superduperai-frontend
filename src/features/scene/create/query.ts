import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISceneCreate } from "@/shared/api";
import { SceneService } from "@/shared/api";
import { sceneKeys } from "@/entities/scene";

export const useSceneCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ISceneCreate) =>
            SceneService.sceneCreate({ requestBody: payload }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
