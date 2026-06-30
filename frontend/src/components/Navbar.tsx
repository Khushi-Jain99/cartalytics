import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, BarChart3, Users, Upload, Home, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/predict", label: "Predict", icon: Users },
  { to: "/segments", label: "Segments", icon: BarChart3 },
  { to: "/analytics", label: "Analytics", icon: Upload },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">Cartalytics</span>
            <span className="navbar__brand-sub">SmartCart AI</span>
          </div>
        </Link>

        <nav className="navbar__links">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/predict" className="btn btn-primary btn-sm">
            Analyze Customer
          </Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `navbar__mobile-link ${isActive ? "navbar__mobile-link--active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <Link to="/predict" className="btn btn-primary" style={{ marginTop: 8 }}>
          Analyze Customer
        </Link>
      </div>
    </header>
  );
}
