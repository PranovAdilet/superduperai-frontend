"use client";

import { TabNav as RadixNavTabs } from "@radix-ui/themes";
import React from "react";

export type TabsOptions = {
    value: string;
    link?: string;
};

type TabProps = {
    pathname: string;
    options: TabsOptions[];
};

export function TabsNav({ options, pathname }: TabProps) {
    return (
        <RadixNavTabs.Root size="2">
            {options.map((option) => (
                <RadixNavTabs.Link
                    key={option.link}
                    href={option.link}
                    active={pathname === option.value}
                >
                    {option.value}
                </RadixNavTabs.Link>
            ))}
        </RadixNavTabs.Root>
    );
}
