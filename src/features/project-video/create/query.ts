import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IProjectVideoCreate } from "@/shared/api";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";

export const useProjectVideoCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IProjectVideoCreate) =>
            ProjectService.projectVideo({ requestBody: payload }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
        },
    });
};
