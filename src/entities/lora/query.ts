import type { IResponsePaginated_ILoraRead_ } from '@/shared/api';
import { LoraService } from '@/shared/api';
import type { UseQueryOptions } from '@/shared/types';
import { cancelableRequest } from '@/shared/utils';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export type ILoraListParams = Parameters<typeof LoraService.loraGetList>[0];

export const loraKeys = createQueryKeys("lora", {
    list: (params: ILoraListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => LoraService.loraGetList(params)),
    }),
});

export const useLoraList = (
    params?: ILoraListParams,
    options?: UseQueryOptions<IResponsePaginated_ILoraRead_>,
) => {
    return useQuery({
        ...loraKeys.list(params ?? {}),
        ...options,
    });
};