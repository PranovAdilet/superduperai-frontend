"use client";

import { Box, Spinner } from "@radix-ui/themes";
import { Star } from "lucide-react";
import { useEntityAddFavorite } from "../../add-favorite";
import { useEntityRemoveFavorite } from "../../remove-favorite";
import type { IEntityRead } from "@/shared/api";
import type { FC } from "react";

type Props = {
    myEntities?: IEntityRead[];
    entityId: string;
    isFavorite?: boolean;
};

export const EntityFavoriteButton: FC<Props> = ({
    entityId,
    myEntities,
    isFavorite,
}) => {
    const { mutate: addFavorite, isPending: isAddingFavorite } =
        useEntityAddFavorite();
    const { mutate: removeFavorite, isPending: isRemovingFavorite } =
        useEntityRemoveFavorite();

    const handleAddToFavorite = () => {
        if (isAddingFavorite || isRemovingFavorite) return;
        if (myEntities?.find((e) => e.id === entityId)) {
            removeFavorite({ id: entityId });
        } else {
            addFavorite({ id: entityId });
        }
    };

    return (
        <Box
            position="absolute"
            top="7px"
            left="10px"
            onClick={handleAddToFavorite}
            role="button"
            className="text-gray-500 "
        >
            {isAddingFavorite || isRemovingFavorite ? (
                <Spinner />
            ) : (
                <Star
                    size="20px"
                    fill={isFavorite ? "lime" : undefined}
                    color={isFavorite ? "lime" : undefined}
                />
            )}
        </Box>
    );
};
