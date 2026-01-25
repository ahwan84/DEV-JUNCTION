"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export function CompareSlider({
    beforeImage,
    afterImage,
    beforeLabel = "Before",
    afterLabel = "After",
    className,
}: CompareSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
        },
        []
    );

    const onMouseMove = useCallback(
        (e: React.MouseEvent | MouseEvent) => {
            if (!isDragging) return;
            handleMove(e.clientX);
        },
        [isDragging, handleMove]
    );

    const onTouchMove = useCallback(
        (e: React.TouchEvent | TouchEvent) => {
            if (!isDragging) return;
            handleMove(e.touches[0].clientX);
        },
        [isDragging, handleMove]
    );

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onMouseUp);
        } else {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onMouseUp);
        };
    }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full overflow-hidden select-none group cursor-ew-resize rounded-xl shadow-lg ring-1 ring-slate-900/5",
                className
            )}
            onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
            }}
        >
            {/* Before Image (Background) */}
            <div className="relative w-full aspect-video">
                <Image
                    src={beforeImage}
                    alt={beforeLabel}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                    {beforeLabel}
                </div>
            </div>

            {/* After Image (Foreground - Clipped) */}
            <div
                className="absolute top-0 left-0 right-0 bottom-0 w-full aspect-video"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
            >
                <Image
                    src={afterImage}
                    alt={afterLabel}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                    {afterLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-xl transition-transform duration-200 group-hover:scale-110 active:scale-95">
                    <GripVertical className="h-5 w-5 text-slate-800" />
                </div>
            </div>
        </div>
    );
}
