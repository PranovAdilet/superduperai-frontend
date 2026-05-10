import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";
import { sceneKeys } from "@/entities/scene";

type IProjectVideoStoryboard2Video = Parameters<
    typeof ProjectService.projectSyncToBeats
>[0];

export const useProjectVideoSyncToBeats = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: IProjectVideoStoryboard2Video) =>
            ProjectService.projectSyncToBeats(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
