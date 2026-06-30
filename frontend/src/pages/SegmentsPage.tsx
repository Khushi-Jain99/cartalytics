import { useState } from "react";
import SegmentCard from "../components/SegmentCard";
import { SEGMENTS } from "../data/segmentData";
import { LayoutGrid, List } from "lucide-react";
import "./SegmentsPage.css";

export default function SegmentsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<number | null>(null);

  const displayed = selected !== null ? SEGMENTS.filter((s) => s.id === selected) : SEGMENTS;

  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="segs-header">
          <div className="segs-header__eyebrow">4 Customer Personas</div>
          <h1 className="section-title">Explore Customer Segments</h1>
          <p className="section-subtitle">
            Each segment represents a distinct group of SmartCart customers with unique spending patterns,
            behaviors, and preferences identified through Agglomerative Clustering.
          </p>
        </div>

        {/* Filter Chips + View Toggle */}
        <div className="segs-controls">
          <div className="segs-filters">
            <button
              className={`segs-filter ${selected === null ? "segs-filter--active" : ""}`}
              onClick={() => setSelected(null)}
            >
              All Segments
              <span className="segs-filter__count">{SEGMENTS.length}</span>
            </button>
            {SEGMENTS.map((s) => (
              <button
                key={s.id}
                className={`segs-filter ${selected === s.id ? "segs-filter--active" : ""}`}
                style={selected === s.id ? { borderColor: s.color, color: s.color, background: s.lightColor } : {}}
                onClick={() => setSelected(selected === s.id ? null : s.id)}
              >
                {s.emoji} {s.label}
                <span className="segs-filter__count">{s.percentage}%</span>
              </button>
            ))}
          </div>
          <div className="segs-view-toggle">
            <button className={`segs-view-btn ${view === "grid" ? "segs-view-btn--active" : ""}`} onClick={() => setView("grid")}>
              <LayoutGrid size={16} />
            </button>
            <button className={`segs-view-btn ${view === "list" ? "segs-view-btn--active" : ""}`} onClick={() => setView("list")}>
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Summary Stats Bar */}
        <div className="segs-summary">
          {SEGMENTS.map((s) => (
            <div key={s.id} className="segs-summary-item" style={{ borderLeftColor: s.color }}>
              <span className="segs-summary-emoji">{s.emoji}</span>
              <div>
                <div className="segs-summary-name" style={{ color: s.color }}>{s.label}</div>
                <div className="segs-summary-stat">{s.count.toLocaleString()} customers · ${s.avgSpending} avg spend</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className={`segs-cards ${view === "list" ? "segs-cards--list" : ""}`}>
          {displayed.map((s) => (
            <div key={s.id} className="animate-fade-in-up" style={{ animationDelay: `${s.id * 0.08}s` }}>
              <SegmentCard segment={s} compact={view === "list"} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
