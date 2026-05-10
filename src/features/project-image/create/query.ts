import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IProjectMediaCreate } from "@/shared/api";
import { ProjectService } from "@/shared/api";
import { projectKeys } from "@/entities/project";

export const useProjectImageCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IProjectMediaCreate) =>
            ProjectService.projectImage({ requestBody: payload }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: projectKeys._def });
        },
    });
};
