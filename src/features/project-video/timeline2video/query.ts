import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";

export const useProjectTimeline2Video = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ProjectService.projectTimeline2Video,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
        },
    });
};
