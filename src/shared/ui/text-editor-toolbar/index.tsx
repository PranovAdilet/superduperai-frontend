"use client";

import { Button, Flex } from "@radix-ui/themes";

import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { useTextEditorToolbarStore } from "@/shared/store";
import type { Textbox } from "fabric";
import type { ICompactFont } from "./font-family";
import { FontFamily } from "./font-family";
import { TextAligns } from "./text-aligns";
import { FontStyles } from "./font-style";
import { TextColor } from "./text-color";
import { TextBackground } from "./text-background";
import { TextFontSize } from "./font-size";

export const TextEditorToolbar: FC = () => {
    const { editor } = useTextEditorToolbarStore();

    const [activeTextbox, setActiveTextbox] = useState<Textbox | null>(null);

    const activeText = editor?.getActiveText();

    useEffect(() => {
        if (!activeText) return;
        setActiveTextbox(activeText);
    }, [activeText]);

    const handleFontSizeChange = (value: number) => {
        if (!activeTextbox) return;
        editor?.updateText(activeTextbox, { fontSize: value });
    };

    const handleColorChange = (value: string) => {
        if (!activeTextbox) return;
        editor?.updateText(activeTextbox, { fill: value });
    };

    const handleBgColorChange = (value: string) => {
        if (!activeTextbox) return;
        editor?.updateText(activeTextbox, { backgroundColor: value });
    };

    const handleChangeTextStyle = (value: string) => {
        editor?.setStyleText(value);
    };

    const handleChangeAlignText = (value: string) => {
        if (!activeTextbox) return;
        editor?.updateText(activeTextbox, { textAlign: value });
    };

    const handleChangeFont = (font: ICompactFont) => {
        if (!activeTextbox) return;
        editor?.updateText(activeTextbox, {
            fontFamily: font.default.postScriptName,
        });
    };

    const handleDeleteText = () => {
        editor?.removeText();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Backspace" && !activeText?.isEditing) {
            handleDeleteText();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const fontStyles = useMemo(
        () =>
            [
                activeTextbox?.fontWeight === "bold" ? "bold" : "",
                activeTextbox?.fontStyle === "italic" ? "italic" : "",
                activeTextbox?.underline ? "underline" : "",
                activeTextbox?.linethrough ? "linethrough" : "",
                activeTextbox?.text === activeTextbox?.text.toUpperCase()
                    ? "uppercase"
                    : "",
            ].filter(Boolean),
        [activeTextbox],
    );

    if (!activeTextbox) return;

    return (
        <Flex
            direction="column"
            py="3"
            px="1"
        >
            <Flex
                direction="column"
                gap="6"
            >
                <Flex
                    direction="column"
                    gap="4"
                >
                    <TextFontSize
                        defaultValue={Math.round(activeTextbox.fontSize)}
                        onChange={handleFontSizeChange}
                    />

                    <FontFamily
                        onChange={handleChangeFont}
                        defaultValue={activeTextbox.fontFamily}
                    />

                    <Flex
                        gap="4"
                        align="center"
                        justify="between"
                    >
                        <FontStyles
                            defaultValue={fontStyles}
                            onChange={handleChangeTextStyle}
                        />
                        <TextAligns
                            defaultValue={activeTextbox.textAlign}
                            onChange={handleChangeAlignText}
                        />
                    </Flex>
                </Flex>
                <TextColor
                    defaultValue={
                        typeof activeTextbox.fill === "string"
                            ? activeTextbox.fill
                            : "#ffffffff"
                    }
                    onChange={handleColorChange}
                />
                <TextBackground
                    defaultValue={activeTextbox.backgroundColor}
                    onChange={handleBgColorChange}
                />
                <Button
                    color="red"
                    onClick={handleDeleteText}
                >
                    Delete text
                </Button>
            </Flex>
        </Flex>
    );
};
