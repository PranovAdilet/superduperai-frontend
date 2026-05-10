import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IEntityUpdate } from "@/shared/api";
import { EntityService } from "@/shared/api";
import { entityKeys } from "@/entities/entity";

export const useEntityUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IEntityUpdate) =>
            EntityService.entityUpdate({
                id: payload.id,
                requestBody: payload,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: entityKeys._def });
        },
    });
};
