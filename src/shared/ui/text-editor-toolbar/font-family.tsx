"use client";

import { Button } from "@radix-ui/themes";
import { ChevronDown } from "lucide-react";
import { Popover } from "../popover";
import { getCompactFontData, loadFonts } from "@/shared/utils/fonts";
import { useEffect, useState } from "react";
import { DEFAULT_FONT } from "./fonts";
import { FONTS } from "super-timeline";

export type IFont = {
    id: string;
    family: string;
    fullName: string;
    postScriptName: string;
    preview: string;
    style: string;
    url: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
};

export type ICompactFont = {
    family: string;
    styles: IFont[];
    default: IFont;
    name?: string;
};

export const FontFamily = ({
    onChange,
    defaultValue,
}: {
    onChange: (font: ICompactFont) => void;
    defaultValue: string;
}) => {
    const [selectedFont, setSelectedFont] = useState<ICompactFont>({
        family: "Open Sans",
        styles: [],
        default: DEFAULT_FONT,
        name: "Regular",
    });

    const [compactFonts, setCompactFonts] = useState<ICompactFont[]>([]);

    useEffect(() => {
        const fontsData = getCompactFontData(FONTS);
        setCompactFonts(fontsData);

        const defaultFont = fontsData.find(
            (font) =>
                font.family === defaultValue ||
                font.default.postScriptName === defaultValue,
        );

        if (defaultFont) {
            void handleChangeFont(defaultFont);
        } else {
            setSelectedFont({
                family: "Open Sans",
                styles: [],
                default: DEFAULT_FONT,
                name: "Regular",
            });
        }
    }, [defaultValue]);

    const handleChangeFont = async (font: ICompactFont) => {
        const fontName = font.default.postScriptName;
        const fontUrl = font.default.url;

        await loadFonts([
            {
                name: fontName,
                url: fontUrl,
            },
        ]);
        const value = { ...font, name: getStyleNameFromFontName(fontName) };
        setSelectedFont(value);
        onChange(value);
    };

    return (
        <Popover
            trigger={
                <Button
                    className="flex w-full items-center justify-between py-5 text-sm"
                    variant="outline"
                    color="gray"
                >
                    <div className="w-full text-left ">
                        <p className="truncate">
                            {selectedFont.family || "Open Sans"}
                        </p>
                    </div>
                    <ChevronDown size={14} />
                </Button>
            }
        >
            {compactFonts.map((font, index) => (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                        void handleChangeFont(font);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            void handleChangeFont(font);
                        }
                    }}
                    className="cursor-pointer px-2 py-1 hover:bg-zinc-800/50"
                    key={index}
                >
                    {/*
  eslint-disable-next-line @next/next/no-img-element
*/}
                    <img
                        style={{
                            filter: "invert(100%)",
                        }}
                        src={font.default.preview}
                        alt={font.family}
                    />
                </div>
            ))}
        </Popover>
    );
};

const getStyleNameFromFontName = (fontName: string) => {
    const fontFamilyEnd = fontName.lastIndexOf("-");
    const styleName = fontName
        .substring(fontFamilyEnd + 1)
        .replace("Italic", " Italic");
    return styleName;
};
