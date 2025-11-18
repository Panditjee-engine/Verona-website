// import { useEffect, useState } from 'react';
// import { useAuth } from "@/_core/hooks/useAuth";

// import JewelryScene from '@/components/JewelryScene';
// import CircularJewelryScene from '@/components/CircularJewelryScene';
// import SpiralJewelryScene from '@/components/SpiralJewelryScene';
// import FloatingJewelryScene from '@/components/FloatingJewelryScene';

// export default function Home() {
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const { user, isAuthenticated } = useAuth();
//   const [activeSection, setActiveSection] = useState(0);


//   useEffect(() => {
//     const handleScroll = () => {
//       const max = document.documentElement.scrollHeight - window.innerHeight;
//       const progress = window.scrollY / max;
//       setScrollProgress(progress);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const sectionElements = document.querySelectorAll("[data-section]");

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const target = entry.target as HTMLElement; // <-- FIX HERE

//           if (entry.isIntersecting) {
//             setActiveSection(Number(target.dataset.section));
//           }
//         });
//       },
//       { threshold: 0.6 }
//     );

//     sectionElements.forEach((el) =>
//       observer.observe(el as HTMLElement) // <-- or here
//     );

//     return () => observer.disconnect();
//   }, []);



//   return (
//     <div className="bg-red-600 text-white min-h-screen scroll-smooth">

//       {/* GLOBAL FIXED BACKGROUND SCENE */}
//       <JewelryScene onScroll={setScrollProgress} />

//       {/* CONTENT OVERLAY */}
//       <div className="relative z-10 pointer-events-none">

//         {/* HERO SECTION */}
//         <section className="h-screen flex items-center justify-center text-center px-4">
//           <div className="max-w-2xl">
//             <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-6">
//               VERONA
//             </h1>
//             <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
//               Where Digital Artistry Meets Haute Joaillerie
//             </p>
//             <p className="text-sm text-gray-400 tracking-widest">
//               SCROLL TO EXPLORE
//             </p>
//           </div>
//         </section>

//         {/* SECTION 1 — CIRCULAR JEWELRY SCENE */}
//         <section data-section="1" className="h-screen flex items-center justify-start px-8 md:px-16 relative">
//           {/* <div className="absolute inset-0 pointer-events-none">
//             {activeSection === 1 && (
//               <JewelryScene scroll={scrollProgress} />
//             )}
//           </div> */}

//           <div className="max-w-xl ml-auto">
//             <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
//               The Signature Ring
//             </h2>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Crafted from ethically sourced gold and adorned with a hand-selected diamond,
//               each piece is a masterpiece of precision and artistry. Our signature ring
//               represents the perfect balance between timeless elegance and contemporary design.
//             </p>
//             <div className="text-sm text-gray-400 space-y-2">
//               <p>18K Gold • Certified Diamond • Handcrafted</p>
//               <p className="text-gray-500">Starting at $8,500</p>
//             </div>
//           </div>
//         </section>

//         {/* SECTION 2 — SPIRAL JEWELRY SCENE */}
//         <section data-section="3" className="h-screen flex items-center justify-end px-8 md:px-16 relative">
//            {/* <div className="absolute inset-0 pointer-events-none">
//             {activeSection === 1 && (
//               <CircularJewelryScene scroll={scrollProgress} />
//             )}
//           </div> */}

//           <div className="max-w-xl">
//             <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
//               Bespoke Customization
//             </h2>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Every piece in our collection can be customized to reflect your unique vision.
//               From metal selection to stone specifications, our master jewelers work with you
//               to create a truly one-of-a-kind treasure.
//             </p>
//             <div className="text-sm text-gray-400">
//               <p>Unlimited Customization • Expert Consultation • Lifetime Care</p>
//             </div>
//           </div>
//         </section>

//         {/* SECTION 3 — FLOATING JEWELRY SCENE */}
//         <section data-section="4" className="h-screen flex items-center justify-center px-8 md:px-16 relative">
//            {/* <div className="absolute inset-0 pointer-events-none">
//             {activeSection === 1 && (
//               <FloatingJewelryScene scroll={scrollProgress} />
//             )}
//           </div> */}

//           <div className="max-w-2xl text-center">
//             <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
//               Our Philosophy
//             </h2>
//             <p className="text-gray-300 mb-6 leading-relaxed text-lg">
//               We believe that luxury is not just about the product—it's about the experience.
//               By combining cutting-edge digital innovation with traditional craftsmanship,
//               we create a world-class brand that sets a new standard in fine jewelry.
//             </p>
//             <p className="text-gray-400 text-sm">
//               Every diamond tells a story. Every piece is a promise.
//             </p>
//           </div>
//         </section>

//         {/* FOOTER */}
//         <section data-section="5" className="h-screen flex items-center justify-center px-4">
//           <div className="text-center">
//             <h3 className="text-3xl md:text-4xl font-light tracking-wider mb-6">
//               LUMINESCENCE
//             </h3>
//             <p className="text-gray-400 mb-8">The Future of Fine Jewelry</p>

//             <div className="flex justify-center gap-8 text-sm text-gray-500">
//               <a href="#" className="hover:text-white transition">Contact</a>
//               <a href="#" className="hover:text-white transition">About</a>
//               <a href="#" className="hover:text-white transition">Sustainability</a>
//             </div>

//             <p className="text-gray-600 text-xs mt-12">
//               © 2024 Luminescence. All rights reserved.
//             </p>
//           </div>
//         </section>
//       </div>

//       {/* SCROLL PROGRESS INDICATOR */}
//       <div className="fixed bottom-8 right-8 z-20 pointer-events-auto">
//         <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center">
//           <div className="text-xs text-gray-400">
//             {Math.round(scrollProgress * 100)}%
//           </div>
//         </div>
//       </div>

//       {/* AUTH STATUS (DEBUG) */}
//       {isAuthenticated && user && (
//         <div className="fixed top-4 right-4 z-20 text-xs text-gray-400 pointer-events-auto">
//           Logged in as {user.name}
//         </div>
//       )}
//     </div>
//   );
// }



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
    <div className="bg-black text-white min-h-screen scroll-smooth">

      {/* FIXED BACKGROUND CONTAINER - All scenes rendered with opacity transitions */}
      <div className="fixed inset-0 z-0">
        {/* Scene 0 - Hero */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: activeSection === 0 ? 1 : 0,
            pointerEvents: activeSection === 0 ? 'auto' : 'none'
          }}
        >
          <JewelryScene 
            modelPath="/diamond-glb.glb" 
            envPath="/venice.hdr"
          />
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
          <SpreadingJewelryScene />
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
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-6">
              VERONA
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
              Where Digital Artistry Meets Haute Joaillerie
            </p>
            <p className="text-sm text-gray-400 tracking-widest">
              SCROLL TO EXPLORE
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------
            SECTION 1 — CIRCULAR SCENE
        -------------------------------------------------------- */}
        <section
          data-section="1"
          className="h-screen flex items-center justify-end px-8 md:px-16"
        >
          <div className="max-w-xl bg-black/40 p-8 rounded-lg border border-white/10">
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
          <div className="max-w-xl bg-black/40 p-8 rounded-lg border border-white/10">
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
          <div className="max-w-2xl text-center bg-black/40 p-8 rounded-lg border border-white/10">
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
          <div className="text-center">
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
          </div>
        </section>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-auto">
        <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center backdrop-blur-sm bg-black/30">
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
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === i 
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
