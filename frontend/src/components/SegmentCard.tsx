import { CheckCircle, TrendingUp, Users, DollarSign, ShoppingBag } from "lucide-react";
import type { Segment } from "../data/segmentData";
import "./SegmentCard.css";

interface Props {
  segment: Segment;
  confidence?: number;
  scores?: number[];
  isResult?: boolean;
  compact?: boolean;
}

export default function SegmentCard({ segment: s, confidence, scores, isResult, compact }: Props) {
  return (
    <div
      className={`scard ${isResult ? "scard--result" : ""} ${compact ? "scard--compact" : ""}`}
      style={{ borderColor: s.borderColor }}
    >
      {isResult && (
        <div className="scard__result-banner" style={{ background: s.lightColor, borderBottom: `1px solid ${s.borderColor}` }}>
          <CheckCircle size={16} style={{ color: s.color }} />
          <span style={{ color: s.color, fontWeight: 700, fontSize: "0.875rem" }}>
            Predicted Segment — {confidence}% Confidence
          </span>
        </div>
      )}

      <div className="scard__body">
        {/* Header */}
        <div className="scard__header">
          <div className="scard__emoji" style={{ background: s.lightColor, border: `1.5px solid ${s.borderColor}` }}>
            {s.emoji}
          </div>
          <div>
            <div className="scard__label" style={{ color: s.color }}>{s.label}</div>
            <div className="scard__tagline">{s.tagline}</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={`scard__stats ${compact ? "scard__stats--compact" : ""}`}>
          <StatChip icon={DollarSign} label="Avg Income" value={`$${(s.avgIncome / 1000).toFixed(0)}k`} color={s.color} />
          <StatChip icon={Users} label="Avg Age" value={`${s.avgAge} yr`} color={s.color} />
          <StatChip icon={ShoppingBag} label="Avg Spend" value={`$${s.avgSpending}`} color={s.color} />
          {!compact && <StatChip icon={TrendingUp} label="Share" value={`${s.percentage}%`} color={s.color} />}
        </div>

        {/* Spending Breakdown */}
        {!compact && (
          <div className="scard__spending">
            <p className="scard__spending-label">Spending Breakdown</p>
            {Object.entries(s.spending).map(([cat, val]) => {
              const totalSpend = Object.values(s.spending).reduce((a, b) => a + b, 0);
              const pct = Math.round((val / totalSpend) * 100);
              const icons: Record<string, string> = {
                wines: "🍷", fruits: "🍎", meat: "🥩", fish: "🐟", sweets: "🍬", gold: "✨",
              };
              return (
                <div key={cat} className="scard__spending-row">
                  <span className="scard__spending-cat">{icons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%`, background: s.color }}
                    />
                  </div>
                  <span className="scard__spending-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Traits */}
        <div className="scard__traits">
          {s.traits.map((t) => (
            <span key={t} className="scard__trait" style={{ background: s.lightColor, color: s.color, borderColor: s.borderColor }}>
              {t}
            </span>
          ))}
        </div>

        {/* Confidence Bar (when it's a result) */}
        {isResult && scores && (
          <div className="scard__scores">
            <p className="scard__spending-label">Confidence Across Segments</p>
            {["Premium Loyalists", "Deal Seekers", "Budget Starters", "Rising Stars"].map((lbl, i) => (
              <div key={i} className="scard__score-row">
                <span className="scard__score-lbl">{lbl}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.round(scores[i] * 100)}%`,
                      background: i === s.id ? s.color : "var(--color-border-strong)",
                    }}
                  />
                </div>
                <span className="scard__score-pct">{Math.round(scores[i] * 100)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommendation */}
        <div className="scard__rec" style={{ background: s.lightColor, border: `1px solid ${s.borderColor}` }}>
          <p className="scard__rec-title" style={{ color: s.color }}>💡 Recommended Action</p>
          <p className="scard__rec-text">{s.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="scard__stat">
      <Icon size={14} style={{ color }} />
      <div>
        <div className="scard__stat-val">{value}</div>
        <div className="scard__stat-lbl">{label}</div>
      </div>
    </div>
  );
}
