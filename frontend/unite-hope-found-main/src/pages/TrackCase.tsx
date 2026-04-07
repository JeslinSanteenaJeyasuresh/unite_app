import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const monthlyData = [
  { month: "Aug", new: 45, cleared: 30, pending: 15 },
  { month: "Sep", new: 62, cleared: 48, pending: 14 },
  { month: "Oct", new: 38, cleared: 35, pending: 3 },
  { month: "Nov", new: 71, cleared: 52, pending: 19 },
  { month: "Dec", new: 55, cleared: 44, pending: 11 },
  { month: "Jan", new: 89, cleared: 67, pending: 22 },
];

const pieData = [
  { name: "Cleared", value: 276, color: "hsl(142, 71%, 38%)" },
  { name: "Pending", value: 84, color: "hsl(38, 95%, 52%)" },
  { name: "Missing", value: 112, color: "hsl(0, 84%, 55%)" },
];

const recentActivity = [
  { id: "UNITE-2024-0089", name: "Ravi Kumar", status: "cleared", date: "2024-01-28", action: "Reunited with family" },
  { id: "UNITE-2024-0092", name: "Priya Sharma", status: "missing", date: "2024-01-26", action: "Under investigation" },
  { id: "UNITE-2024-0078", name: "Mohan Das", status: "cleared", date: "2024-01-25", action: "Located in Chennai shelter" },
  { id: "UNITE-2024-0085", name: "Arjun Patel", status: "missing", date: "2024-01-23", action: "New tip received" },
  { id: "UNITE-2024-0070", name: "Lakshmi Devi", status: "cleared", date: "2024-01-20", action: "Found by local police" },
];

export default function TrackCase() {
  const { t, role, missingPersons } = useApp();
  const navigate = useNavigate();

  const cleared = missingPersons.filter((p) => p.status === "cleared").length + 276;
  const pending = missingPersons.filter((p) => p.status === "missing").length + 84;
  const newCount = missingPersons.length;

  const goBack = () => {
    if (role === "admin") navigate("/admin-dashboard");
    else navigate("/citizen-dashboard");
  };

  const statCards = [
    { label: t("clearedCases"), value: cleared, icon: <CheckCircle className="w-8 h-8" />, colorStyle: { color: "hsl(var(--success))", background: "hsl(var(--success) / 0.1)" }, badge: "+12% this month" },
    { label: t("pendingCases"), value: pending, icon: <Clock className="w-8 h-8" />, colorStyle: { color: "hsl(var(--warning))", background: "hsl(var(--warning) / 0.1)" }, badge: "Under review" },
    { label: t("newCases"), value: newCount, icon: <AlertCircle className="w-8 h-8" />, colorStyle: { color: "hsl(var(--emergency))", background: "hsl(var(--emergency) / 0.1)" }, badge: "This month" },
  ];

  return (
    <div className="min-h-screen bg-background page-enter">
      <div className="py-10 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={goBack} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">{t("trackCase")}</h1>
          <p className="text-white/70 mt-1">Real-time case monitoring and statistics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <div key={card.label} className="dashboard-stat-card bg-white border border-border">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: card.colorStyle.background }}>
                  <span style={{ color: card.colorStyle.color }}>{card.icon}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">{card.badge}</span>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground font-medium mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="card-unite lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">{t("caseStatistics")}</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 31%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 20%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 20%, 50%)" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 31%, 91%)", fontSize: 12 }}
                />
                <Bar dataKey="new" name="New Cases" fill="hsl(0, 84%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cleared" name="Cleared" fill="hsl(142, 71%, 38%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="hsl(38, 95%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card-unite">
            <h2 className="text-lg font-bold text-foreground mb-6">Case Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(214, 31%, 91%)", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 12, color: "hsl(215, 20%, 50%)" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-unite">
          <h2 className="text-lg font-bold text-foreground mb-4">{t("recentCases")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Case ID</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Update</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 text-sm font-mono text-primary">{item.id}</td>
                    <td className="py-3 px-2 text-sm font-medium text-foreground">{item.name}</td>
                    <td className="py-3 px-2">
                      {item.status === "cleared" && <span className="badge-success">Cleared</span>}
                      {item.status === "missing" && <span className="badge-emergency">Missing</span>}
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{item.date}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
