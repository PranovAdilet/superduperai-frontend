import type {
    IFileRead,
    IResponsePaginated_IFileRead_,
    WSMessage,
} from "@/shared/api";
import { WSMessageTypeEnum } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { unshiftOrReplace, type EventHandler } from "@/shared/utils";
import { fileKeys } from "@/entities/file";

export const useFileEventHandler = (): EventHandler => {
    const queryClient = useQueryClient();

    return (eventData: WSMessage) => {
        if (eventData.type === WSMessageTypeEnum.FILE) {
            const object = eventData.object as IFileRead;

            queryClient.setQueriesData(
                { queryKey: fileKeys.list._def },
                (oldData?: IResponsePaginated_IFileRead_) => {
                    if (!oldData) return;

                    return {
                        ...oldData,
                        items: unshiftOrReplace(oldData.items, object, "id"),
                    };
                },
            );

            queryClient.setQueriesData(
                { queryKey: fileKeys.getById._def },
                () => object,
            );
        }
    };
};
