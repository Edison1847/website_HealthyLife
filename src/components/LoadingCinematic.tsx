"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingCinematicProps {
    progress: number;
}

export default function LoadingCinematic({ progress }: LoadingCinematicProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reveal animation
        gsap.fromTo(textRef.current,
            { opacity: 0, scale: 0.9, filter: "blur(10px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
        );
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-onyx"
        >
            <div className="relative flex flex-col items-center gap-8">
                {/* Animated Brand Symbol/Progress */}
                <div className="relative h-24 w-24">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            className="text-alabaster/10"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className="text-vitality-green transition-all duration-300 ease-out"
                            strokeWidth="2"
                            strokeDasharray={45 * 2 * Math.PI}
                            strokeDashoffset={45 * 2 * Math.PI * (1 - progress / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-jakarta text-xs font-bold text-alabaster tracking-tighter">
                        {progress}%
                    </div>
                </div>

                {/* Text Cinematic */}
                <div ref={textRef} className="flex flex-col items-center gap-2">
                    <h2 className="font-jakarta text-2xl font-bold uppercase tracking-[0.4em] text-alabaster">
                        Vitality
                    </h2>
                    <div className="h-[1px] w-0 bg-vitality-green transition-all duration-1000" style={{ width: `${progress * 1.5}px` }} />
                    <p className="font-jakarta text-[10px] uppercase tracking-[0.2em] text-alabaster/40 mt-2">
                        Optimizing your wellness canvas...
                    </p>
                </div>
            </div>

            {/* Background Micro-lines */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-vitality-green to-transparent -translate-y-1/2 scale-x-[2] blur-[1px]" />
            </div>
        </div>
    );
}
