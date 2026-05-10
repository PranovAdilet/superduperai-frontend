import { useMemo, type FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Flex } from "@radix-ui/themes";
import { PaginationButtons } from "./pagination-buttons";

type Props = {
    total: number;
    limit: number;
    offset: number;
    onChange: (offset: number) => void;
};

export const Pagination: FC<Props> = ({ total, limit, offset, onChange }) => {
    const currentPage = useMemo(() => offset / limit + 1, [offset, limit]);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    const handleNext = () => {
        if (currentPage >= totalPages) return;
        onChange(offset + limit);
    };

    const handlePrev = () => {
        const value = offset - limit < 0 ? 0 : offset - limit;
        onChange(value);
    };

    const handlePage = (page: number) => {
        const offset = (page - 1) * limit;
        onChange(offset);
    };

    if (totalPages < 2) {
        return;
    }

    return (
        <Flex
            gap="6"
            align="center"
            justify="center"
            mt="auto"
        >
            <Button
                className="rounded-lg px-1"
                onClick={handlePrev}
                color="gray"
            >
                <ChevronLeft />
            </Button>
            <Flex
                align="center"
                gap="6"
            >
                <PaginationButtons
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPage={handlePage}
                />
            </Flex>
            <Button
                className="rounded-lg px-1"
                onClick={handleNext}
                color="gray"
            >
                <ChevronRight />
            </Button>
        </Flex>
    );
};
