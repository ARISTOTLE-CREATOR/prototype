/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Order, Product, LoyaltyAccount } from "../types";
import { 
  Award, 
  MapPin, 
  Settings, 
  Heart, 
  Clock, 
  Truck, 
  AlertCircle, 
  RefreshCcw, 
  Star,
  ShoppingBag,
  Bell,
  CheckCircle,
  Gem
} from "lucide-react";

interface CustomerDashboardProps {
  orders: Order[];
  wishlist: Product[];
  loyalty: LoyaltyAccount;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  onPriceDropToggle: (pId: string) => void;
}

export default function CustomerDashboard({
  orders,
  wishlist,
  loyalty,
  onSelectProduct,
  onAddToCart,
  onPriceDropToggle
}: CustomerDashboardProps) {
  
  // Interactive UI panel state toggles
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "loyalty">("orders");
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Price Drop Alert state simulation
  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({
    prod_1: true,
    prod_6: false
  });

  const handleTogglePriceAlert = (pId: string) => {
    setPriceAlerts(prev => ({
      ...prev,
      [pId]: !prev[pId]
    }));
    alert(`Price drop alert preference updated to ${!priceAlerts[pId] ? "subscribed" : "unsubscribed"}.`);
  };

  // Simulating Return request on order
  const handleReturnRequest = (orderId: string, itemIdx: number) => {
    alert(`Return label generated successfully for Order #${orderId}. We have sent a prepaid DHL/FedEx label to your registered email 'sainithin172005@gmail.com'. Please drop it off within 14 days.`);
  };

  // Check which VIP perks apply based on tier
  const perkBenefits = {
    Bronze: "1% back in reward points. Standard slow ship lanes.",
    Silver: "3% back in reward points. Priority crafting slots.",
    Gold: "5% back in reward points. FedEx complimentary Premium White Glove shipping.",
    Platinum: "10% back in reward points, immediate access to rare custom gem releases, direct stylist Viber/WhatsApp concierge hotline."
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="customer-profile-section">
      
      {/* Client Overview Banner */}
      <div className="bg-gradient-to-r from-luxury-charcoal to-neutral-900 border border-gray-100 rounded p-6 shadow text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-full bg-gold-400 text-luxury-charcoal border-2 border-gold-200 flex justify-center items-center text-3xl font-serif font-black shadow-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold">Sai Nithin</h2>
              <span className="bg-gold-500 text-luxury-charcoal font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                {loyalty.tier} Elite Member
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Master Member since June 2026 &bull; sainithin172005@gmail.com</p>
            <p className="text-gold-300 text-xs font-mono mt-1.5 flex items-center gap-1">
              <Award className="w-4 h-4 text-gold-450" />
              {loyalty.points} Loyalty points active &bull; gold concierge channel
            </p>
          </div>
        </div>

        {/* Level metrics bar */}
        <div className="w-full md:w-64 text-left space-y-1 bg-white/5 p-3 rounded">
          <div className="flex justify-between text-[11px] font-mono text-gray-400">
            <span>Points Progress</span>
            <span className="text-gold-300 font-bold">{loyalty.points} / {loyalty.nextTierPoints} Pts</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded overflow-hidden">
            <div 
              style={{ width: `${(loyalty.points / loyalty.nextTierPoints) * 100}%` }}
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
            ></div>
          </div>
          <p className="text-[9px] text-gray-500 text-right">Unlock Platinum Level for complimentary expedited flights</p>
        </div>
      </div>

      {/* Main Grid: left switches / right detail drawers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation panel */}
        <div className="md:col-span-1 space-y-2 text-left" id="dashboard-nav">
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold mb-2">MY CHEST SERVICES</span>
          
          <button
            onClick={() => { setActiveTab("orders"); setSelectedTrackingOrder(null); }}
            className={`w-full py-2.5 px-4 font-mono font-semibold rounded text-xs flex items-center justify-between transition-all ${activeTab === "orders" ? "bg-luxury-charcoal text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gold-50/20"}`}
          >
            <span>📜 Active Orders ({orders.length})</span>
            <Clock className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full py-2.5 px-4 font-mono font-semibold rounded text-xs flex items-center justify-between transition-all ${activeTab === "wishlist" ? "bg-luxury-charcoal text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gold-50/20"}`}
          >
            <span>❤️ Loved Ornaments ({wishlist.length})</span>
            <Heart className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab("loyalty")}
            className={`w-full py-2.5 px-4 font-mono font-semibold rounded text-xs flex items-center justify-between transition-all ${activeTab === "loyalty" ? "bg-luxury-charcoal text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gold-50/20"}`}
          >
            <span>👑 Gold VIP Membership</span>
            <Award className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Content detail panels */}
        <div className="md:col-span-3 text-left">
          
          {/* Tab 1: Orders with real time tracking expanded */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b border-gray-100 pb-3">My Purchase & Commissions Ledger</h3>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border rounded text-xs text-gray-400">
                  You have not registered any jewelry orders yet. Ornaments you buy will show here instantly for tracking!
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => {
                    const isTrackingActive = selectedTrackingOrder?.id === ord.id;
                    return (
                      <div key={ord.id} className="bg-white border border-gray-100 rounded shadow-xs overflow-hidden">
                        {/* Order Header block */}
                        <div className="bg-gray-50 p-4 border-b border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center text-xs font-mono gap-4">
                          <div>
                            <p className="text-gray-400">ORDER NO: <span className="font-bold text-luxury-charcoal">{ord.id}</span></p>
                            <p className="text-gray-400 mt-0.5">Date Placed: {ord.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="bg-gold-50 border border-gold-200 text-gold-700 py-1 px-2.5 rounded font-bold uppercase text-[10px]">
                              Status: {ord.status.toUpperCase()}
                            </span>
                            <button
                              onClick={() => setSelectedTrackingOrder(isTrackingActive ? null : ord)}
                              className="bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal py-1 px-3 rounded font-bold uppercase text-[10px] transition-colors"
                            >
                              {isTrackingActive ? "Collapse Track" : "🚚 TRACK LIVE"}
                            </button>
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="p-4 divide-y divide-gray-50">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-3 flex justify-between items-center text-xs">
                              <div className="flex gap-3 items-center">
                                <img src={it.product.images[0]} alt={it.product.name} className="w-12 h-12 object-cover rounded border" />
                                <div>
                                  <h4 onClick={() => onSelectProduct(it.product)} className="font-serif font-bold text-luxury-charcoal hover:text-gold-500 cursor-pointer">{it.product.name}</h4>
                                  <p className="text-[10px] text-gray-400 font-mono">Qty: {it.quantity} &bull; Materials: {it.product.materials.slice(0, 2).join(", ")}</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                <span className="font-mono font-bold text-luxury-charcoal">${(it.priceAtPurchase * it.quantity).toFixed(2)}</span>
                                <button
                                  onClick={() => handleReturnRequest(ord.id, idx)}
                                  className="text-[10px] text-gray-400 hover:text-red-500 font-mono border border-gray-100 hover:border-red-200 px-2 py-0.5 rounded transition-all"
                                >
                                  🔄 Ask Return
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Summary panel */}
                        <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-xs font-mono flex justify-between items-center">
                          <p className="text-gray-400">Paid and Insured via: <span className="text-gray-600 font-bold">{ord.paymentMethod.provider}</span></p>
                          <p className="font-bold text-luxury-charcoal">Invoice Total: ${ord.total.toFixed(2)}</p>
                        </div>

                        {/* REAL-TIME DELIVERY TIMELINE (EXPPANDS DYNAMICALLY!) */}
                        {isTrackingActive && (
                          <div className="p-6 bg-zinc-50 border-t border-gray-150 text-xs space-y-4 font-sans text-left" id={`tracking-view-${ord.id}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border rounded text-xs gap-3">
                              <div>
                                <p className="font-mono text-gray-500 text-[10px] tracking-wide uppercase">Courier Route Partner</p>
                                <p className="font-bold text-luxury-charcoal">{ord.carrier}</p>
                              </div>
                              <div>
                                <p className="font-mono text-gray-500 text-[10px] tracking-wide uppercase">Waybill Tracker Id</p>
                                <p className="font-mono font-semibold text-[11px] text-gold-600">{ord.trackingNumber}</p>
                              </div>
                              <div>
                                <p className="font-mono text-gray-500 text-[10px] tracking-wide uppercase">Estimated Arrival</p>
                                <p className="font-bold text-green-600">{ord.estimatedDelivery}</p>
                              </div>
                            </div>

                            {/* Timeline tracker steps */}
                            <div className="space-y-4 pt-2">
                              <h4 className="font-serif font-bold text-xs tracking-wider uppercase text-luxury-charcoal">Real-time Delivery Timeline</h4>
                              <div className="relative border-l-2 border-gold-300 ml-3.5 pl-6 space-y-5 py-1">
                                {ord.deliveryTimeline.map((step, sIdx) => {
                                  return (
                                    <div key={sIdx} className="relative text-xs">
                                      {/* Node Circle */}
                                      <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${step.completed ? 'bg-gold-500 border-gold-400 text-luxury-charcoal w-4.5 h-4.5' : 'bg-gray-200 border-gray-300 text-gray-400'}`}>
                                        {step.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                                      </span>
                                      
                                      <div className="space-y-0.5">
                                        <div className="flex justify-between items-center">
                                          <p className={`font-semibold font-mono ${step.completed ? 'text-luxury-charcoal font-bold' : 'text-gray-400'}`}>
                                            {step.status}
                                          </p>
                                          <span className="text-[10px] text-gray-400 font-mono">{step.timestamp}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{step.description}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Lovable Wishlist shelf */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b border-gray-100 pb-3">My Saved Jewelry Chamber</h3>
              
              {wishlist.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border rounded text-xs text-gray-400">
                  Your jewelry chest is empty. Tap the heart symbol on product pages to save custom gems and track price drop alerts!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((prod) => (
                    <div 
                      key={prod.id}
                      className="bg-white border rounded border-gray-100 p-4 shadow-xs flex justify-between items-center gap-4 text-xs font-sans text-left hover:shadow-md transition-all"
                    >
                      <div className="flex gap-3 items-center overflow-hidden">
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          className="w-14 h-14 object-cover rounded border border-gray-100"
                        />
                        <div className="truncate">
                          <h4 
                            onClick={() => onSelectProduct(prod)} 
                            className="font-serif font-bold text-luxury-charcoal hover:text-gold-500 cursor-pointer truncate"
                          >
                            {prod.name}
                          </h4>
                          <p className="text-gold-600 font-mono font-bold mt-0.5">${prod.price.toFixed(2)}</p>
                          
                          {/* Alert checkbox */}
                          <label className="flex items-center gap-1.5 mt-2 cursor-pointer text-gray-500 hover:text-gold-700">
                            <input 
                              type="checkbox"
                              checked={!!priceAlerts[prod.id]}
                              onChange={() => handleTogglePriceAlert(prod.id)}
                              className="accent-gold-500"
                            />
                            <span className="text-[9px] font-mono">🔔 Price Drop Alert Active</span>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={() => { onAddToCart(prod, 1); alert(`Success: Added ${prod.name} to Cart list.`); }}
                        className="p-2 bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal rounded text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> BUY NOW
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Detailed loyalty club rules */}
          {activeTab === "loyalty" && (
            <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-luxury-charcoal">ArtisanGems VIP Guild</h3>
                <span className="bg-gold-500 text-luxury-charcoal font-mono text-[10px] tracking-widest font-bold py-1 px-3 rounded uppercase">
                  ACTIVE TIER perk: GOLD
                </span>
              </div>

              {/* Progress visual */}
              <div className="p-4 bg-gold-50 rounded border border-gold-100 text-xs text-left grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center font-serif md:border-r border-gold-200">
                  <p className="text-3xl">🏺</p>
                  <p className="font-bold text-gold-800 text-sm mt-1">GOLD LEVEL CLUB</p>
                  <p className="text-[10px] text-gray-500 font-mono">15% discount on all commissions</p>
                </div>
                <div className="col-span-2 space-y-3 font-sans">
                  <p className="text-gray-650 leading-relaxed text-[11px]">
                    You accumulate <b>10 loyalty reward points</b> for every $100 spent on handmade jewelry. Accruing more points upgrades your platform membership limits, enabling faster crafting channels and direct concierge contact.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500">
                      <span>Bronze (0 pts)</span>
                      <span>Silver (500 pts)</span>
                      <span className="text-gold-700 font-bold">Gold (1450 pts)</span>
                      <span>Platinum (3000 pts)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded overflow-hidden">
                      <div className="h-full bg-gold-400 w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perks details chart */}
              <div className="space-y-3 text-xs text-left" id="loyalty-perks-chart">
                <h4 className="font-serif font-bold text-sm text-luxury-charcoal">Available Tier Benefits</h4>
                <div className="border border-gray-150 rounded overflow-hidden font-mono text-[11px] divide-y">
                  <div className="p-3 bg-gray-50 flex justify-between font-bold text-luxury-charcoal">
                    <span>Platform Tier Rank</span>
                    <span>Exclusive Benefits</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-gray-500">Bronze Rank</span>
                    <span className="text-gray-600 text-right font-sans">{perkBenefits["Bronze"]}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-gray-500">Silver Rank</span>
                    <span className="text-gray-600 text-right font-sans">{perkBenefits["Silver"]}</span>
                  </div>
                  <div className="p-3 bg-gold-50 flex justify-between font-semibold text-gold-800">
                    <span>Gold Rank (You)</span>
                    <span className="text-right font-sans">{perkBenefits["Gold"]}</span>
                  </div>
                  <div className="p-3 flex justify-between text-gray-505">
                    <span>Platinum VIP Royal</span>
                    <span className="text-gray-600 text-right font-sans">{perkBenefits["Platinum"]}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
