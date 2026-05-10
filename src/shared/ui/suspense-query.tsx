import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { ErrorQuery } from "@/shared/ui/fallback-error";
import { Flex, Spinner } from "@radix-ui/themes";

type RefetchFunctionType<T> = Pick<UseQueryResult<T>, "refetch">["refetch"];

type SuspenseQueryProps<T> = {
    children: ReactNode;
    fallbackLoading?: ReactNode;
    fallbackError?: (refetch: RefetchFunctionType<T>) => ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    refetch: RefetchFunctionType<T>;
};

export const SuspenseQuery = <T,>({
    fallbackLoading,
    fallbackError,
    isError,
    isLoading,
    refetch,
    children,
}: SuspenseQueryProps<T>) => {
    if (isLoading) {
        return fallbackLoading ? (
            <>{fallbackLoading}</>
        ) : (
            <Flex
                width="100%"
                height="100%"
                justify="center"
                align="center"
            >
                <Spinner />
            </Flex>
        );
    }

    if (isError) {
        return fallbackError ? (
            <>{fallbackError(refetch)}</>
        ) : (
            <ErrorQuery refetch={refetch} />
        );
    }

    return <>{children}</>;
};
