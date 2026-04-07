import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { CheckCircle, ArrowLeft, Shield } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // ===============================
  // 🔴 SEND ADMIN OTP
  // ===============================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/auth/admin/send-otp",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Admin not configured");
        return;
      }

      setStep("otp");
    } catch {
      setError("Server error");
    }
  };

  // ===============================
  // 🔴 VERIFY ADMIN OTP
  // ===============================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/auth/admin/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid OTP");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", data.access_token);

      // ✅ VERY IMPORTANT: Set role
      setRole("admin");

      setStep("success");

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        <Link
          to="/"
          className="text-sm text-muted-foreground flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <div className="card-unite text-center">

          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

          {/* STEP 1 */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">

              <p className="text-sm text-muted-foreground">
                OTP will be sent to registered admin email
              </p>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full">
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">

              <input
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input text-center text-lg tracking-widest"
              />

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full">
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === "success" && (
            <div>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-3" />
              <p className="font-semibold">Login Successful</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
