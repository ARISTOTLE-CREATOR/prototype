/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Product, Order, ArtisanProfile } from "../types";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Inbox, 
  Plus, 
  Sliders, 
  MapPin, 
  Globe, 
  AlertTriangle,
  Upload,
  CheckCircle2,
  Calendar,
  MessageSquare
} from "lucide-react";

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onAddNewProduct: (newP: Product) => void;
  onUpdateOrderStatus: (oId: string, status: any) => void;
  artisan: ArtisanProfile;
  onUpdateArtisanProfile: (updated: ArtisanProfile) => void;
}

export default function SellerDashboard({
  products,
  orders,
  onAddNewProduct,
  onUpdateOrderStatus,
  artisan,
  onUpdateArtisanProfile
}: SellerDashboardProps) {
  
  // Interactive Panel Tabs
  const [activeTab, setActiveTab] = useState<"analytics" | "inventory" | "orders" | "messages">("analytics");

  // Profile editing inputs state
  const [profileName, setProfileName] = useState(artisan.name);
  const [profileBio, setProfileBio] = useState(artisan.bio);
  const [profileLocation, setProfileLocation] = useState(artisan.location);
  const [profileAvatar, setProfileAvatar] = useState(artisan.avatar);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // New product form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdCat, setNewProdCat] = useState<any>("rings");
  const [newProdPrice, setNewProdPrice] = useState("145.00");
  const [newProdMaterials, setNewProdMaterials] = useState("925 Sterling Silver, Natural Topaz");
  const [newProdWeight, setNewProdWeight] = useState("2.8g");
  const [newProdDimensions, setNewProdDimensions] = useState("Size 7");
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdImage, setNewProdImage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Seller specific products and orders
  const artisanNameLower = artisan.name.toLowerCase();
  
  const myProducts = useMemo(() => {
    return products.filter(p => p.artisan.name.toLowerCase() === artisanNameLower);
  }, [products, artisanNameLower]);

  const myOrders = useMemo(() => {
    // orders that contain at least one of my products
    return orders.filter(o => o.items.some(it => it.product.artisan.name.toLowerCase() === artisanNameLower));
  }, [orders, artisanNameLower]);

  // Analytics Math calculations
  const totalSellerRevenue = useMemo(() => {
    let rev = 0;
    myOrders.forEach(ord => {
      ord.items.forEach(it => {
        if (it.product.artisan.name.toLowerCase() === artisanNameLower) {
          rev += it.priceAtPurchase * it.quantity;
        }
      });
    });
    return rev;
  }, [myOrders, artisanNameLower]);

  // Handle profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateArtisanProfile({
      ...artisan,
      name: profileName,
      bio: profileBio,
      location: profileLocation,
      avatar: profileAvatar
    });
    setIsEditingProfile(false);
    alert("Artisan Profile updated successfully. Hallmarks applied.");
  };

  // Submit product creation
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProdName.trim() || !newProdPrice || !newProdMaterials) {
      alert("Please fully supply the product name, materials list, and retail cost.");
      return;
    }

    const brandNewProduct: Product = {
      id: "prod_" + Date.now(),
      name: newProdName,
      description: newProdDesc || "High-quality custom handcrafted luxury jewelry.",
      category: newProdCat,
      price: parseFloat(newProdPrice),
      originalPrice: parseFloat(newProdPrice) * 1.1, // mock original price
      materials: newProdMaterials.split(",").map(m => m.trim()),
      weight: newProdWeight || "3.0g",
      dimensions: newProdDimensions || "Standard",
      artisan: artisan,
      stock: parseInt(newProdStock) || 5,
      images: [
        newProdImage || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80"
      ],
      ratingsAvg: 5.0,
      reviewsCount: 0,
      reviews: [],
      isApproved: false, // admin must approve premium listing!
      featured: false
    };

    onAddNewProduct(brandNewProduct);
    alert(`Treasure listing "${newProdName}" successfully queued in Admin approval pool! Approval is usually immediate.`);
    
    // reset form fields
    setNewProdName("");
    setNewProdDesc("");
    setNewProdPrice("145.00");
    setNewProdMaterials("925 Sterling Silver, Natural Topaz");
    setNewProdStock("10");
    setNewProdImage("");
    setIsFormOpen(false);
  };

  const handleSimulatePhotoSelect = () => {
    const jewelryPhotos = [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80"
    ];
    const pick = jewelryPhotos[Math.floor(Math.random() * jewelryPhotos.length)];
    setNewProdImage(pick);
    alert("Artisan mock camera captured high-res macro detail!");
  };

  // Buyer message simulators
  const [buyerConversations, setBuyerConversations] = useState([
    { id: "c1", buyer: "Nitin Sai", query: "Can you resize the Emerald Ring to Size 9 before shipping?", date: "June 12, 10:14 AM", replied: false, replyText: "" },
    { id: "c2", buyer: "Elena", query: "Is the ceylon sapphire chain length customizable to 50cm?", date: "June 11, 4:32 PM", replied: true, replyText: "Absolutely! I will solder a 5cm silver safety extension chain on your order box." }
  ]);

  const handleSendReply = (convId: string) => {
    const matched = buyerConversations.find(c => c.id === convId);
    if (!matched || !matched.replyText.trim()) {
      alert("Please enter message reply text.");
      return;
    }
    setBuyerConversations(prev => prev.map(c => c.id === convId ? { ...c, replied: true } : c));
    alert("Artisan reply securely routed over SSL messenger corridor!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="seller-dashboard-panel">
      
      {/* Top Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-left border-b border-gray-100 pb-4 mb-6 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-luxury-charcoal">
            ARTISAN WORKSPACE & REGSTRY
          </h2>
          <p className="text-xs font-mono text-gray-400">Manage your goldsmith soldering, inventory, and ledger balances</p>
        </div>

        <button
          onClick={() => setActiveTab("inventory")}
          className="bg-luxury-charcoal text-white hover:bg-gold-500 hover:text-luxury-charcoal font-mono font-bold text-xs py-2 px-4 rounded flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> UPLOAD NEW TREASURE
        </button>
      </div>

      {/* Grid: Profile Editor Left + Content Panels Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Profile card */}
        <div className="lg:col-span-1 space-y-6 text-left">
          
          <div className="bg-white border border-gray-150 rounded overflow-hidden shadow-xs">
            <div className="h-16 bg-gradient-to-r from-gold-500 to-gold-250"></div>
            <div className="px-4 pb-4 text-center -mt-8 relative">
              <img 
                src={artisan.avatar} 
                alt={artisan.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mx-auto bg-white"
              />
              
              <h3 className="font-serif font-black text-sm text-luxury-charcoal mt-2">{artisan.name}</h3>
              <p className="text-[10px] font-mono text-gold-600 flex justify-center items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-500" /> {artisan.location}
              </p>
              
              <p className="text-[11px] text-gray-400 font-sans italic my-3 px-1">
                "{artisan.bio}"
              </p>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-mono text-[10px] text-gray-400">
                <div>
                  <p className="font-bold text-luxury-charcoal">★ {artisan.rating}</p>
                  <p>Rating</p>
                </div>
                <div>
                  <p className="font-bold text-luxury-charcoal">{artisan.salesCount}</p>
                  <p>Transactions</p>
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full mt-4 py-1.5 bg-gray-50 hover:bg-gold-50 text-[10px] text-gold-700 font-mono font-bold rounded border border-gold-200 transition-colors"
                >
                  ⚙️ EDIT MY ARTISAN LAB
                </button>
              ) : (
                <form onSubmit={handleSaveProfile} className="mt-4 border-t pt-3 text-left space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400">Workshop Brand Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-gray-50 border p-1 rounded w-full text-xs font-serif" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400">Workshop Location</label>
                    <input 
                      type="text" 
                      value={profileLocation} 
                      onChange={(e) => setProfileLocation(e.target.value)}
                      className="bg-gray-50 border p-1 rounded w-full text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400">Artisan Narrative Bio</label>
                    <textarea 
                      rows={2} 
                      value={profileBio} 
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="bg-gray-50 border p-1 rounded w-full text-xs" 
                    />
                  </div>
                  <div className="flex gap-1">
                    <button type="submit" className="flex-1 bg-luxury-charcoal text-white rounded p-1 text-[10px] font-mono font-bold">Save</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-150 rounded p-1 text-[10px] font-mono text-gray-500">Cancel</button>
                  </div>
                </form>
              )}

            </div>
          </div>

          {/* Quick tab switches */}
          <div className="bg-white border rounded p-4 space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full py-2 px-3 text-left rounded flex justify-between items-center ${activeTab === "analytics" ? "bg-gold-100 text-gold-800 font-bold" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <span>📈 Dashboard Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full py-2 px-3 text-left rounded flex justify-between items-center ${activeTab === "inventory" ? "bg-gold-100 text-gold-800 font-bold" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <span>💎 Inventories & Listings ({myProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full py-2 px-3 text-left rounded flex justify-between items-center ${activeTab === "orders" ? "bg-gold-100 text-gold-800 font-bold" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <span>📦 Solder Commissions ({myOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full py-2 px-3 text-left rounded flex justify-between items-center ${activeTab === "messages" ? "bg-gold-100 text-gold-800 font-bold" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <span>💬 Buyer Chat Inbox</span>
            </button>
          </div>

        </div>

        {/* Right column: Content panel dashboards */}
        <div className="lg:col-span-3 text-left">
          
          {/* TAB 1: ANALYTICS & SALES CHARTS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              
              {/* Stat figures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border rounded p-4 text-left shadow-xs">
                  <div className="flex justify-between items-center text-gray-400 mb-1">
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase">ARTISAN REVENUE</span>
                    <DollarSign className="w-4.5 h-4.5 text-gold-500" />
                  </div>
                  <p className="font-serif font-black text-2xl text-luxury-charcoal">${(totalSellerRevenue + 450.00).toFixed(2)}</p>
                  <p className="text-[10px] text-green-600 font-mono mt-1">▲ 14.5% versus last week</p>
                </div>

                <div className="bg-white border rounded p-4 text-left shadow-xs">
                  <div className="flex justify-between items-center text-gray-400 mb-1">
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase">COMMISSIONS CLEARED</span>
                    <Package className="w-4.5 h-4.5 text-gold-500" />
                  </div>
                  <p className="font-serif font-black text-2xl text-luxury-charcoal">{myOrders.length + 3} Orders</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">Pending crafting slots: 1</p>
                </div>

                <div className="bg-white border rounded p-4 text-left shadow-xs">
                  <div className="flex justify-between items-center text-gray-400 mb-1">
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase">CONVERSION RATIO</span>
                    <TrendingUp className="w-4.5 h-4.5 text-gold-500" />
                  </div>
                  <p className="font-serif font-black text-2xl text-luxury-charcoal">4.82%</p>
                  <p className="text-[10px] text-gold-600 font-mono mt-1">Top-quartile artisan rank</p>
                </div>
              </div>

              {/* Graphical representation of sales (Custom beautiful css chart) */}
              <div className="bg-white border rounded p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-sm text-luxury-charcoal">Commission Income Log (Weekly)</h4>
                  <span className="text-[10px] text-gray-400 font-mono">VALUES SECURED IN USD</span>
                </div>

                {/* Custom layout of vertical bar graph */}
                <div className="h-44 flex items-end justify-between px-4 pt-4 border-b border-gray-100 relative">
                  
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-gray-50 border-dashed"></div>
                  <div className="absolute inset-x-0 top-2/4 border-b border-gray-50 border-dashed"></div>
                  <div className="absolute inset-x-0 top-3/4 border-b border-gray-50 border-dashed"></div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gray-200 hover:bg-gold-500 h-16 rounded-t transition-colors" title="$320"></div>
                    <span className="text-[9px] font-mono text-gray-400">Mon</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gold-400 h-28 rounded-t" title="$540"></div>
                    <span className="text-[9px] font-mono text-gray-400">Tue</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gray-200 hover:bg-gold-500 h-20 rounded-t transition-colors" title="$380"></div>
                    <span className="text-[9px] font-mono text-gray-400">Wed</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-luxury-charcoal h-36 rounded-t shadow" title="$720"></div>
                    <span className="text-[9px] font-mono text-gold-600 font-bold">Thu</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gray-200 hover:bg-gold-500 h-12 rounded-t transition-colors" title="$210"></div>
                    <span className="text-[9px] font-mono text-gray-400">Fri</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gold-400 h-32 rounded-t" title="$610"></div>
                    <span className="text-[9px] font-mono text-gray-400">Sat</span>
                  </div>

                  <div className="w-10 flex flex-col items-center gap-2 z-10">
                    <div className="w-4 bg-gray-200 hover:bg-gold-500 h-10 rounded-t transition-colors" title="$180"></div>
                    <span className="text-[9px] font-mono text-gray-400">Sun</span>
                  </div>

                </div>
                <p className="text-[10px] text-gray-400 text-center font-mono">Commission sales spiked on Thursday over Emerald custom orders!</p>
              </div>

            </div>
          )}

          {/* TAB 2: INVENTORY LIST & PRODUCT CREATION DETAILS */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-luxury-charcoal">My Live Jewelry Catalog</h3>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-mono font-bold text-xs py-1.5 px-3 rounded flex items-center gap-1 transition-all"
                >
                  {isFormOpen ? "Close Form" : "🛠️ UPLOAD NEW TREASURE"}
                </button>
              </div>

              {/* COLLAPSIBLE UPLOAD PRODUCT FORM */}
              {isFormOpen && (
                <form onSubmit={handleCreateProductSubmit} className="bg-gold-50/20 border border-gold-300 p-6 rounded text-xs space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 mb-2">
                    <Plus className="w-4 h-4 text-gold-500" />
                    <span className="font-serif font-black text-sm tracking-wide text-neutral-800">UPLOAD TO GLOBAL COMMISSION</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 mb-1">Product Display Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Vintage Sapphire Solitaire Ring" 
                        required 
                        className="bg-white border rounded p-2 w-full text-xs font-serif font-medium focus:outline-gold-400"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-500 mb-1">Catalog Category</label>
                      <select 
                        className="bg-white border rounded p-2 w-full text-xs"
                        value={newProdCat}
                        onChange={(e) => setNewProdCat(e.target.value)}
                      >
                        <option value="rings">💍 Rings</option>
                        <option value="necklaces">📿 Necklaces</option>
                        <option value="earrings">✨ Earrings</option>
                        <option value="bracelets">⌾ Bracelets</option>
                        <option value="anklets">〰 Anklets</option>
                        <option value="pendants">👑 Pendants</option>
                        <option value="custom">⚒️ Custom Commission</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-500 mb-1">Narration Narrative Description</label>
                      <textarea 
                        rows={2} 
                        placeholder="Detail the filigree technique, stone facets, shine under light, etc..." 
                        className="bg-white border rounded p-2 w-full text-xs"
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-500 mb-1">Materials List (Comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="925 Sterling Silver, Amethyst Cabochons" 
                        required 
                        className="bg-white border rounded p-2 w-full font-mono text-xs"
                        value={newProdMaterials}
                        onChange={(e) => setNewProdMaterials(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-500 mb-1">Price Retail ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          required 
                          className="bg-white border rounded p-2 w-full font-mono text-center text-xs"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Initial Stock</label>
                        <input 
                          type="number" 
                          required 
                          className="bg-white border rounded p-2 w-full font-mono text-center text-xs"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-500 mb-1">Weight (e.g. 3.4g)</label>
                        <input 
                          type="text" 
                          className="bg-white border rounded p-2 w-full text-center text-xs"
                          value={newProdWeight}
                          onChange={(e) => setNewProdWeight(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Standard Dimensions</label>
                        <input 
                          type="text" 
                          className="bg-white border rounded p-2 w-full text-center text-xs"
                          value={newProdDimensions}
                          onChange={(e) => setNewProdDimensions(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Image URL with Mock Capture button */}
                    <div>
                      <label className="block text-gray-500 mb-1">Jewelry Photograph URL (Optional)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://images.unsplash..." 
                          className="bg-white border rounded p-2 flex-1 text-xs font-mono"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleSimulatePhotoSelect}
                          className="bg-luxury-charcoal text-white rounded p-2 text-xs font-mono flex items-center gap-1 hover:bg-gold-500"
                        >
                          <Upload className="w-3.5 h-3.5" /> Mock
                        </button>
                      </div>
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal rounded text-xs font-mono font-bold tracking-wide transition-colors"
                  >
                    SUBMIT TO REGISTERED ARCHIVE DEPOSIT
                  </button>

                </form>
              )}

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProducts.map((prod) => {
                  const isLow = prod.stock > 0 && prod.stock <= 4;
                  const isOut = prod.stock === 0;

                  return (
                    <div key={prod.id} className="bg-white border rounded border-gray-150 p-4 flex gap-4 items-center">
                      <img src={prod.images[0]} alt={prod.name} className="w-16 h-16 object-cover rounded border" />
                      <div className="flex-1 text-xs">
                        <h4 className="font-serif font-bold text-luxury-charcoal line-clamp-1">{prod.name}</h4>
                        <p className="font-mono text-[10px] text-gold-600 font-bold mt-0.5">${prod.price.toFixed(2)}</p>
                        <div className="flex gap-2 items-center mt-2.5">
                          {isOut ? (
                            <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-mono font-semibold">OUT OF STOCK</span>
                          ) : isLow ? (
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-mono font-semibold">LOW STOCK: {prod.stock}</span>
                          ) : (
                            <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono font-semibold">IN STORAGE: {prod.stock}</span>
                          )}
                          {!prod.isApproved && (
                            <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono font-semibold uppercase">Pending Verification</span>
                          )}
                          {prod.isApproved && (
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono font-semibold uppercase">Active Listing</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMER ORDER PROCESSING MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b border-gray-100 pb-3">Artisan Soldering & Delivery Management</h3>
              
              {myOrders.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border rounded text-xs text-gray-400 font-mono">
                  No active orders for your workstation yet. Treasures bought by clients appear here immediately!
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div key={ord.id} className="bg-white border rounded p-4 text-xs space-y-3">
                      <div className="flex justify-between items-center font-mono">
                        <div>
                          <p className="font-bold text-luxury-charcoal">ORDER #{ord.id}</p>
                          <p className="text-gray-400 text-[10px]">Client Addressee: {ord.shippingAddress.fullName}</p>
                        </div>
                        <span className="bg-gold-50 text-gold-700 py-1 px-2.5 rounded font-bold uppercase text-[10px] border border-gold-200">
                          {ord.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Items for this order */}
                      <div className="divide-y divide-gray-50">
                        {ord.items
                          .filter(it => it.product.artisan.name.toLowerCase() === artisanNameLower)
                          .map((it, idx) => (
                            <div key={idx} className="py-2 flex justify-between items-center text-[11px] font-mono">
                              <span>{it.product.name} (x{it.quantity})</span>
                              <span className="font-bold text-luxury-charcoal">${(it.priceAtPurchase * it.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                      </div>

                      {/* Fulfill Action switcher button */}
                      <div className="bg-gray-50 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <p className="font-sans text-gray-500 text-[11px]">Advance the real-time shipping status tracking:</p>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          {ord.status === "placed" && (
                            <button
                              onClick={() => { onUpdateOrderStatus(ord.id, "confirmed"); alert("Direct payment matched! Transitioning timeline step."); }}
                              className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-bold font-mono text-[10px] px-3 py-1.5 rounded"
                            >
                              ✓ CONFIRM PAYMENT
                            </button>
                          )}
                          {ord.status === "confirmed" && (
                            <button
                              onClick={() => { onUpdateOrderStatus(ord.id, "processing"); alert("Metals are currently heat soldering in the kiln!"); }}
                              className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-bold font-mono text-[10px] px-3 py-1.5 rounded"
                            >
                              🔥 START CRAFTING & METALWORK
                            </button>
                          )}
                          {ord.status === "processing" && (
                            <button
                              onClick={() => { onUpdateOrderStatus(ord.id, "packed"); alert("Crated in cedar boxes!"); }}
                              className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-bold font-mono text-[10px] px-3 py-1.5 rounded"
                            >
                              📦 CRATE & PACK ORNAMENT
                            </button>
                          )}
                          {ord.status === "packed" && (
                            <button
                              onClick={() => { onUpdateOrderStatus(ord.id, "shipped"); alert("Courier picked up the cedar box. FedEx tracker active!"); }}
                              className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-bold font-mono text-[10px] px-3 py-1.5 rounded"
                            >
                              🚀 DEPART DHL/FEDEX FLIGHTS
                            </button>
                          )}
                          {ord.status === "shipped" && (
                            <button
                              onClick={() => { onUpdateOrderStatus(ord.id, "delivered"); alert("Signature secured! Delivery transaction fully cleared."); }}
                              className="bg-green-600 text-white font-bold font-mono text-[10px] px-3 py-1.5 rounded hover:bg-green-750"
                            >
                              ✓ MARK SIGNED DELIVERY
                            </button>
                          )}
                          {ord.status === "delivered" && (
                            <p className="text-green-600 font-bold font-mono text-[10px]">✓ TRANSACTION DEPOSITED SUCCESSFULLY</p>
                          )}
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ARTISAN MESSAGES INBOX */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b border-gray-100 pb-3">Direct Buyer Consultations</h3>

              <div className="space-y-4">
                {buyerConversations.map((conv) => (
                  <div key={conv.id} className="bg-white border rounded p-4 text-xs space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 font-mono text-[10px] text-gray-400">
                      <span>Sender: <b className="text-luxury-charcoal">{conv.buyer}</b></span>
                      <span>{conv.date}</span>
                    </div>

                    <p className="text-gray-600 font-sans italic leading-relaxed text-[11px] bg-gray-50 p-2 rounded">
                      "{conv.query}"
                    </p>

                    {conv.replied ? (
                      <div className="bg-gold-50/50 p-2.5 rounded border border-gold-250 text-gold-900 font-sans leading-relaxed text-[11px]">
                        <b>Your workshop response:</b> "{conv.replyText}"
                        <p className="text-[10px] text-green-600 font-mono font-bold mt-1">✓ Transmitted and Read</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={conv.replyText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuyerConversations(prev => prev.map(c => c.id === conv.id ? { ...c, replyText: val } : c));
                          }}
                          placeholder="Type your elegant metalwork resizing options..."
                          className="w-full bg-white border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gold-500 text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(conv.id)}
                          className="bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal font-bold font-mono text-[10px] px-3.5 py-1 rounded transition-colors"
                        >
                          Send Concierge Reply
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
