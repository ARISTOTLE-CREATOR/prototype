/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Product, Review, CartItem } from "../types";
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  RotateCcw, 
  Play, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Calendar,
  AlertCircle,
  Truck,
  MessageSquare
} from "lucide-react";
import { mockDefaultReviews } from "../mockData";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onAddToWishlist: (product: Product) => void;
  onContactArtisanClick: (artisanName: string, productContext: Product) => void;
  allProducts: Product[]; // for recommended list
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onContactArtisanClick,
  allProducts
}: ProductDetailModalProps) {
  
  // Interactive states
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [is360Active, setIs360Active] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0); // for simulating dragging to rotate
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [itemQty, setItemQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // AI recommendations from server
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Reviews list state
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewPhoto, setNewReviewPhoto] = useState<string | null>(null);

  // Load reviews on design mounting
  useEffect(() => {
    // combine defaults with custom product reviews if any
    setReviewsList([...mockDefaultReviews, ...(product.reviews || [])]);
  }, [product]);

  // Load elegant server-side gemstone style coordinating recommendation via OpenAI/Gemini proxy
  useEffect(() => {
    setAiLoading(true);
    fetch("/api/ai-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedProduct: {
          name: product.name,
          category: product.category,
          materials: product.materials,
          gemstone: product.gemstone,
          price: product.price
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        setAiAnalysis(data.recommendationText);
        setAiLoading(false);
      })
      .catch(err => {
        console.error("Failed to load matching recommendation:", err);
        setAiAnalysis(`Coordinating Styling: Because this matches ${product.materials.join(" & ")}, we recommend choosing matching earrings in similar golden accents.`);
        setAiLoading(false);
      });
  }, [product]);

  // Simulated 360 Mouse Drag rotation
  const handleDragRotate = (e: React.MouseEvent) => {
    if (!is360Active) return;
    // rotate degrees based on cursor position
    const offset = e.clientX % 3;
    setActiveImgIdx((prev) => (prev + offset) % product.images.length);
  };

  // Submit handcrafted review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      alert("Please fully supply your review feedback name and summary.");
      return;
    }

    const brandReview: Review = {
      id: "rev_" + Date.now(),
      userId: "user_cur",
      userName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
      date: "Today",
      verified: true,
      images: newReviewPhoto ? [newReviewPhoto] : undefined
    };

    setReviewsList([brandReview, ...reviewsList]);
    alert("Heartfelt review added! Verified Buyer stamp generated.");
    setNewReviewAuthor("");
    setNewReviewComment("");
    setNewReviewPhoto(null);
  };

  const handleSimulatedPhotoUpload = () => {
    // Pick an elegant jewelry photograph from Unsplash to mock upload
    const photos = [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop"
    ];
    const picked = photos[Math.floor(Math.random() * photos.length)];
    setNewReviewPhoto(picked);
    alert("Image successfully compressed for decentral database uploading!");
  };

  // Precomputed price tax numbers
  const calculatedTax = product.price * 0.0825; // 8.25% mock premium tax
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Filter similar items dynamically
  const matchingAddons = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.gemstone === product.gemstone))
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto flex justify-center items-start p-4 md:p-10">
      <div className="relative w-full max-w-5xl bg-white border border-gray-100 rounded shadow-2xl flex flex-col md:flex-row text-left overflow-hidden luxury-glow my-auto" id="product-modal">
        
        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-40 bg-white/80 p-2 text-gray-500 rounded-full border border-gray-200 hover:bg-gold-500 hover:text-luxury-charcoal transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Media Center (Multi-angle view, Drag-to-rotate 360, Video player) */}
        <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-100 p-6 flex flex-col justify-between space-y-4">
          
          <div className="relative h-[340px] bg-white rounded border border-gray-100 overflow-hidden flex items-center justify-center">
            
            {/* Main view display (Video vs 360 view vs regular) */}
            {isVideoPlaying ? (
              <div className="relative w-full h-full p-4 flex flex-col justify-between bg-black text-white text-center">
                <div className="text-right">
                  <button 
                    onClick={() => setIsVideoPlaying(false)}
                    className="bg-white/20 hover:bg-white/40 text-white rounded px-2.5 py-1 text-[11px] font-mono"
                  >
                    CLOSE VIDEO
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xl">⚒️</p>
                  <p className="font-serif italic text-gold-300">"Carving Celestial Emeralds"</p>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wider">A 10-second workshop master simulation</p>
                  <div className="w-2/3 h-1 bg-gray-800 mx-auto rounded overflow-hidden">
                    <div className="h-full bg-gold-400 animate-progressive w-3/4"></div>
                  </div>
                </div>
                <div className="py-2 text-[9px] text-gray-500 font-mono text-center">
                  Live HD production feed verified. Standard latency is fully optimized.
                </div>
              </div>
            ) : (
              <div 
                className={`w-full h-full relative cursor-grab ${is360Active ? 'cursor-all-scroll bg-gold-50/10' : ''}`}
                onMouseMove={handleDragRotate}
              >
                <img 
                  src={product.images[activeImgIdx % product.images.length]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-2"
                />

                {is360Active && (
                  <div className="absolute top-3 left-3 bg-gold-500 text-luxury-charcoal font-mono text-[9px] font-bold py-1 px-2.5 rounded flex items-center gap-1">
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    360° DRAG TO ROTATE ACTIVE
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Interactive controls */}
          <div className="flex justify-between items-center gap-2">
            
            <div className="flex gap-2">
              {/* Thumbnail rotation previews */}
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImgIdx(idx); setIsVideoPlaying(false); }}
                  className={`w-12 h-12 bg-white border rounded p-1 ${(!isVideoPlaying && activeImgIdx === idx) ? 'border-gold-500 scale-102 ring-1 ring-gold-400' : 'border-gray-200'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>

            {/* Simulated interactive actions */}
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => { setIs360Active(!is360Active); setIsVideoPlaying(false); }}
                className={`py-1.5 px-3 rounded text-[11px] font-mono font-bold border transition-colors ${is360Active ? 'bg-gold-500 text-luxury-charcoal border-gold-500' : 'bg-white hover:bg-gold-50/20 text-gray-700 border-gray-200'}`}
              >
                🔄 360° VIEW
              </button>
              <button
                onClick={() => { setIsVideoPlaying(true); setIs360Active(false); }}
                className="py-1.5 px-3 bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> WORKSHOP LAB
              </button>
            </div>

          </div>

          {/* Spec details card */}
          <div className="bg-white p-4 rounded border border-gray-100 text-xs space-y-2">
            <h4 className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-bold">METALLIC Hallmarks & DIMENSIONING</h4>
            <div className="grid grid-cols-2 gap-2 text-luxury-charcoal font-mono">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] text-gray-400 font-sans">Craft Base Alloys</p>
                <p className="font-bold text-[11px] truncate">{product.materials.join(", ")}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] text-gray-400 font-sans">Total Dry Weight</p>
                <p className="font-bold text-[11px]">{product.weight}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] text-gray-400 font-sans">Adjustable Dimensions</p>
                <p className="font-bold text-[11px]">{product.dimensions}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-[10px] text-gray-400 font-sans">Artisan Certified Purity</p>
                <p className="font-bold text-[11px] text-gold-600 font-serif">Hallmark 925 Cert ✓</p>
              </div>
            </div>
          </div>

        </div>

        {/* Column 2: Checkout controls, pricing, reviews list, AI analysis */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[550px] md:max-h-[700px] space-y-6">
          
          {/* Header description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-start gap-4">
              <span className="font-mono text-[10px] text-gold-600 tracking-widest font-bold uppercase">{product.category} COLLECTION</span>
              {/* Stars summary */}
              <div className="flex items-center gap-1">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.ratingsAvg) ? 'fill-gold-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold text-gray-700">{product.ratingsAvg} ({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-luxury-charcoal leading-tight">
              {product.name}
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed font-sans mt-2">
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock block */}
          <div className="bg-gold-50/50 p-4 rounded border border-gold-100 flex justify-between items-center text-left">
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase leading-none mb-1">COMPREHENSIVE DIRECT PRICING</p>
              <div className="flex items-baseline gap-2">
                <p className="font-serif font-black text-xl text-luxury-charcoal">${product.price.toFixed(2)}</p>
                {hasDiscount && (
                  <p className="text-xs text-gray-400 line-through font-mono">${product.originalPrice?.toFixed(2)}</p>
                )}
              </div>
              <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-gold-500 shrink-0" />
                Includes pre-computed ${calculatedTax.toFixed(2)} local excise tax
              </p>
            </div>

            <div className="text-right">
              <span className="bg-white border border-gold-200 px-3 py-1 text-[11px] rounded font-mono text-gold-700 font-bold block">
                {product.stock > 0 ? `IN STOCK: ${product.stock} PCS` : "OUT OF STOCK"}
              </span>
              <p className="text-[9px] text-gray-400 mt-1 font-mono tracking-tight">Ships within 24 hours</p>
            </div>
          </div>

          {/* Checkout Selection Qty & Buttons */}
          {product.stock > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded">
                  <button 
                    onClick={() => setItemQty(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 text-gray-500 hover:text-black font-mono focus:outline-none"
                  >
                    -
                  </button>
                  <span className="px-4 font-mono text-xs text-luxury-charcoal font-semibold">{itemQty}</span>
                  <button 
                    onClick={() => setItemQty(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-1.5 text-gray-500 hover:text-black font-mono focus:outline-none"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => { onAddToCart(product, itemQty); alert(`Success: Added ${itemQty} x ${product.name} to your custom shopping cart list.`); }}
                  className="flex-1 bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal font-mono font-bold text-xs py-3 rounded tracking-wider flex justify-center items-center gap-2 transition-colors duration-300"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD DEPOSIT TO CART
                </button>

                <button
                  onClick={() => { onAddToWishlist(product); setIsWishlisted(true); alert(`Added ${product.name} to saved gems.`); }}
                  className={`p-3 rounded border border-gray-200 hover:bg-gold-50/50 transition-colors ${isWishlisted ? 'text-red-500 border-red-200' : 'text-gray-400 hover:text-gold-500'}`}
                  title="Save to jewelry chest"
                >
                  <Heart className="w-5.5 h-5.5 fill-current" />
                </button>
              </div>

              <div className="flex gap-4 pt-1 text-[10px] text-gray-500 font-mono justify-center border-t border-gray-50">
                <span className="flex items-center gap-1 font-semibold text-green-600">✓ Fully Secured SSL Payment</span>
                <span className="flex items-center gap-1">&bull; Track Deliveries Live</span>
                <span className="flex items-center gap-1">&bull; Instant Refund Claim Allowed</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-sans text-center">
              Our silversmiths are currently soldering more of this product. Place custom commission or request notify when back.
            </div>
          )}

          {/* Server-Powered GEMINI Style coordinating advice! */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded text-xs space-y-2">
            <div className="flex gap-1.5 items-center font-serif font-bold text-luxury-charcoal">
              <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
              <span>GEMINI LUXURY COORDINATE ADIVCE</span>
              {aiLoading && <span className="text-[10px] font-mono text-gold-600 animate-pulse">(Connecting Stylist...)</span>}
            </div>
            {aiAnalysis ? (
              <p className="text-[11px] leading-relaxed text-gray-600 bg-white p-2.5 rounded border border-gray-100 font-mono italic">
                {aiAnalysis}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 animate-pulse font-mono font-medium">Assembling gemstone spectrum recommendations from our Florence and London servers...</p>
            )}
          </div>

          {/* Artisan Biography Card */}
          <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <img 
                  src={product.artisan.avatar} 
                  alt={product.artisan.name} 
                  className="w-12 h-12 rounded-full object-cover border border-gold-300 shadow"
                />
                <div>
                  <h4 className="font-serif font-bold text-xs text-luxury-charcoal">{product.artisan.name}</h4>
                  <p className="text-[10px] text-gray-400">{product.artisan.location}</p>
                </div>
              </div>
              <div className="text-right font-mono text-[10px]">
                <p className="text-gold-600">★ {product.artisan.rating} rating</p>
                <p className="text-gray-400">{product.artisan.salesCount} commissions</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 font-sans italic leading-relaxed">
              "{product.artisan.bio}"
            </p>
            <button
              onClick={() => onContactArtisanClick(product.artisan.name, product)}
              className="w-full py-1.5 bg-white hover:bg-gold-50 border border-gold-200 rounded text-center text-xs text-gold-700 font-mono font-bold flex justify-center items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-4.5 h-4.5" /> ASK CUSTOM RESIZING OR SWAP
            </button>
          </div>

          {/* RECOMMENDED MATCHING ACCESSORIES AND ADDONS */}
          {matchingAddons.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-serif font-bold text-xs text-luxury-charcoal tracking-wide flex items-center gap-1.5">
                💎 COORDINATING GEMS YOU MAY CHERISH
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {matchingAddons.map((addon) => (
                  <div 
                    key={addon.id}
                    onClick={() => { setActiveImgIdx(0); setItemQty(1); setIsWishlisted(false); }} // reset and view addon on clicking (simulated)
                    className="p-3 bg-white border border-gray-100 hover:border-gold-300 rounded flex gap-2.5 items-center cursor-pointer transition-all"
                  >
                    <img src={addon.images[0]} alt={addon.name} className="w-12 h-12 object-cover rounded" />
                    <div className="text-left max-w-[150px] truncate">
                      <p className="text-[11px] font-serif font-bold truncate line-clamp-1 text-luxury-charcoal">{addon.name}</p>
                      <p className="text-[10px] font-mono text-gold-600 font-semibold">${addon.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews & Ratings Submission block */}
          <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
            <h3 className="font-serif font-bold text-sm tracking-wider text-luxury-charcoal">
              CLIENT TESTIMONALS ({reviewsList.length})
            </h3>

            {/* Ratings Bar Breakdown */}
            <div className="p-3 bg-gray-50 rounded border border-gray-100 flex gap-4 items-center">
              <div className="text-center shrink-0">
                <p className="text-2xl font-serif font-black text-luxury-charcoal">{product.ratingsAvg}</p>
                <div className="flex text-gold-400 justify-center">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="text-[9px] text-gray-400 font-mono mt-0.5">Rating average</p>
              </div>

              <div className="flex-1 space-y-1 text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span>5 ★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-gold-400 w-4/5"></div>
                  </div>
                  <span className="text-gray-500">80%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4 ★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-gold-400 w-1/5"></div>
                  </div>
                  <span className="text-gray-500">18%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3 ★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-gold-400 w-[2%]"></div>
                  </div>
                  <span className="text-gray-500">2%</span>
                </div>
              </div>
            </div>

            {/* Simulated Review form */}
            <form onSubmit={handleReviewSubmit} className="p-4 bg-gold-50/20 border border-dashed border-gold-300 rounded space-y-3">
              <h4 className="font-sans font-semibold text-xs text-gold-850">Leave your own handcrafted testimonial</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Charlotte Vance" 
                    className="bg-white border rounded p-1.5 w-full focus:outline-none focus:border-gold-500 font-sans text-xs"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Select Star Grade</label>
                  <select 
                    className="bg-white border rounded p-1.5 w-full font-mono text-xs focus:outline-none focus:border-gold-500"
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Detailed commentary context</label>
                <textarea 
                  rows={2} 
                  required
                  placeholder="Share details of the soldering weights, color hue, secure clasping quality etc..." 
                  className="bg-white border rounded p-2 w-full focus:outline-none focus:border-gold-500 text-xs"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                />
              </div>

              {/* Upload image for review */}
              <div className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSimulatedPhotoUpload}
                    className="text-[10px] bg-gray-50 border px-2.5 py-1 hover:bg-gray-100 text-gold-700 font-mono rounded"
                  >
                    📎 Upload Client Photo
                  </button>
                  {newReviewPhoto && <span className="text-green-600 text-[10px] font-semibold">✓ photo_raw_01.jpg</span>}
                </div>
                <button
                  type="submit"
                  className="bg-luxury-charcoal text-white hover:bg-gold-500 hover:text-luxury-charcoal rounded text-xs font-mono font-bold px-4 py-1.5 transition-colors"
                >
                  DEPOSIT ENCRYPTED TESTIMONIAL
                </button>
              </div>
            </form>

            {/* Testimonials list */}
            <div className="space-y-4 pt-2">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="border-b border-gray-50 pb-3 last:border-0 text-xs text-left">
                  <div className="flex justify-between items-center text-[11px] text-gray-500 mb-1">
                    <span className="font-bold text-luxury-charcoal flex items-center gap-1">
                      {rev.userName}
                      {rev.verified && <span className="text-[9px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.2 rounded font-mono font-semibold uppercase">verified client</span>}
                    </span>
                    <span className="font-mono text-gray-400">{rev.date}</span>
                  </div>

                  <div className="flex text-gold-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-gold-400' : 'text-gray-200'}`} />
                    ))}
                  </div>

                  <p className="text-gray-600 font-sans leading-relaxed leading-tight text-[11px]">
                    "{rev.comment}"
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {rev.images.map((img, i) => (
                        <img key={i} src={img} alt="review accessory" className="w-12 h-12 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
