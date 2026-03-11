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
            <div className="glass-card-wrapper w-full h-full relative z-10 rounded-[20px] bg-black/40 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-ruby-red/50 hover:bg-black/60">
                {/* Glow Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-ruby-red/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-start">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-white font-jakarta tracking-tight">{title}</h3>
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

    // Cards refs
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);

    // Particles refs
    const particlesContainerRef = useRef<HTMLDivElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const handleSequenceComplete = useCallback(() => setIsLoaded(true), []);

    useGSAP(() => {
        if (!isLoaded || !containerRef.current || !pomegranateRef.current) return;

        // 1. Main ScrollTrigger Timeline for the Section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // 3 screens of scrolling for the sequence
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            }
        });

        // 2. Particle creation & floating logic
        const particlesContainer = particlesContainerRef.current;
        if (particlesContainer) {
            // Create 50 particles, with a bias towards the bottom right
            for (let i = 0; i < 50; i++) {
                const p = document.createElement('div');
                p.className = 'absolute w-1.5 h-1.5 rounded-full bg-vitality-green blur-[1px] opacity-0 mix-blend-screen';

                // Bias towards the right side (70% chance to spawn on the right half)
                const isRightBiased = Math.random() > 0.3;
                const startX = isRightBiased
                    ? (window.innerWidth * 0.5) + (Math.random() * (window.innerWidth * 0.5))
                    : Math.random() * window.innerWidth;

                // Start slightly below the screen
                const startY = window.innerHeight + (Math.random() * 300);

                gsap.set(p, { x: startX, y: startY });
                particlesContainer.appendChild(p);

                // Animate them floating up, drifting left, and changing color
                // Tied to the main scroll timeline `tl`
                tl.to(p, {
                    y: startY - window.innerHeight - (Math.random() * 500) - 200, // Move past the screen
                    x: startX - (Math.random() * 400),
                    opacity: Math.random() * 0.8 + 0.2, // Random max opacity
                    backgroundColor: '#ba1c1c', // Change from green to ruby-red
                    ease: "power1.out",
                }, 0); // The '0' joins it to the start of the timeline
            }
        }
        // 3. Cinematic Image Sequence playback with "Slow-Mo Trick"
        // Total frames = 91 (index 0 to 90)
        // Let's assume the "cracking open" burst happens around frame 40-50.
        // To create a slow-mo effect, we map timeline progress to frame progress non-linearly.
        const sequenceObj = { progress: 0 };

        tl.to(sequenceObj, {
            progress: 1,
            ease: "power1.inOut", // Custom easing curve to create the slow mo
            duration: 1, // Timeline abstract duration
            onUpdate: () => {
                // Apply a custom curve to the progress to fake slow-mo during the burst
                // Normal speed 0-0.4, slows down 0.4-0.6, normal speed 0.6-1.0
                let t = sequenceObj.progress;

                // Cinematic curve mapping (Bezier approximation)
                // We slow down the growth of 'p' around t=0.5
                let mappedProgress;
                if (t < 0.3) {
                    mappedProgress = t * 1.33; // fast start (0 to 0.4)
                } else if (t < 0.7) {
                    // SLOW MO PHASE (Delta of 0.4 't' only produces 0.2 'mappedProgress')
                    mappedProgress = 0.4 + ((t - 0.3) * 0.5);
                } else {
                    // Catch up phase
                    mappedProgress = 0.6 + ((t - 0.7) * 1.33);
                }

                sequenceRef.current?.setProgress(mappedProgress);
            }
        }, 0);

        // 4. Parallax & 3D Tilt on the Pomegranate itself
        // It starts slightly rotated away and smaller, then scales into frame
        gsap.set(pomegranateRef.current, { scale: 0.8, rotationY: -15, rotationX: 5 });
        tl.to(pomegranateRef.current, {
            scale: 1.1,
            rotationY: 0,
            rotationX: 0,
            duration: 0.7, // Reaches full scale before the end of scroll
            ease: "power2.out"
        }, 0);

        // 5. Text & Card Reveal (Staggered)
        // Initial state
        gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 50 });
        gsap.set([card1Ref.current, card2Ref.current, card3Ref.current], {
            opacity: 0,
            y: 100,
            rotationX: "random(-140, 140)",
            rotationY: "random(-140, 140)",
            rotationZ: "random(-30, 30)",
            scale: 0.5,
            transformPerspective: 1200
        });

        // Fade in title and subtitle somewhat early in the timeline
        tl.to([titleRef.current, subtitleRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: "power3.out"
        }, 0.1);

        // Fade in cards staggered as the fruit opens (around 0.3 progress)
        tl.to([card1Ref.current, card2Ref.current, card3Ref.current], {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
            duration: 0.4,
            stagger: {
                each: 0.08,
                from: "random" // Randomly reveal them
            },
            ease: "back.out(1.2)" // Premium elastic feel
        }, 0.25);

        // Cleanup particles on unmount
        return () => {
            if (particlesContainer) particlesContainer.innerHTML = '';
        };

    }, { scope: containerRef, dependencies: [isLoaded] });

    return (
        <section ref={containerRef} className="relative min-h-[150vh] w-full bg-black overflow-hidden">
            {/* Background - Plain Black */}
            <div className="absolute inset-0 z-0 bg-black" />

            {/* Particles Transition Container from Section 2 */}
            <div ref={particlesContainerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden" />

            {/* Pinned Viewport Content Container */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-center max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 pt-[80px]">

                {/* LEFT SIDE - 3D Pomegranate & Cinematics */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center z-20">
                    {/* Soft diagonal light beam */}
                    <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-white/5 via-transparent to-transparent -rotate-12 pointer-events-none mix-blend-screen" />

                    <div
                        ref={pomegranateRef}
                        className="relative w-full h-full flex items-center justify-center transform perspective-[1000px]"
                    >
                        <ImageSequence
                            ref={sequenceRef}
                            frameCount={91}
                            baseUrl="/animations/food_promo"
                            onComplete={handleSequenceComplete}
                            fit="none"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE - Content & Glass Cards */}
                <div ref={contentRef} className="relative w-full md:w-1/2 h-auto md:h-full flex flex-col justify-center z-30 pt-8 md:pt-0 pb-16 md:pb-0 pl-0 md:pl-12 lg:pl-24">

                    <div className="mb-10 md:mb-16">
                        <h2
                            ref={titleRef}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-jakarta leading-tight mb-4 text-white"
                        >
                            Nature's <br className="hidden md:block" />
                            <span className="text-ruby-red cinematic-text drop-shadow-[0_0_15px_rgba(186,28,28,0.4)]">Power Foods</span>
                        </h2>
                        <p
                            ref={subtitleRef}
                            className="text-white/80 font-inter text-lg md:text-xl max-w-md leading-relaxed"
                        >
                            Fuel your body with nutrient-dense foods that support energy, immunity, and long-term health.
                        </p>
                    </div>

                    {/* Staggered Feature Cards Container */}
                    <div className="flex flex-col gap-5 md:gap-6 w-full max-w-[480px]">
                        <div ref={card1Ref}>
                            <FeatureCard
                                title="Antioxidant Rich"
                                desc="Foods like pomegranate contain powerful polyphenols that protect cells."
                            />
                        </div>
                        <div ref={card2Ref}>
                            <FeatureCard
                                title="Nutrient Density"
                                desc="Whole foods provide essential vitamins, minerals, and fiber."
                            />
                        </div>
                        <div ref={card3Ref}>
                            <FeatureCard
                                title="Heart Support"
                                desc="Natural foods support cardiovascular health and circulation."
                            />
                        </div>
                    </div>

                </div>

            </div>

            {/* Loading Cover while images load */}
            <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        </section>
    );
}
