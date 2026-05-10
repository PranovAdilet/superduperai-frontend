"use client";

import type { FC } from "react";
import { Flex } from "@radix-ui/themes";
import {
    PromptStepCard,
    ScriptStepCard,
    StoryboardStepCard,
    PreviewStepCard,
    EntitiesStepCard,
    StyleStepCard,
    MusicStepCard,
    EditorStepCard,
} from "@/widgets/project";
import { useActiveScroll } from "@/shared/hooks";

type Props = {
    projectId: string;
};

const stepCards = [
    {
        component: PromptStepCard,
        path: "edit/prompt",
    },
    {
        component: ScriptStepCard,
        path: "edit/script",
    },
    { component: StyleStepCard, path: "edit/style" },
    {
        component: EntitiesStepCard,
        path: "edit/entities",
    },

    {
        component: StoryboardStepCard,
        path: "edit/storyboard",
    },
    {
        component: MusicStepCard,
        path: "edit/music",
    },
    { component: EditorStepCard, path: "edit/video" },
    { component: PreviewStepCard, path: "preview" },
];

const ProjectStepsPage: FC<Props> = ({ projectId }) => {
    const { activeRef, isActiveCard } = useActiveScroll();

    return (
        <Flex
            direction="column"
            gapY="5"
            py="6"
        >
            {stepCards.map((card) => {
                const Component = card.component;
                const isActive = isActiveCard(card.path);
                return (
                    <div
                        key={card.path}
                        className="scroll-my-3"
                        ref={isActive ? activeRef : null}
                    >
                        <Component
                            projectId={projectId}
                            active={isActive}
                        />
                    </div>
                );
            })}
        </Flex>
    );
};

export default ProjectStepsPage;
