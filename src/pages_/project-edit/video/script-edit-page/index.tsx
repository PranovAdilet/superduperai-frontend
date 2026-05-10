"use client";

import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
    useProjectScript,
    useScriptStore,
} from "@/entities/project";
import { useDataUpdate } from "@/features/data";
import { MarkdownEditor } from "@/shared/ui";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { Flex, Box, Text } from "@radix-ui/themes";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";
import type { FC } from "react";
import { useEffect, useRef } from "react";

type Props = {
    projectId: string;
};

const ScriptEditPage: FC<Props> = ({ projectId }) => {
    const router = useRouter();

    const { data: project } = useProjectGetById({ id: projectId });

    const { mutate, isPending: isUpdating, isSuccess } = useDataUpdate();

    const {
        text,
        data: scriptData,
        isPending: isScriptPending,
        isError: isScriptError,
    } = useProjectScript(project);

    const { setScript, script: scriptText } = useScriptStore();

    const routePath = getPath("PROJECT_VIDEO_EDIT_STYLE", {
        projectId,
    });

    useEffect(() => {
        router.prefetch(routePath);
    }, [router, routePath]);

    useEffect(() => {
        const safeText = text.replace(/(?<!(?<!\\)\\)</g, "\\<");

        const formattedText = safeText.replace(
            /(^|[^`])```(?!txt|json)(.*?)```/s,
            (match, p1, p2) => {
                return p2.startsWith("txt")
                    ? match
                    : `${p1}\`\`\`txt${p2}\`\`\``;
            },
        );

        setScript(formattedText);

        editorRef.current?.setMarkdown(formattedText);
    }, [text]);

    const handleChange = (value: string) => {
        setScript(value);
    };

    const handleNext = () => {
        if (!project || !scriptData) return;

        const safeText = scriptText.replace(/\\</g, "<");

        mutate(
            {
                ...scriptData,
                value: {
                    text: safeText,
                },
            },
            {
                onSuccess: () => {
                    router.push(routePath);
                },
            },
        );
    };

    const waitingText = isScriptPending || !scriptText;

    const editorRef = useRef<MDXEditorMethods>(null);

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Box
                    p="6"
                    pb="0"
                    height="100%"
                    position="relative"
                >
                    {isScriptError && (
                        <Flex
                            top="0"
                            left="0"
                            position="absolute"
                            width="100%"
                            height="100%"
                            justify="center"
                            align="center"
                        >
                            <Text>Something went wrong, please try again</Text>
                        </Flex>
                    )}

                    <MarkdownEditor
                        readOnly={isScriptPending}
                        editorRef={editorRef}
                        markdown={scriptText}
                        onChange={handleChange}
                        className="size-full rounded-2xl bg-transparent p-3 "
                        placeholder={
                            isScriptPending ? "Generating script..." : ""
                        }
                    />
                </Box>
            </ProjectStep.Root>
            <ProjectStep.Footer>
                <ProjectNextBtn
                    onClick={handleNext}
                    disabled={waitingText}
                    loading={isScriptPending || isSuccess || isUpdating}
                    id="script-next-btn"
                />
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default ScriptEditPage;
