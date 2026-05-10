"use client";

import { MyEntitiesList } from "@/widgets/entity";
import { Flex } from "@radix-ui/themes";

export const MyEntitiesPage = () => {
    return (
        <Flex
            flexGrow="1"
            justify="center"
            p="6"
        >
            <Flex
                maxWidth="700px"
                direction="column"
                gap="5"
                flexGrow="1"
            >
                <MyEntitiesList />
            </Flex>
        </Flex>
    );
};

export default MyEntitiesPage;
