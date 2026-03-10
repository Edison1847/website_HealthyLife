"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

export interface ImageSequenceRef {
    setProgress: (progress: number) => void;
}

interface ImageSequenceProps {
    frameCount: number;
    baseUrl: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    fit?: "cover" | "contain";
}

const ImageSequence = forwardRef<ImageSequenceRef, ImageSequenceProps>(
    ({ frameCount, baseUrl, onProgress, onComplete, fit = "cover" }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [images, setImages] = useState<HTMLImageElement[]>([]);
        const lastFrameIndex = useRef(-1);

        // Preload images
        useEffect(() => {
            let isActive = true;
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.src = `${baseUrl}/ezgif-frame-${i.toString().padStart(3, "0")}.png`;
                img.onload = () => {
                    if (!isActive) return;
                    loadedCount++;
                    const loadingProgress = Math.round((loadedCount / frameCount) * 100);
                    if (onProgress) onProgress(loadingProgress);

                    if (loadedCount === frameCount) {
                        setImages(loadedImages);
                        // Force a local render of frame 0 immediately after setImages
                        const canvas = canvasRef.current;
                        if (canvas) {
                            const context = canvas.getContext("2d", { alpha: true });
                            const firstImg = loadedImages[0];
                            if (context && firstImg) {
                                context.clearRect(0, 0, canvas.width, canvas.height);
                                context.fillStyle = '#ffffff';
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                                const scale = fit === "contain"
                                    ? Math.min(canvas.width / firstImg.width, canvas.height / firstImg.height)
                                    : Math.max(canvas.width / firstImg.width, canvas.height / firstImg.height);
                                const x = (canvas.width / 2) - (firstImg.width / 2) * scale;
                                const y = (canvas.height / 2) - (firstImg.height / 2) * scale;
                                context.drawImage(firstImg, x, y, firstImg.width * scale, firstImg.height * scale);
                            }
                        }
                        if (onComplete) onComplete();
                    }
                };
                loadedImages.push(img);
            }

            return () => {
                isActive = false;
            };
        }, [frameCount, baseUrl, onProgress, onComplete]);

        // Drawing function
        const render = (idx: number, force = false) => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;
            const context = canvas.getContext("2d", { alpha: false });
            if (!context) return;

            // Only re-render if the frame index has actually changed or if forced
            if (!force && idx === lastFrameIndex.current) return;

            const img = images[idx];
            if (img && canvas.width > 0 && canvas.height > 0) {
                // We purposefully do NOT use clearRect here to prevent black flickering 
                // between frame drawing and GPU upload if the browser delays the paint.
                const scale = fit === "contain"
                    ? Math.min(canvas.width / img.width, canvas.height / img.height)
                    : Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                context.drawImage(img, x, y, img.width * scale, img.height * scale);
                lastFrameIndex.current = idx;
            }
        };

        // Expose setProgress to parent to avoid React re-renders on scroll
        useImperativeHandle(ref, () => ({
            setProgress: (progress: number) => {
                if (images.length === 0) return;
                const targetFrame = Math.floor(progress * (frameCount - 1));
                const safeFrame = Math.max(0, Math.min(targetFrame, frameCount - 1));
                render(safeFrame);
            }
        }));

        // Initial sizing and resize handler
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                if (lastFrameIndex.current >= 0) {
                    render(lastFrameIndex.current, true);
                }
            };

            // Initial set on mount/load
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                render(0, true);
            }

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [images]); // Only re-run when images are loaded

        return (
            <div ref={containerRef} className="absolute inset-0 z-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-0 h-full w-full opacity-100"
                    style={{ willChange: "transform" }}
                />
            </div>
        );
    }
);

ImageSequence.displayName = "ImageSequence";
export default ImageSequence;
