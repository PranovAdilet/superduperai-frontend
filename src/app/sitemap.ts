import type { MetadataRoute } from "next";
import superDuperEn from "../../messages/sitemap-superduper.json";
import neuroStudioEn from "../../messages/sitemap-neurostudio.json";

const type =
    process.env.NEXT_PUBLIC_PROJECT_TYPE === "neuroStudio"
        ? "neuroStudio"
        : "superDuper";
const sitemaps: Record<string, any[]> = {
    superDuper: superDuperEn,
    neuroStudio: neuroStudioEn,
};

export default function sitemap(): MetadataRoute.Sitemap {
    return sitemaps[type].map((item) => ({
        ...item,
        lastModified: new Date(),
    }));
}
