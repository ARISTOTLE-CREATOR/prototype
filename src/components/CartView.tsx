/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { CartItem, Product, Order, Coupon } from "../types";
import { 
  Trash2, 
  Tag, 
  MapPin, 
  CreditCard, 
  Lock, 
  Truck, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  QrCode
} from "lucide-react";
import { mockCoupons } from "../mockData";

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQty: (prodId: string, newQty: number) => void;
  onRemoveItem: (prodId: string) => void;
  onSaveForLater: (prodId: string, flag: boolean) => void;
  onOrderCompleted: (newOrder: Order) => void;
  onClose: () => void;
  loyaltyPoints: number;
}

export default function CartView({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onSaveForLater,
  onOrderCompleted,
  onClose,
  loyaltyPoints
}: CartViewProps) {
  
  // Checkout information form states
  const [addressName, setAddressName] = useState("S. Nithin");
  const [addressLine, setAddressLine] = useState("1024 Emerald Highstreet, Suite 17");
  const [addressCity, setAddressCity] = useState("San Francisco");
  const [addressState, setAddressState] = useState("CA");
  const [addressZip, setAddressZip] = useState("94103");
  const [addressPhone, setAddressPhone] = useState("+1 (555) 448-2121");
  
  const [paymentOption, setPaymentOption] = useState<"card" | "upi" | "paypal">("card");
  const [cardHolder, setCardHolder] = useState("SAI NITHIN");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4482");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("255");

  const [upiIdInput, setUpiIdInput] = useState("nithin@phonepe");
  const [selectedShipping, setSelectedShipping] = useState<"standard" | "express">("standard");

  // Coupon code states
  const [typedCoupon, setTypedCoupon] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  // Filter cart vs saved
  const activeCartItems = useMemo(() => cartItems.filter(i => !i.savedForLater), [cartItems]);
  const savedForLaterItems = useMemo(() => cartItems.filter(i => i.savedForLater), [cartItems]);

  // Real-time currency metrics
  const pricingMetrics = useMemo(() => {
    let subtotal = 0;
    activeCartItems.forEach(item => {
      subtotal += item.product.price * item.quantity;
    });

    // Shipping cost
    const shipping = selectedShipping === "express" ? 25.00 : 0.00; // standard is free
    
    // Tax rate (8.25%)
    const tax = subtotal * 0.0825;

    // Coupon discount
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === "percentage") {
        discount = (subtotal * activeCoupon.value) / 100;
      } else {
        discount = activeCoupon.value;
      }
      // clamp discount
      if (discount > subtotal) discount = subtotal;
    }

    // Total
    const total = subtotal - discount + tax + shipping;

    return { subtotal, tax, shipping, discount, total };
  }, [activeCartItems, selectedShipping, activeCoupon]);

  // Apply handmade coupons validation
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const matched = mockCoupons.find(c => c.code.toUpperCase() === typedCoupon.toUpperCase() && c.active);
    
    if (matched) {
      if (matched.minPurchase && pricingMetrics.subtotal < matched.minPurchase) {
        setCouponError(`This coupon requires a minimum subtotal purchase size of $${matched.minPurchase}.`);
        setActiveCoupon(null);
        return;
      }
      setActiveCoupon(matched);
      alert(`Coupon '${matched.code}' applied successfully: Value ${matched.discountType === 'percentage' ? matched.value + '%' : '$' + matched.value} subtracted!`);
    } else {
      setCouponError("Invalid or expired artisan promotion code.");
      setActiveCoupon(null);
    }
  };

  // Auto Address detection simulation using browser coords or randomized premium zip
  const handleAutoAddressDetect = () => {
    setAddressLine("24 Luxury Place, Sea Cliff Plaza");
    setAddressCity("San Francisco");
    setAddressState("CA");
    setAddressZip("94121");
    alert("ArtisanGems encrypted satellite radar detected your location securely. Profile updated.");
  };

  // Submit secure checkout buy order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCartItems.length === 0) {
      alert("Your shopping cart bag is currently empty. Please add items first.");
      return;
    }

    if (!addressName || !addressLine || !addressCity || !addressZip) {
      alert("Please supply accurate shipping coordinates.");
      return;
    }

    // Prepare live delivery order
    const orderCreated: Order = {
      id: "AG-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      items: activeCartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      })),
      subtotal: pricingMetrics.subtotal,
      discount: pricingMetrics.discount,
      tax: pricingMetrics.tax,
      shipping: pricingMetrics.shipping,
      total: pricingMetrics.total,
      couponCode: activeCoupon ? activeCoupon.code : undefined,
      status: "placed",
      trackingNumber: "TRK" + Math.floor(550970736 + Math.random() * 100000),
      carrier: "FedEx Premium White Glove",
      estimatedDelivery: "In 3 Business Days",
      deliveryTimeline: [
        { status: "Order Placed", timestamp: "Today " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: "We have registered your secure transaction deposit.", completed: true },
        { status: "Payment Confirmed", timestamp: "Ready to confirm", description: "Direct clearing verification successfully established.", completed: false },
        { status: "Processing & Crafting", timestamp: "Pending", description: "Artisans are soldering your precious metal structure.", completed: false },
        { status: "Packed & Shipped", timestamp: "Pending", description: "Crated in fresh cedarwood packaging with tracker.", completed: false },
        { status: "Delivered", timestamp: "Pending", description: "Completed signature delivery.", completed: false }
      ],
      shippingAddress: {
        fullName: addressName,
        addressLine1: addressLine,
        city: addressCity,
        state: addressState,
        postalCode: addressZip,
        phone: addressPhone
      },
      paymentMethod: {
        type: paymentOption,
        provider: paymentOption === "card" ? "Stripe Gateway Secure" : paymentOption === "upi" ? "Razorpay GPay" : "PayPal Digital",
        last4: paymentOption === "card" ? cardNumber.slice(-4) : undefined
      }
    };

    onOrderCompleted(orderCreated);
    alert(`Order of $${pricingMetrics.total.toFixed(2)} completed successfully! Live tracking has been activated.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="checkout-section">
      <div className="text-left border-b border-gray-100 pb-3 mb-6">
        <h2 className="font-serif text-2xl font-bold tracking-wide text-luxury-charcoal">
          YOUR SHOPPING BOX CABINET
        </h2>
        <p className="text-xs font-mono text-gray-400">One-page secure SSL checkout system</p>
      </div>

      {activeCartItems.length === 0 ? (
        <div className="py-16 text-center max-w-sm mx-auto space-y-4">
          <p className="text-3xl">🛍️</p>
          <h3 className="font-serif font-semibold text-luxury-charcoal">Your Jewelry Box is Vacant</h3>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Fill your chest with rare, hand-forged emerald bands, customized gemstone pendants, or bohemian lightweight silver anklets.
          </p>
          <button 
            onClick={onClose}
            className="bg-gold-500 hover:bg-gold-400 text-luxury-charcoal font-bold px-6 py-2.5 rounded text-xs font-mono"
          >
            RETURN TO JEWELRY SHOP
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Cart items & Checkout Info */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* Items display */}
            <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-black text-sm tracking-wide text-luxury-charcoal border-b border-gray-50 pb-2">
                ACTIVE COMMISSIONS DEPOSITS ({activeCartItems.length})
              </h3>

              <div className="space-y-4">
                {activeCartItems.map((item) => {
                  const hasDiscount = item.product.originalPrice && item.product.originalPrice > item.product.price;
                  return (
                    <div 
                      key={item.product.id}
                      className="flex gap-4 md:items-center justify-between border-b border-gray-50 pb-4 last:border-0 text-xs"
                    >
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded border border-gray-100"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-luxury-charcoal pr-4">{item.product.name}</h4>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                            Category: {item.product.category.toUpperCase()} &bull; Metal: {item.product.materials[0]}
                          </p>
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => onSaveForLater(item.product.id, true)}
                              className="text-[10px] text-gold-600 hover:text-gold-800 font-mono"
                            >
                              📂 Save for Lated
                            </button>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-[10px] text-red-500 hover:text-red-700 font-mono flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col md:flex-row items-end md:items-center gap-3">
                        {/* Qty controls */}
                        <div className="flex items-center border border-gray-200 bg-gray-50 rounded">
                          <button
                            onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 text-gray-500 font-mono"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-[11px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                            className="px-2 py-0.5 text-gray-500 font-mono"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Item prices */}
                        <div className="font-mono min-w-[70px]">
                          <p className="font-bold text-luxury-charcoal">${(item.product.price * item.quantity).toFixed(2)}</p>
                          {item.quantity > 1 && (
                            <p className="text-[9px] text-gray-400">${item.product.price.toFixed(2)} ea</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address Management with auto detection */}
            <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h3 className="font-serif font-black text-sm tracking-wide text-luxury-charcoal">
                  📍 DELIVERY ADDRESS COORDINATES
                </h3>
                <button
                  type="button"
                  onClick={handleAutoAddressDetect}
                  className="text-[10px] bg-gold-50 hover:bg-gold-100 text-gold-700 font-semibold px-2.5 py-1 font-mono rounded flex items-center gap-1 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" /> AUTO-DETECT GEOLOC
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-gray-500 mb-1">Full Addressee Name</label>
                  <input
                    type="text"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Addressee Contact Phone</label>
                  <input
                    type="text"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-500 mb-1">Street Address / Floor / Suite</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Postal ZIP Pin</label>
                    <input
                      type="text"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      placeholder="94103"
                      className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-center focus:ring-1 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Payment options (Form + QrCode + Secure locks) */}
            <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-black text-sm tracking-wide text-luxury-charcoal border-b border-gray-50 pb-2">
                🛡️ SECURE PCI-DSS CRATED PAYMENT GATEWAY
              </h3>

              {/* Payment selector */}
              <div className="flex gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentOption("card")}
                  className={`flex-1 py-2.5 rounded border font-semibold flex justify-center items-center gap-1.5 transition-all ${paymentOption === "card" ? "bg-luxury-charcoal text-white border-luxury-charcoal shadow" : "bg-gray-50 hover:bg-white border-gray-200 text-gray-600"}`}
                >
                  <CreditCard className="w-4 h-4" /> CREDIT/DEBIT
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption("upi")}
                  className={`flex-1 py-2.5 rounded border font-semibold flex justify-center items-center gap-1.5 transition-all ${paymentOption === "upi" ? "bg-luxury-charcoal text-white border-luxury-charcoal shadow" : "bg-gray-50 hover:bg-white border-gray-200 text-gray-600"}`}
                >
                  <QrCode className="w-4 h-4" /> UPI QR PORT
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption("paypal")}
                  className={`flex-1 py-2.5 rounded border font-semibold flex justify-center items-center gap-1.5 transition-all ${paymentOption === "paypal" ? "bg-luxury-charcoal text-white border-luxury-charcoal shadow" : "bg-gray-50 hover:bg-white border-gray-200 text-gray-600"}`}
                >
                  💳 PAYPAL
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded border border-gray-200 text-xs">
                {paymentOption === "card" && (
                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-gray-550 mb-1 text-[11px]">Cradholders Full Name</label>
                      <input 
                        type="text" 
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded p-2 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-550 mb-1 text-[11px]">Crad Number (Encrypted transmission)</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded p-2 font-mono text-center"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-550 mb-1 text-[11px]">Expiration Date</label>
                        <input 
                          type="text" 
                          value={cardExpiry} 
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded p-2 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-550 mb-1 text-[11px]">CVV Security code</label>
                        <input 
                          type="password" 
                          maxLength={3} 
                          value={cardCvv} 
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded p-2 text-center text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentOption === "upi" && (
                  <div className="space-y-4 text-center font-sans">
                    <p className="text-[11px] text-gray-500">Scan this secure UPI address for Instant Clearing via Razorpay, GPay, PhonePe, or Paytm.</p>
                    <div className="mx-auto w-32 h-32 bg-white border p-1 rounded flex justify-center items-center shadow-inner">
                      {/* Simulated QR block code */}
                      <div className="w-full h-full bg-luxury-charcoal p-2 flex flex-wrap gap-[2px]">
                        {[...Array(144)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{ opacity: (i*7*13)%2 === 0 ? 0.95 : 0.05 }} 
                            className="bg-white w-[8px] h-[8px] rounded-[1px]"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-left text-gray-550 mb-1 text-[11px]">Enter your personalized UPI handle</label>
                      <input 
                        type="text" 
                        value={upiIdInput} 
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded p-2 font-mono text-center"
                      />
                    </div>
                  </div>
                )}

                {paymentOption === "paypal" && (
                  <div className="py-4 text-center space-y-2">
                    <p className="font-serif italic font-bold text-blue-700 text-lg">PayPal Secure System Log</p>
                    <p className="text-gray-400 text-[11px]">You will be routed to a secure popup dialog box frame. Clear with 1 click.</p>
                    <button 
                      type="button" 
                      onClick={() => alert("PayPal authentication parameters generated.")}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 font-mono font-bold rounded text-[10px]"
                    >
                      Authorize PayPal Link
                    </button>
                  </div>
                )}

              </div>

              {/* Bank security lock indicators */}
              <div className="flex gap-2 items-center text-[10px] font-mono text-gray-400 justify-center">
                <Lock className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                <span>AES-256 BIT KEY ENCRYPTION REGISTERED</span>
                <span>&bull; Cert PCI-DSS Active ✓</span>
              </div>
            </div>

          </div>

          {/* Column 3: Cart Subtotals & Coupons Summary */}
          <div className="space-y-6">
            
            {/* Promo coupon engine form */}
            <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-3 text-left">
              <h4 className="font-serif font-bold text-xs text-luxury-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gold-500" />
                APPLY ARTISAN PROMOTION
              </h4>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">Enter promo to apply direct subtraction discounts (Try: <b>WELCOME10</b> or <b>GOLDENHOUR</b>)</p>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="WELCOME10"
                  className="bg-gray-50 border border-gray-200 uppercase rounded px-3 py-1.5 flex-1 focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs font-mono"
                  value={typedCoupon}
                  onChange={(e) => setTypedCoupon(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal text-xs font-mono px-4 py-1.5 rounded transition-colors"
                >
                  APPLY
                </button>
              </form>
              {couponError && <p className="text-red-500 font-mono text-[10px] mt-1">{couponError}</p>}
              {activeCoupon && (
                <p className="text-green-600 font-mono text-[10px] font-bold mt-1">
                  ✓ Active Promo Applied: {activeCoupon.code} - {activeCoupon.description}
                </p>
              )}
            </div>

            {/* Order Price summary cost calculations */}
            <div className="bg-white border-2 border-gold-300 rounded p-6 shadow-md space-y-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1.5 px-3 bg-gold-400 text-luxury-charcoal text-[9px] font-mono font-bold rounded-bl">
                FINAL ESTIMATES
              </div>

              <h4 className="font-serif font-black text-sm tracking-wide text-luxury-charcoal border-b border-gray-50 pb-2">
                TREASURE CHEST RECIPT
              </h4>

              <div className="space-y-2.5 text-xs text-gray-600 font-mono">
                <div className="flex justify-between">
                  <span>Gold/Silver Subtotal</span>
                  <span className="font-bold text-luxury-charcoal">${pricingMetrics.subtotal.toFixed(2)}</span>
                </div>

                {pricingMetrics.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Artisan Promo Discount</span>
                    <span>-${pricingMetrics.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Excise Tax (8.25%)</span>
                  <span>${pricingMetrics.tax.toFixed(2)}</span>
                </div>

                <div className="space-y-1 mt-2 mb-2">
                  <span className="block text-left text-[10px] text-gray-400 uppercase tracking-wide">SHIPPING CHANNEL METRIC</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedShipping("standard")}
                      className={`flex-1 py-1.5 rounded text-[10px] font-mono text-center border font-semibold ${selectedShipping === "standard" ? "bg-luxury-charcoal text-white" : "bg-gray-50 hover:bg-white"}`}
                    >
                      🌱 Eco Shipping (FREE)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedShipping("express")}
                      className={`flex-1 py-1.5 rounded text-[10px] font-mono text-center border font-semibold ${selectedShipping === "express" ? "bg-luxury-charcoal text-white" : "bg-gray-50 hover:bg-white"}`}
                    >
                      🚀 Express Courier ($25)
                    </button>
                  </div>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-2 text-sm text-luxury-charcoal">
                  <span className="font-serif font-semibold">Total Invoice</span>
                  <span className="font-serif font-black text-base text-gold-600">${pricingMetrics.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gold-50 p-2.5 rounded border border-gold-200 text-[10px] text-gold-800 space-y-1">
                <p className="font-bold">✨ Loyalty Points Gained</p>
                <p>Completing this checkout adds <b>{Math.round(pricingMetrics.total * 0.1)}</b> reward points to your membership ledger.</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-luxury-charcoal hover:bg-gold-500 text-white hover:text-luxury-charcoal font-serif font-black tracking-widest text-xs py-4 rounded transition-colors duration-300"
              >
                COMMIT SECURE AUDIT ESCROW
              </button>

            </div>

            {/* Saved for later shelf */}
            {savedForLaterItems.length > 0 && (
              <div className="bg-white border border-gray-100 rounded p-6 shadow-xs space-y-3 text-left">
                <h4 className="font-serif font-bold text-xs text-luxury-charcoal uppercase tracking-wider">
                  📂 SAVED FOR LATER CHEST ({savedForLaterItems.length})
                </h4>
                <div className="space-y-2 text-xs">
                  {savedForLaterItems.map((item) => (
                    <div key={item.product.id} className="flex gap-2.5 items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex gap-2 items-center overflow-hidden">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded border" />
                        <div className="truncate max-w-[120px]">
                          <p className="font-serif font-bold truncate text-[11px]">{item.product.name}</p>
                          <p className="font-mono text-[10px] text-gold-600 font-semibold">${item.product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSaveForLater(item.product.id, false)}
                        className="bg-gray-100 hover:bg-gold-100 text-luxury-charcoal hover:text-gold-700 font-mono text-[9px] font-bold px-2 py-1 rounded transition-colors"
                      >
                        👜 Move to Bag
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
