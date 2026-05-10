import { createQueryKeys } from "@lukemorales/query-key-factory";
import { cancelableRequest } from "@/shared/utils/cancelable-request";
import type { IResponsePaginated_IStyleRead_ } from "@/shared/api";
import { StyleService } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/shared/types";

export type IStyleListParams = Parameters<typeof StyleService.styleGetList>[0];

export const styleKeys = createQueryKeys("style", {
    list: (params: IStyleListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => StyleService.styleGetList(params)),
    }),
});

export const useStyleList = (
    params?: IStyleListParams,
    options?: UseQueryOptions<IResponsePaginated_IStyleRead_>,
) => {
    return useQuery({
        ...styleKeys.list(params ?? {}),
        ...options,
    });
};
