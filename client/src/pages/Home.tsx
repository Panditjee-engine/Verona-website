import { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import JewelryScene from '@/components/JewelryScene';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 3D Scene - Fixed Background */}
      <JewelryScene onScroll={setScrollProgress} />

      {/* Content Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-6">
              LUMINESCENCE
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">
              Where Digital Artistry Meets Haute Joaillerie
            </p>
            <p className="text-sm text-gray-400 tracking-widest">
              SCROLL TO EXPLORE
            </p>
          </div>
        </section>

        {/* Product Section 1 */}
        <section className="h-screen flex items-center justify-start px-8 md:px-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
              The Signature Ring
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Crafted from ethically sourced gold and adorned with a hand-selected diamond, 
              each piece is a masterpiece of precision and artistry. Our signature ring 
              represents the perfect balance between timeless elegance and contemporary design.
            </p>
            <div className="text-sm text-gray-400 space-y-2">
              <p>18K Gold • Certified Diamond • Handcrafted</p>
              <p className="text-gray-500">Starting at $8,500</p>
            </div>
          </div>
        </section>

        {/* Product Section 2 */}
        <section className="h-screen flex items-center justify-end px-8 md:px-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
              Bespoke Customization
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Every piece in our collection can be customized to reflect your unique vision. 
              From metal selection to stone specifications, our master jewelers work with you 
              to create a truly one-of-a-kind treasure.
            </p>
            <div className="text-sm text-gray-400">
              <p>Unlimited Customization • Expert Consultation • Lifetime Care</p>
            </div>
          </div>
        </section>

        {/* Product Section 3 */}
        <section className="h-screen flex items-center justify-center px-8 md:px-16">
          <div className="max-w-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
              Our Philosophy
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              We believe that luxury is not just about the product—it's about the experience. 
              By combining cutting-edge digital innovation with traditional craftsmanship, 
              we create a world-class brand that sets a new standard in fine jewelry.
            </p>
            <p className="text-gray-400 text-sm">
              Every diamond tells a story. Every piece is a promise.
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-light tracking-wider mb-6">
              LUMINESCENCE
            </h3>
            <p className="text-gray-400 mb-8">
              The Future of Fine Jewelry
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
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

      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-auto">
        <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center">
          <div className="text-xs text-gray-400">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>
      </div>

      {/* Auth Status (Debug) */}
      {isAuthenticated && user && (
        <div className="fixed top-4 right-4 z-20 text-xs text-gray-400 pointer-events-auto">
          Logged in as {user.name}
        </div>
      )}
    </div>
  );
}
