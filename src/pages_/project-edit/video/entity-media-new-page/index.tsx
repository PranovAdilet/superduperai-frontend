"use client";

import { SuspenseQuery } from "@/shared/ui";
import { Flex, Separator, Text } from "@radix-ui/themes";
import { useEntityGetById } from "@/entities/entity";
import { getPath } from "@/shared/config/routes";
import { useMemo, useState, type FC } from "react";
import { FileImageGenerate } from "@/widgets/file";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { IFileRead } from "@/shared/api";
import { useEntityUpdate } from "@/features/entity";

type Props = {
    entityId: string;
    projectId?: string;
};

const EntityMediaNewPage: FC<Props> = ({ entityId, projectId }) => {
    const { push, back } = useRouter();

    const {
        data: entity,
        isLoading,
        isError,
        refetch,
    } = useEntityGetById({ id: entityId });

    const { mutate: updateEntity } = useEntityUpdate();

    const [isEditingStyle, setIsEditingStyle] = useState(false);

    const backRoute = useMemo(() => {
        return projectId
            ? getPath("PROJECT_VIDEO_EDIT_ENTITY_MEDIA", {
                  projectId,
                  entityId,
              })
            : getPath("MY_ENTITY_MEDIA", { entityId });
    }, [projectId, entityId]);

    const handleComplete = (file?: IFileRead) => {
        if (file && entity) {
            updateEntity({
                ...entity,
                id: entityId,
                file_id: file.id,
            });
        }
        push(backRoute);
    };

    const handleBack = () => {
        if (isEditingStyle) {
            back();
        } else {
            push(backRoute);
        }
    };

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
                {/* <BackButton route={backRoute} /> */}
                <button
                    onClick={handleBack}
                    className="flex gap-x-2 text-gray-400"
                    color="gray"
                >
                    <ArrowLeft />
                    <Text>Back</Text>
                </button>
                <Separator size="4" />
            </Flex>

            <SuspenseQuery
                isError={isError}
                isLoading={isLoading}
                refetch={refetch}
            >
                <FileImageGenerate
                    projectId={projectId}
                    entityId={entityId}
                    initialValue={entity?.file?.image_generation ?? undefined}
                    onComplete={handleComplete}
                    onEditingStyle={setIsEditingStyle}
                />
            </SuspenseQuery>
        </Flex>
    );
};

export default EntityMediaNewPage;
