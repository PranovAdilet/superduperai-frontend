import type { FC } from "react";
import { Button } from "@radix-ui/themes";

type Props = {
    page: number | string;
    isActive?: boolean;
    onClick?: () => void;
};
export const PaginationButton: FC<Props> = ({ page, isActive, onClick }) => {
    return (
        <Button
            className="size-[30px] rounded-lg "
            color={isActive ? "lime" : "gray"}
            onClick={onClick}
            disabled={typeof page === "string"}
        >
            {page}
        </Button>
    );
};
