import { createQueryKeys } from "@lukemorales/query-key-factory";
import { cancelableRequest } from "@/shared/utils/cancelable-request";
import type {
    IProjectRead,
    IResponsePaginated_IProjectRead_,
} from "@/shared/api";
import { ProjectService } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/shared/types";

export type IProjectListParams = Parameters<
    typeof ProjectService.projectGetList
>[0];
export type IProjectByIdParams = Parameters<
    typeof ProjectService.projectGetById
>[0];

export const projectKeys = createQueryKeys("project", {
    list: (params: IProjectListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => ProjectService.projectGetList(params)),
    }),
    getById: (params: IProjectByIdParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => ProjectService.projectGetById(params)),
    }),
});

export const useProjectList = (
    params?: IProjectListParams,
    options?: UseQueryOptions<IResponsePaginated_IProjectRead_>,
) => {
    return useQuery({
        ...projectKeys.list(params ?? {}),
        ...options,
    });
};

export const useProjectGetById = (
    params: IProjectByIdParams,
    options?: UseQueryOptions<IProjectRead>,
) => {
    return useQuery({
        ...projectKeys.getById(params),
        ...options,
    });
};
