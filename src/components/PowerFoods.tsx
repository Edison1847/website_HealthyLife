"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageSequence, { ImageSequenceRef } from "./ImageSequence";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Custom internal component for the glass feature cards
interface FeatureCardProps {
    title: string;
    desc: string;
    className?: string;
}

const FeatureCard = ({ title, desc, className = "" }: FeatureCardProps) => {
    return (
        <div className={`relative ${className} pointer-events-auto group`}>
            {/* The glass card Wrapper */}
            <div className="glass-card-wrapper w-full h-full relative z-10 rounded-[20px] bg-black/40 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-vitality-green/50 hover:bg-black/60">
                {/* Glow Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-vitality-green/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10 p-4 md:p-5 h-full flex flex-col justify-start">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-white font-jakarta tracking-tight">
                        {title}
                    </h3>
                    <p className="text-white/70 font-inter leading-relaxed text-[14px] md:text-[15px]">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function PowerFoods() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pomegranateRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const sequenceRef = useRef<ImageSequenceRef>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const avocadoWrapperRef = useRef<HTMLDivElement>(null);

    // Cards refs
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);

    // Particles refs


    const [isLoaded, setIsLoaded] = useState(false);

    const handleSequenceComplete = useCallback(() => setIsLoaded(true), []);

    // Spotlight cursor effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!spotlightRef.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(spotlightRef.current, {
            x: x - 150, // Center of 300px light
            y: y - 150,
            duration: 0.6,
            ease: "power2.out"
        });
    }, []);

    useGSAP(() => {
        if (!isLoaded || !containerRef.current || !pomegranateRef.current) return;

        // 1. Main ScrollTrigger Timeline for the Section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=250%", // Faster scroll distance
                scrub: 0.2, // Snappier catch-up
                pin: true,
                markers: true, // DEBUG
                anticipatePin: 1,
            }
        });

        // === PHASE 1: Avocado reveal (Instant start) ===
        gsap.set(avocadoWrapperRef.current, { opacity: 0, scale: 0.9 });
        tl.to(avocadoWrapperRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.2, // Slightly slower fade for smoothness
            ease: "power2.out"
        }, 0); // Start IMMEDIATELY

        // === PHASE 2: Image Sequence playback (0.1 → 0.9) ===
        const sequenceObj = { progress: 0 };
        tl.to(sequenceObj, {
            progress: 1,
            ease: "power1.inOut",
            duration: 0.8, // Plays across most of the scroll
            onUpdate: () => {
                let t = sequenceObj.progress;
                let mappedProgress;
                if (t < 0.3) {
                    mappedProgress = t * 1.33;
                } else if (t < 0.7) {
                    mappedProgress = 0.4 + ((t - 0.3) * 0.5);
                } else {
                    mappedProgress = 0.6 + ((t - 0.7) * 1.33);
                }
                sequenceRef.current?.setProgress(mappedProgress);
            }
        }, 0.1);

        // === PHASE 3: 3D Tilt on the avocado (Instant) ===
        gsap.set(pomegranateRef.current, { scale: 1.5, rotationY: -15, rotationX: 5 });
        tl.to(pomegranateRef.current, {
            scale: 1.5,
            rotationY: 0,
            rotationX: 0,
            duration: 0.4,
            ease: "power2.out"
        }, 0);

        // === PHASE 4: Text & Card Reveal (Staggered) ===
        gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
        gsap.set([card1Ref.current, card2Ref.current], {
            opacity: 0,
            y: 100,
            rotationX: "random(-140, 140)",
            rotationY: "random(-140, 140)",
            rotationZ: "random(-30, 30)",
            scale: 0.5,
            transformPerspective: 1200
        });



        // Subtitle fades in as avocado appears
        tl.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        }, 0.1);

        // Card 1 Reveal
        tl.to(card1Ref.current, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)"
        }, 0.4);

        // Card 2 Reveal (Delayed significantly)
        tl.to(card2Ref.current, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)"
        }, 0.8);

        // Crucial: After animations are set and isLoaded is complete, refresh all triggers
        // This ensures the Contact Section below gets its start markers calculated natively 
        // after this section applies its pinning spacer.
        if (isLoaded) {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }

    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden">
            {/* Background - Plain Black */}
            <div className="absolute inset-0 z-0 bg-black" />



            {/* Pinned Viewport Content Container */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-center max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 pt-[80px]">

                {/* LEFT SIDE - 3D Avocado & Cinematics */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center z-20 -translate-x-[40px] -translate-y-[80px]">
                    {/* Soft diagonal light beam */}
                    <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-white/5 via-transparent to-transparent -rotate-12 pointer-events-none mix-blend-screen" />

                    <div
                        ref={pomegranateRef}
                        className="relative w-full h-full flex items-center justify-center transform perspective-[1000px]"
                        onMouseMove={handleMouseMove}
                    >
                        {/* Soft Follow-Cursor Light */}
                        <div
                            ref={spotlightRef}
                            className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-10 opacity-40 mix-blend-screen blur-[100px]"
                            style={{
                                background: 'radial-gradient(circle, rgba(127,214,138,0.4) 0%, rgba(63,174,93,0) 70%)'
                            }}
                        />

                        {/* Avocado wrapper with fade-in */}
                        <div ref={avocadoWrapperRef} className="absolute inset-0">
                            <ImageSequence
                                ref={sequenceRef}
                                frameCount={91}
                                baseUrl="/animations/avacado_black"
                                onComplete={handleSequenceComplete}
                                fit="none"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Content & Glass Cards */}
                <div ref={contentRef} className="relative w-full md:w-1/2 h-auto md:h-full flex flex-col justify-center z-30 pt-8 md:pt-0 pb-16 md:pb-0 pl-0 md:pl-12 lg:pl-24 -translate-y-[40px]">

                    <div className="mb-6 md:mb-12 translate-y-[0px]">
                        <h2
                            ref={titleRef}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-jakarta leading-tight mb-4 text-white"
                        >
                            Nature's <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#7fd68a] to-[#96ad8f] cinematic-text drop-shadow-[0_0_15px_rgba(127,214,138,0.2)] tracking-wider">
                                POWER FOODS
                            </span>
                        </h2>
                        <p
                            ref={subtitleRef}
                            className="text-white/80 font-inter text-lg md:text-xl max-w-md leading-relaxed"
                        >
                            Fuel your body with nutrient-dense foods that support energy, immunity, and long-term health.
                        </p>
                    </div>

                    {/* Staggered Feature Cards Container */}
                    <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[480px]">
                        <div ref={card1Ref}>
                            <FeatureCard
                                title="Antioxidant Rich"
                                desc="Foods like avocado contain healthy fats and nutrients that protect cells."
                            />
                        </div>
                        <div ref={card2Ref}>
                            <FeatureCard
                                title="Nutrient Density"
                                desc="Whole foods provide essential vitamins, minerals, and fiber."
                            />
                        </div>
                    </div>

                </div>

            </div>

            {/* Loading Cover while images load */}
            <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        </section>
    );
}
