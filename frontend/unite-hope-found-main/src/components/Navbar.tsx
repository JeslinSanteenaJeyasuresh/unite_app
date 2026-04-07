import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp, Language } from "@/context/AppContext";
import { Globe, Menu, X, Shield } from "lucide-react";

const langLabels: Record<Language, string> = {
  en: "EN",
  ta: "தமிழ்",
  hi: "हिंदी",
};

export default function Navbar() {
  const { t, language, setLanguage, role, setRole } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-ring" style={{ background: "var(--gradient-primary)" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-primary">{t("unite")}</span>
              <span className="hidden sm:block text-[10px] text-muted-foreground leading-none">{t("tagline")}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`nav-link ${isActive("/") ? "text-primary font-semibold" : ""}`}>{t("home")}</Link>
            <Link to="/contact" className={`nav-link ${isActive("/contact") ? "text-primary font-semibold" : ""}`}>{t("contact")}</Link>

            {!role && (
              <>
                <Link to="/admin-login" className={`nav-link ${isActive("/admin-login") ? "text-primary font-semibold" : ""}`}>{t("adminLogin")}</Link>
                <Link to="/citizen-login" className={`nav-link ${isActive("/citizen-login") ? "text-primary font-semibold" : ""}`}>{t("citizenLogin")}</Link>
              </>
            )}
            {role && (
              <button onClick={handleLogout} className="text-emergency font-medium hover:underline transition-colors">{t("logout")}</button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-medium transition-colors"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>{langLabels[language]}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-50">
                  {(["en", "ta", "hi"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors ${language === lang ? "text-primary font-semibold bg-primary/5" : ""}`}
                    >
                      {langLabels[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 pb-4 space-y-1 page-enter">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-3 px-3 rounded-lg hover:bg-secondary font-medium">{t("home")}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-3 px-3 rounded-lg hover:bg-secondary font-medium">{t("contact")}</Link>
          {!role && (
            <>
              <Link to="/admin-login" onClick={() => setMenuOpen(false)} className="block py-3 px-3 rounded-lg hover:bg-secondary font-medium">{t("adminLogin")}</Link>
              <Link to="/citizen-login" onClick={() => setMenuOpen(false)} className="block py-3 px-3 rounded-lg hover:bg-secondary font-medium">{t("citizenLogin")}</Link>
            </>
          )}
          {role && (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left py-3 px-3 rounded-lg text-emergency font-medium hover:bg-red-50">{t("logout")}</button>
          )}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground px-3 mb-2">{t("language")}</p>
            <div className="flex gap-2 px-3">
              {(["en", "ta", "hi"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${language === lang ? "bg-primary text-white border-primary" : "border-border hover:bg-secondary"}`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
