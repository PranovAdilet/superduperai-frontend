import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";

export const useGenerateTimeline = (mutationKey?: MutationKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mutationKey,
        mutationFn: ProjectService.projectRegenerateTimeline,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
        },
    });
};
