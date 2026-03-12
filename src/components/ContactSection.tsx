"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Particle Component for subtle background motion
const Particles = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 contact-particles">
            {[...Array(25)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-[#55c58a] rounded-full animate-float-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100 + 100}%`,
                        width: `${Math.random() * 3 + 1.5}px`,
                        height: `${Math.random() * 3 + 1.5}px`,
                        animationDuration: `${Math.random() * 15 + 20}s`,
                        animationDelay: `${Math.random() * 10}s`,
                        '--max-opacity': Math.random() * 0.04 + 0.08,
                    } as any}
                />
            ))}
        </div>
    );
};

export default function ContactSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const [isRipple, setIsRipple] = useState(false);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
            }
        });

        // Entrance animations
        if (cardRef.current && infoRef.current) {
            // Left Card Slide In
            tl.fromTo(cardRef.current, 
                { opacity: 0, x: -60, scale: 0.96, immediateRender: false },
                { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out" },
                0
            );

            // Right Panel Slide In
            tl.fromTo(infoRef.current,
                { opacity: 0, x: 60, scale: 0.96, immediateRender: false },
                { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out" },
                0
            );

            const elements = [
                infoRef.current.querySelector(".info-header h2"),
                infoRef.current.querySelector(".info-header p"),
                ...gsap.utils.toArray(".info-item", infoRef.current)
            ].filter(Boolean);

            if (elements.length > 0) {
                // Stagger sequence for inner items
                tl.fromTo(elements,
                    { opacity: 0, y: 20, immediateRender: false },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" },
                    0.5 // Start after the panels have mostly slid in
                );
            }
        }

        // Footer transition effect (darken background & fade particles)
        // Triggered when scrolling past the section
        gsap.to(containerRef.current, {
            backgroundColor: "#f4f7f5",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "bottom 100%", // Bottom of section hits bottom of viewport
                end: "+=250",
                scrub: true,
            }
        });

        gsap.to(".contact-particles", {
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "bottom 95%",
                end: "+=200",
                scrub: true,
            }
        });

    }, { scope: containerRef });

    const handleButtonClick = () => {
        setIsRipple(true);
        setTimeout(() => setIsRipple(false), 500);
    };

    return (
        <section ref={containerRef} className="relative pt-24 pb-12 px-4 md:px-8 lg:px-16 bg-white flex items-center justify-center overflow-hidden font-inter transition-colors duration-500">
            
            <Particles />

            <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center relative z-10">
                
                {/* LEFT SIDE - CONTACT CARD */}
                <div ref={cardRef} className="max-w-[480px] w-full">
                    <div className="bg-[#3b4148] rounded-[24px] p-6 md:p-8 shadow-2xl relative overflow-hidden group w-full animate-breathe">
                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
                        Contact
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-jakarta">
                        Get In Touch
                    </h2>
                    
                    <p className="text-white/70 text-sm md:text-base mb-6 max-w-[90%] font-light leading-relaxed">
                        Have questions about nutrition, healthy living, or wellness plans? Send us a message and our team will respond shortly.
                    </p>

                    <form className="space-y-4">
                        {[
                            { label: "Name", type: "text" },
                            { label: "Email", type: "email" },
                            { label: "Subject", type: "text" }
                        ].map((field, idx) => (
                            <div key={idx} className="relative group/input pb-1 cursor-text">
                                <label className="block text-white/60 text-sm mb-1 transition-colors duration-300 ease-out group-focus-within/input:text-[#55c58a]">
                                    {field.label}
                                </label>
                                <input 
                                    type={field.type} 
                                    className="w-full bg-transparent border-b border-white/20 py-1 text-white outline-none transition-colors peer"
                                />
                                {/* Expanding animated underline */}
                                <div className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#55c58a] shadow-[0_0_8px_rgba(85,197,138,0.5)] transition-all duration-300 ease-out group-focus-within/input:w-full"></div>
                            </div>
                        ))}

                        <div className="relative group/input pb-1 cursor-text">
                            <label className="block text-white/60 text-sm mb-1 transition-colors duration-300 ease-out group-focus-within/input:text-[#55c58a]">
                                Message
                            </label>
                            <textarea 
                                rows={2}
                                className="w-full bg-transparent border-b border-white/20 py-1 text-white outline-none transition-colors resize-none peer"
                            />
                            <div className="absolute bottom-1 left-0 w-0 h-[1.5px] bg-[#55c58a] shadow-[0_0_8px_rgba(85,197,138,0.5)] transition-all duration-300 ease-out group-focus-within/input:w-full"></div>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleButtonClick}
                            className="relative overflow-hidden w-full py-3 mt-4 rounded-full bg-gradient-to-r from-[#61cc7e] to-[#36a188] hover:from-[#72d48d] hover:to-[#40b89d] text-white font-medium text-sm hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(85,197,138,0.5)] active:scale-[0.98] transition-all duration-300 pointer-events-auto"
                        >
                            <span className="relative z-10">Send Message</span>
                            {/* Ripple Effect */}
                            <span className={`absolute inset-0 bg-white/30 rounded-full scale-0 opacity-0 pointer-events-none transition-transform duration-500 ease-out origin-center ${isRipple ? 'scale-[2.5] opacity-100 transition-none' : ''}`} />
                            {isRipple && (
                                <span className="absolute inset-0 bg-white/20 rounded-full pointer-events-none origin-center animate-ping" />
                            )}
                        </button>
                    </form>
                </div>
                </div>

                {/* RIGHT SIDE - INFO */}
                <div ref={infoRef} className="space-y-12 lg:pl-16">
                    <div className="info-header">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#202428] mb-5 font-jakarta">
                            Wellness Support
                        </h2>
                        <p className="text-[#5a6268] text-[15px] max-w-[400px] leading-relaxed">
                            Our wellness team is here to guide you with nutrition advice, healthy lifestyle support, and personalized wellness recommendations.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Phone */}
                        <div className="info-item flex items-start gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e8f0ea] group-hover:shadow-[0_0_12px_rgba(85,197,138,0.2)] transition-all duration-300">
                                <svg className="w-5 h-5 text-[#515860] group-hover:text-[#55c58a] group-hover:rotate-[5deg] transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#202428] text-sm mb-1 group-hover:text-[#36a188] transition-colors duration-300">Phone</h4>
                                <p className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">___ 77 123 4567</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="info-item flex items-start gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e8f0ea] group-hover:shadow-[0_0_12px_rgba(85,197,138,0.2)] transition-all duration-300">
                                <svg className="w-5 h-5 text-[#515860] group-hover:text-[#55c58a] group-hover:rotate-[5deg] transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#202428] text-sm mb-1 group-hover:text-[#36a188] transition-colors duration-300">Email</h4>
                                <p className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">support@__________.com</p>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="info-item flex items-start gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e8f0ea] group-hover:shadow-[0_0_12px_rgba(85,197,138,0.2)] transition-all duration-300">
                                <svg className="w-5 h-5 text-[#515860] group-hover:text-[#55c58a] group-hover:rotate-[5deg] transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="w-full">
                                <h4 className="font-semibold text-[#202428] text-sm mb-1.5 group-hover:text-[#36a188] transition-colors duration-300">Office Hours</h4>
                                <div className="space-y-1 w-full max-w-[280px]">
                                    <div className="flex justify-between w-full">
                                        <span className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">Monday – Friday</span>
                                        <span className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">8:00 AM – 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <span className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">Saturday</span>
                                        <span className="text-[#5a6268] text-sm transition-colors duration-300 group-hover:text-[#6a7278]">9:00 AM – 2:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
