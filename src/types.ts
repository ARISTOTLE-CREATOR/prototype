/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CUSTOMER = "customer",
  ARTISAN = "artisan",
  ADMIN = "admin"
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  verified: boolean;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  rating: number;
  salesCount: number;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: "necklaces" | "earrings" | "bracelets" | "rings" | "anklets" | "pendants" | "custom";
  price: number;
  originalPrice?: number;
  materials: string[];
  weight: string; // e.g., "4.2g"
  dimensions: string; // e.g., "45cm chain"
  artisan: ArtisanProfile;
  stock: number;
  images: string[]; // 3-4 images for multi-angle/360 view
  videoUrl?: string;
  ratingsAvg: number;
  reviewsCount: number;
  reviews?: Review[];
  isApproved: boolean;
  featured?: boolean;
  gemstone?: string;
  color?: string;
  occasion?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: {
    product: Product;
    quantity: number;
    priceAtPurchase: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: "placed" | "confirmed" | "processing" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "returned" | "refunded";
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  deliveryTimeline: {
    status: string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: {
    type: string; // "card" | "upi" | "paypal"
    provider?: string; // "stripe" | "razorpay" | "paypal"
    last4?: string;
  };
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  active: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "human_agent";
  text: string;
  timestamp: string;
}

export interface LoyaltyAccount {
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  memberSince: string;
}
