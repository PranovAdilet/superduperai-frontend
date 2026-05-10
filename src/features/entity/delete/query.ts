import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntityService } from "@/shared/api";
import { entityKeys } from "@/entities/entity";

export const useEntityDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: EntityService.entityDelete,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: entityKeys._def });
        },
    });
};
