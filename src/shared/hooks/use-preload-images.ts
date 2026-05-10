"use client";

import { useEffect, useState } from "react";

export const usePreloadImages = (imageUrls?: string[], cleanable?: boolean) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setLoaded(true);
            return;
        }
        let isCancelled = false;

        const preloadImage = (url: string) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    if (!isCancelled) resolve(url);
                };
                img.onerror = reject;
            });
        };

        Promise.all(imageUrls.map(preloadImage))
            .then(() => {
                if (!isCancelled) setLoaded(true);
            })
            .catch(() => {
                // console.error("Failed to preload images", error);
            });

        return () => {
            isCancelled = true;
            if (cleanable) {
                setLoaded(false);
            }
        };
    }, [imageUrls]);

    return loaded;
};
