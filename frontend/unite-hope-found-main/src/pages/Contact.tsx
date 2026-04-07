import { useApp } from "@/context/AppContext";
import { Phone, Mail, PhoneCall, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <div className="py-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{t("contactTitle")}</h1>
          <p className="text-white/80 text-lg">{t("contactDesc")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Emergency Phone */}
          <div className="card-unite text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 pulse-ring" style={{ background: "hsl(var(--emergency) / 0.1)" }}>
              <Phone className="w-8 h-8" style={{ color: "hsl(var(--emergency))" }} />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">{t("emergencyPhone")}</h3>
            <a href="tel:1800-123-4567" className="text-2xl font-bold text-primary hover:underline block mt-2">
              1800-123-4567
            </a>
            <p className="text-sm text-muted-foreground mt-1">Toll Free • 24/7</p>
          </div>

          {/* Email */}
          <div className="card-unite text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">{t("email")}</h3>
            <a href="mailto:help@unite.gov.in" className="text-base font-semibold text-primary hover:underline block mt-2">
              help@unite.gov.in
            </a>
            <p className="text-sm text-muted-foreground mt-1">Response within 2 hours</p>
          </div>

          {/* Landline */}
          <div className="card-unite text-center group">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: "hsl(var(--accent) / 0.1)" }}>
              <PhoneCall className="w-8 h-8" style={{ color: "hsl(var(--accent))" }} />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">{t("landline")}</h3>
            <a href="tel:044-2233-4455" className="text-2xl font-bold text-primary hover:underline block mt-2">
              044-2233-4455
            </a>
            <p className="text-sm text-muted-foreground mt-1">Mon–Sat, 9AM–6PM</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-unite flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Headquarters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ministry of Home Affairs, Unite Division<br />
                North Block, New Delhi - 110001<br />
                India
              </p>
            </div>
          </div>

          <div className="card-unite flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "hsl(var(--success) / 0.1)" }}>
              <Clock className="w-5 h-5" style={{ color: "hsl(var(--success))" }} />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Operating Hours</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Emergency Helpline: 24/7<br />
                Office Hours: Mon–Sat, 9:00AM – 6:00PM<br />
                <span className="font-semibold text-foreground">Never closes during disasters</span>
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-8 rounded-2xl p-6 text-white text-center" style={{ background: "hsl(var(--emergency))" }}>
          <p className="text-lg font-bold">🚨 In Case of Emergency</p>
          <p className="mt-1 text-white/90">Call <strong>1800-123-4567</strong> immediately. Our response team is available around the clock.</p>
        </div>
      </div>
    </div>
  );
}
