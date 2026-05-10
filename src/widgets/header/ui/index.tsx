"use client";

import {
    Button,
    Container,
    Flex,
    Section,
    Separator,
    Text,
} from "@radix-ui/themes";
import { useLogin, useLogout } from "@/features/auth";
import { useAuthStore } from "@/shared/store";
import { DropdownMenu, Image, Link } from "@/shared/ui";
import { useRouter } from "@/i18n/navigation";
import { useUserMe } from "@/entities/user";
import { useMemo } from "react";
import logo from "@/../public/logo.svg";
import { getPath } from "@/shared/config/routes";
import styles from "./styles.module.scss";
import { Menu, Plus } from "lucide-react";
import clsx from "clsx";
import { useProjectUpdate } from "@/features/project";
import { ProjectAutoModeSwitcher, useProjectGetById } from "@/entities/project";
import { ProjectTypeEnum, TaskTypeEnum } from "@/shared/api";
import { useTaskStatus } from "@/entities/task";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

type Params = {
    projectId?: string;
};

export const Header = () => {
    const params = useParams<Params>();
    const { push } = useRouter();

    const { logout } = useLogout();

    const { login } = useLogin();

    const { setToken, token } = useAuthStore((state) => state);

    const { data: user } = useUserMe({ enabled: !!token });

    const { mutate: updateProject } = useProjectUpdate();

    const { data: project } = useProjectGetById(
        { id: params.projectId ?? "" },
        { enabled: !!params.projectId },
    );

    const { isExists, isCompleted } = useTaskStatus(
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        project?.tasks,
    );

    const t = useTranslations("metadata");

    const handleLogout = () => {
        setToken(null);
        logout();
    };

    const handleBuy = () => {
        push(getPath("PAYMENT"));
    };

    const redirectToDiscord = () => {
        window.location.href = "https://discord.gg/uj7gjQkke8";
    };

    const menuOptions = useMemo(() => {
        return [
            {
                value: "Chat",
                onClick: () => {
                    window.open("https://chat.superduperai.co/", "_blank");
                },
                shortcut: "💬",
            },
            {
                value: "New Video",
                onClick: () => {
                    window.open("https://chat.superduperai.co/tools/video-generator", "_blank");
                },
                shortcut: "🎥",
            },
            {
                value: "New Story",
                onClick: () => {
                    push(getPath("PROJECT_VIDEO_CREATE"));
                },
                shortcut: "🎞️",
            },
            {
                value: "New Image",
                onClick: () => {
                    push(getPath("PROJECT_IMAGE_CREATE"));
                },
                shortcut: "🌄",
            },
            {
                value: " Train",
                onClick: () => {
                    push(getPath("LORA"));
                },
                shortcut: "✨",
            },
        ];
    }, []);

    const options = useMemo(() => {
        return [
            {
                value: user?.email ?? "",
                shortcut: "✉",
                disabled: true,
            },

            {
                value: "My Projects",
                onClick: () => {
                    push(getPath("MY_PROJECTS"));
                },
                shortcut: "📁",
            },
            {
                value: "My Entities",
                onClick: () => {
                    push(getPath("MY_ENTITIES"));
                },
                shortcut: "🎭",
            },
            {
                value: "Our Discord",
                shortcut: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="18"
                        height="18"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#8c9eff"
                            d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"
                        ></path>
                    </svg>
                ),
                onClick: redirectToDiscord,
            },
            {
                value: "Logout",
                onClick: handleLogout,
                shortcut: "➡",
            },
        ];
    }, [user]);

    const handleUpdate = (isAutoMode?: boolean) => {
        if (!project) return;
        updateProject({
            ...project,
            id: project.id,
            config: { ...project.config, auto_mode: isAutoMode },
        });
    };

    const showSwitcher = useMemo(
        () => project && project.type === ProjectTypeEnum.FILM,
        [project],
    );

    const type = process.env.NEXT_PUBLIC_PROJECT_TYPE;

    return (
        <Section
            py={"4"}
            className="border-b border-[#5E5E5E]"
        >
            <Container
                maxWidth="90vw"
                mx="auto"
                width="100%"
            >
                <Flex
                    justify={"between"}
                    align={"center"}
                >
                    <Flex className="cursor-pointer">
                        <Flex
                            align="center"
                            gap="4"
                        >
                            <Flex className={styles.header__menu}>
                                <DropdownMenu
                                    trigger={<Menu />}
                                    align="start"
                                    options={menuOptions}
                                />
                            </Flex>
                            <Flex className={styles.header__logo}>
                                {type === "neuroStudio" ? (
                                    <></>
                                ) : (
                                    <Image
                                        className="rounded-full"
                                        src={logo}
                                        alt="logo"
                                    />
                                )}
                            </Flex>
                            <Text weight="medium">{t("title")}</Text>
                            <Flex
                                align="center"
                                gap="4"
                                className={styles.header__nav}
                            >
                                <Separator orientation="vertical" />
                                <Link href="https://chat.superduperai.co/" target="_blank">
                                    <Text
                                        size="2"
                                        weight="bold"
                                    >
                                        CHAT
                                    </Text>
                                </Link>
                                <Separator orientation="vertical" />
                                <Link href="https://chat.superduperai.co/tools/video-generator" target="_blank">
                                    <Text
                                        size="2"
                                        weight="bold"
                                    >
                                        NEW VIDEO
                                    </Text>
                                </Link>
                                <Separator orientation="vertical" />
                                <Link href={getPath("PROJECT_VIDEO_CREATE")}>
                                    <Text
                                        size="2"
                                        weight="bold"
                                    >
                                        NEW STORY
                                    </Text>
                                </Link>
                                <Separator orientation="vertical" />
                                <Link href={getPath("PROJECT_IMAGE_CREATE")}>
                                    <Text
                                        size="2"
                                        weight="bold"
                                    >
                                        NEW IMAGE
                                    </Text>
                                </Link>
                                <Separator orientation="vertical" />
                                <Link href={getPath("LORA")}>
                                    <Text
                                        size="2"
                                        weight="bold"
                                    >
                                        TRAIN
                                    </Text>
                                </Link>
                            </Flex>
                        </Flex>
                    </Flex>
                    {user ? (
                        <Flex
                            gap="3"
                            align="center"
                        >
                            {showSwitcher && (!isCompleted || !isExists) && (
                                <ProjectAutoModeSwitcher
                                    projectId={project?.id}
                                    onChange={handleUpdate}
                                    onUpdate={handleUpdate}
                                    autoMode={project?.config?.auto_mode}
                                />
                            )}

                            <Flex>
                                <Text
                                    size="2"
                                    weight="medium"
                                >
                                    {user.balance} credits
                                </Text>
                            </Flex>

                            <Button
                                size="2"
                                onClick={handleBuy}
                                className={clsx("p-2", styles.header__buy)}
                            >
                                <Text
                                    size="2"
                                    weight="medium"
                                >
                                    Buy credits
                                </Text>
                            </Button>
                            <Button
                                size="1"
                                onClick={handleBuy}
                                className={clsx(
                                    "size-[28px] p-1",
                                    styles.header__plus,
                                )}
                            >
                                <Plus size="20px" />
                            </Button>
                            <DropdownMenu
                                trigger={
                                    <Flex>
                                        {user.picture ? (
                                            <Flex
                                                className={
                                                    styles.header__avatar
                                                }
                                            >
                                                <Image
                                                    src={user.picture}
                                                    alt="user avatar"
                                                    className="cursor-pointer rounded-full"
                                                />
                                            </Flex>
                                        ) : (
                                            <Flex
                                                justify="center"
                                                align="center"
                                                className="size-8 !h-[40px] !w-[40px] cursor-pointer rounded-full bg-[#5E5E5E]"
                                            >
                                                <Text>
                                                    {user.email
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </Text>
                                            </Flex>
                                        )}
                                    </Flex>
                                }
                                align="center"
                                options={options}
                            />
                        </Flex>
                    ) : (
                        <Button
                            color="gray"
                            onClick={login}
                        >
                            Sign In
                        </Button>
                    )}
                </Flex>
            </Container>
        </Section>
    );
};
