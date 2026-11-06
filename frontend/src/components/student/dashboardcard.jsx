import { BookOpen, CheckCheck, CreditCard, Wallet } from "lucide-react";

const statConfigs = [
  { key: "total_courses", label: "Enrolled", icon: BookOpen, accent: "purple" },
  { key: "completed_lessons", label: "Lessons", icon: CheckCheck, accent: "orange" },
  { key: "total_payments", label: "Payments", icon: CreditCard, accent: "violet" },
  { key: "total_amount_spent", label: "Spent", icon: Wallet, accent: "green", format: "currency" },
];

function formatValue(key, value) {
  if (key === "total_amount_spent") {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  return value ?? 0;
}

export default function DashboardCard({ stats, loading }) {
  const resolvedStats = stats || {
    total_courses: 0,
    completed_lessons: 0,
    total_payments: 0,
    total_amount_spent: 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statConfigs.map(({ key, label, icon: Icon, accent, format }) => {
        const value = format === "currency" ? formatValue(key, resolvedStats[key]) : formatValue(key, resolvedStats[key]);

        return (
          <div key={key} className="rounded-3xl border border-white/10 bg-[#101018]/85 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/50">{label}</div>
                <div className="mt-3 text-3xl font-black text-white">
                  {loading ? "..." : value}
                </div>
              </div>
              <div className={`rounded-2xl p-2 ${accent === "purple" ? "bg-purple-500/15 text-purple-300" : accent === "orange" ? "bg-orange-500/15 text-orange-300" : accent === "violet" ? "bg-violet-500/15 text-violet-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
