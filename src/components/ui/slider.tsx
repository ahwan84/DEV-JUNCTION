"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number[]
    onValueChange?: (value: number[]) => void
    onValueCommit?: (value: number[]) => void
    max?: number
    step?: number
    className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, onValueCommit, max = 100, step = 1, disabled, ...props }, ref) => {

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseFloat(e.target.value)
            onValueChange?.([val])
        }

        const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
            const val = parseFloat((e.target as HTMLInputElement).value)
            onValueCommit?.([val])
        }

        const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
            const val = parseFloat((e.target as HTMLInputElement).value)
            onValueCommit?.([val])
        }

        // Calculate percentage for background gradient (filled track)
        const percentage = ((value[0] || 0) / max) * 100

        return (
            <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
                <input
                    ref={ref}
                    type="range"
                    min={0}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleTouchEnd}
                    disabled={disabled}
                    className={cn(
                        "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 disabled:cursor-not-allowed",
                        "accent-primary", // Uses browser default accent color for thumb usually, but we style via standard CSS if needed
                        className
                    )}
                    style={{
                        background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`
                    }}
                    {...props}
                />
                {/* Custom Thumb Styling injection if needed, but accent-color is often enough for simple cases. 
            For "premium" look, we might want custom CSS, but inline styles for range inputs are tricky. 
            The above uses a linear gradient for the track fill.
        */}
                <style jsx>{`
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #3b82f6;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                margin-top: -6px; /* Adjust for track height */
                cursor: grab;
                transition: transform 0.1s;
            }
            input[type=range]::-webkit-slider-thumb:active {
                cursor: grabbing;
                transform: scale(1.1);
            }
            input[type=range]::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #3b82f6;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                cursor: grab;
                border: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
                height: 8px;
                border-radius: 9999px;
            }
        `}</style>
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
