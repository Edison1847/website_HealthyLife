"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImageSequence, { ImageSequenceRef } from "./ImageSequence";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Custom internal component for the glass cards
interface SleepCardProps {
    title: string;
    desc: string;
    image: string;
    blurBg: string;
    className?: string;
}

const SleepCard = ({ title, desc, image, blurBg, className = "" }: SleepCardProps) => {
    return (
        <div className={`relative ${className} pointer-events-auto cursor-pointer group`}>
            {/* Hover container, separated from GSAP transforms as per rules */}
            <div className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-3 w-full h-full relative z-10 rounded-[24px] shadow-2xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                {/* 1. Blurred canvas background for true glassmorphism over WebGL */}
                <div className="absolute inset-0 rounded-[24px] overflow-hidden bg-white/20">
                    <div
                        className={`absolute inset-0 transition-opacity duration-500 ${blurBg ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: blurBg ? `url(${blurBg})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(16px) brightness(1.1)',
                            transform: 'scale(1.1)',
                        }}
                    />
                </div>

                {/* 2. Specific Card Image with fade/blend */}
                <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover opacity-30 mix-blend-multiply"
                    />
                    {/* Add gradient to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-white/10" />
                </div>

                {/* 3. Glass border effect */}
                <div className="absolute inset-0 rounded-[24px] border-[2.5px] border-white/80 pointer-events-none" />

                {/* 4. Content */}
                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-3 text-wellness-dark font-jakarta tracking-tight">{title}</h3>
                    <p className="text-[#2D332B]/80 font-inter leading-relaxed text-[15px]">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function DeepSleep() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const bedContainerRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const sequenceRef = useRef<ImageSequenceRef>(null);

    // Cards refs
    const card1LeftRef = useRef<HTMLDivElement>(null);
    const card2LeftRef = useRef<HTMLDivElement>(null);
    const card1RightRef = useRef<HTMLDivElement>(null);
    const card2RightRef = useRef<HTMLDivElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const handleSequenceComplete = useCallback(() => setIsLoaded(true), []);

    // Static blur background frame as requested
    const blurFrame = "/animations/sleep/ezgif-frame-068.png";

    useGSAP(() => {
        if (!isLoaded) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=150%", // Tighter transition
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // --- Initial States (Setup) ---
        gsap.set(bedContainerRef.current, { y: 150, scale: 0.6 });
        gsap.set([card1LeftRef.current, card2LeftRef.current], { x: -400, opacity: 0 });
        gsap.set([card1RightRef.current, card2RightRef.current], { x: 400, opacity: 0 });
        gsap.set(subtitleRef.current, { opacity: 0, y: 30, filter: "blur(5px)" });

        // --- Animation Timeline ---
        const sequenceObj = { progress: 0 };

        // 0. Play 3D Bed sequence first (from duration 0 to 1.0)
        tl.to(sequenceObj, {
            progress: 1,
            duration: 1.0,
            ease: "none",
            onUpdate: () => {
                sequenceRef.current?.setProgress(sequenceObj.progress);
            }
        }, 0);

        // 1. Entrance (Bed rises slightly while animating)
        tl.to(bedContainerRef.current, { y: 0, duration: 0.2, ease: "power2.out" }, 0);

        // 2. Pair 1 Slides In (Left & Right 1) AFTER sequence finishes at 1.0
        tl.to([card1LeftRef.current, card1RightRef.current], {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        }, 1.1);

        // 3. Pair 2 Slides In (Left & Right 2)
        tl.to([card2LeftRef.current, card2RightRef.current], {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 1.8);

        // 4. Subtitle fades in
        tl.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3
        }, .7);

        ScrollTrigger.refresh();
    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden" style={{ background: '#FFFFFF' }}>
            {/* Pinned Viewport Container */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex flex-col items-center justify-center">

                {/* 1. Background - pure white matching animation edges + very subtle green tint at bottom */}
                <div className="absolute inset-0 z-0" style={{ background: '#FFFFFF' }} />

                {/* 2. Main Title */}
                <h2
                    ref={titleRef}
                    className="absolute top-[4%] md:top-[8%] z-20 text-4xl md:text-6xl lg:text-[72px] font-bold text-center w-full leading-tight cinematic-text text-wellness-dark"
                >
                    The Science of <br className="md:hidden" />
                    <span
                        className="text-[#96ad8f] relative inline-block drop-shadow-[0_0_25px_rgba(150,173,143,0.6)]"
                    >
                        Deep Sleep
                    </span>
                </h2>

                <div
                    ref={bedContainerRef}
                    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                    <div className="relative w-full h-full origin-bottom md:origin-center">
                        <ImageSequence
                            ref={sequenceRef}
                            frameCount={91}
                            baseUrl="/animations/sleep"
                            onComplete={handleSequenceComplete}
                            fit="contain"
                        />
                    </div>
                </div>

                {/* 4. Cards Overlays */}
                <div className="absolute inset-0 w-full h-full z-30 pointer-events-none max-w-[1400px] mx-auto">

                    {/* LEFT CARDS */}
                    <div className="absolute left-[1%] md:left-[1%] top-[55%] md:top-[50%] lg:top-[50%] -translate-y-1/2 w-[90%] md:w-[320px] lg:w-[380px] h-[350px]">
                        {/* Pair 1 - Left */}
                        <div ref={card1LeftRef} className="absolute inset-0">
                            <SleepCard
                                title="Cellular Repair"
                                desc="Growth hormones are released to repair muscle and tissue damage from your daily activities."
                                image="/images/section2/section2_crad1.jpeg"
                                blurBg={blurFrame}
                                className="w-full h-[180px]"
                            />
                        </div>

                        {/* Pair 2 - Left (Overlaps the first card with layered offset) */}
                        <div ref={card2LeftRef} className="absolute inset-0 mt-20 -left-4 md:-left-8 right-4 md:right-8 z-20 drop-shadow-2xl">
                            <SleepCard
                                title="Memory Consolidation"
                                desc="Your brain processes and stores information from the day, cementing skills and memories."
                                image="/images/section2/section2_crad2.jpeg"
                                blurBg={blurFrame}
                                className="w-full h-[180px]"
                            />
                        </div>
                    </div>

                    {/* RIGHT CARDS */}
                    <div className="absolute right-[1%] md:right-[1%] top-[55%] md:top-[50%] lg:top-[50%] -translate-y-1/2 w-[90%] md:w-[320px] lg:w-[380px] h-[350px]">
                        {/* Pair 1 - Right */}
                        <div ref={card1RightRef} className="absolute inset-0">
                            <SleepCard
                                title="Immune Restoration"
                                desc="Crucial immune cells are produced to combat inflammation, keeping your defenses strong."
                                image="/images/section2/section2_crad2.jpeg"
                                blurBg={blurFrame}
                                className="w-full h-[180px]"
                            />
                        </div>

                        {/* Pair 2 - Right (Overlaps) */}
                        <div ref={card2RightRef} className="absolute inset-0 mt-20 left-4 md:left-8 -right-4 md:-right-8 z-20 drop-shadow-2xl">
                            <SleepCard
                                title="Cortisol Reduction"
                                desc="Stress hormone levels drop significantly while your body shifts from fight-or-flight to deep recovery."
                                image="/images/section2/section2_crad1.jpeg"
                                blurBg={blurFrame}
                                className="w-full h-[180px]"
                            />
                        </div>
                    </div>

                </div>

                {/* 5. Subtitle Text */}
                <div
                    ref={subtitleRef}
                    className="absolute bottom-[1%] md:bottom-[4%] z-40 w-full text-center px-4"
                >
                    <p className="text-xl md:text-[28px] font-medium text-wellness-dark/90 tracking-tight max-w-[800px] mx-auto drop-shadow-sm font-jakarta">
                        Your body performs essential repairs, consolidating memory and restoring physical energy during deep sleep.
                    </p>
                </div>

            </div>

            {/* Loading Cover while images load */}
            <div className={`fixed inset-0 z-50 bg-alabaster transition-opacity duration-1000 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        </section>
    );
}
