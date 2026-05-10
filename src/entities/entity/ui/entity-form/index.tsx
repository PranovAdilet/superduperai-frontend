"use client";

import type { IEntityCreate, IEntityRead, IEntityUpdate } from "@/shared/api";
import { EntityTypeEnum } from "@/shared/api";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { FC } from "react";
import { useMemo } from "react";
import { Form, TextArea, TextField } from "@/shared/ui";
import { Flex } from "@radix-ui/themes";
import { VoiceSelect } from "@/entities/voice";
import { EntityLoraInput } from "@/entities/entity-lora";

export type EntityData = Pick<
    IEntityCreate | IEntityUpdate,
    "name" | "description" | "config" | "voice_name" | "loras"
>;

type Props = {
    entity?: IEntityRead;
    type?: EntityTypeEnum;
    onSubmit: (data: EntityData) => void;
};

type OptionalField = {
    label: string;
    name: Exclude<
        FieldPath<IEntityUpdate>,
        | "name"
        | "description"
        | "voice_name"
        | "loras"
        | `loras.${number}`
        | "id"
        | "file_id"
        | "config"
    >;
    defaultValue: string | null;
    isInline?: boolean;
};

const FORM_ID = "entity-form";

const EntityForm: FC<Props> & { ID: string } = ({
    entity,
    type,
    onSubmit,
}: Props) => {
    const { control, handleSubmit } = useForm<IEntityUpdate>({
        defaultValues: { ...entity } as IEntityUpdate,
    });

    const optionalFields = useMemo<OptionalField[]>(() => {
        if (type === EntityTypeEnum.CHARACTER) {
            return [
                {
                    label: "Age",
                    name: "config.age",
                    defaultValue: null,
                    isInline: true,
                },
                {
                    label: "Gender",
                    name: "config.gender",
                    defaultValue: null,
                    isInline: true,
                },
                {
                    label: "Appearance",
                    name: "config.appearance",
                    defaultValue: null,
                    isInline: false,
                },
                {
                    label: "Clothes",
                    name: "config.clothes",
                    defaultValue: null,
                    isInline: false,
                },
                {
                    label: "Race",
                    name: "config.race",
                    defaultValue: null,
                    isInline: true,
                },
                {
                    label: "Role",
                    name: "config.role",
                    defaultValue: null,
                    isInline: true,
                },
                {
                    label: "Resemblance",
                    name: "config.resemblance",
                    defaultValue: null,
                    isInline: false,
                },
            ];
        }
        if (type === EntityTypeEnum.LOCATION) {
            return [
                {
                    label: "Appearance",
                    name: "config.appearance",
                    defaultValue: null,
                },
                {
                    label: "Setting",
                    name: "config.setting",
                    defaultValue: null,
                },
                {
                    label: "Specific Elements",
                    name: "config.specific_elements",
                    defaultValue: null,
                },
                {
                    label: "Historical Period or Setting",
                    name: "config.historical_period_or_setting",
                    defaultValue: null,
                },
            ];
        }
        if (type === EntityTypeEnum.OBJECT) {
            return [
                {
                    label: "Appearance",
                    name: "config.appearance",
                    defaultValue: null,
                },
                {
                    label: "Properties",
                    name: "config.properties",
                    defaultValue: null,
                },
            ];
        }
        return [];
    }, [type]);

    return (
        <Form
            id={FORM_ID}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                    <>
                        <TextField
                            label="Name*"
                            {...field}
                        />
                        {fieldState.error && (
                            <span className="text-red-400">
                                Name is required
                            </span>
                        )}
                    </>
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field: { value, ...restField } }) => (
                    <TextArea
                        label="Description"
                        value={value ?? undefined}
                        rows={4}
                        {...restField}
                        resize="vertical"
                    />
                )}
                defaultValue={null}
            />

            {optionalFields.map((optionalField, index) => {
                const nextField = optionalFields[index + 1];
                const shouldRenderInline =
                    optionalField.isInline && nextField.isInline;

                if (
                    index > 0 &&
                    optionalFields[index - 1].isInline &&
                    optionalField.isInline
                ) {
                    return null;
                }

                return (
                    <Flex
                        key={optionalField.name}
                        direction="row"
                        gap="4"
                        width="100%"
                    >
                        <Controller
                            name={optionalField.name}
                            control={control}
                            defaultValue={optionalField.defaultValue}
                            render={({ field: { value, ...field } }) => (
                                <TextField
                                    full
                                    label={optionalField.label}
                                    value={value ?? ""}
                                    {...field}
                                />
                            )}
                        />
                        {shouldRenderInline && (
                            <Controller
                                key={nextField.name}
                                name={nextField.name}
                                control={control}
                                defaultValue={nextField.defaultValue}
                                render={({ field: { value, ...field } }) => (
                                    <TextField
                                        full
                                        label={nextField.label}
                                        value={value ?? ""}
                                        {...field}
                                    />
                                )}
                            />
                        )}
                    </Flex>
                );
            })}

            <Controller
                name="voice_name"
                control={control}
                render={({ field: { value, ...rest } }) => (
                    <VoiceSelect
                        value={value ?? null}
                        {...rest}
                    />
                )}
                defaultValue={null}
            />

            <Controller
                name="loras"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                    <EntityLoraInput
                        value={(value ?? [])[0] ?? null}
                        onChange={(value) => {
                            onChange(value ? [value] : []);
                        }}
                        {...rest}
                    />
                )}
                defaultValue={[]}
            />
        </Form>
    );
};

EntityForm.ID = FORM_ID;

export { EntityForm };
