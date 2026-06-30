import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import type { CustomerInput } from "../utils/mockPredict";
import "./CustomerForm.css";

interface Props {
  onSubmit: (data: CustomerInput) => void;
  loading: boolean;
}

const EDUCATION_OPTIONS = ["Undergraduate", "Graduate", "Postgraduate"];
const MARITAL_OPTIONS = ["Single", "Together", "Married", "Divorced", "Widow"];

type Section = "demographics" | "spending" | "behavior";

export default function CustomerForm({ onSubmit, loading }: Props) {
  const [openSection, setOpenSection] = useState<Section>("demographics");
  const [form, setForm] = useState<CustomerInput>({
    Year_Birth: 1975,
    Education: "Graduate",
    Marital_Status: "Single",
    Income: 55000,
    Kidhome: 0,
    Teenhome: 0,
    Recency: 30,
    MntWines: 200,
    MntFruits: 20,
    MntMeatProducts: 100,
    MntFishProducts: 30,
    MntSweetProducts: 20,
    MntGoldProds: 40,
    NumDealsPurchases: 2,
    NumWebPurchases: 4,
    NumCatalogPurchases: 3,
    NumStorePurchases: 5,
    NumWebVisitsMonth: 5,
    Complain: 0,
    Response: 0,
  });

  const set = (key: keyof CustomerInput, val: number | string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const toggle = (s: Section) => setOpenSection(openSection === s ? s : s);

  const totalSpending =
    form.MntWines + form.MntFruits + form.MntMeatProducts +
    form.MntFishProducts + form.MntSweetProducts + form.MntGoldProds;

  return (
    <form className="cform" onSubmit={handleSubmit}>
      {/* ── Section 1: Demographics ── */}
      <AccordionSection
        label="Demographics"
        emoji="👤"
        id="demographics"
        open={openSection === "demographics"}
        onToggle={() => setOpenSection(openSection === "demographics" ? "spending" : "demographics")}
      >
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Birth Year</label>
            <input
              type="number"
              className="form-input"
              value={form.Year_Birth}
              min={1940} max={2005}
              onChange={(e) => set("Year_Birth", +e.target.value)}
            />
            <span className="cform__hint">Age: {2026 - form.Year_Birth} years</span>
          </div>
          <div className="form-group">
            <label className="form-label">Annual Income ($)</label>
            <input
              type="number"
              className="form-input"
              value={form.Income}
              min={0} max={200000} step={500}
              onChange={(e) => set("Income", +e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Education Level</label>
            <select className="form-select" value={form.Education} onChange={(e) => set("Education", e.target.value)}>
              {EDUCATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select className="form-select" value={form.Marital_Status} onChange={(e) => set("Marital_Status", e.target.value)}>
              {MARITAL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Children at Home</label>
            <SliderInput value={form.Kidhome} min={0} max={3} step={1}
              onChange={(v) => set("Kidhome", v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Teenagers at Home</label>
            <SliderInput value={form.Teenhome} min={0} max={3} step={1}
              onChange={(v) => set("Teenhome", v)} />
          </div>
        </div>
      </AccordionSection>

      {/* ── Section 2: Spending ── */}
      <AccordionSection
        label="Spending Habits"
        emoji="💰"
        id="spending"
        open={openSection === "spending"}
        onToggle={() => setOpenSection(openSection === "spending" ? "demographics" : "spending")}
        badge={`$${totalSpending.toLocaleString()} total`}
      >
        <div className="cform__spending-grid">
          {[
            { key: "MntWines", label: "Wines 🍷", max: 1500 },
            { key: "MntMeatProducts", label: "Meat Products 🥩", max: 1500 },
            { key: "MntFruits", label: "Fruits 🍎", max: 200 },
            { key: "MntFishProducts", label: "Fish Products 🐟", max: 300 },
            { key: "MntSweetProducts", label: "Sweets 🍬", max: 300 },
            { key: "MntGoldProds", label: "Gold Products ✨", max: 400 },
          ].map(({ key, label, max }) => (
            <div key={key} className="form-group">
              <div className="cform__spending-header">
                <label className="form-label">{label}</label>
                <span className="cform__spending-val">${form[key as keyof CustomerInput]}</span>
              </div>
              <SliderInput
                value={form[key as keyof CustomerInput] as number}
                min={0} max={max} step={5}
                onChange={(v) => set(key as keyof CustomerInput, v)}
              />
            </div>
          ))}
        </div>

        {/* Spending bar preview */}
        <div className="cform__spending-total">
          <div className="cform__spending-total-label">
            <span>Total Spending</span>
            <span className="cform__spending-total-val">${totalSpending.toLocaleString()}</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min((totalSpending / 4000) * 100, 100)}%`,
                background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
              }}
            />
          </div>
        </div>
      </AccordionSection>

      {/* ── Section 3: Behavior ── */}
      <AccordionSection
        label="Purchase Behavior"
        emoji="📊"
        id="behavior"
        open={openSection === "behavior"}
        onToggle={() => setOpenSection(openSection === "behavior" ? "demographics" : "behavior")}
      >
        <div className="grid-2">
          {[
            { key: "Recency", label: "Days Since Last Purchase", min: 0, max: 100 },
            { key: "NumWebVisitsMonth", label: "Web Visits / Month", min: 0, max: 20 },
            { key: "NumWebPurchases", label: "Web Purchases", min: 0, max: 27 },
            { key: "NumStorePurchases", label: "Store Purchases", min: 0, max: 13 },
            { key: "NumCatalogPurchases", label: "Catalog Purchases", min: 0, max: 28 },
            { key: "NumDealsPurchases", label: "Deal Purchases", min: 0, max: 15 },
          ].map(({ key, label, min, max }) => (
            <div key={key} className="form-group">
              <div className="cform__spending-header">
                <label className="form-label">{label}</label>
                <span className="cform__spending-val">{form[key as keyof CustomerInput]}</span>
              </div>
              <SliderInput
                value={form[key as keyof CustomerInput] as number}
                min={min} max={max} step={1}
                onChange={(v) => set(key as keyof CustomerInput, v)}
              />
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="form-group">
            <label className="form-label">Has Complained</label>
            <div className="cform__toggle-group">
              {[0, 1].map((v) => (
                <button
                  key={v} type="button"
                  className={`cform__toggle ${form.Complain === v ? "cform__toggle--active" : ""}`}
                  onClick={() => set("Complain", v)}
                >
                  {v === 0 ? "No" : "Yes"}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Responded to Campaign</label>
            <div className="cform__toggle-group">
              {[0, 1].map((v) => (
                <button
                  key={v} type="button"
                  className={`cform__toggle ${form.Response === v ? "cform__toggle--active" : ""}`}
                  onClick={() => set("Response", v)}
                >
                  {v === 0 ? "No" : "Yes"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* Submit */}
      <button type="submit" className={`btn btn-primary btn-lg cform__submit ${loading ? "cform__submit--loading" : ""}`} disabled={loading}>
        {loading ? (
          <><span className="cform__spinner" /> Analyzing...</>
        ) : (
          <>Predict Segment →</>
        )}
      </button>

      <div className="alert alert-info cform__notice">
        <Info size={16} />
        This uses a heuristic model based on the Agglomerative Clustering trained on 2,240 customers.
      </div>
    </form>
  );
}

/* ─── Sub-Components ─── */
function AccordionSection({
  label, emoji, id, open, onToggle, badge, children,
}: {
  label: string; emoji: string; id: string; open: boolean;
  onToggle: () => void; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className={`cform__section ${open ? "cform__section--open" : ""}`}>
      <button type="button" className="cform__section-header" onClick={onToggle}>
        <div className="cform__section-title">
          <span className="cform__section-emoji">{emoji}</span>
          <span>{label}</span>
          {badge && <span className="cform__section-badge">{badge}</span>}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="cform__section-body">{children}</div>}
    </div>
  );
}

function SliderInput({
  value, min, max, step, onChange,
}: {
  value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="cform__slider">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <div className="cform__slider-range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
