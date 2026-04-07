import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Users, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const stats = [
  { value: "12,400+", label: "Families Reunited" },
  { value: "98.2%", label: "AI Accuracy Rate" },
  { value: "24/7", label: "Active Monitoring" },
  { value: "32", label: "States Covered" },
];

const features = [
  { icon: <Zap className="w-6 h-6" />, title: "AI-Powered Matching", desc: "Advanced facial recognition and AI algorithms to identify matches within seconds." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure & Private", desc: "End-to-end encrypted data handling with strict privacy protection protocols." },
  { icon: <Users className="w-6 h-6" />, title: "Community Network", desc: "Crowd-sourced reporting backed by trained officials for maximum coverage." },
];

export default function Home() {
  const { t } = useApp();

  return (
    <div className="min-h-screen page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Unite Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220 80% 8% / 0.88) 0%, hsl(217 91% 20% / 0.75) 60%, hsl(199 89% 20% / 0.7) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live System Active
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              {t("heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admin-login" className="btn-primary text-center flex items-center justify-center gap-2">
                {t("adminLoginBtn")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/citizen-login" className="btn-outline-white text-center flex items-center justify-center gap-2">
                {t("citizenLoginBtn")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose Unite?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A comprehensive platform designed to bring families together during the most critical times.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="card-unite group cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "var(--gradient-primary)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Help Reunite Families?</h2>
          <p className="text-white/80 mb-8">Join thousands of officials and citizens working together to bring missing persons home.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/citizen-login" className="bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-300 hover:scale-105">
              {t("citizenLoginBtn")}
            </Link>
            <Link to="/contact" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300">
              {t("contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
