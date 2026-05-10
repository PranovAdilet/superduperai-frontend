import { Flex, Text } from "@radix-ui/themes";

const Page = () => {
    return (
        <Flex
            justify="center"
            align="center"
            flexGrow="1"
        >
            <Text
                size="6"
                weight="bold"
            >
                Select a step from the left
            </Text>
        </Flex>
    );
};

export default Page;
