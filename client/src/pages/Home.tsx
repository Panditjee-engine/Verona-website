
"use client";

import { useState, useEffect } from "react";

// Mock auth hook for demo
const useAuth = () => ({
  user: null,
  isAuthenticated: false
});

//Import your actual scene components
import JewelryScene from "@/components/JewelryScene";
import CircularJewelryScene from "@/components/CircularJewelryScene";
import SpiralJewelryScene from "@/components/SpiralJewelryScene";
import FloatingJewelryScene from "@/components/FloatingJewelryScene";
import SpreadingJewelryScene from "@/components/SpreadingJewelryScene";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import MergedJewelryScene from "@/components/MergedJewelryScene";



export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const { user, isAuthenticated } = useAuth();

  /* -------------------------------------------------------
    SCROLL PROGRESS HANDLER
  -------------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / max;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------------------------------------------
    SECTION IN-VIEW DETECTION
  -------------------------------------------------------- */
  useEffect(() => {
    const sectionElements = document.querySelectorAll("[data-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = Number((entry.target as HTMLElement).dataset.section);
            setActiveSection(sectionIndex);
          }
        });
      },
      { threshold: 0.5 } // 50% visible triggers scene switch
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-white min-h-screen scroll-smooth">

      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between backdrop-blur-md bg-black/20 border border-white/10 rounded-full px-8 py-4">
            {/* Logo */}
            <div className="text-2xl font-light tracking-widest">
              VERONA
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm tracking-wider">
              <a href="#home" className="hover:text-gray-300 transition-colors duration-300">
                HOME
              </a>
              <a href="#about" className="hover:text-gray-300 transition-colors duration-300">
                ABOUT
              </a>
              <a href="#shop" className="hover:text-gray-300 transition-colors duration-300">
                SHOP
              </a>
              <a href="#contact" className="hover:text-gray-300 transition-colors duration-300">
                CONTACT
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* PASTE THE BACKGROUND IMAGE CODE HERE 👇 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/background-theme.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

      </div>

      {/* FIXED BACKGROUND CONTAINER - All scenes rendered with opacity transitions */}
      <div className="fixed inset-0 z-10">
        {/* Scene 0 - Hero */}
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 0 ? 1 : 0,
            pointerEvents: activeSection === 0 ? 'auto' : 'none',
          }}
        >
          {/* <MergedJewelryScene
            mainModelPath="/VERONA.glb"
            floatingModels={["/2.glb", "/3.glb", "/4.glb", "/5.glb", "/6.glb", "/7.glb"]}
            envPath="/venice.hdr"
            floatingCount={6}
          /> */}

          <div style={{width: "100%", height: "100%" }}>
            <JewelryScene />
          </div>

        </div>

        {/* Scene 1 - Circular */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 1 ? 1 : 0,
            pointerEvents: activeSection === 1 ? 'auto' : 'none'
          }}
        >
          <CircularJewelryScene />
        </div>

        {/* Scene 2 - Spiral */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 2 ? 1 : 0,
            pointerEvents: activeSection === 2 ? 'auto' : 'none'
          }}
        >
          <SpiralJewelryScene />
        </div>

        {/* Scene 3 - Floating */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 3 ? 1 : 0,
            pointerEvents: activeSection === 3 ? 'auto' : 'none'
          }}
        >
          {/* <SpreadingJewelryScene /> */}
        </div>

        {/* Scene 3 - Floating */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeSection === 4 ? 1 : 0,
            pointerEvents: activeSection === 4 ? 'auto' : 'none'
          }}
        >
          <JewelryScene />
        </div>
      </div>

      {/* CONTENT OVERLAY */}
      <div className="relative z-10 pointer-events-none">

        {/* HERO SECTION */}
        <section
          data-section="0"
          className="h-screen flex items-center justify-center text-center px-4"
        >
          {/* <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-6">
              VERONA
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
              Where Digital Artistry Meets Haute Joaillerie
            </p>
            <p className="text-sm text-gray-400 tracking-widest">
              SCROLL TO EXPLORE
            </p>
          </div> */}
        </section>

        {/* -------------------------------------------------------
            SECTION 1 — CIRCULAR SCENE
        -------------------------------------------------------- */}
         <section
          data-section="1"
          className="h-screen flex items-center justify-end px-8 md:px-16"
        >
          <div className="max-w-xl p-8 rounded-lg border border-white/10">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
              The Signature Ring
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Crafted from ethically sourced gold and adorned with a
              hand-selected diamond, each piece is a masterpiece of precision.
            </p>
            <div className="text-sm text-gray-400 space-y-2">
              <p>18K Gold • Certified Diamond • Handcrafted</p>
              <p className="text-gray-500">Starting at $8,500</p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------
            SECTION 2 — SPIRAL SCENE
        -------------------------------------------------------- */}
        <section
          data-section="2"
          className="h-screen flex items-center justify-start px-8 md:px-16"
        >
          <div className="max-w-xl p-8 rounded-lg border border-white/10">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
              Bespoke Customization
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Customize your piece from metal selection to stone specifications,
              working directly with master jewelers.
            </p>
            <div className="text-sm text-gray-400">
              <p>Unlimited Customization • Expert Consultation • Lifetime Care</p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------
            SECTION 3 — FLOATING SCENE
        -------------------------------------------------------- */}
        <section
          data-section="3"
          className="h-screen flex items-center justify-center px-8 md:px-16"
        >
          <div className="max-w-2xl text-center p-8 rounded-lg border border-white/10">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
              Our Philosophy
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Luxury is an experience. By merging digital innovation with
              traditional craftsmanship, we redefine haute joaillerie.
            </p>
            <p className="text-gray-400 text-sm">
              Every diamond tells a story. Every piece is a promise.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <section data-section="4" className="h-screen flex items-center justify-center px-4">
          {/* <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-light tracking-wider mb-6">
              LUMINESCENCE
            </h3>
            <p className="text-gray-400 mb-8">
              The Future of Fine Jewelry
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500 pointer-events-auto">
              <a href="#" className="hover:text-white transition">Contact</a>
              <a href="#" className="hover:text-white transition">About</a>
              <a href="#" className="hover:text-white transition">Sustainability</a>
            </div>
            <p className="text-gray-600 text-xs mt-12">
              © 2024 Luminescence. All rights reserved.
            </p>
          </div> */}
        </section>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-auto">
        <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center backdrop-blur-sm">
          <div className="text-xs text-gray-400">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>
      </div>

      {/* SECTION INDICATOR DOTS */}
      <div className="fixed bottom-8 left-8 z-20 flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === i
              ? 'bg-white scale-150 shadow-lg shadow-white/50'
              : 'bg-gray-600 hover:bg-gray-400'
              }`}
          ></div>
        ))}
      </div>

      {/* AUTH STATUS */}
      {isAuthenticated && user && (
        <div className="fixed top-4 right-4 z-20 text-xs text-gray-400 pointer-events-auto">

        </div>
      )}
    </div>
  );
}



