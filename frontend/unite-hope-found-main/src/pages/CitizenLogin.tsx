import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { User, CheckCircle, ArrowLeft } from "lucide-react";

export default function CitizenLogin() {
  const { t, setRole, role } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    address: "",
    mobile: ""
  });

  if (role === "citizen") return <Navigate to="/citizen-dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin-dashboard" replace />;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1)
      e.age = "Valid age required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.mobile.match(/^\d{10}$/))
      e.mobile = "10-digit mobile number required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;


    try {
      const response = await fetch("http://localhost:8000/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          email: form.email,
          mobile: form.mobile,
          role: "citizen"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setStep("otp");
    } catch (error) {
      alert("Error sending OTP. Check backend server.");
    }
  };

  // 🔥 VERIFY OTP WITH BACKEND
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mobile: form.mobile,
          otp: otp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.detail || "Invalid or expired OTP");
        return;
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.access_token);

      setStep("success");
      setRole("citizen");

      setTimeout(() => navigate("/citizen-dashboard"), 1500);

    } catch (error) {
      setOtpError("Server error. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-background page-enter flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {t("backHome")}
        </Link>

        <div className="card-unite">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "hsl(var(--accent) / 0.15)" }}
            >
              <User
                className="w-8 h-8"
                style={{ color: "hsl(var(--accent))" }}
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("citizenLogin")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Help reunite families in your community
            </p>
          </div>

          {step === "form" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {[
                { key: "name" as const, label: t("name"), type: "text" },
                { key: "age" as const, label: t("age"), type: "number" },
                { key: "email" as const, label: t("emailField"), type: "email" },
                { key: "address" as const, label: t("address"), type: "text" },
                { key: "mobile" as const, label: t("mobile"), type: "tel" }
              ].map((f) => (
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    className="form-input"
                  />
                  {errors[f.key] && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "hsl(var(--emergency))" }}
                    >
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}

              <button type="submit" className="btn-primary w-full">
                {t("sendOtp")}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-xl p-4 text-sm font-medium text-center"
                style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}>
                📱 OTP sent to +91 {form.mobile}
              </div>

              <div>
                <label className="form-label">{t("enterOtp")}</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError("");
                  }}
                  className="form-input text-center text-xl tracking-widest font-bold"
                />
                {otpError && (
                  <p
                    className="text-xs mt-1 text-center"
                    style={{ color: "hsl(var(--emergency))" }}
                  >
                    {otpError}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                {t("verifyOtp")}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("back")}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4 page-enter">
              <CheckCircle
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "hsl(var(--success))" }}
              />
              <p className="text-lg font-bold text-foreground">
                {t("otpSuccess")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting to Citizen Dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
