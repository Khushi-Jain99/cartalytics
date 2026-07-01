import { useState } from "react";
import CustomerForm from "../components/CustomerForm";
import SegmentCard from "../components/SegmentCard";
import { mockPredict, getSegmentById } from "../utils/mockPredict";
import type { CustomerInput, PredictionResult } from "../utils/mockPredict";
import { RefreshCw, Sparkles, Info } from "lucide-react";
import "./PredictPage.css";

export default function PredictPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (data: CustomerInput) => {
    setLoading(true);
    setResult(null);
    setUsingMock(false);
    setErrorMsg(null);

    const minDelay = new Promise((r) => setTimeout(r, 1200));

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const prediction = await response.json();
      await minDelay;
      setResult(prediction);
    } catch (err: any) {
      console.warn("Failed to connect to ML backend, falling back to mock predictor.", err);
      const fallbackResult = mockPredict(data);
      await minDelay;
      setResult(fallbackResult);
      setUsingMock(true);
      setErrorMsg("Failed to connect to ML model server. Running heuristic backup locally.");
    } finally {
      setLoading(false);
      // Scroll to result
      setTimeout(() => {
        document.getElementById("predict-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const segment = result ? getSegmentById(result.segmentId) : null;

  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="predict-header">
          <div className="predict-header__eyebrow">
            <Sparkles size={14} />
            AI-Powered Prediction
          </div>
          <h1 className="section-title">Customer Segment Predictor</h1>
          <p className="section-subtitle">
            Fill in your customer's profile below and our ML model will instantly classify them
            into one of 4 behavioral segments.
          </p>
        </div>

        <div className="predict-layout">
          {/* Left: Form */}
          <div className="predict-form-col">
            <div className="predict-form-card">
              <div className="predict-form-card__header">
                <h2 className="predict-form-card__title">Customer Profile</h2>
                <p className="predict-form-card__subtitle">Complete all three sections for best results</p>
              </div>
              <CustomerForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Right: Result */}
          <div className="predict-result-col" id="predict-result">
            {!result && !loading && (
              <div className="predict-placeholder">
                <div className="predict-placeholder__icon">🎯</div>
                <h3 className="predict-placeholder__title">Ready to Predict</h3>
                <p className="predict-placeholder__desc">
                  Fill in the customer form on the left and click <strong>Predict Segment</strong> to see
                  which group they belong to.
                </p>
                <div className="predict-placeholder__segments">
                  {["💎 Premium", "🛒 Deal Seeker", "🌱 Budget", "🌟 Rising Star"].map((l) => (
                    <span key={l} className="predict-placeholder__chip">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="predict-loading">
                <div className="predict-loading__spinner">
                  <div className="predict-loading__ring" />
                </div>
                <h3 className="predict-loading__title">Analyzing Customer Data</h3>
                <p className="predict-loading__desc">Applying PCA decomposition and clustering model…</p>
                <div className="predict-loading__steps">
                  {["Feature Engineering", "PCA Reduction", "Cluster Assignment", "Generating Insights"].map((s, i) => (
                    <div key={s} className="predict-loading__step" style={{ animationDelay: `${i * 0.25}s` }}>
                      <div className="predict-loading__step-dot" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && segment && (
              <div className="animate-fade-in-up">
                <div className="predict-result-header">
                  <h2 className="predict-result-title">Prediction Result</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>
                    <RefreshCw size={14} /> New Prediction
                  </button>
                </div>
                {usingMock && (
                  <div className="predict-fallback-warning">
                    <Info size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <SegmentCard
                  segment={segment}
                  confidence={result.confidence}
                  scores={result.scores}
                  isResult
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
