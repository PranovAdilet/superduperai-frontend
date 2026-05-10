import { createQueryKeys } from "@lukemorales/query-key-factory";
import { cancelableRequest } from "@/shared/utils/cancelable-request";
import type { IResponsePaginated_IVoiceRead_ } from "@/shared/api";
import { VoiceService } from "@/shared/api";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/shared/types";

export type IVoiceListParams = Parameters<typeof VoiceService.voiceGetList>[0];

export const voiceKeys = createQueryKeys("voice", {
    list: (params: IVoiceListParams) => ({
        queryKey: [params],
        queryFn: cancelableRequest(() => VoiceService.voiceGetList(params)),
    }),
});

export const useVoiceList = (
    params?: IVoiceListParams,
    options?: UseQueryOptions<IResponsePaginated_IVoiceRead_>,
) => {
    return useQuery({
        ...voiceKeys.list(params ?? {}),
        ...options,
    });
};
