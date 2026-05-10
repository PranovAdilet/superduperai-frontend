"use client";

import { Flex, Text } from "@radix-ui/themes";
import { Heading } from "lucide-react";
import {
    AbsoluteFill,
    continueRender,
    delayRender,
    Img,
    staticFile,
    useVideoConfig,
} from "remotion";

const logo = staticFile(`/logo.svg`);
const neuroLogo = staticFile(`/neuroStudio/Union.svg`);

const fontFamily = "TecnicaStencil2Rg";
const waitForFont = delayRender();

let font: FontFace | undefined;
if (typeof window !== "undefined" && "FontFace" in window) {
    font = new FontFace(
        fontFamily,
        `url('${staticFile("fonts/TecnicaStencil2Rg.woff2")}') format('woff2')`,
    );

    font.load()
        .then(() => {
            document.fonts.add(font!);
            continueRender(waitForFont);
        })
        .catch((err: unknown) => {
            console.log("Error loading font", err);
            continueRender(waitForFont);
        });
}

export const ScreenSaver = ({ projectType }: { projectType: string }) => {
    const { width } = useVideoConfig();
    const imageWidth = width <= 450 ? 300 : 500;
    const fontSize = width <= 450 ? "1.6rem" : "2.3rem";

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
            }}
        >
            {projectType === "neuroStudio" ? (
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    gap="4"
                    className="text-center"
                >
                    <p
                        style={{
                            fontFamily,
                            color: "#24FF00",
                            fontSize: fontSize,
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        {`"You are not lost. You are awakening."`}
                    </p>
                    <Img
                        src={neuroLogo}
                        alt="Logo"
                        style={{
                            width: imageWidth,
                        }}
                    />
                </Flex>
            ) : (
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    gap="3"
                    className="text-center"
                >
                    <Heading size="4">Thanks for watching!</Heading>
                    <Text
                        as="p"
                        align="center"
                        size="2"
                    >
                        Your creativity, powered by SuperDuperAi
                    </Text>
                    <Flex
                        gap="3"
                        align="center"
                    >
                        <Img
                            src={logo}
                            width={40}
                            height={40}
                            alt="Logo"
                        />
                        <Text
                            as="p"
                            weight="bold"
                            size="2"
                        >
                            www.superduperai.co
                        </Text>
                    </Flex>
                </Flex>
            )}
        </AbsoluteFill>
    );
};
