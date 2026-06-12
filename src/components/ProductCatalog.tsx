/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { 
  Sparkles, 
  SlidersHorizontal, 
  HelpCircle, 
  Flame, 
  BadgePercent, 
  AlertTriangle,
  ChevronDown,
  Star
} from "lucide-react";

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onProductClick: (product: Product) => void;
  searchTerm: string;
}

export default function ProductCatalog({ 
  products, 
  selectedCategory, 
  onProductClick,
  searchTerm 
}: ProductCatalogProps) {
  
  // Advanced filter states
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  // Static options for filters
  const gemstonesList = ["Emerald", "Sapphire", "Diamond", "Quartz", "Turquoise", "Amethyst"];
  const materialsList = ["925 Sterling Silver", "18k Gold Plating", "14k Rose Gold Plating"];
  const colorsList = ["Green", "Blue", "Silver", "Pink", "Teal", "Purple"];
  const occasionsList = ["Wedding", "Anniversary", "Everyday", "Casual Luxury", "Gala"];

  // Trending searches terms
  const trendingSearches = [
    { label: "18k Engagement Gold", term: "emerald gold ring" },
    { label: "Eco Ceylon Sapphires", term: "sapphire necklace" },
    { label: "Raw Brutalist Handcuffs", term: "interstellar cuff" },
    { label: "Turquoise barefoot", term: "turquoise anklet" }
  ];

  // Toggle helpers
  const handleGemstoneToggle = (gem: string) => {
    setSelectedGemstones(prev => 
      prev.includes(gem) ? prev.filter(g => g !== gem) : [...prev, gem]
    );
  };

  const handleMaterialToggle = (mat: string) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedGemstones([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMaxPrice(400);
    setMinRating(0);
    setSelectedOccasion("");
  };

  // Memoized filter and search application
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // 1. Category check
      if (selectedCategory !== "all" && prod.category !== selectedCategory) {
        return false;
      }

      // 2. Search Text query check
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesGem = prod.gemstone?.toLowerCase().includes(query) || false;
        const matchesMaterials = prod.materials.some(m => m.toLowerCase().includes(query));
        const matchesArtis = prod.artisan.name.toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesGem && !matchesMaterials && !matchesArtis) {
          return false;
        }
      }

      // 3. Price limit check
      if (prod.price > maxPrice) {
        return false;
      }

      // 4. Rating standards check
      if (prod.ratingsAvg < minRating) {
        return false;
      }

      // 5. Gemstones checklist check
      if (selectedGemstones.length > 0 && (!prod.gemstone || !selectedGemstones.includes(prod.gemstone))) {
        return false;
      }

      // 6. Materials checklist check
      if (selectedMaterials.length > 0) {
        const matchesAnyMaterial = prod.materials.some(m => selectedMaterials.includes(m));
        if (!matchesAnyMaterial) return false;
      }

      // 7. Colors checklist check
      if (selectedColors.length > 0 && (!prod.color || !selectedColors.includes(prod.color))) {
        return false;
      }

      // 8. Occasions specific check
      if (selectedOccasion && (!prod.occasion || !prod.occasion.includes(selectedOccasion))) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchTerm, selectedGemstones, selectedMaterials, selectedColors, maxPrice, minRating, selectedOccasion]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="catalog-section">
      
      {/* Search Header Banner */}
      {searchTerm && (
        <div className="mb-6 bg-[#F5F2ED] p-5 border border-[#E5E1D8] rounded-xs text-left flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono text-[#C5A059] tracking-[0.2em] font-bold">SEARCH RESULTS FOR</p>
            <p className="text-xl font-serif italic text-luxury-charcoal font-light">"{searchTerm}"</p>
          </div>
          <span className="text-[10px] bg-[#1A1A1A] text-[#C5A059] py-1.5 px-4 rounded-xs font-mono font-bold tracking-widest uppercase">
            {filteredProducts.length} DESIGNS FOUND
          </span>
        </div>
      )}

      {/* Trending Search Shortcuts */}
      <div className="mb-8 flex gap-3 items-center flex-wrap" id="trending-shortcuts">
        <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#C5A059] flex items-center gap-1 uppercase">
          <Flame className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          TRENDING SEARCHES:
        </span>
        {trendingSearches.map((obj, i) => (
          <button
            key={i}
            className="text-[10px] bg-[#FDFBF7] text-gray-700 border border-[#E5E1D8] px-3.5 py-1.5 hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#F5F2ED] rounded-xs transition-all cursor-pointer font-sans tracking-wide uppercase font-medium"
            // we will simulate search change clicking
            onClick={() => {
              const searchInput = document.querySelector('input[placeholder*="Seeking rare"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.value = obj.term;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
          >
            {obj.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Trigger & Count */}
      <div className="mb-6 flex justify-between items-center border-b border-[#E5E1D8] pb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E1D8] hover:border-[#C5A059] bg-[#FDFBF7] hover:bg-[#F5F2ED] text-[10px] font-mono tracking-[0.25em] text-[#1A1A1A] transition-all rounded-xs font-bold uppercase"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          {showFilters ? "HIDE ADVANCED FILTERS" : "SHOW ADVANCED FILTERS"}
        </button>

        <p className="text-xs font-mono text-gray-500">
          Showing <span className="font-bold text-luxury-charcoal">{filteredProducts.length}</span> of {products.length} unique treasures
        </p>
      </div>

      {/* Advanced Filters Panel (Collapsible Drawer style) */}
      {showFilters && (
        <div className="mb-8 bg-[#FDFBF7] border border-[#E5E1D8] p-6 rounded-xs shadow-lg text-left gap-6 grid grid-cols-1 md:grid-cols-4 luxury-glow transition-all" id="filters-panel">
          
          {/* Column 1: Prices & Rating */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#1A1A1A] tracking-widest mb-2 uppercase">
                MAX PRICE: <span className="text-[#C5A059] font-serif font-bold text-xs">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C5A059] h-[3px] bg-[#E5E1D8] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                <span>$50</span>
                <span>$400</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-[#1A1A1A] tracking-wider mb-2 uppercase">
                MIN RATING:
              </label>
              <div className="flex gap-1.5">
                {[0, 3, 4, 4.5, 4.8].map((ratObj) => (
                  <button
                    key={ratObj}
                    onClick={() => setMinRating(ratObj)}
                    className={`text-[10px] py-1 px-2.5 border rounded-xs font-mono transition-all ${minRating === ratObj ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A]' : 'bg-[#FDFBF7] hover:bg-[#F5F2ED] text-gray-500 border-[#E5E1D8]'}`}
                  >
                    {ratObj === 0 ? "All" : `${ratObj}★+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Materials Checkboxes */}
          <div>
            <span className="block text-[10px] font-mono font-bold text-[#1A1A1A] tracking-wider mb-2.5 uppercase">METALLIC ORE BASE:</span>
            <div className="space-y-1.5">
              {materialsList.map((mat) => {
                const isChecked = selectedMaterials.includes(mat);
                return (
                  <label key={mat} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-[#C5A059]">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMaterialToggle(mat)}
                      className="accent-[#C5A059] w-3.5 h-3.5 rounded-none border-[#E5E1D8]"
                    />
                    <span className="text-[11px] font-light text-gray-700">{mat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Column 3: Precious Gemstones */}
          <div>
            <span className="block text-[10px] font-mono font-bold text-[#1A1A1A] tracking-wider mb-2.5 uppercase">GEMSTONE INDUCTION:</span>
            <div className="space-y-1.5">
              {gemstonesList.map((gem) => {
                const isChecked = selectedGemstones.includes(gem);
                return (
                  <label key={gem} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-[#C5A059]">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleGemstoneToggle(gem)}
                      className="accent-[#C5A059] w-3.5 h-3.5 rounded-none border-[#E5E1D8]"
                    />
                    <span className="text-[11px] font-light text-gray-700">{gem}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Column 4: Occasions & Clear */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="block text-[10px] font-mono font-bold text-[#1A1A1A] tracking-wider mb-2 uppercase">FOR OCCASION:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full bg-[#F5F2ED] border border-[#E5E1D8] text-xs p-2 rounded-xs focus:ring-1 focus:ring-[#C5A059] focus:outline-none text-gray-700 font-mono"
              >
                <option value="">✨ Any Occasion</option>
                {occasionsList.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <button
              onClick={clearAllFilters}
              className="mt-4 w-full py-2.5 border border-[#E5E1D8] text-gray-600 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] hover:border-[#1A1A1A] rounded-xs text-center font-mono text-[9px] tracking-widest font-bold transition-all cursor-pointer uppercase"
            >
              RESET ALL SELECTION
            </button>
          </div>

        </div>
      )}

      {/* Main Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <p className="text-3xl">🏺</p>
          <h3 className="font-serif text-lg text-[#1A1A1A] font-light">No Artisan Findings Match</h3>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Our silversmiths are constantly sculpting brand new custom jewelry pieces. Please reset filters or search query to find matching luxury ornaments.
          </p>
          <button 
            onClick={clearAllFilters}
            className="bg-[#C5A059] hover:bg-[#A88339] text-[#1A1A1A] font-bold py-2.5 px-6 rounded-xs text-[10px] tracking-widest font-mono uppercase"
          >
            RECLAIM ALL TREASURES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const hasDiscount = prod.originalPrice && prod.originalPrice > prod.price;
            const savingsPercent = hasDiscount ? Math.round(((prod.originalPrice! - prod.price) / prod.originalPrice!) * 100) : 0;
            const isLowStock = prod.stock > 0 && prod.stock <= 4;
            const isOutOfStock = prod.stock === 0;

            return (
              <div 
                key={prod.id}
                onClick={() => onProductClick(prod)}
                className="group bg-[#FDFBF7] border border-[#E5E1D8] rounded-xs overflow-hidden hover:shadow-2xl hover:border-[#C5A059] transition-all duration-500 flex flex-col justify-between cursor-pointer relative text-left"
                id={`product-card-${prod.id}`}
              >
                {/* Image Showcase Container */}
                <div className="relative aspect-square overflow-hidden bg-[#F5F2ED] h-[280px]">
                  
                  {/* Image hovering transitions */}
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />

                  {/* Absolute badgins on image */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {/* Discount badge */}
                    {hasDiscount && (
                      <span className="bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/40 font-mono text-[8px] font-bold px-2 py-1 select-none flex items-center gap-1 uppercase tracking-widest">
                        <BadgePercent className="w-3 h-3" />
                        SAVE {savingsPercent}%
                      </span>
                    )}
                    {/* Featured badge */}
                    {prod.featured && (
                      <span className="bg-[#C5A059] text-[#1A1A1A] font-mono text-[8px] font-bold px-2 py-1 select-none flex items-center gap-1 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 fill-[#1A1A1A]" />
                        PREMIUM PICK
                      </span>
                    )}
                  </div>

                  {/* Inventory Warning Badge on Image */}
                  <div className="absolute bottom-3 right-3 z-20">
                    {isOutOfStock ? (
                      <span className="bg-red-600 text-white font-mono text-[8px] tracking-widest font-bold px-2 py-1 select-none">
                        OUT OF STOCK
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-[#1A1A1A] text-orange-500 border border-orange-500/20 font-mono text-[8px] font-bold px-2 py-1 select-none flex items-center gap-1 uppercase tracking-widest">
                        <AlertTriangle className="w-3 h-3" />
                        ONLY {prod.stock} LEFT
                      </span>
                    ) : null}
                  </div>

                  {/* Elegant Quick View overlay */}
                  <div className="absolute inset-x-0 bottom-0 py-3.5 bg-[#1A1A1A]/95 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center items-center gap-2 text-[#C5A059] text-[10px] font-mono tracking-[0.25em] font-medium">
                    <span>DISCOVER MASTERPIECE</span>
                  </div>

                </div>

                {/* Info and Pricing */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#C5A059] tracking-widest uppercase font-bold">
                      <span>{prod.category} &bull; {prod.weight}</span>
                      <span className="text-[#1A1A1A] font-normal italic opacity-60">by {prod.artisan.name}</span>
                    </div>

                    <h3 className="font-serif text-[17px] font-light leading-snug text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                      {prod.name}
                    </h3>

                    {/* Materials dots preview */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prod.materials.slice(0, 2).map((m, idx) => (
                        <span key={idx} className="bg-[#F5F2ED] text-gray-500 border border-[#E5E1D8]/40 text-[9px] px-2 py-0.5 rounded-none font-mono">
                          {m}
                        </span>
                      ))}
                      {prod.materials.length > 2 && (
                        <span className="text-[9px] text-[#C5A059] px-1 font-mono">+{prod.materials.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E1D8]/30 flex justify-between items-center self-end w-full">
                    
                    {/* Star ratings */}
                    <div className="flex items-center gap-1" title={`${prod.ratingsAvg} average stars`}>
                      <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                      <span className="text-xs font-mono text-[#1A1A1A] font-bold">{prod.ratingsAvg}</span>
                      <span className="text-[10px] text-gray-400">({prod.reviewsCount})</span>
                    </div>

                    {/* Price section */}
                    <div className="text-right">
                      {hasDiscount && (
                        <span className="text-[11px] text-gray-400 line-through mr-1.5 font-mono">
                          $ {prod.originalPrice?.toFixed(2)}
                        </span>
                      )}
                      <span className="font-serif font-medium text-base text-[#1A1A1A]">
                        $ {prod.price.toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
