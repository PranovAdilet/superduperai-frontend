"use client";

import { MyProjectCard, useProjectList } from "@/entities/project";
import { useUserMe } from "@/entities/user";
import { useRouter } from "@/i18n/navigation";
import { ProjectTypeEnum, ListOrderEnum } from "@/shared/api";

import { SearchField, SuspenseQuery, Tabs } from "@/shared/ui";
import { Pagination } from "@/shared/ui/pagination";
import { Flex, Heading, ScrollArea } from "@radix-ui/themes";
import { useState } from "react";
import { useWindowSize } from "react-use";

export const MyProjectsPage = () => {
    // const projectTypes = [
    //     { label: "Videos", value: ProjectTypeEnum.FILM },
    //     { label: "Images", value: ProjectTypeEnum.MEDIA },
    // ];

    const projectTypes = [
        { label: "Videos", value: ProjectTypeEnum.VIDEO },
        { label: "Images", value: ProjectTypeEnum.IMAGE },
    ];

    const { push } = useRouter();

    const { width } = useWindowSize();

    const { data: user, isSuccess, isLoading: isUserLoading } = useUserMe();

    const [searchText, setSearchText] = useState<string>("");

    const [type, setType] = useState(projectTypes[0].value);

    const [offset, setOffset] = useState(0);

    const limit = 10;

    const {
        data,
        isLoading: isProjectsLoading,
        isError,
        refetch,
    } = useProjectList(
        {
            userId: user?.id,
            orderBy: "created_at",
            order: ListOrderEnum.DESCENDENT,
            searchText,
            limit,
            offset,
            type,
        },
        { enabled: isSuccess },
    );

    const handleClick = (routePath: string) => {
        push(routePath);
    };

    const handleSearch = (query: string) => {
        setSearchText(query);
        setOffset(0);
    };

    const handleChangeProjectType = (value: ProjectTypeEnum) => {
        setType(value);
    };

    const isDekstop = width > 1000;

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
                <Flex
                    pr="3"
                    direction="column"
                    gap="4"
                >
                    <Tabs
                        full
                        options={projectTypes}
                        value={type}
                        onValueChange={handleChangeProjectType}
                    />
                    <SearchField
                        placeholder="Search projects..."
                        onSearch={handleSearch}
                    />
                </Flex>
                <Flex
                    flexGrow="1"
                    flexBasis="0"
                    height="0"
                >
                    <ScrollArea scrollbars="vertical">
                        <Flex
                            direction="column"
                            flexGrow="1"
                            height="100%"
                            gap="4"
                            className="pr-3"
                        >
                            <SuspenseQuery
                                isLoading={isProjectsLoading || isUserLoading}
                                refetch={refetch}
                                isError={isError}
                            >
                                {!data?.items.length ? (
                                    <Flex
                                        justify="center"
                                        align="center"
                                    >
                                        <Heading size="6">
                                            No projects found
                                        </Heading>
                                    </Flex>
                                ) : (
                                    data.items.map((project, index) => (
                                        <MyProjectCard
                                            key={index}
                                            project={project}
                                            onClick={handleClick}
                                            isDekstop={isDekstop}
                                            // actionsList={
                                            //     <ProjectActionsList
                                            //         projectId={project.id}
                                            //     />
                                            // }
                                        />
                                    ))
                                )}
                            </SuspenseQuery>
                        </Flex>
                        <Pagination
                            offset={offset}
                            limit={limit}
                            total={data?.total ?? 0}
                            onChange={setOffset}
                        />
                    </ScrollArea>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MyProjectsPage;
