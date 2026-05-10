"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SuspenseQuery } from "./suspense-query";
import { CardList } from "./card-list";

type RefetchFunctionType = Pick<UseQueryResult<any>, "refetch">["refetch"];

type Props<T> = {
    items?: T[];
    isLoading: boolean;
    isError: boolean;
    refetch: RefetchFunctionType;
    fallbackLoading?: ReactNode;
    fallbackError?: (refetch: RefetchFunctionType) => ReactNode;

    children: (item: T, index?: number) => ReactNode;
    direction?: "row" | "column";
    wrap?: "wrap" | "nowrap" | "wrap-reverse";
    appendItem?: ReactNode;
    placeholder?: ReactNode;
    itemSize?: string;
};

export const QueryCardList = <T,>({
    items,
    children,
    isError,
    isLoading,
    refetch,
    direction = "column",
    wrap,
    fallbackLoading,
    fallbackError,
    appendItem,
    placeholder,
    itemSize,
}: Props<T>) => {
    const isEmpty = !items?.length;
    return (
        <SuspenseQuery
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
            fallbackLoading={fallbackLoading}
            fallbackError={fallbackError}
        >
            <CardList
                direction={direction}
                isEmpty={isEmpty}
                wrap={wrap}
                placeholder={placeholder}
            >
                {appendItem}
                {items?.map((el, index) => (
                    <CardList.Item
                        size={itemSize}
                        key={index}
                    >
                        {children(el, index)}
                    </CardList.Item>
                ))}
            </CardList>
        </SuspenseQuery>
    );
};
