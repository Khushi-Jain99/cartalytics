import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  ScatterController,
} from "chart.js";
import { Bar, Radar, Doughnut, Scatter } from "react-chartjs-2";
import { SEGMENTS } from "../data/segmentData";
import "./Charts.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, ArcElement,
  ScatterController
);

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B"];
const LIGHT_COLORS = ["rgba(79,70,229,0.15)", "rgba(6,182,212,0.15)", "rgba(16,185,129,0.15)", "rgba(245,158,11,0.15)"];

/* ── Spending Comparison Bar Chart ── */
export function SpendingChart() {
  const categories = ["Wines", "Fruits", "Meat", "Fish", "Sweets", "Gold"];
  const data = {
    labels: categories,
    datasets: SEGMENTS.map((s, i) => ({
      label: `${s.emoji} ${s.label}`,
      data: Object.values(s.spending),
      backgroundColor: COLORS[i],
      borderRadius: 6,
      borderSkipped: false,
    })),
  };

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Spending by Category</h3>
        <p className="chart-card__desc">Average spending per product category across all segments</p>
      </div>
      <div className="chart-card__body">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
              tooltip: { callbacks: { label: (ctx) => ` $${ctx.parsed.y}` } },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 12 } } },
              y: {
                grid: { color: "rgba(0,0,0,0.05)" },
                ticks: { callback: (v) => `$${v}`, font: { size: 12 } },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

/* ── Segment Size Doughnut ── */
export function SegmentSizeChart() {
  const data = {
    labels: SEGMENTS.map((s) => `${s.emoji} ${s.label}`),
    datasets: [{
      data: SEGMENTS.map((s) => s.count),
      backgroundColor: COLORS,
      borderColor: "#fff",
      borderWidth: 3,
      hoverBorderWidth: 4,
    }],
  };

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Segment Distribution</h3>
        <p className="chart-card__desc">Number of customers in each segment</p>
      </div>
      <div className="chart-card__body chart-card__body--sm">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "62%",
            plugins: {
              legend: { position: "right", labels: { usePointStyle: true, padding: 16, font: { size: 12 } } },
              tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed} customers (${SEGMENTS[ctx.dataIndex].percentage}%)` } },
            },
          }}
        />
      </div>
    </div>
  );
}

/* ── Behavioral Radar Chart ── */
export function BehaviorRadarChart() {
  const labels = ["Web Purchases", "Store Purchases", "Catalog Purchases", "Deals Used", "Web Visits", "Recency (inv)"];

  const normalize = (val: number, max: number) => Math.round((val / max) * 100);

  const data = {
    labels,
    datasets: SEGMENTS.map((s, i) => ({
      label: `${s.emoji} ${s.label}`,
      data: [
        normalize(s.avgWebPurchases, 10),
        normalize(s.avgStorePurchases, 12),
        normalize(s.avgCatalogPurchases, 8),
        normalize(s.avgDealsPurchases, 5),
        normalize(8, 20), // web visits approx
        normalize(100 - s.avgRecency, 100),
      ],
      borderColor: COLORS[i],
      backgroundColor: LIGHT_COLORS[i],
      pointBackgroundColor: COLORS[i],
      pointRadius: 4,
      borderWidth: 2,
    })),
  };

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Purchase Behavior Radar</h3>
        <p className="chart-card__desc">Multi-dimensional behavioral comparison across segments</p>
      </div>
      <div className="chart-card__body">
        <Radar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
            },
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: { stepSize: 25, font: { size: 10 }, color: "#9CA3AF" },
                grid: { color: "rgba(0,0,0,0.08)" },
                pointLabels: { font: { size: 11 }, color: "#6B7280" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

/* ── Income vs Spending Scatter (simulated) ── */
export function IncomeSpendingChart() {
  const data = {
    labels: ["Income ($k)"],
    datasets: SEGMENTS.map((s, i) => ({
      label: `${s.emoji} ${s.label}`,
      data: [{ x: Math.round(s.avgIncome / 1000), y: s.avgSpending }],
      backgroundColor: COLORS[i],
      pointRadius: 16,
      pointHoverRadius: 20,
    })),
  };

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Income vs. Total Spending</h3>
        <p className="chart-card__desc">Cluster centroids plotted by average income and spending</p>
      </div>
      <div className="chart-card__body chart-card__body--sm">
        <Scatter
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const raw = ctx.raw as { x: number; y: number };
                    return ` ${ctx.dataset.label}: Income $${raw.x}k, Spend $${raw.y}`;
                  },
                },
              },
            },
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                title: { display: true, text: "Average Income ($k)", color: "#6B7280", font: { size: 10, weight: "bold" } },
                ticks: { callback: (v) => `$${v}k`, font: { size: 10 }, color: "#9CA3AF" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              y: {
                type: "linear",
                title: { display: true, text: "Average Spending ($)", color: "#6B7280", font: { size: 10, weight: "bold" } },
                ticks: { callback: (v) => `$${v}`, font: { size: 10 }, color: "#9CA3AF" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
