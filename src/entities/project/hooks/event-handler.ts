import type {
    IDataRead,
    IProjectRead,
    ITaskRead,
    WSMessage,
} from "@/shared/api";
import { WSMessageTypeEnum } from "@/shared/api";
import { projectKeys } from "../query";
import { useQueryClient } from "@tanstack/react-query";
import type { EventHandler } from "@/shared/utils";
import { unshiftOrReplace } from "@/shared/utils";

export const useProjectEventHandler = (projectId: string): EventHandler => {
    const queryClient = useQueryClient();

    return (eventData: WSMessage) => {
        if (eventData.type === WSMessageTypeEnum.DATA) {
            const object = eventData.object as IDataRead;

            const queryKey = projectKeys.getById({ id: projectId }).queryKey;

            queryClient.setQueryData(queryKey, (oldData: IProjectRead) => {
                return {
                    ...oldData,
                    data: unshiftOrReplace(oldData.data, object, "type"),
                };
            });
        } else if (eventData.type === WSMessageTypeEnum.TASK) {
            const object = eventData.object as ITaskRead;

            if (object.file_id) {
                return;
            }

            const queryKey = projectKeys.getById({ id: projectId }).queryKey;

            queryClient.setQueryData(queryKey, (oldData: IProjectRead) => {
                return {
                    ...oldData,
                    tasks: unshiftOrReplace(oldData.tasks, object, "id"),
                };
            });
        }
    };
};
