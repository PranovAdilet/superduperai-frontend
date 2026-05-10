import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";
import { entityKeys } from "@/entities/entity";

type IProjectVideoScript2Entities = Parameters<
    typeof ProjectService.projectScript2Entities
>[0];

export const useProjectVideoScript2Entities = (mutationKey?: MutationKey) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey,
        mutationFn: (payload: IProjectVideoScript2Entities) =>
            ProjectService.projectScript2Entities(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
            await queryClient.invalidateQueries({ queryKey: entityKeys._def });
        },
    });
};
