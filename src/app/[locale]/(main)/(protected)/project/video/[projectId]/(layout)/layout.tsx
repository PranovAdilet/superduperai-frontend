import type { ReactNode } from "react";
import type { PageProps } from "@/shared/types";
import type { Metadata } from "next";
import { QueryClient } from "@tanstack/react-query";
import type { IProjectRead } from "@/shared/api";
import { projectKeys } from "@/entities/project";
import { cookies } from "next/headers";
import banner from "@/../public/banner.webp";

type Params = {
    projectId: string;
};

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    return <>{children}</>;
};

export default Layout;

export const getScenes = async (projectId: string) => {
    const token = cookies().get("token")?.value;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/scene?project_id=${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "force-cache",
            next: {
                revalidate: 120,
            },
        },
    );

    if (!res.ok) {
        throw new Error("Error");
    }
    return res.json();
};

export const getProject = async (projectId: string) => {
    const token = cookies().get("token")?.value;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/project/${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "force-cache",
            next: {
                revalidate: 120,
            },
        },
    );

    if (!res.ok) {
        throw new Error("Error");
    }

    return res.json();
};

export const generateMetadata = async ({
    params,
}: PageProps<Params>): Promise<Metadata> => {
    try {
        const queryClient = new QueryClient();
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

        await queryClient.prefetchQuery({
            queryKey: [projectKeys.getById],
            queryFn: () => getProject(params.projectId),
        });

        const project: IProjectRead | undefined = queryClient.getQueryData([
            projectKeys.getById,
        ]);

        // Handle image URL properly
        const imageUrl = project?.thumbnail_url ?? "/banner.webp";
        const absoluteImageUrl = imageUrl.startsWith("http")
            ? imageUrl
            : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

        const width = 1200;
        const height = 630;

        const title = project?.config?.prompt
            ? String(project.config.prompt)
                  .slice(0, 20)
                  .replace(/[#*\n]/g, "")
                  .trim() + (project.config.prompt.length > 20 ? "..." : "")
            : "SuperDuperAi";

        const description = project?.config?.prompt
            ? String(project.config.prompt)
                  .replace(/[#*\n]/g, "")
                  .trim()
                  .slice(0, 160) +
              (project.config.prompt.length > 160 ? "..." : "")
            : "Create amazing videos with SuperDuperAi";

        return {
            title,
            description,
            metadataBase: new URL(baseUrl),
            openGraph: {
                title,
                description,
                images: [
                    {
                        url: absoluteImageUrl,
                        width,
                        height,
                        alt: title,
                        type: imageUrl.endsWith(".webp")
                            ? "image/webp"
                            : "image/png",
                    },
                ],
                type: "website",
                siteName: "SuperDuperAi",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [absoluteImageUrl],
                creator: "@SuperDuperAi",
                site: "@SuperDuperAi",
            },
            other: {
                "og:image": absoluteImageUrl,
                "og:image:width": width.toString(),
                "og:image:height": height.toString(),
                "og:image:type": imageUrl.endsWith(".webp")
                    ? "image/webp"
                    : "image/png",
            },
        };
    } catch (error) {
        console.error("Failed to generate metadata:", error);
        const baseUrl =
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const defaultImageUrl = banner.src;

        return {
            title: "SuperDuperAi",
            description: "Create amazing videos with SuperDuperAi",
            metadataBase: new URL(baseUrl),
            openGraph: {
                images: [
                    {
                        url: defaultImageUrl,
                        width: 1200,
                        height: 630,
                        alt: "SuperDuperAi",
                        type: "image/webp",
                    },
                ],
                siteName: "SuperDuperAi",
            },
            twitter: {
                card: "summary_large_image",
                images: [defaultImageUrl],
                site: "@SuperDuperAi",
            },
            other: {
                "og:image": defaultImageUrl,
                "og:image:width": "1200",
                "og:image:height": "630",
                "og:image:type": "image/webp",
            },
        };
    }
};
