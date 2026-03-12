"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!footerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%", // Trigger when footer enters
                toggleActions: "play none none reverse",
            }
        });

        // Horizontal gradient line animation
        tl.fromTo(lineRef.current,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out", transformOrigin: "center" }
        );

        // Footer content fade in and move up
        if (contentRef.current) {
            tl.fromTo(contentRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.5"
            );
        }

    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="relative bg-[#f4f7f5] pt-12 pb-8 overflow-hidden font-inter">
            {/* Soft horizontal gradient line briefly above footer */}
            <div 
                ref={lineRef} 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#55c58a]/40 to-transparent"
            />

            <div ref={contentRef} className="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-2xl font-bold text-[#202428] font-jakarta mb-2">
                        Vitality
                    </h2>
                    <p className="text-[#5a6268] text-sm text-center md:text-left max-w-[250px]">
                        Empowering your journey to a healthier, more vibrant life through science and nature.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <h3 className="font-semibold text-[#202428] text-sm mb-1">Company</h3>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">About Us</a>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">Careers</a>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">Contact</a>
                    </div>
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <h3 className="font-semibold text-[#202428] text-sm mb-1">Resources</h3>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">Blog</a>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">Wellness Guide</a>
                        <a href="#" className="text-[#5a6268] text-sm hover:text-[#55c58a] transition-colors duration-300">FAQs</a>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                    <h3 className="font-semibold text-[#202428] text-sm">Follow Us</h3>
                    <div className="flex gap-4">
                        {[1, 2, 3].map((icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#5a6268] hover:text-[#55c58a] hover:shadow-[0_0_12px_rgba(85,197,138,0.2)] hover:scale-105 transition-all duration-300"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-[#5a6268]/60 text-xs font-light">
                © {new Date().getFullYear()} Vitality Wellness. All rights reserved.
            </div>
        </footer>
    );
}
