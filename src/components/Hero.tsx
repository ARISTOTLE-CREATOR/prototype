/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Crown, 
  CircleDot, 
  ChevronRight, 
  ChevronLeft, 
  History, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";

interface HeroProps {
  onCategorySelected: (category: string) => void;
  selectedCategory: string;
}

export default function Hero({ onCategorySelected, selectedCategory }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      collection: "THE WEDDING & BRIDAL HARMONY",
      title: "Sculpted Eternity Sets",
      subtitle: "Hand-finished 18k gold bands & solitaire diamonds custom paired by European master silversmiths.",
      btnText: "EXLORE WEDDING SETS",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=80",
      accent: "NEW ARRIVALS"
    },
    {
      collection: "LIMITED FESTIVAL SPECALS",
      title: "Natural Ceylon Sapphire Dewdrops",
      subtitle: "Vibrant sapphire pendants that mirror the gentle deep blue twilight ocean ripples.",
      btnText: "SEEK DEWDROP COLL",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&auto=format&fit=crop&q=80",
      accent: "SPECIAL EDITION"
    },
    {
      collection: "ANNIVERSARY & HEIRLOOMS",
      title: "Raw Hammered Constellations",
      subtitle: "Bold unisex cuffs highlighting delicate embedded Diamond flakes and organic textures.",
      btnText: "BROWSE BRUTALIST CUFFS",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&auto=format&fit=crop&q=80",
      accent: "ARTISAN EXCLUSIVE"
    }
  ];

  const categories = [
    { id: "all", label: "✨ All Gemstones", icon: "💎" },
    { id: "rings", label: "💍 Rings", icon: "💍" },
    { id: "necklaces", label: "📿 Necklaces", icon: "📿" },
    { id: "earrings", label: "💎 Earrings", icon: "✨" },
    { id: "bracelets", label: "🌟 Bracelets", icon: "⌾" },
    { id: "anklets", label: "🪄 Anklets", icon: "〰" },
    { id: "pendants", label: "👑 Pendants", icon: "👑" },
    { id: "custom", label: "⚒️ Commissions", icon: "⚒️" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-[#FDFBF7] text-[#1A1A1A]" id="hero-section">
      
      {/* Interactive Luxury Banner Slider */}
      <div className="relative overflow-hidden h-[460px] md:h-[500px] bg-[#1A1A1A] text-white">
        
        {/* Current Active Slide Background Image */}
        <div className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out">
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title} 
            className="w-full h-full object-cover opacity-45 transform scale-102 hover:scale-105 transition-transform duration-2000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"></div>
        </div>

        {/* Content Overlays */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded-xs text-[#C5A059] font-mono text-[9px] tracking-[0.25em] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C5A059]" />
              {slides[currentSlide].accent}
            </div>

            <p className="font-mono text-[10px] tracking-[0.25em] text-gray-300 font-medium uppercase">
              {slides[currentSlide].collection}
            </p>

            <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
              {slides[currentSlide].title}
            </h1>

            <p className="text-xs md:text-sm text-gray-300 font-sans max-w-lg leading-relaxed opacity-90">
              {slides[currentSlide].subtitle}
            </p>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => onCategorySelected("all")}
                className="bg-[#C5A059] hover:bg-[#A88339] text-[#1A1A1A] font-sans text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 transition-all shadow-lg"
              >
                {slides[currentSlide].btnText}
              </button>
              <button 
                onClick={() => onCategorySelected("custom")}
                className="bg-transparent border border-white/20 hover:border-[#C5A059] text-white font-sans text-[11px] uppercase tracking-[0.2em] font-medium px-6 py-3.5 transition-all"
              >
                REQUEST DESIGN COMMISSION
              </button>
            </div>

          </div>
        </div>

        {/* Slider Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-25 p-2.5 bg-black/50 hover:bg-[#C5A059] hover:text-black rounded-full text-white transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-25 p-2.5 bg-black/50 hover:bg-[#C5A059] hover:text-black rounded-full text-white transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex gap-2">
          {slides.map((_, idx) => (
            <button
               key={idx}
               onClick={() => setCurrentSlide(idx)}
               className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === idx ? 'bg-[#C5A059] w-5' : 'bg-white/35'}`}
               aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Triple Quality Pillars */}
      <div className="bg-[#FDFBF7] border-b border-[#E5E1D8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div className="flex items-center justify-center gap-4 md:border-r border-[#E5E1D8] last:border-0 py-2">
            <div className="p-3 bg-[#F5F2ED] text-[#C5A059] rounded-full">
              <Crown className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">GENUINE METALS & STONES</h4>
              <p className="text-[11px] text-gray-500">Every piece has certified assay 925 hallmarks.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 md:border-r border-[#E5E1D8] last:border-0 py-2">
            <div className="p-3 bg-[#F5F2ED] text-[#C5A059] rounded-full">
              <History className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">HANDMADE TO ORDER</h4>
              <p className="text-[11px] text-gray-500">Eco-conscious carving avoids factory wastage.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="p-3 bg-[#F5F2ED] text-[#C5A059] rounded-full">
              <HeartHandshake className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="font-serif font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">DEPOSIT INSURANCE</h4>
              <p className="text-[11px] text-gray-500">Full 30-day money-back guarantee with return labels.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Elegant Categories Carousel Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#C5A059] font-bold uppercase block mb-1">DESIGN PALETTE</span>
        <h2 className="font-serif text-3xl font-light tracking-wide text-[#1A1A1A]">
          BROWSE BY PLATINUM GENUS
        </h2>
        <div className="w-8 h-[1px] bg-[#C5A059] mx-auto mt-4 mb-8"></div>

        {/* Category Bubbles Layout */}
        <div className="flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center scrollbar-thin scrollbar-thumb-[#C5A059] scroll-smooth px-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelected(cat.id)}
                className={`flex flex-col items-center shrink-0 min-w-[110px] p-4 rounded-xs transition-all focus:outline-none ${isActive ? 'bg-[#1A1A1A] text-[#C5A059] scale-105 shadow-md border border-[#C5A059]' : 'bg-[#FDFBF7] hover:bg-[#F5F2ED] text-gray-600 border border-[#E5E1D8]'}`}
              >
                <span className="text-2xl mb-2 filter drop-shadow">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap">
                  {cat.label.replace(/💍 |📿 |💎 |✨ |🌟 |🪄 |👑 |⚒️ /g, '')}
                </span>
                {isActive && (
                  <span className="w-1 h-1 bg-[#C5A059] rounded-full mt-1.5 animate-bounce"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
