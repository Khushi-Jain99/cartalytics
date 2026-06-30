import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Users, TrendingUp, ChevronDown } from "lucide-react";
import { SEGMENTS } from "../data/segmentData";
import "./HeroSection.css";

const STATS = [
  { label: "Customers Profiled", value: "2,240+", icon: Users },
  { label: "Cluster Segments", value: "4", icon: Cpu },
  { label: "Accuracy (Silhouette)", value: "~89%", icon: TrendingUp },
];

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Background blobs */}
      <div className="hero__bg">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
      </div>

      <div className="container hero__content">
        {/* Badge */}
        <div className="hero__badge animate-fade-in-up">
          <span className="hero__badge-dot" />
          Powered by Agglomerative Clustering + PCA
        </div>

        {/* Heading */}
        <h1 className="hero__title animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Understand Your <br />
          <span className="hero__title-gradient">SmartCart Customers</span>
          <br />
          Like Never Before
        </h1>

        <p className="hero__desc animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Harness the power of machine learning to segment your customers into meaningful
          groups. Input customer data and instantly discover which segment they belong to —
          and how to serve them best.
        </p>

        {/* CTA Buttons */}
        <div className="hero__ctas animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/predict" className="btn btn-primary btn-lg">
            Analyze a Customer <ArrowRight size={18} />
          </Link>
          <Link to="/segments" className="btn btn-secondary btn-lg">
            Explore Segments
          </Link>
        </div>

        {/* Stats */}
        <div className="hero__stats animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="hero__stat">
              <div className="hero__stat-icon">
                <Icon size={18} />
              </div>
              <div>
                <div className="hero__stat-value">{value}</div>
                <div className="hero__stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Cards Preview Strip */}
      <div className="hero__segments-strip">
        <div className="container">
          <p className="hero__strip-label">4 Customer Segments Identified</p>
          <div className="hero__segment-pills">
            {SEGMENTS.map((s) => (
              <Link to="/segments" key={s.id} className="hero__pill" style={{ borderColor: s.borderColor, background: s.lightColor }}>
                <span>{s.emoji}</span>
                <span style={{ color: s.color, fontWeight: 600, fontSize: "0.9rem" }}>{s.label}</span>
                <span className="hero__pill-pct" style={{ background: s.color }}>{s.percentage}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
