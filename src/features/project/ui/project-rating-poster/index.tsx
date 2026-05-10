"use client";

import { useProjectGetById } from "@/entities/project";
import { useProjectUpdate } from "@/features/project";
import { RatingButtons, TextField } from "@/shared/ui";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { memo, useState } from "react";

type Props = {
    width?: string;
};

type Params = {
    projectId?: string;
};

const Poster: FC<Props> = ({ width }) => {
    const [comment, setComment] = useState<string>("");

    const [rating, setRating] = useState<number | null>(0);

    const handleSubmit = () => {
        if (!rating) return;
        handleRatingUpdate(rating, comment);
    };
    //TODO:Вынести params из компонента
    const params = useParams<Params>();

    const projectId = params.projectId;

    const { mutate: updatedProject } = useProjectUpdate();

    const { data: project } = useProjectGetById(
        { id: projectId ?? "" },
        { enabled: !!projectId },
    );

    const handleRatingUpdate = (rating?: number | null, comment?: string) => {
        if (!project) return;
        updatedProject({ ...project, id: project.id, rating, comment });
    };

    return (
        <Flex
            position="absolute"
            className="z-10  bg-black "
            justify="center"
            align="center"
            width={width}
            direction="column"
            bottom="35%"
            gap="2"
            p="2"
            pb="1"
        >
            <Text>Rate the result</Text>
            <RatingButtons
                rating={rating}
                onChange={setRating}
                dense={project?.config?.aspect_ratio === "9:16"}
            />
            <Flex
                direction="column"
                align="center"
                gap="3"
                py="2"
            >
                <TextField
                    full
                    placeholder="Feedback"
                    size="2"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                />
                <Button
                    size="2"
                    onClick={handleSubmit}
                    disabled={!rating}
                >
                    Confirm
                </Button>
            </Flex>
        </Flex>
    );
};

export const ProjectRatingPoster = memo(Poster);
