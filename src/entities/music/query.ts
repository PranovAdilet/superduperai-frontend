import { createQueryKeys } from "@lukemorales/query-key-factory";
import { cancelableRequest } from "@/shared/utils/cancelable-request";
import type { IMusicRead, IResponsePaginated_IMusicRead_ } from "@/shared/api";
import { MusicService } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/shared/types";

export type IMusicListParams = Parameters<typeof MusicService.musicGetList>[0];
export type IMusicByIdParams = Parameters<typeof MusicService.musicGetById>[0];
export type IMusicListByIdsParams = Parameters<
    typeof MusicService.musicGetListByIds
>[0];

export const musicKeys = createQueryKeys("music", {
    list: (params: IMusicListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => MusicService.musicGetList(params)),
    }),
    getById: (params: IMusicByIdParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => MusicService.musicGetById(params)),
    }),
    getByIds: (params: IMusicListByIdsParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() =>
            MusicService.musicGetListByIds(params),
        ),
    }),
});

export const useMusicList = (
    params?: IMusicListParams,
    options?: UseQueryOptions<IResponsePaginated_IMusicRead_>,
) => {
    return useQuery({
        ...musicKeys.list(params ?? {}),
        ...options,
    });
};

export const useMusicListByIds = (
    params: IMusicListByIdsParams,
    options?: UseQueryOptions<IMusicRead[]>,
) => {
    return useQuery({
        ...musicKeys.getByIds(params),
        ...options,
    });
};

export const useMusicGetById = (
    params: IMusicByIdParams,
    options?: UseQueryOptions<IMusicRead>,
) => {
    return useQuery({
        ...musicKeys.getById(params),
        ...options,
    });
};
