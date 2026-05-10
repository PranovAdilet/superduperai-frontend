"use client";

import type { ForwardedRef } from "react";
import { Box } from "@radix-ui/themes";
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    ListsToggle,
    Separator,
    codeBlockPlugin,
    InsertCodeBlock,
    codeMirrorPlugin,
} from "@mdxeditor/editor";
import clsx from "clsx";
import "@mdxeditor/editor/style.css";
import styles from "./styles.module.scss";

export const MarkdownEditor = ({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {
    return (
        <Box width="100%">
            <MDXEditor
                {...props}
                ref={editorRef}
                contentEditableClassName={clsx("prose ", styles.editor)}
                plugins={[
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <InsertCodeBlock />
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <ListsToggle />
                                <Separator />
                                <BlockTypeSelect />

                                {/* <CreateLink />
                <InsertImage /> */}
                            </>
                        ),
                    }),

                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    // linkDialogPlugin(),
                    // linkPlugin(),
                    thematicBreakPlugin(),

                    codeBlockPlugin({
                        defaultCodeBlockLanguage: "txt",
                    }),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            json: "json",
                            txt: "text",
                        },
                    }),
                    markdownShortcutPlugin(),
                ]}
            />
        </Box>
    );
};
