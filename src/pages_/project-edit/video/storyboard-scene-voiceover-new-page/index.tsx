"use client";

import { BackButton, SuspenseQuery } from "@/shared/ui";
import { Flex, Separator } from "@radix-ui/themes";
import { useMemo, type FC } from "react";
import { useSceneGetById } from "@/entities/scene";
import { FileAudioGenerate } from "@/widgets/file";
import type { IFileRead } from "@/shared/api";
import { AudioTypeEnum } from "@/shared/api";
import { useSceneUpdate } from "@/features/scene";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";

type Props = { sceneId: string; projectId: string };

export const StoryboardSceneVoiceoverNewPage: FC<Props> = ({
    projectId,
    sceneId,
}) => {
    const { push } = useRouter();

    const backPath = getPath("PROJECT_VIDEO_STORYBOARD_SCENE", {
        projectId,
        sceneId,
    });

    const {
        data: scene,
        isLoading,
        isError,
        refetch,
    } = useSceneGetById({ id: sceneId });

    const { mutate: update } = useSceneUpdate();

    const handleComplete = (file?: IFileRead) => {
        push(backPath);

        if (!scene) return;
        if (!scene.file_id) return;

        update({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: scene.file_id,
                voiceover_id: file?.id ?? null,
            },
        });
    };

    const initialValue = useMemo(() => {
        if (!scene) return undefined;
        if (!scene.voiceover) return undefined;
        return scene.voiceover.audio_generation ?? undefined;
    }, [scene]);

    return (
        <Flex
            direction="column"
            flexGrow="1"
            gapY="5"
            p="6"
        >
            <Flex
                gap="2"
                direction="column"
            >
                <BackButton route={backPath} />
                <Separator size="4" />
            </Flex>

            <SuspenseQuery
                isError={isError}
                isLoading={isLoading}
                refetch={refetch}
            >
                <FileAudioGenerate
                    projectId={projectId}
                    sceneId={sceneId}
                    initialValue={initialValue}
                    audioType={AudioTypeEnum.VOICEOVER}
                    onComplete={handleComplete}
                />
            </SuspenseQuery>
        </Flex>
    );
};

export default StoryboardSceneVoiceoverNewPage;
