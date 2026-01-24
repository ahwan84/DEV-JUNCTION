'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, MessageSquareWarning } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface CaptchaProps {
    onVerify: (isValid: boolean) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
    const [isVerified, setIsVerified] = useState(false);
    const [sliderValue, setSliderValue] = useState([0]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const puzzleRef = useRef<HTMLCanvasElement>(null);
    const [targetX, setTargetX] = useState(0);

    // Configuration
    const width = 320;
    const height = 160;
    const puzzleSize = 40;
    const tolerance = 5;

    const generateCaptcha = () => {
        setIsLoading(true);
        setIsVerified(false);
        setStatus('idle');
        onVerify(false);
        setSliderValue([0]);

        const canvas = canvasRef.current;
        const puzzle = puzzleRef.current;
        if (!canvas || !puzzle) return;

        const ctx = canvas.getContext('2d');
        const pCtx = puzzle.getContext('2d');
        if (!ctx || !pCtx) return;

        // Clear canvases
        ctx.clearRect(0, 0, width, height);
        pCtx.clearRect(0, 0, width, height);
        puzzle.width = width;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        // Access random nature/building images
        img.src = `https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ts=${Date.now()}`;

        img.onload = () => {
            // Random Position for Puzzle Piece (The "Hole")
            const x = Math.floor(Math.random() * (width - puzzleSize * 2)) + puzzleSize + 20;
            const y = Math.floor(Math.random() * (height - puzzleSize * 2)) + puzzleSize;
            setTargetX(x);

            // Draw Background
            ctx.drawImage(img, 0, 0, width, height);

            // Draw Hole
            drawPuzzleShape(ctx, x, y, puzzleSize, true);

            // Draw Piece
            pCtx.clearRect(0, 0, width, height);
            drawPuzzleShape(pCtx, x, y, puzzleSize, false);
            pCtx.clip();
            pCtx.drawImage(img, 0, 0, width, height);
            drawPuzzleShape(pCtx, x, y, puzzleSize, false, true); // Stroke

            setIsLoading(false);
        };
        img.onerror = () => {
            console.error("Failed to load captcha image");
            // Fallback?
        }
    };

    const drawPuzzleShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isHole: boolean, isStroke = false) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        // Top
        ctx.lineTo(x + size / 2 - 5, y);
        ctx.arc(x + size / 2, y - 5, 5, 0.5 * Math.PI, 2.5 * Math.PI);
        ctx.lineTo(x + size, y);
        // Right
        ctx.lineTo(x + size, y + size / 2 - 5);
        ctx.arc(x + size + 5, y + size / 2, 5, 1 * Math.PI, 3 * Math.PI);
        ctx.lineTo(x + size, y + size);
        // Bottom
        ctx.lineTo(x + size / 2 + 5, y + size);
        ctx.arc(x + size / 2, y + size - 5, 5, 0, 2 * Math.PI, true);
        ctx.lineTo(x, y + size);
        // Left
        ctx.lineTo(x, y + size / 2 + 5);
        ctx.arc(x - 5, y + size / 2, 5, 0.5 * Math.PI, 2.5 * Math.PI, true);
        ctx.lineTo(x, y);
        ctx.closePath();

        if (isStroke) {
            ctx.strokeStyle = '#fbbf24'; // Ember/Gold
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (isHole) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSliderChange = (value: number[]) => {
        if (isVerified) return;
        setSliderValue(value);
    };

    const handleSliderCommit = (value: number[]) => {
        if (isVerified) return;

        const finalPos = value[0];
        // The piece is normally at 'targetX' on the puzzle canvas.
        // We shift it by `finalPos`.
        // Wait, the logic: 
        // We render piece at targetX.
        // We apply toggle `transform: translateX(sliderValue - targetX)`.
        // If sliderValue === targetX, then transform is 0, so piece is at targetX.
        // Correct.

        if (Math.abs(finalPos - targetX) < tolerance) {
            setIsVerified(true);
            setStatus('success');
            onVerify(true);
        } else {
            setStatus('error');
            onVerify(false);
            setSliderValue([0]); // Snap back
            setTimeout(() => setStatus('idle'), 500);
        }
    };

    return (
        <div className="w-full max-w-[320px] space-y-4">
            <div className="relative h-[160px] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group select-none">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
                        <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 z-0 bg-slate-200"
                />

                {/* Puzzle Piece Canvas */}
                <canvas
                    ref={puzzleRef}
                    width={width}
                    height={height}
                    className="absolute inset-0 z-10 drop-shadow-lg"
                    style={{ transform: `translateX(${sliderValue[0] - targetX}px)` }}
                />

                {status === 'success' && (
                    <div className="absolute inset-0 bg-green-500/20 z-30 flex items-center justify-center backdrop-blur-[1px] animate-in fade-in">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                )}
                {status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/10 z-30 flex items-center justify-center animate-pulse">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                            <MessageSquareWarning className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute top-2 right-2 z-40 bg-white/50 hover:bg-white text-slate-700 h-8 w-8"
                    onClick={generateCaptcha}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative bg-slate-100 rounded-full h-10 p-1 select-none shadow-inner border border-slate-200">
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-400 uppercase tracking-widest pointer-events-none">
                    {isVerified ? 'Verified' : 'Slide to Verify'}
                </div>

                <Slider
                    value={sliderValue}
                    max={width - puzzleSize} // Limit slider so piece doesn't fly off too far? Or just width.
                    // If we want Slider=0 to equate to Piece at Left Edge.
                    // Piece Left Edge is targetX (+ transform).
                    // We want: targetX + (Slider - targetX) = Slider.
                    // So Slider represents the absolute X position of the piece.
                    // Max slider should be width - puzzleSize.
                    step={1}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    disabled={isVerified || isLoading}
                    className={cn(
                        "relative z-10 w-full",
                        status === 'success' && "opacity-50",
                        status === 'error' && "animate-shake"
                    )}
                />
            </div>
        </div>
    );
}
