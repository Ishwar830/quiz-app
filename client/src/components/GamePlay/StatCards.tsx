import { Flame, TrendingUp, Zap } from "lucide-react";
import type { ReactNode } from "react";

export function StatCardsGrid({
  score,
  accuracy,
  streak,
}: {
  score: number;
  accuracy: number;
  streak: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard
        icon={<TrendingUp className="stroke-emerald-400" size={20} />}
        label="Score"
        value={score}
        subtext="Points"
        colorClass="bg-emerald-500/50"
      />
      <StatCard
        icon={<Zap className="fill-amber-400 stroke-none" size={20} />}
        label="Accuracy"
        value={`${accuracy}%`}
        subtext="Correct"
        colorClass="bg-amber-500/50"
      />
      <StatCard
        icon={<Flame className="fill-rose-400 stroke-none" size={20} />}
        label="Best Streak"
        value={streak}
        subtext="In a row"
        colorClass="bg-rose-500/50"
      />
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  colorClass: string;
}

function StatCard({ icon, label, value, subtext, colorClass }: StatCardProps) {
  return (
    <div
      className={`flex relative flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-600 ${colorClass} backdrop-blur-sm`}
    >
      <div className="absolute p-1 rounded-md px-2 bg-white border top-0 -translate-y-1/2 flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-xs text-text-800 font-medium mt-1">{subtext}</div>
    </div>
  );
}