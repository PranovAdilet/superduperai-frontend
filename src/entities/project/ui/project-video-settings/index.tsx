"use client";

import type { TransitionType, ZoomType } from "@/remotion/store";
import { usePlayerSettingsStore } from "@/remotion/store";
import type { IProjectVideoConfig_Output, IProjectRead } from "@/shared/api";

import { Select, RangeSlider } from "@/shared/ui";
import { Button, Flex, Text } from "@radix-ui/themes";
import type { SlideDirection } from "@remotion/transitions/slide";
import { ArrowRight } from "lucide-react";
import type { ChangeEvent, FC } from "react";
import { memo, useEffect } from "react";
import { useDebounce } from "react-use";
import { getPath } from "@/shared/config";
import { useRouter } from "@/i18n/navigation";

type Props = {
    project?: IProjectRead;
    onProjectUpdate: (value: IProjectRead) => void;
    onMusicBeatsChange?: (beat: string) => void;
    isPending?: boolean;
    isSyncing?: boolean;
};

const ProjectVideoSettingsComponent: FC<Props> = ({
    project,
    onProjectUpdate,
    onMusicBeatsChange,
    isPending,
    isSyncing,
}) => {
    const { push } = useRouter();

    const {
        musicVolume,
        soundEffectVolume,
        voiceoverVolume,
        setState,
        transition,
        zoom,
        musicBeat,
        showSubtitles,
    } = usePlayerSettingsStore();

    useEffect(() => {
        if (!project) return;
        if (!project.config) return;

        const config = project.config as IProjectVideoConfig_Output;

        setState({
            musicVolume: config.music_volume ?? 1,
            soundEffectVolume: config.sound_effect_volume ?? 1,
            voiceoverVolume: config.voiceover_volume ?? 1,
            transition: {
                type: (config.transition?.type ?? "none") as TransitionType,
                direction: config.transition?.direction ?? "from-right",
            },
            zoom: {
                type: (config.zoom?.type ?? null) as "in" | "out" | null,
                ease: (config.zoom?.ease ?? "ease-in-out") as
                    | "ease-in"
                    | "ease-out"
                    | "ease-in-out"
                    | "linear"
                    | null,
            },
            musicBeat: String(config.dynamic ?? 1),
            showSubtitles: config.subtitles,
        });
    }, [project?.config]);

    const handleMusicVolumeChange = (value: number) => {
        if (!project || isPending) return;
        const newVolume = value / 100;
        setState({ musicVolume: newVolume });
    };

    const handleVoiceoverVolumeChange = (value: number) => {
        if (!project || isPending) return;
        const newVolume = value / 100;
        setState({ voiceoverVolume: newVolume });
    };

    const handleSoundFXVolumeChange = (value: number) => {
        if (!project || isPending) return;
        const newVolume = value / 100;
        setState({ soundEffectVolume: newVolume });
    };

    const handleZoomChange = (type: ZoomType["type"]) => {
        if (!project) return;
        setState({
            zoom: {
                ...zoom,
                type,
            },
        });
        onProjectUpdate({
            ...project,
            config: {
                ...project.config,
                zoom: {
                    ...project.config?.zoom,
                    type,
                },
            },
        });
    };

    const handleEaseChange = (ease: ZoomType["ease"]) => {
        if (!project) return;
        setState({
            zoom: {
                ...zoom,
                ease,
            },
        });

        onProjectUpdate({
            ...project,
            config: {
                ...project.config,
                zoom: {
                    ...project.config?.zoom,
                    ease,
                },
            },
        });
    };

    const handleTransitionTypeChange = (value: TransitionType | null) => {
        if (!project || !value || isPending) return;

        const newTransition = {
            type: value,
            direction:
                value === "slide" || value === "wipe"
                    ? "from-right"
                    : project.config?.transition?.direction,
        };

        setState({ transition: newTransition });

        onProjectUpdate({
            ...project,
            config: {
                ...project.config,
                transition: newTransition,
            },
        });
    };

    const handleTransitionDirectionChange = (value: SlideDirection | null) => {
        if (!value || !project || isPending) return;
        setState({
            transition: {
                ...transition,
                direction: value,
            },
        });

        onProjectUpdate({
            ...project,
            config: {
                ...project.config,
                transition: {
                    ...project.config?.transition,
                    direction: value,
                },
            },
        });
    };

    const handleUpdateVolumes = () => {
        if (!project) return;

        onProjectUpdate({
            ...project,
            config: {
                ...project.config,
                music_volume: musicVolume,
                voiceover_volume: voiceoverVolume,
                sound_effect_volume: soundEffectVolume,
            },
        });
    };

    const handleBeatChange = (musicBeat: string | null) => {
        if (!project || !musicBeat) return;
        setState({
            musicBeat,
        });
        onMusicBeatsChange?.(musicBeat);
    };

    const handleShowSubtitlesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!project) return;

        const isChecked = e.target.checked;

        setState({
            showSubtitles: isChecked,
        });
    };

    useDebounce(
        () => {
            if (!project || project.config?.subtitles === showSubtitles) return;

            onProjectUpdate({
                ...project,
                config: {
                    ...project.config,
                    subtitles: showSubtitles,
                },
            });
        },
        500,
        [showSubtitles],
    );

    const sounds = [
        {
            label: "Voice over",
            value: voiceoverVolume * 100,
            initialValue: project?.config?.voiceover_volume * 100,
            onChange: handleVoiceoverVolumeChange,
        },
        {
            label: "Sound FX",
            value: soundEffectVolume * 100,
            initialValue: project?.config?.sound_effect_volume * 100,
            onChange: handleSoundFXVolumeChange,
        },
        {
            label: "Music",
            value: musicVolume * 100,
            initialValue: project?.config?.music_volume * 100,
            onChange: handleMusicVolumeChange,
        },
    ];

    const handlePushTimeline = () => {
        const timelinePath = getPath("PROJECT_VIDEO_TIMELINE", {
            projectId: project?.id ?? "",
        });

        push(timelinePath);
    };

    return (
        <Flex
            width="100%"
            gap="6"
            className="mx-12 mb-10 mt-3"
        >
            <Flex
                direction="column"
                gap="3"
                width="400px"
                className="rounded-lg border border-gray-700"
                p="4"
            >
                {sounds.map((sound, index) => (
                    <Flex
                        gap="3"
                        align="center"
                        key={index}
                    >
                        <Text className="min-w-[100px]">{sound.label}</Text>
                        <Flex className="flex-1">
                            <RangeSlider
                                value={sound.value}
                                initialValue={sound.initialValue}
                                onChange={sound.onChange}
                                onDebouncedChange={handleUpdateVolumes}
                                disableInput
                            />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
            <Flex
                direction="column"
                gap="3"
                width="150px"
            >
                <Text>Transition</Text>
                <Select
                    value={transition.type}
                    onChange={handleTransitionTypeChange}
                    options={transitions}
                    radius="large"
                />
                {(transition.type === "slide" ||
                    transition.type === "wipe") && (
                    <>
                        <Text>Direction</Text>
                        <Select
                            value={transition.direction ?? "from-right"}
                            onChange={handleTransitionDirectionChange}
                            options={directions}
                            radius="large"
                        />
                    </>
                )}
            </Flex>
            <Flex
                direction="column"
                gap="3"
                width="150px"
            >
                <Text>Dynamic Zoom</Text>
                <Select
                    value={zoom.type}
                    onChange={handleZoomChange}
                    options={zooms}
                    radius="large"
                />
                {zoom.type !== null && (
                    <>
                        <Text>Zoom Ease</Text>
                        <Select
                            value={zoom.ease}
                            onChange={handleEaseChange}
                            options={easings}
                            radius="large"
                        />
                    </>
                )}
            </Flex>
            <Flex
                direction="column"
                gap="3"
                width="150px"
            >
                <Text>Music Beats</Text>
                <Select
                    value={musicBeat}
                    onChange={handleBeatChange}
                    isLoading={isSyncing}
                    options={[
                        { value: "0.25", label: "0.25" },
                        { value: "0.5", label: "0.5" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "4", label: "4" },
                    ]}
                    radius="large"
                />
                <Flex
                    gap="3"
                    align="center"
                >
                    <Text>Subtitles</Text>
                    <input
                        type="checkbox"
                        className="size-4"
                        checked={showSubtitles ?? true}
                        onChange={handleShowSubtitlesChange}
                    />
                </Flex>
                <Button
                    className="flex items-center gap-2"
                    onClick={handlePushTimeline}
                >
                    <Text>Timeline</Text>
                    <ArrowRight />
                </Button>
            </Flex>
        </Flex>
    );
};

export const ProjectVideoSettings = memo(ProjectVideoSettingsComponent);

const easings: { value: ZoomType["ease"]; label: string }[] = [
    { value: "ease-in", label: "In" },
    { value: "ease-out", label: "Out" },
    { value: "ease-in-out", label: "In and out" },
    { value: "linear", label: "Linear" },
];

const transitions: {
    value: TransitionType;
    label: string;
}[] = [
    { value: "fade", label: "FADE" },
    { value: "none", label: "NONE" },
    { value: "flip", label: "FLIP" },
    {
        value: "clockWipe",
        label: "CLOCK-WIPE",
    },
    { value: "wipe", label: "WIPE" },
    { value: "slide", label: "SLIDE" },
];

const directions: {
    value: SlideDirection;
    label: string;
}[] = [
    {
        value: "from-left",
        label: "from-left",
    },
    {
        value: "from-top",
        label: "from-top",
    },
    {
        value: "from-right",
        label: "from-right",
    },
    {
        value: "from-bottom",
        label: "from-bottom",
    },
];

const zooms: {
    value: ZoomType["type"];
    label: string;
}[] = [
    { value: "in", label: "ZoomIn" },
    { value: "out", label: "ZoomOut" },
    { value: null, label: "None" },
];
