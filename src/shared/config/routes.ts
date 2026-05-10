// frontend/src/shared/config/routes.ts

// Определяем константы для базовых путей
// Используем camelCase или UPPER_CASE для ключей по соглашению
export const APP_ROUTES = {
    HOME: "/",
    LOGIN: "/login", // Пример, если есть
    PAYMENT: "/payment",
    LORA: "/lora",
    LORA_CREATE: "/lora/create", // Добавил, предполагая, что есть

    PROJECT_VIDEO_CREATE: "/project/video/create",
    PROJECT_IMAGE_CREATE: "/project/image/create",
    MY_PROJECTS: "/project/my-projects",
    MY_ENTITIES: "/my-entities",

    // Маршруты с параметрами
    PROJECT_VIDEO_DETAIL: "/project/video/[projectId]",
    PROJECT_IMAGE_DETAIL: "/project/image/[projectId]", // Предположительно
    LORA_ENTITY_DETAIL: "/my-entities/[entityId]", // Предположительно
    LORA_ENTITY_MEDIA: "/my-entities/[entityId]/media", // Предположительно
    PROJECT_VIDEO_EDIT: "/project/video/[projectId]/edit", // Пример пути для редактирования видео
    PROJECT_VIDEO_EDIT_STORYBOARD: "/project/video/[projectId]/edit/storyboard", // Пример пути для сториборда

    // Добавь сюда все остальные необходимые маршруты

    MY_ENTITY_DETAIL: "/my-entities/[entityId]",
    MY_ENTITY_LORA: "/my-entities/lora/[type]", // Добавлен параметр type
    MY_ENTITY_MEDIA: "/my-entities/[entityId]/media",
    MY_ENTITY_MEDIA_NEW: "/my-entities/[entityId]/media/new",

    PROJECT_IMAGE_MEDIA_NEW: "/project/image/[projectId]/media/new",

    PROJECT_VIDEO_CREATE_TEMPLATE: "/project/video/create/[templateName]",
    PROJECT_VIDEO_TIMELINE: "/project/video/[projectId]/timeline",
    PROJECT_VIDEO_READONLY: "/project/video/[projectId]/readonly",

    PROJECT_VIDEO_EDIT_VIDEO: "/project/video/[projectId]/edit/video",
    PROJECT_VIDEO_EDIT_STYLE: "/project/video/[projectId]/edit/style",
    PROJECT_VIDEO_EDIT_STORYBOARD_ROOT:
        "/project/video/[projectId]/edit/storyboard", // storyboard в (default)
    PROJECT_VIDEO_EDIT_SCRIPT: "/project/video/[projectId]/edit/script",
    PROJECT_VIDEO_EDIT_PROMPT: "/project/video/[projectId]/edit/prompt",
    PROJECT_VIDEO_EDIT_MUSIC: "/project/video/[projectId]/edit/music",
    PROJECT_VIDEO_EDIT_ENTITIES: "/project/video/[projectId]/edit/entities",
    PROJECT_VIDEO_EDIT_ENTITIES_ADD:
        "/project/video/[projectId]/edit/entities/add",
    PROJECT_VIDEO_EDIT_ENTITY_DETAIL:
        "/project/video/[projectId]/edit/entities/[entityId]",
    PROJECT_VIDEO_EDIT_ENTITY_MEDIA:
        "/project/video/[projectId]/edit/entities/[entityId]/media",
    PROJECT_VIDEO_EDIT_ENTITY_MEDIA_NEW:
        "/project/video/[projectId]/edit/entities/[entityId]/media/new",

    PROJECT_VIDEO_STORYBOARD_SCENE:
        "/project/video/[projectId]/edit/storyboard/[sceneId]", // storyboard в (storyboard)
    PROJECT_VIDEO_STORYBOARD_SCENE_VOICEOVER_NEW:
        "/project/video/[projectId]/edit/storyboard/[sceneId]/voiceover/new",
    PROJECT_VIDEO_STORYBOARD_SCENE_SOUND_NEW:
        "/project/video/[projectId]/edit/storyboard/[sceneId]/sound-effect/new",
    PROJECT_VIDEO_STORYBOARD_SCENE_MEDIA_NEW:
        "/project/video/[projectId]/edit/storyboard/[sceneId]/media/new",

    PREVIEW_PROJECT: "/preview/[projectId]",
} as const; // 'as const' для строгой типизации ключей и значений

// Тип для ключей маршрутов
export type AppRouteKey = keyof typeof APP_ROUTES;

// --- Типы для параметров ---
// Объединим параметры, где возможно
type ProjectIdParam = { projectId: string };
type EntityIdParam = { entityId: string };
type SceneIdParam = { sceneId: string };
type TemplateNameParam = { templateName: string };
type EntityTypeParam = { type: string }; // Для /my-entities/lora/[type]

// Комбинации параметров
type ProjectAndEntityParams = ProjectIdParam & EntityIdParam;
type ProjectAndSceneParams = ProjectIdParam & SceneIdParam;

// Типизируем параметры для конкретных маршрутов
type RouteParams = {
    PREVIEW_PROJECT: ProjectIdParam;

    MY_ENTITY_DETAIL: EntityIdParam;
    MY_ENTITY_LORA: EntityTypeParam;
    MY_ENTITY_MEDIA: EntityIdParam;
    MY_ENTITY_MEDIA_NEW: EntityIdParam;

    PROJECT_IMAGE_DETAIL: ProjectIdParam;
    PROJECT_IMAGE_MEDIA_NEW: ProjectIdParam;

    PROJECT_VIDEO_CREATE_TEMPLATE: TemplateNameParam;
    PROJECT_VIDEO_DETAIL: ProjectIdParam;
    PROJECT_VIDEO_TIMELINE: ProjectIdParam;
    PROJECT_VIDEO_READONLY: ProjectIdParam;

    PROJECT_VIDEO_EDIT: ProjectIdParam;
    PROJECT_VIDEO_EDIT_VIDEO: ProjectIdParam;
    PROJECT_VIDEO_EDIT_STYLE: ProjectIdParam;
    PROJECT_VIDEO_EDIT_STORYBOARD_ROOT: ProjectIdParam;
    PROJECT_VIDEO_EDIT_SCRIPT: ProjectIdParam;
    PROJECT_VIDEO_EDIT_PROMPT: ProjectIdParam;
    PROJECT_VIDEO_EDIT_MUSIC: ProjectIdParam;
    PROJECT_VIDEO_EDIT_ENTITIES: ProjectIdParam;
    PROJECT_VIDEO_EDIT_ENTITIES_ADD: ProjectIdParam;
    PROJECT_VIDEO_EDIT_ENTITY_DETAIL: ProjectAndEntityParams;
    PROJECT_VIDEO_EDIT_ENTITY_MEDIA: ProjectAndEntityParams;
    PROJECT_VIDEO_EDIT_ENTITY_MEDIA_NEW: ProjectAndEntityParams;

    PROJECT_VIDEO_STORYBOARD_SCENE: ProjectAndSceneParams;
    PROJECT_VIDEO_STORYBOARD_SCENE_VOICEOVER_NEW: ProjectAndSceneParams;
    PROJECT_VIDEO_STORYBOARD_SCENE_SOUND_NEW: ProjectAndSceneParams;
    PROJECT_VIDEO_STORYBOARD_SCENE_MEDIA_NEW: ProjectAndSceneParams;
};

// Универсальный тип для параметров функции getPath
// Если у ключа K есть запись в RouteParams, берем ее, иначе - нет параметров (never)
type GetPathParams<K extends AppRouteKey> = K extends keyof RouteParams
    ? RouteParams[K]
    : Record<string, never>;

// --- Функция для получения пути ---
// Локаль добавляется автоматически компонентами из @/i18n/navigation
export function getPath<K extends AppRouteKey>(
    routeKey: K,
    params?: GetPathParams<K>,
): string {
    let path = APP_ROUTES[routeKey] as string;

    if (params && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([key, value]) => {
            const segment = `[${key}]`;
            if (path.includes(segment)) {
                // Проверяем, что значение не пустое, прежде чем заменять
                const replacement = String(value);
                if (replacement) {
                    path = path.replace(segment, replacement);
                } else {
                    console.error(
                        `getPath: Parameter "[${key}]" for route "${routeKey}" received an empty value.`,
                    );
                    // Можно вернуть пустую строку или кинуть ошибку, если параметр обязателен
                    path = ""; // Пример: возвращаем пустую строку при ошибке
                }
            } else {
                console.warn(
                    `getPath: Parameter "${key}" provided but not found in path for route "${routeKey}": ${path}`,
                );
            }
        });
    }

    // Проверка, что все динамические сегменты были заменены
    if (path.includes("[")) {
        console.error(
            `getPath: Path for route "${routeKey}" still contains dynamic segments after parameter substitution: ${path}. Parameters received:`,
            params,
        );
        // Можно кинуть ошибку или вернуть что-то по умолчанию
        return ""; // Пример: возвращаем пустую строку при ошибке
    }

    return path;
}

// Примеры использования для проверки:
// const homePath = getPath('HOME'); // '/'
// const paymentPath = getPath('PAYMENT'); // '/payment'
// const videoDetailPath = getPath('PROJECT_VIDEO_DETAIL', { projectId: '123' }); // '/project/video/123'
// const storyboardPath = getPath('PROJECT_VIDEO_EDIT_STORYBOARD', { projectId: '456' }); // '/project/video/456/edit/storyboard'

// const invalidPath = getPath('PROJECT_VIDEO_DETAIL'); // Ошибка в консоли, вернет ''
// const invalidParams = getPath('PROJECT_VIDEO_DETAIL', { projectId: '', anotherParam: 'test' }); // Ошибка в консоли, вернет '', ворнинг про anotherParam
