import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntityService } from "@/shared/api";
import { entityKeys } from "@/entities/entity";

export const useEntityAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: EntityService.entityAddFavorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: entityKeys._def });
        },
    });
};
