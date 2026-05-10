import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IEntityCreate } from "@/shared/api";
import { EntityService } from "@/shared/api";
import { entityKeys } from "@/entities/entity";

export const useEntityCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IEntityCreate) =>
            EntityService.entityCreate({ requestBody: payload }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: entityKeys._def });
        },
    });
};
