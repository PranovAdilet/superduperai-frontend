"use client";

import React from "react";

type Props = {
    isoDate: string;
};

export const DateLabel: React.FC<Props> = ({ isoDate }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-EN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    };

    return <>{formatDate(isoDate)}</>;
};
