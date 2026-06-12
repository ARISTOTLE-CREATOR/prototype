/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon, ArtisanProfile, UserRole, Review } from "./types";

export const mockArtisans: ArtisanProfile[] = [
  {
    id: "art_1",
    name: "Elena Rostova",
    bio: "Passionate silversmith specializing in custom, high-detail wire wrapping and gemstone mounting with roots in Traditional European metalwork.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    rating: 4.9,
    salesCount: 1420,
    location: "Prague, Czech Republic"
  },
  {
    id: "art_2",
    name: "Aurelius Smith",
    bio: "Fine jeweler with a master's degree in sculpture. Specializes in luxury 18k and 24k gold-plated filigree, capturing ancient motifs with a modern luxury touch.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 4.8,
    salesCount: 890,
    location: "Florence, Italy"
  },
  {
    id: "art_3",
    name: "Meera Patel",
    bio: "Creating sustainable, contemporary everyday statement pieces using ethically sourced recycled sterling silver and lab-grown diamonds.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    rating: 4.95,
    salesCount: 2310,
    location: "London, UK"
  }
];

export const mockCoupons: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    value: 10,
    minPurchase: 0,
    active: true,
    description: "Enjoy 10% off on your first order!"
  },
  {
    code: "GOLDENHOUR",
    discountType: "fixed",
    value: 50,
    minPurchase: 250,
    active: true,
    description: "$50 off on orders of $250 or more."
  },
  {
    code: "ARTISANPRIDE",
    discountType: "percentage",
    value: 15,
    minPurchase: 100,
    active: true,
    description: "15% off coupon celebrating our master silversmiths."
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "Aurelia Celestial Emerald Ring",
    description: "Adorn yourself with this masterful handcrafted ring, highlighting a radiant-cut emerald wrapped in 18k premium gold on solid sterling silver. Each piece is intricately sculpted with micro-engravings that reflect cosmic constellations under different angles of light.",
    category: "rings",
    price: 185.00,
    originalPrice: 220.00,
    materials: ["18k Gold Plating", "925 Sterling Silver", "Natural Emerald"],
    weight: "3.6g",
    dimensions: "Size 7 (custom sizes available on request)",
    artisan: mockArtisans[1], // Aurelius
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80", // angle 1
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80", // angle 2 (looks like hands/details)
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80"  // angle 3
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    ratingsAvg: 4.9,
    reviewsCount: 34,
    isApproved: true,
    featured: true,
    gemstone: "Emerald",
    color: "Green",
    occasion: ["Anniversary", "Wedding", "Gala"]
  },
  {
    id: "prod_2",
    name: "Elysian Dewdrop Sapphire Necklace",
    description: "A breathtaking pear-cut Ceylon Sapphire droplet suspended from a hand-twisted shimmering sterling silver wire. Elegant and dainty, this necklace serves as a perfect wedding accessory or a high-end heirloom piece to pass through generations.",
    category: "necklaces",
    price: 320.00,
    originalPrice: 350.00,
    materials: ["925 Sterling Silver", "Ceylon Sapphire"],
    weight: "5.8g",
    dimensions: "45cm adjustable high-comfort chain",
    artisan: mockArtisans[0], // Elena
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80"
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    ratingsAvg: 4.8,
    reviewsCount: 19,
    isApproved: true,
    featured: true,
    gemstone: "Sapphire",
    color: "Blue",
    occasion: ["Wedding", "Anniversary"]
  },
  {
    id: "prod_3",
    name: "Artisanal Interstellar cuff Bracelet",
    description: "A bold, modern, brutalist-inspired solid sterling cuff bracelet. The metal is intentionally hammered and textured to achieve an organic bark-like effect, highlighting small embedded raw diamond chips which catch the light brilliantly with every wrist move.",
    category: "bracelets",
    price: 245.00,
    materials: ["925 Sterling Silver", "Raw Diamond Chips"],
    weight: "14.5g",
    dimensions: "6cm diameter (flexible sizing, open cuff design)",
    artisan: mockArtisans[2], // Meera
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&auto=format&fit=crop&q=80"
    ],
    ratingsAvg: 5.0,
    reviewsCount: 8,
    isApproved: true,
    featured: false,
    gemstone: "Diamond",
    color: "Silver",
    occasion: ["Everyday", "Casual Luxury", "Parties"]
  },
  {
    id: "prod_4",
    name: "Petal Filigree Rose Quartz Earrings",
    description: "Whimsical chandelier-style drop earrings featuring faceted rose quartz teardrops that catch the early morning pink glow. Finished in elaborate floral and petal pattern wire filigree. Crafted to look soft, magical, and enchanting.",
    category: "earrings",
    price: 115.00,
    originalPrice: 135.00,
    materials: ["14k Rose Gold Plating", "Faceted Rose Quartz Crystals"],
    weight: "2.1g per earring",
    dimensions: "3.5cm length drop",
    artisan: mockArtisans[1], // Aurelius
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80"
    ],
    ratingsAvg: 4.7,
    reviewsCount: 22,
    isApproved: true,
    featured: false,
    gemstone: "Quartz",
    color: "Pink",
    occasion: ["Spring Festivals", "Dates", "Everyday"]
  },
  {
    id: "prod_5",
    name: "Oceanic Turquoise Anklet Minimal",
    description: "A minimal bohemian-style double strand anklet, stringing microscopic raw turquoise beads along hand-braided fine metallic links. Ideal for beach weddings, summer strolls, or lightweight barefoot aesthetics.",
    category: "anklets",
    price: 85.00,
    materials: ["925 Sterling Silver Link", "Natural Persian Turquoise"],
    weight: "1.8g",
    dimensions: "22cm + 4cm extension chain",
    artisan: mockArtisans[0], // Elena
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80"
    ],
    ratingsAvg: 4.6,
    reviewsCount: 14,
    isApproved: true,
    featured: false,
    gemstone: "Turquoise",
    color: "Teal",
    occasion: ["Summer Beach", "Casual"]
  },
  {
    id: "prod_6",
    name: "Monarch Amethyst Crown Pendant",
    description: "Feel royal with this majestic crown necklace pendant carved with intense deep-purple African Amethyst. Surrounded by crown-like silver arches, symbolic of elegance, royalty, and luxury self-care.",
    category: "pendants",
    price: 160.00,
    originalPrice: 195.00,
    materials: ["Sterling Silver 925", "Deep African Amethyst"],
    weight: "4.5g",
    dimensions: "2.5cm height pendant, fits chains up to 3mm",
    artisan: mockArtisans[2], // Meera
    stock: 3, // Low stock!
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80"
    ],
    ratingsAvg: 4.9,
    reviewsCount: 11,
    isApproved: true,
    featured: true,
    gemstone: "Amethyst",
    color: "Purple",
    occasion: ["Birthdays", "Gala Events"]
  }
];

export const mockDefaultReviews: Review[] = [
  {
    id: "rev_1",
    userId: "us_11",
    userName: "Charlotte Bennett",
    rating: 5,
    comment: "This piece is gorgeous! The emerald glows brilliantly. The detail on the ring shank is far better than standard manufactured jewelry. It has a real weighting and premium soul to it.",
    date: "May 20, 2026",
    verified: true,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop"]
  },
  {
    id: "rev_2",
    userId: "us_12",
    userName: "Benjamin Vance",
    rating: 4,
    comment: "Delivered perfectly on time. The shipping box smells like fresh cedar wood. Bought the Sapphire pendant for my wife's anniversary and she absolutely adored it. Excellent craftsmanship.",
    date: "June 02, 2026",
    verified: true
  }
];

export const mockFAQList = [
  {
    question: "Are your gemstones ethically and conflict-free sourced?",
    answer: "Yes, 100%. ArtisanGems strictly registers and audits individual creators to ensure all raw metal silver, gold, and mineral gemstones are ethically mined, certified conflict-free, or reclaimed sustainably."
  },
  {
    question: "Do you offer customizable resizing?",
    answer: "Resizing is available! If you select a product page, you can see the artisan's contact button. Simply state your customized ring size, chain extensions, or metal swap desires, and the artisan will issue a personalized offer."
  },
  {
    question: "How long does shipping take and what is the return policy?",
    answer: "Since these are handmade, processing time ranges from 1 to 5 days. Once shipped, shipping takes 2-4 business days. We offer full refund or exchange requests up to 30 days after receipt."
  }
];
