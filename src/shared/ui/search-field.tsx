"use client";

import { type FC, type RefAttributes, useState, type ChangeEvent } from "react";

import { TextField } from "@/shared/ui";
import { Search } from "lucide-react";
import type { TextField as Field } from "@radix-ui/themes";

type FieldProps = Omit<Field.RootProps, "slot">;

type SearchProps = {
    placeholder?: string;
    onSearch: (query: string) => void;
} & FieldProps &
    RefAttributes<HTMLInputElement>;

export const SearchField: FC<SearchProps> = ({
    placeholder,
    onSearch,
    ...props
}) => {
    const [search, setSearch] = useState<string>("");
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                onSearch(value);
            }, 500),
        );
    };

    return (
        <TextField
            value={search}
            onChange={handleSearchChange}
            placeholder={placeholder}
            slot={<Search color="gray" />}
            {...props}
            full
        />
    );
};
