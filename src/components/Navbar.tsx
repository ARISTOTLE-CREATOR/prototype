/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Gem, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  LogOut, 
  Smartphone, 
  KeyRound, 
  Chrome, 
  Apple 
} from "lucide-react";
import { UserRole } from "../types";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  cartCount,
  onCartClick,
  onWishlistClick,
  onDashboardClick,
  onHomeClick,
  searchTerm,
  onSearchChange
}: NavbarProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default logged in
  const [authEmail, setAuthEmail] = useState("sainithin172005@gmail.com");
  const [authPassword, setAuthPassword] = useState("********");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [activeTab, setActiveTab ] = useState<"login" | "signup" | "settings">("settings");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Suggestions search state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch AI search suggestions from the server
  useEffect(() => {
    if (!searchTerm.trim()) {
      setAiSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/ai-suggest-search?q=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          if (data.suggestions) {
            setAiSuggestions(data.suggestions);
          }
        })
        .catch(err => {
          console.error("Failed to fetch suggestions:", err);
          // Fallback suggestions
          setAiSuggestions([
            `${searchTerm} custom emerald rings`,
            `${searchTerm} premium 18k necklace`,
            `handcrafted ${searchTerm} bracelets`
          ]);
        });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSuggestionClick = (item: string) => {
    onSearchChange(item);
    setShowSuggestions(false);
  };

  const handleSocialLogin = (platform: string) => {
    setIsLoggedIn(true);
    alert(`Successfully simulated luxury single-sign-on secure session via ${platform}! JWT Generated.`);
    setIsAuthOpen(false);
  };

  const handleOtpRequest = () => {
    setOtpSent(true);
    alert("Phone OTP Code Sim: An encrypted code 4482 has been sent to your verified device.");
  };

  const handleVerifyOtp = () => {
    if (otpCode === "4482" || otpCode === "1234") {
      setOtpVerified(true);
      alert("Multi-Factor OTP Authenticated successfully. Secure session initialized.");
    } else {
      alert("Invalid verification code. Enter '4482' to simulate successful authorization.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#E5E1D8] luxury-glow">
        {/* Top Announcement Ribbon */}
        <div className="bg-[#1A1A1A] text-white text-[10px] font-mono tracking-[0.25em] py-2.5 px-4 text-center flex justify-between items-center overflow-x-auto gap-4">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            COMPLIMENTARY CRATED ECO-SHIPPING ON ALL HANDMADE COMMISSIONS
          </span>
          <div className="flex gap-4">
            <span className="opacity-80">CURRENCY: USD ($)</span>
            <span className="text-[#C5A059] font-bold">EST. DELIVERIES: ON SCHEDULE</span>
          </div>
        </div>

        {/* Primary Navbar Inner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center gap-4">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick} id="brand-logo">
              <div className="relative p-2 bg-[#1A1A1A] text-white rounded-xs">
                <Gem className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl italic tracking-tighter text-[#1A1A1A] leading-none">
                  ArtisanGems
                </span>
                <span className="text-[8px] font-mono tracking-[0.3em] text-[#C5A059] mt-1 leading-none uppercase">
                  Prestige Handcraft Jewelry
                </span>
              </div>
            </div>

            {/* Smart AI Search (Web Desktop View) */}
            <div className="hidden md:flex flex-1 max-w-lg relative" id="search-box">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Seeking rare jewelry, diamonds..."
                  className="w-full bg-[#F5F2ED] border-none text-xs py-2.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C5A059]/50 font-sans focus:bg-white transition-all text-[#1A1A1A]"
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
              </div>

              {/* Autocomplete Box with AI suggestions */}
              {showSuggestions && aiSuggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-[#FDFBF7] border border-[#E5E1D8] rounded shadow-2xl z-50 overflow-hidden text-left luxury-glow">
                  <div className="bg-[#F5F2ED] px-3 py-2 text-[9px] font-mono tracking-[0.2em] text-[#C5A059] border-b border-[#E5E1D8] flex items-center justify-between">
                    <span>AI SMART SEARCH SUGGESTIONS</span>
                    <button onClick={() => setShowSuggestions(false)} className="hover:text-gold-800">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <ul>
                    {aiSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2.5 text-xs text-gray-700 hover:bg-[#F5F2ED] hover:text-[#C5A059] cursor-pointer transition-all border-b border-gray-100 last:border-0 flex items-center gap-2"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Role Manager Toggle (Premium Platform Control) */}
            <div className="flex items-center gap-1.5 bg-[#F5F2ED] p-1 rounded-full border border-[#E5E1D8]" id="role-selector">
              <span className="hidden sm:inline-block text-[9px] font-mono text-[#C5A059] px-2 tracking-widest uppercase font-bold">PORTAL:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent border-0 text-xs font-mono text-[#1A1A1A] focus:outline-none font-semibold cursor-pointer pr-2"
              >
                <option value={UserRole.CUSTOMER}>🛒 Customer</option>
                <option value={UserRole.ARTISAN}>⚒️ Artisan Seller</option>
                <option value={UserRole.ADMIN}>🛡️ Administrator</option>
              </select>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-3">
              {/* Wishlist */}
              <button 
                onClick={onWishlistClick}
                className="p-2 hover:text-[#C5A059] text-[#1A1A1A] transition-all relative hover:scale-105" 
                title="Wishlist"
                id="wishlist-btn"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Cart Button */}
              <button 
                onClick={onCartClick}
                className="p-2 hover:text-[#C5A059] text-[#1A1A1A] transition-all relative flex items-center hover:scale-105" 
                title="Cart Bag"
                id="cart-btn"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#C5A059] text-[#1A1A1A] text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth Button */}
              <button 
                onClick={() => setIsAuthOpen(true)}
                className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 ${isLoggedIn ? 'text-[#C5A059] border border-[#E5E1D8] bg-[#F5F2ED]' : 'text-gray-500 border border-gray-100'}`}
                title="Account Settings"
                id="account-btn"
              >
                <User className="w-4 h-4 stroke-[2]" />
                {isLoggedIn && <span className="hidden lg:inline text-[9px] font-mono tracking-tight font-medium max-w-[80px] truncate">{authEmail}</span>}
              </button>

              {/* Mobile hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1 text-[#1A1A1A] hover:text-[#C5A059]"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Search & Menu Links Dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-[#FDFBF7] border-t border-[#E5E1D8] md:hidden p-4 space-y-3">
            {/* Search Input for Mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Seek jewelry, gemstones, materials..."
                className="w-full bg-[#F5F2ED] border-0 text-xs py-2 pl-3 pr-8 rounded-full focus:ring-1 focus:ring-[#C5A059]"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex justify-around items-center pt-2 font-mono text-[9px] uppercase tracking-wider text-gray-600">
              <button onClick={onHomeClick} className="hover:text-[#C5A059] font-semibold">🏠 HOME</button>
              <button onClick={onDashboardClick} className="hover:text-[#C5A059] font-semibold">🛠️ DASHBOARD</button>
              <button onClick={onWishlistClick} className="hover:text-[#C5A059] font-semibold">💖 WISHLIST</button>
              <button onClick={onCartClick} className="hover:text-[#C5A059] font-semibold">🛒 BAG ({cartCount})</button>
            </div>
          </div>
        )}
      </header>

      {/* LUXURY ACCOUNT / AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-gray-100 rounded p-6 shadow-2xl text-left luxury-glow" id="auth-modal">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
                <h3 className="font-serif text-lg tracking-widest font-semibold text-luxury-charcoal">
                  ARTISANGEMS VAULT
                </h3>
              </div>
              <button onClick={() => setIsAuthOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auth Sub-Tabs */}
            <div className="flex border-b border-gray-100 text-xs font-mono text-center mb-4">
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 border-b-2 ${activeTab === "settings" ? "border-gold-500 text-gold-600 font-bold" : "border-transparent text-gray-500"}`}
              >
                🔐 SESSION & PRIVACY
              </button>
              <button 
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 border-b-2 ${activeTab === "login" ? "border-gold-500 text-gold-600 font-bold" : "border-transparent text-gray-500"}`}
              >
                📧 EMAIL ACCESS
              </button>
              <button 
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 border-b-2 ${activeTab === "signup" ? "border-gold-500 text-gold-600 font-bold" : "border-transparent text-gray-500"}`}
              >
                🆕 CREATE DEPOSIT
              </button>
            </div>

            {/* Tab 1: Profile & Security settings (MFA, Device) */}
            {activeTab === "settings" && (
              <div className="space-y-4 text-xs font-sans">
                {isLoggedIn ? (
                  <>
                    <div className="bg-gold-50 p-3 rounded border border-gold-100 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gold-800">Verified ArtisanGems Account</p>
                        <p className="text-gray-500 text-[11px] font-mono">{authEmail}</p>
                      </div>
                      <button 
                        onClick={() => { setIsLoggedIn(false); alert("Session terminated."); }}
                        className="text-[10px] bg-white border border-gray-200 text-red-500 rounded py-1 px-2 hover:bg-red-50 hover:border-red-200 font-mono"
                      >
                        Sign Out
                      </button>
                    </div>

                    {/* Simulating MFA toggles */}
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-luxury-charcoal">Multi-Factor Authentication (MFA)</p>
                          <p className="text-gray-400 text-[10px]">Secure your transactions via quick phone OTP tokening</p>
                        </div>
                        <input 
                          type="checkbox"
                          checked={mfaEnabled}
                          onChange={(e) => {
                            setMfaEnabled(e.target.checked);
                            alert(`MFA simulation is now ${e.target.checked ? "enabled" : "disabled"}.`);
                          }}
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {mfaEnabled && (
                        <div className="bg-gray-50 p-2.5 rounded border border-gray-200 mt-2">
                          <p className="font-mono text-[10px] text-gray-500 mb-1.5 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-gold-500" />
                            TELEPHONE PIN CHECK: +1 (555) ***-4482
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="MFA OTP Pin" 
                              className="bg-white border text-[11px] rounded px-2 py-1 w-28 text-center focus:outline-gold-400 font-mono"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                            />
                            {!otpSent ? (
                              <button 
                                onClick={handleOtpRequest}
                                className="bg-luxury-charcoal text-white rounded text-[10px] px-2.5 py-1 font-mono hover:bg-gold-600 transition-colors"
                              >
                                Request OTP
                              </button>
                            ) : (
                              <button 
                                onClick={handleVerifyOtp}
                                className="bg-gold-500 text-luxury-charcoal rounded text-[10px] px-2.5 py-1 font-mono hover:bg-gold-400 transition-colors font-bold"
                              >
                                Verify Cod
                              </button>
                            )}
                          </div>
                          {otpVerified && <p className="text-green-600 text-[10px] font-semibold mt-1">Verified Device ✓</p>}
                        </div>
                      )}
                    </div>

                    {/* Simulating Secure JWT Details */}
                    <div className="bg-gray-50 p-2.5 rounded text-[10px] font-mono text-gray-500 space-y-1">
                      <p className="text-gold-600 font-bold tracking-wider">SECURE JWT SESSION LOG</p>
                      <p>Issuer: api.artisangems.net</p>
                      <p>Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...[active]</p>
                      <p>Active Devices: (1) Chrome Frame (This device) [Primary]</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">You are browsing as an anonymous luxury guests.</p>
                    <button 
                      onClick={() => setIsLoggedIn(true)}
                      className="bg-gold-400 text-luxury-charcoal font-semibold rounded py-2 px-4 shadow font-mono text-xs hover:bg-gold-500 transition-all"
                    >
                      Initialize Guest Account Secure Session
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Custom login via standard / socials */}
            {activeTab === "login" && (
              <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setIsAuthOpen(false); alert("Logged in as: " + authEmail); }} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Email address</label>
                  <input 
                    type="email" 
                    required 
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Secure Password</label>
                  <input 
                    type="password" 
                    required 
                    value={authPassword} 
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-gold-500 focus:outline-none" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-luxury-charcoal text-white rounded font-mono font-medium tracking-wide hover:bg-gold-500 transition-colors"
                >
                  SIGN IN TO ARTISANGEMS VIA SECURE JWT
                </button>

                {/* Social logins */}
                <div className="pt-3 border-t border-gray-100 text-center space-y-2">
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Or Single-Sign-On instantly via</p>
                  <div className="flex gap-2.5 justify-center">
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin("Google")}
                      className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded py-1.5 px-2.5 text-[10px] hover:bg-gray-100 font-mono transition-all"
                    >
                      <Chrome className="w-3 h-3 text-red-500" /> Google
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin("Apple")}
                      className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded py-1.5 px-2.5 text-[10px] hover:bg-gray-100 font-mono transition-all"
                    >
                      <Apple className="w-3 h-3 text-black" /> Apple
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin("Facebook")}
                      className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded py-1.5 px-2.5 text-[10px] hover:bg-gray-100 font-mono transition-all"
                    >
                      🌟 Facebook
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Tab 3: Create Vault account */}
            {activeTab === "signup" && (
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Create Display Name</label>
                  <input type="text" placeholder="e.g. S. Nithin" className="w-full bg-gray-50 border border-gray-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Email address</label>
                  <input type="email" placeholder="user@domain.com" className="w-full bg-gray-50 border border-gray-200 rounded p-2" />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Passphrase</label>
                  <input type="password" placeholder="•••••••••" className="w-full bg-gray-50 border border-gray-200 rounded p-2" />
                </div>
                <div className="flex gap-2 items-center">
                  <input type="checkbox" defaultChecked className="accent-gold-500" />
                  <span className="text-[10px] text-gray-400">Accept gold jewelry certificate validation terms</span>
                </div>

                <button 
                  onClick={() => { setIsLoggedIn(true); setActiveTab("settings"); alert("Created account successfully!"); }}
                  className="w-full py-2 bg-gold-400 text-luxury-charcoal rounded font-mono font-bold tracking-wide hover:bg-gold-500 transition-colors"
                >
                  DEPOSIT BRAND NEW PROFILE
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
