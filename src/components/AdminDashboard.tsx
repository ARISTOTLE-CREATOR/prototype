/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Product, Order, Coupon } from "../types";
import { 
  Building2, 
  ShieldAlert, 
  Users, 
  BadgePercent, 
  Plus, 
  Trash, 
  Star, 
  Coins, 
  Search,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { mockCoupons } from "../mockData";

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  onApproveProduct: (prodId: string) => void;
  onAddNewCoupon: (newC: Coupon) => void;
  onDeactivateCoupon: (code: string) => void;
}

export default function AdminDashboard({
  products,
  orders,
  coupons,
  onApproveProduct,
  onAddNewCoupon,
  onDeactivateCoupon
}: AdminDashboardProps) {

  // Layout Tab
  const [activeTab, setActiveTab ] = useState<"metrics" | "approvals" | "coupons" | "disputes" | "security">("metrics");

  // New Coupon Input Form states
  const [newCode, setNewCode] = useState("");
  const [newValType, setNewValType] = useState<"percentage" | "fixed">("percentage");
  const [newVal, setNewVal] = useState("10");
  const [newMin, setNewMin] = useState("0");
  const [newDesc, setNewDesc] = useState("General client discount");
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);

  // Filter products waiting for approval list
  const pendingProductsList = useMemo(() => {
    return products.filter(p => !p.isApproved);
  }, [products]);

  // Overall platform sales metrics
  const platformEarnings = useMemo(() => {
    let sum = 0;
    orders.forEach(o => {
      sum += o.total;
    });
    return sum;
  }, [orders]);

  // Mock Disputes
  const [disputes, setDisputes] = useState([
    { id: "disp_101", orderId: "AG-412211", client: "Benjamin Vance", reason: "Sizing conflict on ring", amount: 185.00, status: "pending_review" },
    { id: "disp_102", orderId: "AG-155490", client: "Elena Rostova", reason: "Shipment packing delay", amount: 320.00, status: "refunded" }
  ]);

  const handleResolveDispute = (disId: string, status: "approved" | "rejected") => {
    setDisputes(prev => prev.map(d => d.id === disId ? { ...d, status: status === "approved" ? "refunded" : "rejected" } : d));
    alert(`Dispute ${disId} resolved: Decided as ${status.toUpperCase()}. Custom refund transaction emitted.`);
  };

  // Mock Fraud Monitor Logs
  const fraudLogs = [
    { id: "fr_1", severity: "HIGH", message: "Mismatched billing zip code on cards with checkout ID AG-112249", date: "June 12, 02:11 AM", cleared: false },
    { id: "fr_2", severity: "MEDIUM", message: "Suspicious API coupon velocity rate exceeded standard user limits", date: "June 11, 11:45 PM", cleared: true },
    { id: "fr_3", severity: "LOW", message: "Multiple sessions created from distant locations using identical JWT token", date: "June 10, 08:30 PM", cleared: false }
  ];

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newVal) {
      alert("Fully supply promo string and value.");
      return;
    }

    const brandCoupon: Coupon = {
      code: newCode.toUpperCase().trim(),
      discountType: newValType,
      value: parseFloat(newVal),
      minPurchase: parseFloat(newMin) || 0,
      active: true,
      description: newDesc
    };

    onAddNewCoupon(brandCoupon);
    setNewCode("");
    setIsCouponFormOpen(false);
    alert(`Coupon code '${brandCoupon.code}' deployed on all e-commerce channels successfully!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-workspace-section">
      
      {/* Banner */}
      <div className="text-left border-b border-gray-100 pb-4 mb-6">
        <h2 className="font-serif text-2xl font-bold tracking-wide text-red-800">
          🛡️ PLATFORM ADMINISTRATOR SECURITY VAULT
        </h2>
        <p className="text-xs font-mono text-gray-400">Review listings, disputes, secure escrow transfers, audit logs</p>
      </div>

      {/* Admin Tab Navigator */}
      <div className="flex gap-2 border-b border-gray-150 pb-3 mb-6 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`py-2 px-4 rounded ${activeTab === "metrics" ? "bg-red-800 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
        >
          📈 High-Level Metrics
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={`py-2 px-4 rounded flex items-center gap-1.5 ${activeTab === "approvals" ? "bg-red-800 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
        >
          💎 Verification Pool ({pendingProductsList.length})
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`py-2 px-4 rounded ${activeTab === "coupons" ? "bg-red-800 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
        >
          🏷️ Manage Coupons ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab("disputes")}
          className={`py-2 px-4 rounded ${activeTab === "disputes" ? "bg-red-800 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
        >
          ⚖️ Client Disputes
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`py-2 px-4 rounded flex items-center gap-1.5 ${activeTab === "security" ? "bg-red-800 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
        >
          🛡️ Anti-Fraud Radar ({fraudLogs.filter(f=>!f.cleared).length})
        </button>
      </div>

      {/* Panel 1: Overall Platform Figures */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            
            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center text-gray-400 mb-1">
                <span className="text-[10px] font-mono tracking-widest font-bold">PLATFORM REVENUE</span>
                <Coins className="w-4.5 h-4.5 text-red-500" />
              </div>
              <p className="font-serif font-black text-2xl text-luxury-charcoal">${(platformEarnings + 10450.00).toFixed(2)}</p>
              <p className="text-[10px] text-green-600 font-mono mt-1">✓ Live platform fee: 8.5%</p>
            </div>

            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center text-gray-400 mb-1">
                <span className="text-[10px] font-mono tracking-widest font-bold">ACTIVE CREATORS</span>
                <Building2 className="w-4.5 h-4.5 text-red-500" />
              </div>
              <p className="font-serif font-black text-2xl text-luxury-charcoal">3 Registered</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">Pending licenses: 0</p>
            </div>

            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center text-gray-400 mb-1">
                <span className="text-[10px] font-mono tracking-widest font-bold">TOTAL CONSUMERS</span>
                <Users className="w-4.5 h-4.5 text-red-500" />
              </div>
              <p className="font-serif font-black text-2xl text-luxury-charcoal">1,421 Users</p>
              <p className="text-[10px] text-green-600 font-mono mt-1">▲ 8.1% Monthly growth</p>
            </div>

            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center text-gray-400 mb-1">
                <span className="text-[10px] font-mono tracking-widest font-bold">COMPLETED SHIPMENTS</span>
                <CheckCircle className="w-4.5 h-4.5 text-red-500" />
              </div>
              <p className="font-serif font-black text-2xl text-luxury-charcoal">{orders.length + 42} Delivered</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">100% signature secured</p>
            </div>

          </div>

          <div className="bg-red-50 p-4 border border-red-200 rounded text-left flex gap-3 text-xs text-red-800">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Automated Security Auditing</p>
              <p className="text-gray-600 mt-1">
                ArtisanGems security suite is running perfectly. All active credit card and UPI transactions have passed standard compliance checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Panel 2: Product Listing approvals pool */}
      {activeTab === "approvals" && (
        <div className="space-y-4 text-left">
          <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b pb-2">Listing Verification Pool</h3>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Sellers cannot showcase new gems publicly until an Administrator verifies their gold assay marks and ethis-conflict clearances.
          </p>

          {pendingProductsList.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 border rounded text-xs text-gray-400 font-mono">
              ✓ Verification Pool is clean. All active artisan listings have been authorized.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProductsList.map((prod) => (
                <div key={prod.id} className="bg-white border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="flex gap-4 items-center">
                    <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 object-cover rounded border" />
                    <div>
                      <h4 className="font-serif font-bold text-luxury-charcoal">{prod.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        Artisan: <b>{prod.artisan.name}</b> &bull; Asked: ${prod.price.toFixed(2)} &bull; Weight: {prod.weight}
                      </p>
                      <p className="text-[10px] text-gray-550 mt-1">Alloys: {prod.materials.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveProduct(prod.id)}
                      className="bg-green-600 text-white hover:bg-green-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded transition-all"
                    >
                      ✓ AUTHORIZE HALLMARKS (APPROVE)
                    </button>
                    <button
                      onClick={() => alert("Flagged for metallurgical review.")}
                      className="bg-red-100 text-red-600 hover:bg-red-250 font-mono text-[10px] px-3 py-1.5 rounded transition-all"
                    >
                      ⚠️ HOLD (REQUEST RE-AUDIT)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Panel 3: Coupons management */}
      {activeTab === "coupons" && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-luxury-charcoal">Global Coupon Registry</h3>
            <button
              onClick={() => setIsCouponFormOpen(!isCouponFormOpen)}
              className="bg-red-800 text-white hover:bg-red-750 font-mono text-xs py-1 px-3 rounded flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> CREATE PROMO COUPON
            </button>
          </div>

          {/* New promo create form */}
          {isCouponFormOpen && (
            <form onSubmit={handleCreateCoupon} className="p-4 bg-red-50/20 border border-red-300 rounded gap-4 grid grid-cols-1 md:grid-cols-4 text-xs font-sans">
              <div>
                <label className="block text-gray-500 mb-1">Coupon string code</label>
                <input 
                  type="text" 
                  value={newCode} 
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. SUMMEREXCLUSIVE" 
                  required 
                  className="w-full bg-white border rounded p-1.5 font-mono text-xs uppercase" 
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Type</label>
                <select 
                  className="w-full bg-white border rounded p-1.5"
                  value={newValType}
                  onChange={(e) => setNewValType(e.target.value as any)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Flat ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Volume Value</label>
                <input 
                  type="number" 
                  value={newVal} 
                  onChange={(e) => setNewVal(e.target.value)}
                  required 
                  className="w-full bg-white border rounded p-1.5 font-mono" 
                />
              </div>

              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="w-full bg-red-800 text-white p-2 text-xs font-mono font-bold rounded"
                >
                  DEPLOY COUPON
                </button>
              </div>
            </form>
          )}

          {/* Coupons Table */}
          <div className="border rounded overflow-hidden divide-y divide-gray-100 font-mono text-xs">
            <div className="p-3 bg-gray-50 flex justify-between font-bold text-luxury-charcoal">
              <span>Code</span>
              <span>Specs & Description</span>
              <span>Status</span>
            </div>
            {coupons.map((c) => (
              <div key={c.code} className="p-3 bg-white flex justify-between items-center">
                <span className="font-semibold text-red-800">{c.code}</span>
                <span className="text-gray-500 text-left font-sans">{c.discountType === 'percentage' ? `${c.value}% discount` : `$${c.value} discount`} - {c.description}</span>
                <div>
                  {c.active ? (
                    <button
                      onClick={() => onDeactivateCoupon(c.code)}
                      className="text-[10px] text-red-500 border border-red-150 py-0.5 px-2 rounded hover:bg-red-50"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <span className="text-gray-400 font-sans text-[10px]">Inactive</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Panel 4: Dispute tickets center */}
      {activeTab === "disputes" && (
        <div className="space-y-4 text-left">
          <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b pb-2">Client Dispute Tickets</h3>
          
          <div className="space-y-3">
            {disputes.map((d) => (
              <div key={d.id} className="bg-white border rounded p-4 text-xs space-y-3">
                <div className="flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-red-800">TICKET #{d.id}</span>
                    <span className="text-gray-400 text-[10px] ml-2">Referenced Order: {d.orderId}</span>
                  </div>
                  <span className={`py-0.5 px-2 rounded text-[10px] font-mono leading-none ${d.status === 'refunded' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                    {d.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-550 border-t pt-2">
                  <p>Client: <b>{d.client}</b></p>
                  <p>Reason: <b>{d.reason}</b></p>
                  <p>Disputed Sum: <b>${d.amount}</b></p>
                </div>

                {d.status === "pending_review" && (
                  <div className="flex gap-2 justify-end pt-2 border-t">
                    <button
                      onClick={() => handleResolveDispute(d.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white font-mono text-[10px] px-3 py-1 rounded"
                    >
                      ✓ ISSUE CLIENT REFUND
                    </button>
                    <button
                      onClick={() => handleResolveDispute(d.id, "rejected")}
                      className="bg-gray-150 text-gray-500 font-mono text-[10px] px-3 py-1 rounded"
                    >
                      Dismiss flag
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel 5: Fraud Security logs and suspicious transaction monitor */}
      {activeTab === "security" && (
        <div className="space-y-4 text-left font-mono text-xs">
          <h3 className="font-serif text-lg font-bold text-luxury-charcoal border-b pb-2">Anti-Fraud Compliance Radar</h3>
          
          <div className="space-y-3">
            {fraudLogs.map((log) => (
              <div key={log.id} className="bg-neutral-900 text-green-400 p-4 rounded border border-gray-100 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold px-2 py-0.5 rounded text-[8px] tracking-widest ${log.severity === 'HIGH' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
                      {log.severity} RISK
                    </span>
                    <span className="text-gray-500 text-[10px]">{log.date}</span>
                  </div>
                  <p className="font-sans text-gray-200 text-[11px] leading-relaxed">{log.message}</p>
                </div>

                <span className="text-[10px] text-green-500 bg-green-900/30 px-2 py-0.5 rounded border border-green-750 font-bold">
                  {log.cleared ? "SECURED ✓" : "INVESTIGATING ●"}
                </span>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
