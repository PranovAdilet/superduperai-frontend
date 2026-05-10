import type { IFileRead, WSMessage } from "@/shared/api";
import { WSMessageTypeEnum } from "@/shared/api";
import type { EventHandler } from "@/shared/utils";
import { useProjectVideoRenderStore } from "../store/render";

export const useProjectVideoEventHandler = (): EventHandler => {
    const { setState } = useProjectVideoRenderStore();
    return (eventData: WSMessage) => {
        if (eventData.type === WSMessageTypeEnum.RENDER_PROGRESS) {
            const { progress } = eventData.object as { progress: number };
            setState({ progress });
        } else if (eventData.type === WSMessageTypeEnum.RENDER_RESULT) {
            const result = eventData.object as IFileRead;
            setState({ result });
        }
    };
};


