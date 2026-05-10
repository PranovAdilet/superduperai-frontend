"use client";

import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
    useProjectScript,
} from "@/entities/project";
import { useProjectTxt2Script } from "@/features/project-video";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";
import { TextArea } from "@/shared/ui";
import { Box } from "@radix-ui/themes";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    projectId: string;
};

export const PromptEditPage: FC<Props> = ({ projectId }) => {
    const { data: project } = useProjectGetById({ id: projectId });

    const { mutateAsync: txt2script, isPending: isTxt2ScriptPending } =
        useProjectTxt2Script();

    const { data: scriptData } = useProjectScript(project);

    const { push, prefetch } = useRouter();

    const [promptText, setPromptText] = useState("");

    const routePath = getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId });

    useEffect(() => {
        prefetch(routePath);
    }, [prefetch, projectId, routePath]);

    useEffect(() => {
        if (!project) return;
        setPromptText((project.config?.prompt as string | undefined) ?? "");
    }, [project]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setPromptText(e.target.value);
    };

    const handleNext = async () => {
        if (!project || !isMinLength || !scriptData) return;

        try {
            await txt2script({
                id: projectId,
                requestBody: promptText,
            });

            push(routePath);
        } catch (error: unknown) {
            console.error("Failed to generate script:", error);
        }
    };

    const isPending = isTxt2ScriptPending;

    const isMinLength = promptText.trim().length >= 20;

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Box
                    p="6"
                    pb="0"
                    height="100%"
                    position="relative"
                >
                    <TextArea
                        disabled={isPending}
                        value={promptText}
                        onChange={handleChange}
                        className="size-full rounded-2xl bg-transparent p-3"
                    />
                </Box>
            </ProjectStep.Root>
            <ProjectStep.Footer>
                <ProjectNextBtn
                    onClick={handleNext}
                    disabled={!scriptData || !isMinLength}
                    loading={isPending}
                />
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default PromptEditPage;
