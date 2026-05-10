import { Link as NextLink } from "@/i18n/navigation";
import type { LinkProps } from "@radix-ui/themes";
import { Link as RadixLink } from "@radix-ui/themes";
import type { FC } from "react";

type Props = {
    href?: string;
    disabled?: boolean;
} & Omit<LinkProps, "href">;

export const Link: FC<Props> = ({ children, href, disabled, ...rest }) => {
    return (
        <RadixLink
            asChild
            style={{
                pointerEvents: disabled ? "none" : "auto",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
            }}
            {...rest}
        >
            <NextLink href={href ?? ""}>{children}</NextLink>
        </RadixLink>
    );
};
