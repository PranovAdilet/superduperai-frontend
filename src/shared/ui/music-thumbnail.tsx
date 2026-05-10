import type { FC } from "react";
import { Image } from "@/shared/ui";
import { Flex } from "@radix-ui/themes";
import { Music } from "lucide-react";

type Props = {
    thumbnail?: string | null;
};

export const MusicThumbnail: FC<Props> = ({ thumbnail }) => {
    return thumbnail ? (
        <Image
            src={thumbnail}
            alt="Audio visual"
            className="rounded-lg"
        />
    ) : (
        <Flex
            width="100%"
            height="100%"
            justify="center"
            align="center"
            className="rounded-lg bg-zinc-900"
        >
            <Music />
        </Flex>
    );
};
