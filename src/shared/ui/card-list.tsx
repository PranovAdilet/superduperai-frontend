import { Box, Flex, Text } from "@radix-ui/themes";
import { SearchX } from "lucide-react";
import type { FC, PropsWithChildren } from "react";
import { Link } from "@/shared/ui";

const Item: FC<PropsWithChildren & { size?: string }> = ({
    children,
    size,
}) => {
    return (
        <Box
            width={size}
            minWidth={size ?? "150px"}
        >
            {children}
        </Box>
    );
};

type NewItemProps = {
    href: string;
    dense?: boolean;
    width?: string;
    height?: string;
};

const NewItem: FC<NewItemProps> = ({ href, width, height }) => {
    return (
        <Item>
            <Link
                href={href}
                style={{
                    minWidth: width,
                    width,
                    height: height ?? "100%",
                }}
                className="flex flex-col justify-center rounded-xl border border-solid border-lime-500"
            >
                <Text
                    align="center"
                    size="8"
                >
                    +
                </Text>
            </Link>
        </Item>
    );
};

type Props = {
    placeholder?: React.ReactNode;
    isEmpty?: boolean;
    direction?: "row" | "column";
    wrap?: "wrap" | "nowrap" | "wrap-reverse";
} & PropsWithChildren;

const CardList: FC<Props> & {
    Item: FC<PropsWithChildren & { size?: string }>;
} & { NewItem: FC<NewItemProps> } = ({
    children,
    isEmpty,
    placeholder,
    direction,
    wrap,
}: Props) => {
    return isEmpty ? (
        <Flex
            justify="center"
            align="center"
            direction="column"
            height="100%"
            gap="4"
        >
            {placeholder ?? (
                <>
                    <SearchX size="60" />
                    <Text size="6">No items found</Text>
                </>
            )}
        </Flex>
    ) : (
        <Flex
            gap="4"
            height="100%"
            wrap={wrap}
            direction={direction}
        >
            {children}
            {wrap === "wrap" &&
                Array.from({ length: 4 }).map((_, index) => (
                    <Item key={index} />
                ))}
        </Flex>
    );
};

CardList.Item = Item;
CardList.NewItem = NewItem;

export { CardList };
