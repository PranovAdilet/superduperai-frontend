import type { MutationKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IProjectUpdate } from "@/shared/api";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";

export const useProjectUpdate = (mutationKey?: MutationKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mutationKey,
        mutationFn: (payload: IProjectUpdate) =>
            ProjectService.projectUpdate({
                id: payload.id,
                requestBody: payload,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
        },
    });
};
