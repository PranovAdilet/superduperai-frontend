"use client";

import {
    QueryClientProvider,
    QueryClient,
    MutationCache,
    QueryCache,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import ReactQueryRewind from "react-query-rewind";
import { useAuthStore } from "../store";
import { OpenAPI } from "../api";
import { getPath } from "../config";
import { useRouter } from "@/i18n/navigation";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    const { setToken } = useAuthStore();

    const { push } = useRouter();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // refetchOnWindowFocus: false
                        staleTime: 30000, // 30 секунд для кеширования запросов
                    },
                },
                mutationCache: new MutationCache({
                    onError: (error: any, _context: any) => {
                        if (error?.status === 401) {
                            setToken(null);
                            push(getPath("HOME"));
                        }
                        if (error?.status === 402) {
                            push(getPath("PAYMENT"));
                        }
                        console.log(error);
                        console.log({ ...error });
                    },
                }),
                queryCache: new QueryCache({
                    onError: (error: any, _query: any) => {
                        if (error?.status === 401) {
                            setToken(null);
                            push(getPath("HOME"));
                        }
                        if (error?.status === 402) {
                            console.log(error);
                            push(getPath("PAYMENT"));
                        }
                    },
                }),
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryRewind />
            {children}
        </QueryClientProvider>
    );
};
