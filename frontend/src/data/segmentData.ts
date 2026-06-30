export interface Segment {
  id: number;
  label: string;
  emoji: string;
  tagline: string;
  color: string;
  lightColor: string;
  borderColor: string;
  count: number;
  percentage: number;
  avgIncome: number;
  avgAge: number;
  avgSpending: number;
  avgRecency: number;
  avgTotalChildren: number;
  avgWebPurchases: number;
  avgStorePurchases: number;
  avgCatalogPurchases: number;
  avgDealsPurchases: number;
  spending: {
    wines: number;
    fruits: number;
    meat: number;
    fish: number;
    sweets: number;
    gold: number;
  };
  traits: string[];
  recommendation: string;
}

export const SEGMENTS: Segment[] = [
  {
    id: 0,
    label: "Premium Loyalists",
    emoji: "💎",
    tagline: "High-value customers who spend big across all categories",
    color: "#4F46E5",
    lightColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    count: 560,
    percentage: 25,
    avgIncome: 72400,
    avgAge: 54,
    avgSpending: 1210,
    avgRecency: 49,
    avgTotalChildren: 0.5,
    avgWebPurchases: 6,
    avgStorePurchases: 9,
    avgCatalogPurchases: 6,
    avgDealsPurchases: 1,
    spending: { wines: 568, fruits: 48, meat: 336, fish: 82, sweets: 46, gold: 130 },
    traits: ["Top 25% income", "Catalog buyers", "Rarely use deals", "Low recency (recent buyers)"],
    recommendation: "Offer exclusive loyalty programs, premium catalogs, and VIP early access to new products.",
  },
  {
    id: 1,
    label: "Deal Seekers",
    emoji: "🛒",
    tagline: "Bargain hunters who visit often but spend selectively",
    color: "#06B6D4",
    lightColor: "#ECFEFF",
    borderColor: "#A5F3FC",
    count: 670,
    percentage: 30,
    avgIncome: 38900,
    avgAge: 48,
    avgSpending: 95,
    avgRecency: 55,
    avgTotalChildren: 1.8,
    avgWebPurchases: 3,
    avgStorePurchases: 5,
    avgCatalogPurchases: 1,
    avgDealsPurchases: 4,
    spending: { wines: 30, fruits: 10, meat: 20, fish: 7, sweets: 8, gold: 20 },
    traits: ["Deal-driven purchases", "High web visits", "Family households", "Medium recency"],
    recommendation: "Target with flash sales, bundle deals, and loyalty point programs to increase basket size.",
  },
  {
    id: 2,
    label: "Budget Starters",
    emoji: "🌱",
    tagline: "Young families with lower income, building spending habits",
    color: "#10B981",
    lightColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    count: 490,
    percentage: 22,
    avgIncome: 26700,
    avgAge: 43,
    avgSpending: 52,
    avgRecency: 62,
    avgTotalChildren: 2.2,
    avgWebPurchases: 2,
    avgStorePurchases: 3,
    avgCatalogPurchases: 0,
    avgDealsPurchases: 2,
    spending: { wines: 15, fruits: 8, meat: 12, fish: 5, sweets: 6, gold: 6 },
    traits: ["Largest families", "Lowest spenders", "Store-first shoppers", "Cost-sensitive"],
    recommendation: "Engage with family-friendly promotions, store coupons, and starter bundle packs.",
  },
  {
    id: 3,
    label: "Rising Stars",
    emoji: "🌟",
    tagline: "Mid-tier earners with a passion for wine and premium items",
    color: "#F59E0B",
    lightColor: "#FFFBEB",
    borderColor: "#FDE68A",
    count: 520,
    percentage: 23,
    avgIncome: 55200,
    avgAge: 50,
    avgSpending: 620,
    avgRecency: 44,
    avgTotalChildren: 0.9,
    avgWebPurchases: 5,
    avgStorePurchases: 7,
    avgCatalogPurchases: 3,
    avgDealsPurchases: 2,
    spending: { wines: 300, fruits: 30, meat: 180, fish: 45, sweets: 28, gold: 37 },
    traits: ["Wine enthusiasts", "Meat product buyers", "Growing web presence", "Aspirational segment"],
    recommendation: "Upsell with premium wine collections, gourmet meat bundles, and personalized recommendations.",
  },
];

export const FEATURE_RANGES = {
  Year_Birth: { min: 1940, max: 2000, default: 1975 },
  Income: { min: 0, max: 200000, default: 50000 },
  Kidhome: { min: 0, max: 3, default: 0 },
  Teenhome: { min: 0, max: 3, default: 0 },
  Recency: { min: 0, max: 100, default: 30 },
  MntWines: { min: 0, max: 1500, default: 200 },
  MntFruits: { min: 0, max: 200, default: 20 },
  MntMeatProducts: { min: 0, max: 1500, default: 100 },
  MntFishProducts: { min: 0, max: 300, default: 30 },
  MntSweetProducts: { min: 0, max: 300, default: 20 },
  MntGoldProds: { min: 0, max: 400, default: 40 },
  NumDealsPurchases: { min: 0, max: 15, default: 2 },
  NumWebPurchases: { min: 0, max: 27, default: 4 },
  NumCatalogPurchases: { min: 0, max: 28, default: 3 },
  NumStorePurchases: { min: 0, max: 13, default: 5 },
  NumWebVisitsMonth: { min: 0, max: 20, default: 5 },
};
