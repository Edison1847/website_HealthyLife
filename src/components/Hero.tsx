"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageSequence, { ImageSequenceRef } from "./ImageSequence";
import LoadingCinematic from "./LoadingCinematic";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subheadingRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const sequenceRef = useRef<ImageSequenceRef>(null);
    const [blurBg, setBlurBg] = useState<string>('');

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleSequenceComplete = useCallback(() => setIsLoaded(true), []);

    // Capture canvas frame periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                // toDataURL() can be expensive, but it's a workaround for backdrop-filter on canvas issues
                setBlurBg(canvas.toDataURL('image/webp', 0.5));
            }
        }, 50); // update every 50ms during scroll
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        if (!isLoaded) return;

        // Unified ScrollTrigger for the entire Hero section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=100%",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    // Map the animation progress directly to the scroll progress
                    sequenceRef.current?.setProgress(self.progress);
                },
                // OnEnter, OnLeave, OnEnterBack, OnLeaveBack
                invalidateOnRefresh: true,
            }
        });

        // Entrance animations
        if (headlineRef.current) {
            gsap.fromTo(headlineRef.current,
                { opacity: 0, y: 100, filter: "blur(10px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out" }
            );
        }

        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
            );
        }

        // Scroll Indicator Entrance (Fade in after a delay)
        if (scrollIndicatorRef.current) {
            gsap.fromTo(scrollIndicatorRef.current,
                { opacity: 0 },
                { opacity: 0.6, duration: 1, delay: 1.5, ease: "power2.out" }
            );
        }

        // Scroll-driven content disappearances (Slower due to higher durations relative to timeline)

        // 1. Scroll Indicator (Disappears later)
        if (scrollIndicatorRef.current) {
            tl.fromTo(scrollIndicatorRef.current,
                { opacity: 0.6, y: 0 },
                { opacity: 0, y: 20, duration: 0.5 },
                0.2 // moved later in timeline
            );
        }

        // 2. Headline (Slow dissolve upwards — delayed start)
        if (headlineRef.current) {
            tl.fromTo(headlineRef.current,
                { y: 0, opacity: 1, filter: "blur(0px)" },
                { y: -150, opacity: 0, filter: "blur(20px)", duration: 1.5 },
                0.5
            );
        }

        // 3. Subheading (Creative: blur out and drift to the left)
        if (subheadingRef.current) {
            tl.fromTo(subheadingRef.current,
                { x: 0, opacity: 1, filter: "blur(0px)" },
                { x: -40, opacity: 0, filter: "blur(12px)", duration: 1.2 },
                0.5
            );
        }

        // 4. Buttons (Creative: sink down and scale out rapidly)
        if (buttonsRef.current) {
            tl.fromTo(buttonsRef.current,
                { y: 0, scale: 1, opacity: 1 },
                { y: 40, scale: 0.9, opacity: 0, duration: 1.0 },
                0.5
            );
        }

        // 5. Card (Floats DOWNWARD with heavy blur)
        if (cardRef.current) {
            tl.fromTo(cardRef.current,
                { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
                { y: 300, opacity: 0, scale: 0.85, filter: "blur(20px)", duration: 1.5 },
                0.5
            );
        }

        // Removed the solid white transition overlay animation so the user can actually see the sections scrolling gracefully.

        // Initial refresh once everything is ready
        ScrollTrigger.refresh();

    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <div ref={containerRef} className="hero-container relative h-screen w-full bg-deep-onyx overflow-hidden">
            {/* Top Accent Bar */}
            <div className="top-accent-bar" />

            {/* Loading State */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-1000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <LoadingCinematic progress={loadingProgress} />
            </div>

            {/* The Background Sequence (Driven by Hero Progress) */}
            <ImageSequence
                ref={sequenceRef}
                frameCount={91}
                baseUrl="/animations/intro_new"
                onProgress={setLoadingProgress}
                onComplete={handleSequenceComplete}
            />

            {/* Overlay Content */}
            <div className={`absolute top-0 left-0 right-0 h-screen z-20 pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

                {/* Positioned closer to left edge, with balanced content width */}
                <div className="absolute top-[18%] left-[4%] md:left-[8%] max-w-[680px]">

                    {/* 1. MAIN TITLE */}
                    <h1
                        ref={headlineRef}
                        className="text-7xl md:text-[96px] font-extrabold text-white leading-none tracking-tight"
                    >
                        Your Health <br />
                        Starts Here
                    </h1>

                    {/* 2. SUBHEADING */}
                    <p
                        ref={subheadingRef}
                        className="text-[22px] md:text-2xl text-white/80 leading-snug max-w-[580px]"
                        style={{ marginTop: '32px', marginBottom: '32px' }}
                    >
                        Simple nutrition guidance, effective workouts, and healthy lifestyle
                        habits to help you feel your best every day.
                    </p>

                    {/* 3. BUTTON GROUP */}
                    <div ref={buttonsRef} className="flex items-center gap-6 pointer-events-auto">
                        <button className="px-10 py-3 rounded-full bg-[#96ad8f] text-white font-medium text-sm hover:bg-[#869b7f] transition shadow-lg">
                            Start Your Wellness Journey
                        </button>
                        <button className="px-10 py-3 rounded-full border border-[#96ad8f] text-white font-medium text-sm hover:bg-[#96ad8f]/10 transition">
                            Explore Healthy Guides
                        </button>
                    </div>

                </div>

                {/* Floating Wellness Card */}
                <div
                    ref={cardRef}
                    className="absolute bottom-8 right-8 md:right-24 pointer-events-auto z-40"
                >
                    <div className="animate-float">
                        <div className="glass-card-wrapper">
                            {/* Blurred canvas snapshot behind card */}
                            <div
                                className="absolute inset-0 rounded-[20px] overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    className={`absolute inset-0 transition-opacity duration-1000 ${blurBg ? 'opacity-100' : 'opacity-0'}`}
                                    style={{
                                        backgroundImage: blurBg ? `url(${blurBg})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(18px) brightness(0.98)',
                                        transform: 'scale(1.1)', // increased from 1.05 to 1.1
                                        borderRadius: '20px',
                                    }}
                                />
                            </div>

                            {/* Balanced tint overlay */}
                            <div className="absolute inset-0 rounded-[20px] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 100%)'
                                }}
                            />

                            <div className="glass-card relative z-10 shadow-2xl group cursor-pointer">
                                <div>
                                    <h3 className="">Personalized Wellness</h3>
                                    <p className="">
                                        Wellness is not one-size-fits-all. Discover practical advice on nutrition, fitness, and daily habits designed to support your unique lifestyle.
                                    </p>
                                </div>

                                {/* Feature Highlights Grid */}
                                <div
                                    className="grid grid-cols-2 gap-x-6 gap-y-4"
                                    style={{ marginTop: '20px' }}   /* explicit inline override */
                                >
                                    {[
                                        "Healthy Recipes",
                                        "Workout Plans",
                                        "Nutrition Tips",
                                        "Lifestyle Guidance"
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-3 text-white/90 text-[15px] font-medium transition-transform group-hover:translate-x-1">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#96ad8f] flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-[#1A1C19]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator (Mouse Style) */}
            <div
                ref={scrollIndicatorRef}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto cursor-pointer flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity z-50"
            >
                <div className="w-6 h-10 border-2 border-alabaster rounded-full relative">
                    <div className="w-1 h-2 bg-alabaster rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-bounce" />
                </div>
            </div>

        </div>
    );
}

