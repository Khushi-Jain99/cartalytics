import { SpendingChart, SegmentSizeChart, BehaviorRadarChart, IncomeSpendingChart } from "../components/Charts";
import { SEGMENTS } from "../data/segmentData";
import { BarChart2, TrendingUp, Users, DollarSign } from "lucide-react";
import "./AnalyticsPage.css";

const KPI_CARDS = [
  { label: "Total Customers", value: "2,240", icon: Users, color: "#4F46E5", bg: "#EEF2FF", delta: "+12.4%" },
  { label: "Avg Annual Income", value: "$48,300", icon: DollarSign, color: "#10B981", bg: "#ECFDF5", delta: "+5.2%" },
  { label: "Avg Total Spending", value: "$605", icon: TrendingUp, color: "#F59E0B", bg: "#FFFBEB", delta: "+8.7%" },
  { label: "Active Segments", value: "4", icon: BarChart2, color: "#06B6D4", bg: "#ECFEFF", delta: "Stable" },
];

export default function AnalyticsPage() {
  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="analytics-header">
          <div className="analytics-header__eyebrow">Data Analytics</div>
          <h1 className="section-title">Cluster Analytics Dashboard</h1>
          <p className="section-subtitle">
            Visual insights derived from the SmartCart Agglomerative Clustering model trained on 2,240 customer profiles.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="analytics-kpis">
          {KPI_CARDS.map(({ label, value, icon: Icon, color, bg, delta }) => (
            <div key={label} className="analytics-kpi">
              <div className="analytics-kpi__icon" style={{ background: bg, color }}>
                <Icon size={22} />
              </div>
              <div>
                <div className="analytics-kpi__value">{value}</div>
                <div className="analytics-kpi__label">{label}</div>
              </div>
              <span className="analytics-kpi__delta" style={{ color, background: bg }}>{delta}</span>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="analytics-charts">
          <div className="analytics-charts__row">
            <SpendingChart />
            <SegmentSizeChart />
          </div>
          <div className="analytics-charts__row">
            <BehaviorRadarChart />
            <IncomeSpendingChart />
          </div>
        </div>

        {/* Cluster Comparison Table */}
        <div className="analytics-table-card">
          <div className="analytics-table-card__header">
            <h2 className="analytics-table-card__title">Cluster Comparison Summary</h2>
            <p className="analytics-table-card__desc">Side-by-side metrics for all four customer segments</p>
          </div>
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Customers</th>
                  <th>Avg Age</th>
                  <th>Avg Income</th>
                  <th>Avg Spending</th>
                  <th>Avg Recency</th>
                  <th>Top Category</th>
                </tr>
              </thead>
              <tbody>
                {SEGMENTS.map((s) => {
                  const topCat = Object.entries(s.spending).sort((a, b) => b[1] - a[1])[0][0];
                  const catIcons: Record<string, string> = { wines: "🍷", fruits: "🍎", meat: "🥩", fish: "🐟", sweets: "🍬", gold: "✨" };
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="analytics-table__seg">
                          <span className="analytics-table__emoji" style={{ background: s.lightColor }}>{s.emoji}</span>
                          <div>
                            <div className="analytics-table__name" style={{ color: s.color }}>{s.label}</div>
                            <div className="analytics-table__pct">{s.percentage}% of customers</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{s.count.toLocaleString()}</strong></td>
                      <td>{s.avgAge} yr</td>
                      <td>${s.avgIncome.toLocaleString()}</td>
                      <td>
                        <span className="analytics-table__spend" style={{ color: s.color, background: s.lightColor }}>
                          ${s.avgSpending.toLocaleString()}
                        </span>
                      </td>
                      <td>{s.avgRecency} days</td>
                      <td>{catIcons[topCat]} {topCat.charAt(0).toUpperCase() + topCat.slice(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Info */}
        <div className="analytics-model">
          <h2 className="analytics-model__title">Model Information</h2>
          <div className="grid-3 analytics-model__cards">
            {[
              { label: "Algorithm", value: "Agglomerative Clustering", sub: "Ward linkage" },
              { label: "Dimensionality Reduction", value: "PCA", sub: "3 principal components" },
              { label: "Optimal Clusters", value: "K = 4", sub: "Elbow + Silhouette score" },
              { label: "Training Samples", value: "2,216", sub: "After outlier removal" },
              { label: "Features Used", value: "22 → 18", sub: "After engineering & cleaning" },
              { label: "Encoding", value: "OneHotEncoder", sub: "Education + Marital Status" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="analytics-model__item">
                <div className="analytics-model__item-label">{label}</div>
                <div className="analytics-model__item-value">{value}</div>
                <div className="analytics-model__item-sub">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
