"use client";

import { FileCard } from "@/entities/file";
import { useFileUpload } from "@/features/file";
import { useLoraCreate } from "@/features/lora";
import { useRouter } from "@/i18n/navigation";
import type {
    EntityTypeEnum,
    IFileRead,
    ILoraReferenceCreate,
} from "@/shared/api";
import { getPath } from "@/shared/config/routes";
import { useFileViewer } from "@/shared/hooks";
import {
    BackButton,
    ImageViewerDialog,
    Link,
    TextArea,
    TextField,
    UploadField,
} from "@/shared/ui";
import {
    Button,
    Callout,
    Flex,
    Heading,
    Separator,
    Text,
} from "@radix-ui/themes";
import { Info } from "lucide-react";
import type { FC } from "react";
import { useMemo, useState } from "react";

type ILoraReferenceData = Omit<ILoraReferenceCreate, "reference_id"> & {
    file: IFileRead;
};

type Props = {
    entityType?: EntityTypeEnum;
};

export const LoraCreatePage: FC<Props> = ({ entityType }) => {
    const { push, back } = useRouter();

    const { zoomImage } = useFileViewer();

    const { mutateAsync: uploadFile, isPending } = useFileUpload();

    const [loraName, setLoraName] = useState<string>("");

    const [loraTrigger, setLoraTrigger] = useState<string>("");

    const [loraReferences, setLoraReferences] = useState<ILoraReferenceData[]>(
        [],
    );

    const handleUpload = async (files: File[]) => {
        for (const file of files) {
            const uploadedFile = await uploadFile({
                formData: { payload: file },
            });
            setLoraReferences((prev) => [
                ...prev,
                {
                    file: uploadedFile,
                    trigger: "",
                },
            ]);
        }
    };

    const handleCaptionChange = (index: number, value: string) => {
        setLoraReferences((prev) => {
            const newLoraReferences = [...prev];
            newLoraReferences[index].trigger = value;
            return newLoraReferences;
        });
    };

    const { mutate: createLora, isPending: isPendingCreate } = useLoraCreate();

    const handleSubmit = () => {
        if (!loraName || !loraTrigger) return;

        const loraReferencesData = loraReferences.map((loraReference) => ({
            reference_id: loraReference.file.id,
            trigger: loraReference.trigger,
        }));

        createLora(
            {
                name: loraName,
                trigger: loraTrigger,
                references: loraReferencesData,
                entity_type: entityType,
            },
            {
                onSuccess: () => {
                    handleBack();
                },
            },
        );
    };

    const valid =
        loraReferences.length >= 5 &&
        loraReferences.length <= 30 &&
        loraName &&
        loraTrigger;

    const disabled = !valid || isPending;

    const handleBack = () => {
        if (window.history.length > 2) {
            back();
        } else {
            push(getPath("LORA"));
        }
    };

    const errorText = useMemo(() => {
        if (loraReferences.length < 5) {
            return "Please upload at least 5 images.";
        }
        if (loraReferences.length > 30) {
            return "Please upload a maximum of 30 images.";
        }
        if (!loraName) {
            return "Please enter a LoRa name.";
        }
        if (!loraTrigger) {
            return "Please enter a LoRa trigger.";
        }
    }, [loraName, loraTrigger, loraReferences]);

    return (
        <>
            <ImageViewerDialog />
            <Flex
                flexGrow="1"
                justify="center"
                p="6"
            >
                <Flex
                    maxWidth="700px"
                    direction="column"
                    gap="6"
                    flexGrow="1"
                >
                    <Flex
                        gap="2"
                        direction="column"
                    >
                        <BackButton onClick={handleBack} />
                        <Separator size="4" />
                    </Flex>
                    <Callout.Root>
                        <Callout.Icon>
                            <Info />
                        </Callout.Icon>
                        <Callout.Text>
                            <Heading size="4">
                                Train: Personalized Character and Style Creation
                            </Heading>
                            <p>
                                Make your character truly yours! Create
                                consistent and recognizable styles or unique
                                avatars that match your vision.
                            </p>
                            <ul>
                                <li>
                                    Price: <strong>50</strong> credits.
                                </li>
                                <li>
                                    Delivery: Within <strong>1-2</strong>{" "}
                                    business day.
                                </li>
                            </ul>
                            <Link
                                target="_blank"
                                href="https://docs.google.com/presentation/d/1BjqJSKVXkf3cMwxwMc-3eqvkmkAz5ZoeoeSSBOI64J0/edit?usp=sharing"
                            >
                                Example
                            </Link>
                        </Callout.Text>
                    </Callout.Root>
                    <Callout.Root>
                        <Callout.Icon>
                            <Info />
                        </Callout.Icon>
                        <Callout.Text>
                            <Heading size="4">Requirements:</Heading>
                            Upload 5-30 high-quality photos showing your
                            character, place or object clearly from different
                            angles. <br />
                            <Text
                                size="1"
                                className="italic"
                            >
                                Note: You can only upload photos that you own
                                the rights to.
                            </Text>
                        </Callout.Text>
                    </Callout.Root>
                    <Flex
                        direction="column"
                        gap="3"
                    >
                        <TextField
                            full
                            label="Name*"
                            placeholder="e.g.: Funny cats, Car toy, etc."
                            onChange={(e) => {
                                setLoraName(e.target.value);
                            }}
                        ></TextField>
                        <TextField
                            full
                            label="Trigger*"
                            placeholder="uncommon word like p3r5on or 5tuff, or sentence like 'in the style of CNSTLL'"
                            onChange={(e) => {
                                setLoraTrigger(e.target.value);
                            }}
                        ></TextField>
                    </Flex>
                    <UploadField
                        multiple
                        onUpload={handleUpload}
                    >
                        {(handleClick) => (
                            <Button
                                variant="outline"
                                loading={isPending}
                                onClick={handleClick}
                            >
                                {isPending
                                    ? "Uploading..."
                                    : "Upload your images"}
                            </Button>
                        )}
                    </UploadField>
                    {loraReferences.length !== 0 && (
                        <Callout.Root>
                            <Callout.Icon>
                                <Info />
                            </Callout.Icon>
                            <Callout.Text>
                                You can optionally add a custom caption for each
                                image. [trigger] will represent your concept
                                sentence/trigger word.
                            </Callout.Text>
                        </Callout.Root>
                    )}
                    {loraReferences.length !== 0 && (
                        <>
                            <Flex
                                gap="3"
                                direction="column"
                            >
                                {loraReferences.map((loraReference, index) => (
                                    <Flex
                                        key={index}
                                        gap="3"
                                    >
                                        <FileCard
                                            file={loraReference.file}
                                            className="min-w-[30%]"
                                            contain
                                            onClick={() => {
                                                zoomImage(loraReference.file);
                                            }}
                                        />
                                        <TextArea
                                            full
                                            label="Caption"
                                            placeholder="e.g.: A funny cat with a hat"
                                            onChange={(e) => {
                                                handleCaptionChange(
                                                    index,
                                                    e.target.value,
                                                );
                                            }}
                                        ></TextArea>
                                    </Flex>
                                ))}
                            </Flex>
                            {!valid && (
                                <Text
                                    size="1"
                                    className="italic"
                                    color="red"
                                >
                                    {errorText}
                                </Text>
                            )}
                            <Button
                                disabled={disabled}
                                onClick={handleSubmit}
                                loading={isPendingCreate}
                            >
                                Submit
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        </>
    );
};

export default LoraCreatePage;
