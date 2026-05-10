"use client";

import type { FC } from "react";
import React, { useRef, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { useClickAway } from "react-use";
import styles from "./styles.module.scss";

type Props = {
    color: string;
    onChange: (color: string) => void;
};

export const ColorPicker: FC<Props> = ({ color, onChange }) => {
    const popover = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };
    const toggle = () => {
        setIsOpen(!isOpen);
    };

    useClickAway(popover, handleClose);

    return (
        <div className={styles.picker}>
            <button
                className={styles.input}
                style={{
                    backgroundColor: color,
                    pointerEvents: isOpen ? "none" : "auto",
                }}
                onClick={toggle}
            />

            {isOpen && (
                <div
                    className={styles.popover}
                    ref={popover}
                >
                    <HexAlphaColorPicker
                        color={color}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
};
