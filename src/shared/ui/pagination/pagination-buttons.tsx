"use client";

import type { FC } from "react";
import { useMemo } from "react";
import { PaginationButton } from "./pagination-button";

type Props = {
    currentPage: number;
    totalPages: number;
    onPage: (page: number) => void;
};

export const PaginationButtons: FC<Props> = ({
    currentPage,
    onPage,
    totalPages,
}) => {
    const renderPageButtons = useMemo(() => {
        const buttons = [];

        const createPageButton = (page: number) => (
            <PaginationButton
                key={page}
                page={page}
                isActive={currentPage === page}
                onClick={() => {
                    onPage(page);
                }}
            />
        );

        buttons.push(createPageButton(1));

        if (currentPage > 4)
            buttons.push(
                <PaginationButton
                    key="start-ellipsis"
                    page="..."
                />,
            );

        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(createPageButton(i));
        }

        if (currentPage < totalPages - 3)
            buttons.push(
                <PaginationButton
                    key="end-ellipsis"
                    page="..."
                />,
            );

        if (totalPages > 1) buttons.push(createPageButton(totalPages));

        return buttons;
    }, [totalPages, currentPage]);

    return <>{renderPageButtons}</>;
};
