import type { ITaskRead, TaskTypeEnum } from "@/shared/api";
import { TaskStatusEnum } from "@/shared/api";

export const useTaskStatus = (type: TaskTypeEnum, tasks?: ITaskRead[]) => {
    const firstTask = tasks?.find((task) => task.type === type);

    return {
        isExists: !!firstTask,
        isCompleted: firstTask?.status === TaskStatusEnum.COMPLETED,
        isPending: firstTask?.status === TaskStatusEnum.IN_PROGRESS,
        isError: firstTask?.status === TaskStatusEnum.ERROR,
    };
};
