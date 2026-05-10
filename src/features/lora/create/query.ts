import { loraKeys } from '@/entities/lora';
import type { ILoraCreate } from '@/shared/api';
import { LoraService } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLoraCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ILoraCreate) =>
            LoraService.loraCreate({ requestBody: payload }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: loraKeys._def });
        },
    });
};
