// import { QueryKey, useQueryClient } from '@tanstack/react-query';
// import { WSMessage, WSMessageTypeEnum } from '@/shared/api';
// import { pushOrReplace } from '@/shared/utils';

// type ObjectEventHandlerParams<T> = {
//   queryKeyFn: (object: T) => QueryKey;
//   messageType: WSMessageTypeEnum;
// };

// export const useObjectEventHandler = <T>({
//   queryKeyFn,
//   messageType,
// }: ObjectEventHandlerParams<T>): EventHandler => {
//   const queryClient = useQueryClient();

//   return (eventData: WSMessage) => {
//     if (eventData.type !== messageType) {
//       return;
//     }

//     const newObject: T = eventData.object as T;

//     const queryKey = queryKeyFn(newObject);

//     queryClient.setQueryData(queryKey, () => {
//       return newObject;
//     });
//   };
// }

// type ListEventHandlerParams<DataK, ItemK> = {
//   queryKey: QueryKey;
//   listKey: DataK;
//   itemKey: ItemK;
//   messageType: WSMessageTypeEnum;
// };

// export const useListEventHandler = <DataT, ItemT>({
//   queryKey,
//   listKey,
//   itemKey,
//   messageType,
// }: ListEventHandlerParams<keyof DataT, keyof ItemT>): EventHandler => {
//   const queryClient = useQueryClient();

//   return (eventData: WSMessage) => {
//     if (eventData.type !== messageType) {
//       return;
//     }

//     const newObject: ItemT = eventData.object as ItemT;

//     queryClient.setQueryData(queryKey, (oldData: DataT) => {
//       const objects = oldData[listKey] as ItemT[];

//       const updatedObjects = pushOrReplace(objects, newObject, itemKey);

//       return {
//         ...oldData,
//         [listKey]: updatedObjects,
//       };
//     });
//   };
// };
