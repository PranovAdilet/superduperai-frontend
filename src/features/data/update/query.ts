import { projectKeys } from "@/entities/project";
import type { IDataUpdate } from "@/shared/api";
import { DataService } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDataUpdate = (updateKeys = true) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: IDataUpdate) =>
            DataService.dataUpdate({
                id: payload.id,
                requestBody: payload,
            }),
        onSuccess: async (data) => {
            if (!updateKeys) return;
            await queryClient.invalidateQueries({
                queryKey: projectKeys.getById({ id: data.project_id }).queryKey,
            });
        },
    });
};
