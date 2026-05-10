import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";
import { sceneKeys } from "@/entities/scene";

type IProjectVideoScript2Storyboard = Parameters<
    typeof ProjectService.projectScript2Storyboard
>[0];

export const useProjectScript2Storyboard = (mutationKey?: MutationKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey,
        mutationFn: (payload: IProjectVideoScript2Storyboard) =>
            ProjectService.projectScript2Storyboard(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
