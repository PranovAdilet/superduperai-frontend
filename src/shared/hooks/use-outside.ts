"use client";
import { useEffect, useRef, useState } from "react";

export const useOutside = (defaultState?: boolean) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isShown, setIsShown] = useState(defaultState ?? false);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsShown(false);
        }
    };

    const toggleShow = () => {
        setIsShown((prev) => !prev);
    };

    useEffect(() => {
        if (isShown) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isShown]);

    return { ref, isShown, toggleShow, setIsShown };
};
