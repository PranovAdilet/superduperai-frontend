import { createQueryKeys } from "@lukemorales/query-key-factory";
import { cancelableRequest } from "@/shared/utils/cancelable-request";
import type { IResponsePaginated_ITemplateRead_ } from "@/shared/api";
import { TemplateService } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/shared/types";

export type ITemplateListParams = Parameters<
    typeof TemplateService.templateGetList
>[0];

export const templateKeys = createQueryKeys("template", {
    list: (params: ITemplateListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() =>
            TemplateService.templateGetList(params),
        ),
    }),
});

export const useTemplateList = (
    params?: ITemplateListParams,
    options?: UseQueryOptions<IResponsePaginated_ITemplateRead_>,
) => {
    return useQuery({
        ...templateKeys.list(params ?? {}),
        ...options,
    });
};
