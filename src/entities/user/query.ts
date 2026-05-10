import type { IUserRead } from "@/shared/api";
import { UserService } from "@/shared/api";
import type { UseQueryOptions } from "@/shared/types";
import { cancelableRequest } from "@/shared/utils";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";

export const userKeys = createQueryKeys("user", {
    me: null,
});

export const useUserMe = (
    options?: UseQueryOptions<IUserRead>,
) => {
    return useQuery({
        ...options,
        queryKey: userKeys.me.queryKey,
        queryFn: cancelableRequest(() => UserService.userMe()),
    });
};
