import type { IResponsePaginated_IGenerationConfigRead_ } from '@/shared/api';
import { GenerationConfigService } from '@/shared/api';
import type { UseQueryOptions } from '@/shared/types';
import { cancelableRequest } from '@/shared/utils';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export type IGenerationConfigListParams = Parameters<typeof GenerationConfigService.generationConfigGetList>[0];

export const generationConfigKeys = createQueryKeys("generationConfig", {
    list: (params: IGenerationConfigListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => GenerationConfigService.generationConfigGetList(params)),
    }),
});

export const useGenerationConfigList = (
    params?: IGenerationConfigListParams,
    options?: UseQueryOptions<IResponsePaginated_IGenerationConfigRead_>,
) => {
    return useQuery({
        ...generationConfigKeys.list(params ?? {}),
        ...options,
    });
};