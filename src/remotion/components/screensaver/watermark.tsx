import { useEffect, useState } from "react";
import { FPS, logoDurationScene } from "@/remotion/utils";
import { Flex, Text } from "@radix-ui/themes";
import {
    Img,
    Sequence,
    staticFile,
    useVideoConfig,
    delayRender,
    continueRender,
    AbsoluteFill,
} from "remotion";

const logo = staticFile(`/logo.svg`);
const neuroLogo = staticFile(`/neuroStudio/logo.svg`);

export const Watermark = ({ projectType }: { projectType: string }) => {
    const { durationInFrames } = useVideoConfig();
    const logoDurationInFrames = logoDurationScene * FPS;

    const [waitForImage] = useState(() => delayRender());
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        if (imgLoaded) {
            continueRender(waitForImage);
        }
    }, [imgLoaded, waitForImage]);

    return (
        <Sequence durationInFrames={durationInFrames - logoDurationInFrames}>
            <AbsoluteFill>
                <Flex
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 16,
                        gap: 4,
                        alignItems: "center",
                    }}
                >
                    {projectType === "neuroStudio" ? (
                        <Img
                            src={neuroLogo}
                            onLoad={() => {
                                setImgLoaded(true);
                            }}
                            style={{ objectFit: "contain", width: "350px" }}
                        />
                    ) : (
                        <>
                            <Img
                                src={logo}
                                onLoad={() => {
                                    setImgLoaded(true);
                                }}
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                            />
                            <Text
                                weight="bold"
                                style={{ fontSize: 14 }}
                            >
                                SuperDuperAi
                            </Text>
                        </>
                    )}
                </Flex>
            </AbsoluteFill>
        </Sequence>
    );
};
