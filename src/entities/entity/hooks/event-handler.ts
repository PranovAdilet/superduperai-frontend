import { entityKeys } from "@/entities/entity";
import type {
    IEntityRead,
    IResponsePaginated_IEntityRead_,
    WSMessage,
} from "@/shared/api";
import { WSMessageTypeEnum } from "@/shared/api";
import type { EventHandler } from "@/shared/utils";
import { unshiftOrReplace } from "@/shared/utils";
import { useQueryClient } from "@tanstack/react-query";

export const useEntityEventHandler = (projectId?: string): EventHandler => {
    const queryClient = useQueryClient();

    return (eventData: WSMessage) => {
        if (eventData.type === WSMessageTypeEnum.ENTITY) {
            const object: IEntityRead = eventData.object as IEntityRead;
            const listQueryKey = entityKeys.list({ projectId }).queryKey;
            const entityQueryKey = entityKeys.getById({
                id: object.id,
            }).queryKey;

            queryClient.setQueryData(
                listQueryKey,
                (oldData: IResponsePaginated_IEntityRead_) => {
                    return {
                        ...oldData,
                        items: unshiftOrReplace(oldData.items, object, "id"),
                    };
                },
            );

            queryClient.setQueryData(entityQueryKey, () => {
                return { ...object };
            });
        }
        // else if (eventData.type === WSMessageTypeEnum.TASK) {
        //     const object = eventData.object as ITaskRead;

        //     if (!object.entity_id) {
        //         return;
        //     }

        //     const listQueryKey = entityKeys.list({ projectId }).queryKey;
        //     const entityQueryKey = entityKeys.getById({
        //         id: object.entity_id,
        //     }).queryKey;

        //     queryClient.setQueryData(
        //         listQueryKey,
        //         (oldData: IResponsePaginated_IEntityRead_) => {
        //             const entity = oldData.items.find(
        //                 (e) => e.id === object.entity_id,
        //             );

        //             if (!entity) {
        //                 return oldData;
        //             }

        //             const updatedEntity = {
        //                 ...entity,
        //                 tasks: unshiftOrReplace(entity.tasks, object, "id"),
        //             };

        //             return {
        //                 ...oldData,
        //                 items: unshiftOrReplace(
        //                     oldData.items,
        //                     updatedEntity,
        //                     "id",
        //                 ),
        //             };
        //         },
        //     );

        //     queryClient.setQueryData(entityQueryKey, (oldData: IEntityRead) => {
        //         return {
        //             ...oldData,
        //             tasks: unshiftOrReplace(oldData.tasks, object, "id"),
        //         };
        //     });
        // }
    };
};
