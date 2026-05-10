"use client";

import {
    SceneGenerateDialog,
    useSceneDelete,
    useSceneUpdate,
    useSceneUpdateOrder,
} from "@/features/scene";
import type { ISceneRead } from "@/shared/api";
import { Button, Flex } from "@radix-ui/themes";
import { debounce } from "lodash";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect, type FC } from "react";
import {
    ScenesList,
    ScenesSkeletonCards,
    SceneCard,
    useSceneList,
    SceneGenerateButton,
} from "@/entities/scene";
import { SuspenseQuery } from "@/shared/ui";
import { getPath } from "@/shared/config/routes";
import { useModal } from "@/shared/store";
import { DeleteDialog } from "@/shared/ui/delete-dialog";
import { usePathname } from "next/navigation";
import { Grid, List } from "lucide-react";
import Image from "next/image";

type Props = {
    projectId: string;
    sceneId?: string;
    readonly?: boolean;
};

type ViewMode = "list" | "grid";

export const SceneStoryboardList: FC<Props> = ({
    projectId,
    sceneId,
    readonly,
}) => {
    const { push } = useRouter();
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    // Load saved view mode from localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem("storyboard-view-mode");
        if (savedViewMode === "list" || savedViewMode === "grid") {
            setViewMode(savedViewMode);
        }
    }, []);

    // Save view mode to localStorage when it changes
    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem("storyboard-view-mode", mode);
    };

    const { mutate: updateOrder } = useSceneUpdateOrder();

    const handleCardClick = (scene: ISceneRead) => {
        push(
            getPath("PROJECT_VIDEO_STORYBOARD_SCENE", {
                projectId,
                sceneId: scene.id,
            }),
        );
    };

    const handleDragChange = (scene: ISceneRead, order: number) => {
        updateOrder({ id: scene.id, requestBody: { order } });
    };

    const { mutate: update } = useSceneUpdate();
    const debouncedUpdate = debounce(update, 500);

    const handleTextChange = (
        scene: ISceneRead,
        actionDescrtiption: string,
    ) => {
        if (!scene.objects) return;
        if (!scene.file_id) return;

        debouncedUpdate({
            id: scene.id,
            requestBody: {
                ...scene,
                action_description: actionDescrtiption,
                file_id: scene.file_id,
            },
        });
    };

    const { data: scenes, isLoading, refetch } = useSceneList({ projectId });

    const dense = Boolean(sceneId);

    const loading = isLoading || scenes?.items.length === 0;

    const { open, close } = useModal();

    const { mutate, isPending: isDeleting } = useSceneDelete();

    const handleDelete = (scene?: ISceneRead) => {
        if (!scene) return;

        mutate(
            { id: scene.id },
            {
                onSuccess: () => {
                    close();

                    if (
                        !scenes ||
                        pathname.endsWith("storyboard") ||
                        sceneId !== scene.id
                    ) {
                        return;
                    }

                    const filteredScenes = scenes.items.filter(
                        (s) => s.id !== scene.id,
                    );
                    if (filteredScenes.length === 0) return;

                    const prevSceneId = filteredScenes.find(
                        (s) => s.order === scene.order - 1,
                    )?.id;
                    const firstScene = filteredScenes.reduce((minScene, s) =>
                        s.order < minScene.order ? s : minScene,
                    );

                    push(
                        getPath("PROJECT_VIDEO_STORYBOARD_SCENE", {
                            projectId,
                            sceneId: prevSceneId ?? firstScene.id,
                        }),
                    );
                },
            },
        );
    };

    const handleSceneClick = (scene: ISceneRead) => {
        handleCardClick(scene);
    };

    const handleSceneKeyDown = (event: React.KeyboardEvent, scene: ISceneRead) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick(scene);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent, scene: ISceneRead) => {
        event.stopPropagation();
        open("deleteDialog", scene);
    };

    const handleDeleteKeyDown = (event: React.KeyboardEvent, scene: ISceneRead) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            open("deleteDialog", scene);
        }
    };

    const renderGridView = () => {
        if (!scenes?.items) return null;

        return (
            <div 
                className="grid grid-cols-3 gap-4 overflow-auto p-4"
                style={{ height: "calc(100vh - 200px)" }}
            >
                {scenes.items.map((scene, index) => {
                    // Type guard to check if scene is ISceneRead
                    const isFullScene = 'file' in scene;
                    const fileUrl = isFullScene ? scene.file?.thumbnail_url ?? scene.file?.url : undefined;
                    
                    return (
                        <div
                            key={scene.id}
                            className="relative aspect-video cursor-pointer transition-transform hover:scale-105"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                handleSceneClick(scene as ISceneRead);
                            }}
                            onKeyDown={(e) => {
                                handleSceneKeyDown(e, scene as ISceneRead);
                            }}
                        >
                            <div className="relative size-full overflow-hidden rounded-lg border border-gray-600">
                                <Image
                                    src={fileUrl ?? '/placeholder-image.jpg'}
                                    alt={`Scene ${index + 1}`}
                                    className="size-full object-cover"
                                    width={400}
                                    height={225}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2">
                                    <p className="line-clamp-2 text-sm text-white">
                                        {scene.action_description ?? `Scene ${index + 1}`}
                                    </p>
                                </div>
                                <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1">
                                    <span className="text-xs font-bold text-white">
                                        {index + 1}
                                    </span>
                                </div>
                                {!readonly && (
                                    <button
                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity hover:bg-red-600 hover:opacity-100"
                                        onClick={(e) => {
                                            handleDeleteClick(e, scene as ISceneRead);
                                        }}
                                        onKeyDown={(e) => {
                                            handleDeleteKeyDown(e, scene as ISceneRead);
                                        }}
                                        type="button"
                                        aria-label={`Delete scene ${index + 1}`}
                                    >
                                        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderListView = () => {
        return (
            <ScenesList.Root
                scenes={scenes?.items as any}
                dense={dense}
                onDragChange={handleDragChange}
            >
                {(scene, isActive, index) => (
                    <Flex
                        flexGrow="1"
                        direction="column"
                        position="relative"
                    >
                        <SceneGenerateButton
                            projectId={projectId}
                            order={scene.order}
                            position="top"
                        />
                        <SceneCard
                            scene={scene}
                            readonly={readonly}
                            dense={dense}
                            isActive={isActive}
                            onClick={() => {
                                handleCardClick(scene);
                            }}
                            onTextChange={handleTextChange}
                            onDelete={() => {
                                open("deleteDialog", scene);
                            }}
                        />
                        {scenes &&
                            !readonly &&
                            index === scenes.items.length - 1 && (
                                <SceneGenerateButton
                                    projectId={projectId}
                                    order={scene.order + 1}
                                    position="bottom"
                                />
                            )}
                    </Flex>
                )}
            </ScenesList.Root>
        );
    };

    return (
        <Flex flexGrow="1" direction="column">
            {/* View Mode Toggle */}
            <Flex justify="end" p="3" pb="0">
                <Flex gap="1">
                    <Button
                        variant={viewMode === "list" ? "solid" : "outline"}
                        color={viewMode === "list" ? "lime" : "gray"}
                        size="2"
                        onClick={() => {
                            handleViewModeChange("list");
                        }}
                    >
                        <List size={16} />
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "solid" : "outline"}
                        color={viewMode === "grid" ? "lime" : "gray"}
                        size="2"
                        onClick={() => {
                            handleViewModeChange("grid");
                        }}
                    >
                        <Grid size={16} />
                    </Button>
                </Flex>
            </Flex>

            {/* Content */}
            <Flex flexGrow="1">
                <SuspenseQuery
                    refetch={refetch}
                    isLoading={loading}
                    fallbackLoading={<ScenesSkeletonCards dense={dense} />}
                >
                    {viewMode === "grid" ? renderGridView() : renderListView()}
                </SuspenseQuery>
            </Flex>
            
            <DeleteDialog
                onDelete={handleDelete}
                isPending={isDeleting}
                label="scene"
            />
            <SceneGenerateDialog />
        </Flex>
    );
};
