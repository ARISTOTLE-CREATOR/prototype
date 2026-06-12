/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { UserRole, Product, CartItem, Order, Coupon, LoyaltyAccount, ArtisanProfile } from "./types";
import { mockProducts, mockCoupons, mockArtisans } from "./mockData";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetailModal from "./components/ProductDetailModal";
import CartView from "./components/CartView";
import CustomerDashboard from "./components/CustomerDashboard";
import SellerDashboard from "./components/SellerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AIChatSupport from "./components/AIChatSupport";

import { MessageSquare, Heart, Shield, Crown, HelpCircle } from "lucide-react";

export default function App() {
  
  // App Global states
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [activeSection, setActiveSection] = useState<"home" | "cart" | "dashboard">("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Models list state (populated initially with mock data)
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [artisan, setArtisan] = useState<ArtisanProfile>(mockArtisans[0]); // Elena Rostova default

  // Customer state bags
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1450); // Gold level starting points

  // Initial dummy orders representing past transactions to display live tracking timelines right away!
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "AG-412211",
      date: "June 08, 2026",
      items: [
        {
          product: mockProducts[0], // Emerald Celestial Ring
          quantity: 1,
          priceAtPurchase: 185.00
        }
      ],
      subtotal: 185.00,
      discount: 0,
      tax: 15.26,
      shipping: 0,
      total: 200.26,
      status: "shipped",
      trackingNumber: "TRK772810931",
      carrier: "FedEx Premium White Glove",
      estimatedDelivery: "Tomorrow by 3:00 PM",
      deliveryTimeline: [
        { status: "Order Placed", timestamp: "June 08, 10:14 AM", description: "Payment securely cleared by Stripe Gateway.", completed: true },
        { status: "Payment Confirmed", timestamp: "June 08, 11:20 AM", description: "Verified hallmarks purity assay certificate.", completed: true },
        { status: "Processing & Crafting", timestamp: "June 09, 04:30 PM", description: "Artisan Aurelius completed hand-filigree soldering.", completed: true },
        { status: "Packed & Shipped", timestamp: "June 10, 09:12 AM", description: "Shipped in protective cedarwood casing.", completed: true },
        { status: "Delivered", timestamp: "Pending", description: "Awaiting signature delivery confirmation.", completed: false }
      ],
      shippingAddress: {
        fullName: "S. Nithin",
        addressLine1: "1024 Emerald Highstreet, Suite 17",
        city: "San Francisco",
        state: "CA",
        postalCode: "94103",
        phone: "+1 (555) 448-2121"
      },
      paymentMethod: {
        type: "card",
        provider: "Stripe Gateway Secure",
        last4: "4482"
      }
    }
  ]);

  // Modals & Chat support drawers states
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContextProduct, setChatContextProduct] = useState<Product | null>(null);

  // Compute total pieces inside active cart bag
  const activeCartCount = useMemo(() => {
    return cartItems.filter(i => !i.savedForLater).reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  // Compute loyalty structures
  const loyaltyProfile = useMemo<LoyaltyAccount>(() => {
    let tier: "Bronze" | "Silver" | "Gold" | "Platinum" = "Bronze";
    if (loyaltyPoints >= 3000) tier = "Platinum";
    else if (loyaltyPoints >= 1200) tier = "Gold";
    else if (loyaltyPoints >= 500) tier = "Silver";

    return {
      points: loyaltyPoints,
      tier,
      nextTierPoints: tier === "Bronze" ? 500 : tier === "Silver" ? 1200 : tier === "Gold" ? 3000 : 99999,
      memberSince: "June 2026"
    };
  }, [loyaltyPoints]);

  // Callback functions
  const handleAddToCart = (product: Product, qty: number) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id && !item.savedForLater);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      }
      return [...prev, { product, quantity: qty, savedForLater: false }];
    });
  };

  const handleUpdateQty = (pId: string, newQty: number) => {
    setCartItems(prev => prev.map(item => item.product.id === pId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (pId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== pId));
  };

  const handleSaveForLater = (pId: string, flag: boolean) => {
    setCartItems(prev => prev.map(item => item.product.id === pId ? { ...item, savedForLater: flag } : item));
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const handlePriceDropToggle = (pId: string) => {
    // handled locally inside Dashboard but we can propagate
    console.log("Toggle price drop preference alert for:", pId);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // clear checkout bag
    setCartItems(prev => prev.filter(i => i.savedForLater)); // keep saved for later items
    // gain rewards points
    const pointsGained = Math.round(newOrder.total * 0.1);
    setLoyaltyPoints(p => p + pointsGained);
    // advance section to dashboard
    setActiveSection("dashboard");
  };

  // Artisan Actions inside Seller panel
  const handleAddNewProductCreated = (newP: Product) => {
    setProducts(prev => [newP, ...prev]);
  };

  const handleUpdateOrderStatus = (oId: string, status: any) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== oId) return o;
      
      const friendlyStatusMapping: Record<string, string> = {
        placed: "Order Placed",
        confirmed: "Payment Confirmed",
        processing: "Processing & Crafting",
        packed: "Packed & Shipped",
        shipped: "Shipped",
        delivered: "Delivered"
      };

      const stepCheck = friendlyStatusMapping[status] || status;

      const updatedTimeline = o.deliveryTimeline.map((step) => {
        if (step.status.toLowerCase().includes(status.toLowerCase()) || 
            (status === "confirmed" && step.status.includes("Payment")) ||
            (status === "processing" && step.status.includes("Crafting")) ||
            (status === "packed" && step.status.includes("Packed")) ||
            (status === "shipped" && step.status.includes("Shipped")) ||
            (status === "delivered" && step.status.includes("Delivered"))
        ) {
          return { ...step, completed: true, timestamp: "Just Now" };
        }
        
        // auto succeed preceding actions in order
        if (status === "processing" && (step.status.includes("Placed") || step.status.includes("Payment"))) {
          return { ...step, completed: true };
        }
        if (status === "packed" && (step.status.includes("Placed") || step.status.includes("Payment") || step.status.includes("Crafting"))) {
          return { ...step, completed: true };
        }
        if (status === "shipped" && (step.status.includes("Placed") || step.status.includes("Payment") || step.status.includes("Crafting") || step.status.includes("Packed"))) {
          return { ...step, completed: true };
        }
        if (status === "delivered") {
          return { ...step, completed: true, timestamp: "Delivered" };
        }
        return step;
      });

      return {
        ...o,
        status: status,
        deliveryTimeline: updatedTimeline,
        estimatedDelivery: status === "delivered" ? "Delivered" : o.estimatedDelivery
      };
    }));
  };

  const handleUpdateArtisanProfile = (updated: ArtisanProfile) => {
    setArtisan(updated);
  };

  // Admin Actions inside Platform Panel
  const handleApproveProductFromPool = (prodId: string) => {
    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, isApproved: true } : p));
  };

  const handleAddNewPromoCoupon = (newC: Coupon) => {
    setCoupons(prev => [newC, ...prev]);
  };

  const handleDeactivatePromoCoupon = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: false } : c));
  };

  // Direct contact to artisan triggers Support Chat slideout
  const handleContactArtisanClick = (artisanName: string, productContext: Product) => {
    setChatContextProduct(productContext);
    setChatOpen(true);
  };

  // Header category link
  const handleSelectHeaderCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveSection("home");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col text-[#1A1A1A] select-none antialiased selection:bg-[#C5A059]/35">
      
      {/* 1. Header Toolbar Navbar */}
      <Navbar 
        currentRole={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          // if role is seller or admin, auto shift view to Dashboard so they can manage aspects immediately!
          if (newRole === UserRole.ARTISAN || newRole === UserRole.ADMIN) {
            setActiveSection("dashboard");
          } else {
            setActiveSection("home");
          }
        }}
        cartCount={activeCartCount}
        onCartClick={() => { setActiveSection("cart"); }}
        onWishlistClick={() => { setActiveSection("dashboard"); }}
        onDashboardClick={() => { setActiveSection("dashboard"); }}
        onHomeClick={() => { setActiveSection("home"); setSelectedCategory("all"); setSearchTerm(""); }}
        searchTerm={searchTerm}
        onSearchChange={(value) => { setSearchTerm(value); if (activeSection !== 'home') setActiveSection('home'); }}
      />

      {/* 2. Main body switch panels */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: HOME PAGE CLIENT CATALOG */}
        {activeSection === "home" && (
          <div className="space-y-6 animate-fade-in">
            {/* Display Hero search slider only if no active text searches is filtering */}
            {!searchTerm && (
              <Hero 
                selectedCategory={selectedCategory}
                onCategorySelected={setSelectedCategory}
              />
            )}

            <ProductCatalog 
              products={products.filter(p => p.isApproved)} // only approved items are visible to customer!
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              onProductClick={(product) => setSelectedDetailProduct(product)}
            />
          </div>
        )}

        {/* VIEW 2: CART VIEW SYSTEM */}
        {activeSection === "cart" && (
          <div className="animate-slide-up bg-white py-4 shadow-inner min-h-[500px]">
            <CartView 
              cartItems={cartItems}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onSaveForLater={handleSaveForLater}
              onOrderCompleted={handleOrderCompleted}
              onClose={() => setActiveSection("home")}
              loyaltyPoints={loyaltyPoints}
            />
          </div>
        )}

        {/* VIEW 3: SECURE ROLE-SPECIFIC DASHBOARDS */}
        {activeSection === "dashboard" && (
          <div className="animate-fade-in">
            
            {/* Customer view */}
            {role === UserRole.CUSTOMER && (
              <CustomerDashboard 
                orders={orders}
                wishlist={wishlist}
                loyalty={loyaltyProfile}
                onSelectProduct={(p) => setSelectedDetailProduct(p)}
                onAddToCart={handleAddToCart}
                onPriceDropToggle={handlePriceDropToggle}
              />
            )}

            {/* Seller / Artisan view */}
            {role === UserRole.ARTISAN && (
              <SellerDashboard 
                products={products}
                orders={orders}
                onAddNewProduct={handleAddNewProductCreated}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                artisan={artisan}
                onUpdateArtisanProfile={handleUpdateArtisanProfile}
              />
            )}

            {/* Admin view */}
            {role === UserRole.ADMIN && (
              <AdminDashboard 
                products={products}
                orders={orders}
                coupons={coupons}
                onApproveProduct={handleApproveProductFromPool}
                onAddNewCoupon={handleAddNewPromoCoupon}
                onDeactivateCoupon={handleDeactivatePromoCoupon}
              />
            )}

          </div>
        )}

      </main>

      {/* 3. Global detail rotation modal */}
      {selectedDetailProduct && (
        <ProductDetailModal 
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onAddToCart={(product, qty) => { handleAddToCart(product, qty); }}
          onAddToWishlist={handleAddToWishlist}
          onContactArtisanClick={handleContactArtisanClick}
          allProducts={products.filter(p => p.isApproved)}
        />
      )}

      {/* 4. Support Stylist Chatbot Slideout */}
      <AIChatSupport 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        selectedProductContext={chatContextProduct}
      />

      {/* 5. Floating button bottom right for Chat Support */}
      <button
        onClick={() => { setChatOpen(!chatOpen); setChatContextProduct(null); }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#C5A059] hover:text-[#1A1A1A] rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border border-[#E5E1D8]/20 group scale-102 hover:rotate-3"
        title="Open Jewelry Consultant Chat"
        id="floating-chat-trigger"
      >
        <MessageSquare className="w-6 h-6 stroke-[1.5]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-mono text-[10px] font-bold group-hover:ml-2.5 uppercase tracking-[0.2em] leading-none">
          咨询 Concierge
        </span>
      </button>

      {/* 6. Comprehensive site bottom footer */}
      <footer className="bg-[#1A1A1A] border-t border-[#E5E1D8]/10 py-12 text-[#E5E1D8] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs font-sans text-gray-400">
          
          <div className="space-y-4">
            <h4 className="font-serif font-light text-[#C5A059] text-base tracking-widest uppercase">ArtisanGems</h4>
            <p className="leading-relaxed text-[11px] text-gray-400 opacity-90">
              A premium, mobile-first e-commerce ledger dedicated to providing a luxury handmade jewelry experience for independent silversmiths and clients worldwide. Inspired by Florence, Prague, and London goldsmith heritage.
            </p>
            <p className="font-mono text-[9px] text-[#C5A059] opacity-50 uppercase tracking-widest">© 2026 ArtisanGems Inc. All hallmarks verified.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-medium text-white text-xs uppercase tracking-widest">Precious Alloys</h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li><button onClick={() => handleSelectHeaderCategory("rings")} className="hover:text-[#C5A059] text-left uppercase font-mono tracking-widest text-[9px]">💍 Solitaire Rings</button></li>
              <li><button onClick={() => handleSelectHeaderCategory("necklaces")} className="hover:text-[#C5A059] text-left uppercase font-mono tracking-widest text-[9px]">📿 Filigree Necklaces</button></li>
              <li><button onClick={() => handleSelectHeaderCategory("earrings")} className="hover:text-[#C5A059] text-left uppercase font-mono tracking-widest text-[9px]">✨ Faceted Earrings</button></li>
              <li><button onClick={() => handleSelectHeaderCategory("bracelets")} className="hover:text-[#C5A059] text-left uppercase font-mono tracking-widest text-[9px]">⌾ Hammered Bracelets</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-medium text-white text-xs uppercase tracking-widest">Ethics & Assay</h4>
            <ul className="space-y-2 leading-relaxed text-[11px] text-gray-400">
              <li className="flex items-center gap-1.5 font-light">✓ 100% Conflict-Free Minerals</li>
              <li className="flex items-center gap-1.5 font-light">✓ 925 Hallmark Quality Assay</li>
              <li className="flex items-center gap-1.5 font-light">✓ Direct-to-Artisan Escrows</li>
              <li className="flex items-center gap-1.5 font-light">✓ Reclaimed Gold Plating Slots</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-medium text-white text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#C5A059] shrink-0" /> VIP Elite Council
            </h4>
            <p className="leading-relaxed text-[11px] text-gray-400 opacity-90">
              Are you a certified silversmith? Register your workshop brand in Prague, Praha, or London today. Receive instant approval and access premium 8.5% flat commissions slots.
            </p>
            <button
              onClick={() => { setRole(UserRole.ARTISAN); setActiveSection("dashboard"); }}
              className="bg-[#C5A059] hover:bg-[#A88339] text-[#1A1A1A] text-[9px] font-mono font-bold py-2 px-4 rounded-none uppercase tracking-[0.2em] transition-all"
            >
              REGISTER WORKSHOP
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
