import type { CancelablePromise } from "@/shared/api";

type CancelablePromiseFunction<T> = () => CancelablePromise<T>;

export const cancelableRequest = <T>(queryFn: CancelablePromiseFunction<T>) => {
    return async ({ signal }: any) => {
        const request = queryFn();

        signal?.addEventListener("abort", () => {
            request.cancel();
        });

        return request;
    };
};
