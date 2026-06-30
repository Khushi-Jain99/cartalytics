import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { ArrowRight, Zap, PieChart, FileText, Brain } from "lucide-react";
import "./HomePage.css";

const FEATURES = [
  {
    icon: Brain,
    title: "ML-Powered Segmentation",
    desc: "Agglomerative Clustering with Ward linkage trained on real customer data from 2,240 shoppers.",
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    desc: "Enter customer details and get an immediate segment assignment with confidence scores.",
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    desc: "Rich interactive charts showing spending patterns, behavioral radars, and cluster distributions.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: FileText,
    title: "Actionable Insights",
    desc: "Each segment comes with personalized marketing recommendations to maximize customer value.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

const HOW_STEPS = [
  { num: "01", title: "Input Customer Data", desc: "Fill in demographics, spending history, and purchase behavior using our intuitive form." },
  { num: "02", title: "ML Model Analyzes", desc: "Our clustering algorithm applies PCA and Agglomerative Clustering to find patterns." },
  { num: "03", title: "Get Segment Result", desc: "Instantly see which of the 4 customer segments this person belongs to." },
  { num: "04", title: "Take Action", desc: "Use tailored marketing recommendations to engage and retain each customer type." },
];

export default function HomePage() {
  return (
    <main className="page-wrapper">
      <HeroSection />

      {/* Features */}
      <section className="home-section">
        <div className="container">
          <div className="home-section__header">
            <div className="home-section__eyebrow">What We Offer</div>
            <h2 className="section-title">Everything You Need to Know<br />Your Customers</h2>
            <p className="section-subtitle">From raw data to actionable segments in seconds.</p>
          </div>
          <div className="grid-4 home-features">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="home-feature">
                <div className="home-feature__icon" style={{ background: bg, color }}>
                  <Icon size={24} />
                </div>
                <h3 className="home-feature__title">{title}</h3>
                <p className="home-feature__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="home-section__header">
            <div className="home-section__eyebrow">How It Works</div>
            <h2 className="section-title">Four Simple Steps</h2>
            <p className="section-subtitle">From input to insight in under a minute.</p>
          </div>
          <div className="home-steps">
            {HOW_STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className="home-step">
                <div className="home-step__num">{num}</div>
                <div className="home-step__connector" style={{ display: i < HOW_STEPS.length - 1 ? "block" : "none" }} />
                <h3 className="home-step__title">{title}</h3>
                <p className="home-step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta__inner">
            <div className="home-cta__blobs">
              <div className="home-cta__blob home-cta__blob--1" />
              <div className="home-cta__blob home-cta__blob--2" />
            </div>
            <div className="home-cta__content">
              <h2 className="home-cta__title">Ready to Discover Your Customers?</h2>
              <p className="home-cta__desc">Start with a single customer profile and instantly uncover their segment, preferences, and the best ways to engage them.</p>
              <div className="home-cta__actions">
                <Link to="/predict" className="btn btn-primary btn-lg">
                  Analyze a Customer <ArrowRight size={18} />
                </Link>
                <Link to="/segments" className="btn btn-ghost btn-lg" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
                  View All Segments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
