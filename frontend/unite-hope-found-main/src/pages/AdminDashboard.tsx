import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Search, FileText, CheckSquare, LogOut, Shield, ArrowLeft } from "lucide-react";

export default function AdminDashboard() {
  const { t, setRole } = useApp();
  const navigate = useNavigate();

  // ==========================================
  // ✅ PROTECT ROUTE + RESTORE ROLE
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    // If token exists, ensure role is admin
    setRole("admin");

  }, []);

  // ==========================================
  // ✅ LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
    navigate("/admin-login");
  };

  const cards = [
    {
      icon: <FileText className="w-10 h-10" />,
      title: t("reportMissing"),
      desc: "File a new missing person report with photo and details",
      path: "/report-missing",
      colorClass: "text-primary",
      bgStyle: { background: "hsl(var(--primary) / 0.08)" },
      borderStyle: { borderColor: "hsl(var(--primary) / 0.3)" },
    },
    {
      icon: <Search className="w-10 h-10" />,
      title: t("reportFound"),
      desc: "Report a found person and check for AI matches",
      path: "/report-found",
      colorClass: "text-accent",
      bgStyle: { background: "hsl(var(--accent) / 0.08)" },
      borderStyle: { borderColor: "hsl(var(--accent) / 0.3)" },
    },
    {
      icon: <CheckSquare className="w-10 h-10" />,
      title: t("trackCase"),
      desc: "View case statistics, charts and case status",
      path: "/track-case",
      colorClass: "text-success",
      bgStyle: { background: "hsl(var(--success) / 0.08)" },
      borderStyle: { borderColor: "hsl(var(--success) / 0.3)" },
    },
  ];

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <div className="py-10 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm font-medium">
                Admin Portal
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              {t("adminDashboard")}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 border border-white/30 hover:bg-white/10 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-muted-foreground mb-8 text-center">
          Select an action from the dashboard below
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="card-unite text-left flex flex-col items-start gap-4 border-2 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              style={card.borderStyle}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={card.bgStyle}
              >
                <span className={card.colorClass}>{card.icon}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div
                className={`text-sm font-semibold flex items-center gap-1 ${card.colorClass}`}
              >
                Open →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
