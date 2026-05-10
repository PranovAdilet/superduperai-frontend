import { groupBy } from "lodash";
import type {
    ICompactFont,
    IFont,
} from "../ui/text-editor-toolbar/font-family";

export const loadFonts = async (fonts: { name: string; url: string }[]) => {
    if (typeof window === "undefined" || !("FontFace" in window)) {
        // FontFace is not available on server, skip loading
        return false;
    }
    try {
        const promisesList = fonts.map(async (font) => {
            try {
                return await new FontFace(font.name, `url(${font.url})`).load();
            } catch (error: unknown) {
                console.error(`Failed to load font ${font.name}:`, error);
                return error;
            }
        });

        const results = await Promise.all(promisesList);
        let fontLoaded = false;

        results.forEach((uniqueFont) => {
            if (uniqueFont instanceof FontFace && uniqueFont.family) {
                document.fonts.add(uniqueFont);
                fontLoaded = true;
            }
        });

        return fontLoaded;
    } catch (error: unknown) {
        console.error("Failed to load fonts:", error);
        throw error instanceof Error ? error : new Error("Font loading failed");
    }
};

const findDefaultFont = (fonts: IFont[]): IFont => {
    const regularFont = fonts.find((font) =>
        font.fullName.toLowerCase().includes("regular"),
    );

    return regularFont ?? fonts[0];
};

export const getCompactFontData = (fonts: IFont[]): ICompactFont[] => {
    const compactFontsMap: Record<string, ICompactFont> = {};
    // lodash groupby
    const fontsGroupedByFamily = groupBy(fonts, (font) => font.family);

    Object.keys(fontsGroupedByFamily).forEach((family) => {
        const fontsInFamily = fontsGroupedByFamily[family];
        const defaultFont = findDefaultFont(fontsInFamily);
        const compactFont: ICompactFont = {
            family: family,
            styles: fontsInFamily,
            default: defaultFont,
        };
        compactFontsMap[family] = compactFont;
    });

    return Object.values(compactFontsMap);
};

export async function ensureFontLoaded(fontFamily: string, fontUrl: string) {
    // Проверяем, не загружен ли уже шрифт
    if (document.fonts.check(`1em ${fontFamily}`)) return;

    const font = new FontFace(fontFamily, `url('${fontUrl}') format('woff2')`);
    await font.load();
    (document as any).fonts.add(font);
    // Ждём, пока шрифт станет доступен
    await (document as any).fonts.ready;
}
