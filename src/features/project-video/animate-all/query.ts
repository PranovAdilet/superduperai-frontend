import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";
import { sceneKeys } from '@/entities/scene';

type ProjectVideoAnimateAllPayload = Parameters<typeof ProjectService.projectAnimateAll>[0];

export const useProjectVideoAnimateAll = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProjectVideoAnimateAllPayload) =>
            ProjectService.projectAnimateAll(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
            await queryClient.invalidateQueries({ queryKey: sceneKeys._def });
        },
    });
};
