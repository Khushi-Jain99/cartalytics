import { SEGMENTS } from "../data/segmentData";

export interface CustomerInput {
  Year_Birth: number;
  Education: string;
  Marital_Status: string;
  Income: number;
  Kidhome: number;
  Teenhome: number;
  Recency: number;
  MntWines: number;
  MntFruits: number;
  MntMeatProducts: number;
  MntFishProducts: number;
  MntSweetProducts: number;
  MntGoldProds: number;
  NumDealsPurchases: number;
  NumWebPurchases: number;
  NumCatalogPurchases: number;
  NumStorePurchases: number;
  NumWebVisitsMonth: number;
  Complain: number;
  Response: number;
}

export interface PredictionResult {
  segmentId: number;
  confidence: number;
  scores: number[];
}

// Heuristic-based mock prediction that mimics the notebook's clustering logic
export function mockPredict(input: CustomerInput): PredictionResult {
  const totalSpending =
    input.MntWines +
    input.MntFruits +
    input.MntMeatProducts +
    input.MntFishProducts +
    input.MntSweetProducts +
    input.MntGoldProds;
  const totalChildren = input.Kidhome + input.Teenhome;
  const age = 2026 - input.Year_Birth;

  // Score each cluster [0=Premium, 1=Deal, 2=Budget, 3=Rising]
  const scores = [0, 0, 0, 0];

  // Cluster 0: Premium Loyalists — high income + high spending + catalog
  scores[0] +=
    Math.min(input.Income / 80000, 1) * 30 +
    Math.min(totalSpending / 1200, 1) * 30 +
    Math.min(input.NumCatalogPurchases / 8, 1) * 20 +
    (totalChildren < 1 ? 10 : 0) +
    (age > 48 ? 10 : 0);

  // Cluster 1: Deal Seekers — deals + web visits + low spending
  scores[1] +=
    Math.min(input.NumDealsPurchases / 5, 1) * 30 +
    Math.min(input.NumWebVisitsMonth / 10, 1) * 20 +
    (totalSpending < 200 ? 20 : 0) +
    (totalChildren >= 1 ? 15 : 0) +
    (input.Income < 50000 ? 15 : 0);

  // Cluster 2: Budget Starters — low income + low spending + many children
  scores[2] +=
    (input.Income < 35000 ? 30 : 0) +
    (totalSpending < 100 ? 30 : 0) +
    Math.min(totalChildren / 3, 1) * 20 +
    (input.NumCatalogPurchases === 0 ? 10 : 0) +
    (age < 50 ? 10 : 0);

  // Cluster 3: Rising Stars — medium-high income, wine + meat lovers
  scores[3] +=
    (input.Income >= 40000 && input.Income < 80000 ? 20 : 0) +
    Math.min(input.MntWines / 400, 1) * 25 +
    Math.min(input.MntMeatProducts / 250, 1) * 25 +
    Math.min(input.NumWebPurchases / 7, 1) * 15 +
    (age >= 45 && age < 60 ? 15 : 0);

  const total = scores.reduce((a, b) => a + b, 0) || 1;
  const normalized = scores.map((s) => s / total);
  const maxIdx = normalized.indexOf(Math.max(...normalized));
  const confidence = Math.round(normalized[maxIdx] * 100);

  return { segmentId: maxIdx, confidence, scores: normalized };
}

export function getSegmentById(id: number) {
  return SEGMENTS.find((s) => s.id === id) ?? SEGMENTS[0];
}
