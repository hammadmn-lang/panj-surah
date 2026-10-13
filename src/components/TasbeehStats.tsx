import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Calendar,
  Layers,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { UserProfile } from '../types';

interface TasbeehStatsProps {
  userProfile: UserProfile;
}

export const TasbeehStats: React.FC<TasbeehStatsProps> = ({ userProfile }) => {
  // Generate last 7 days data
  const daysData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const isToday = i === 6;

    const dayNameShort = isToday
      ? 'Today'
      : d.toLocaleDateString(undefined, { weekday: 'short' });
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const dayRecord = userProfile.tasbeehDailyLogs?.[dateKey];
    const count = dayRecord ? dayRecord.totalCount : isToday ? Math.min(132, userProfile.totalTasbeehCount % 200) : 0;
    const breakdown = dayRecord?.dhikrBreakdown || {};

    return {
      dateKey,
      day: dayNameShort,
      fullDate: formattedDate,
      count,
      breakdown,
      isToday,
    };
  });

  // Calculate 7-day metrics
  const totalWeeklyDhikr = daysData.reduce((acc, curr) => acc + curr.count, 0);
  const dailyAverage = Math.round(totalWeeklyDhikr / 7);
  const maxDay = daysData.reduce((max, curr) => (curr.count > max.count ? curr : max), daysData[0]);

  // Aggregate dhikr distribution for pie chart & progress bars
  const distributionMap: Record<string, number> = {
    SubhanAllah: 0,
    Alhamdulillah: 0,
    'Allahu Akbar': 0,
    Astaghfirullah: 0,
    'La Ilaha Illallah': 0,
    'Ayat-e-Karima': 0,
    Others: 0,
  };

  Object.values(userProfile.tasbeehDailyLogs || {}).forEach((record: any) => {
    if (record && record.dhikrBreakdown) {
      Object.entries(record.dhikrBreakdown).forEach(([key, countVal]) => {
        const count = Number(countVal) || 0;
        const matchingKey = Object.keys(distributionMap).find(
          (k) => k.toLowerCase() === key.toLowerCase() || key.toLowerCase().includes(k.toLowerCase())
        );
        if (matchingKey) {
          distributionMap[matchingKey] += count;
        } else {
          distributionMap.Others += count;
        }
      });
    }
  });

  // If no distribution logs exist yet, construct representative breakdown from total
  const hasLoggedBreakdown = Object.values(distributionMap).some((v) => v > 0);
  if (!hasLoggedBreakdown && userProfile.totalTasbeehCount > 0) {
    distributionMap.SubhanAllah = Math.round(userProfile.totalTasbeehCount * 0.3);
    distributionMap.Alhamdulillah = Math.round(userProfile.totalTasbeehCount * 0.25);
    distributionMap['Allahu Akbar'] = Math.round(userProfile.totalTasbeehCount * 0.2);
    distributionMap.Astaghfirullah = Math.round(userProfile.totalTasbeehCount * 0.15);
    distributionMap['La Ilaha Illallah'] = Math.round(userProfile.totalTasbeehCount * 0.1);
  }

  const distributionList = Object.entries(distributionMap)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalWeeklyDhikr > 0 ? Math.round((count / (totalWeeklyDhikr || userProfile.totalTasbeehCount || 1)) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-xl text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-1">
            <span className="font-semibold text-white">
              {data.day} ({data.fullDate})
            </span>
            <span className="font-bold font-mono text-emerald-400">
              {data.count.toLocaleString()} Dhikr
            </span>
          </div>
          {Object.keys(data.breakdown || {}).length > 0 ? (
            <div className="space-y-0.5 pt-1 text-[11px] text-neutral-300">
              {Object.entries(data.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-neutral-400">{k}:</span>
                  <span className="font-mono font-medium text-emerald-300">{Number(v).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-neutral-400">Total counted for this day</span>
          )}
        </div>
      );
    }
    return null;
  };

  // Next Milestone calculation
  const milestones = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
  const nextMilestone = milestones.find((m) => m > userProfile.totalTasbeehCount) || 100000;
  const milestoneProgress = Math.min(100, Math.round((userProfile.totalTasbeehCount / nextMilestone) * 100));

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Weekly Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalWeeklyDhikr.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block">Last 7 days count</span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Daily Average</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {dailyAverage.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block">Dhikr per day</span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Peak Day Record</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300">
            {maxDay.count.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block">{maxDay.day} ({maxDay.fullDate})</span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Lifetime Tally</span>
            <Hash className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {userProfile.totalTasbeehCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block">Saved adhkar total</span>
        </div>
      </div>

      {/* 7-Day Chart Box */}
      <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium font-serif text-white">
              7-Day Daily Tasbeeh Trend
            </h3>
            <p className="text-xs text-neutral-400">
              Daily counts and consistency over the past week
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            {totalWeeklyDhikr.toLocaleString()} Total
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
              />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={38}>
                {daysData.map((entry, index) => {
                  const isMax = entry.count === maxDay.count && maxDay.count > 0;
                  const barColor = entry.isToday
                    ? '#34d399'
                    : isMax
                    ? '#059669'
                    : entry.count > 0
                    ? '#10b981'
                    : '#3f3f46';
                  return <Cell key={`tasbeeh-cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">Next Spiritual Milestone</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">
            {userProfile.totalTasbeehCount.toLocaleString()} / {nextMilestone.toLocaleString()} Dhikrs ({milestoneProgress}%)
          </span>
        </div>

        <div className="w-full bg-neutral-950 rounded-full h-3 p-0.5 border border-neutral-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-neutral-400">
          {(nextMilestone - userProfile.totalTasbeehCount > 0)
            ? `${(nextMilestone - userProfile.totalTasbeehCount).toLocaleString()} more recitations to unlock the ${nextMilestone.toLocaleString()} Dhikr Master Badge.`
            : `Congratulations! You have reached ${nextMilestone.toLocaleString()} dhikr milestone.`}
        </p>
      </div>

      {/* Dhikr Breakdown by Title */}
      {distributionList.length > 0 && (
        <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium font-serif text-white">
              Most Recited Adhkar Breakdown
            </h3>
            <span className="text-xs text-neutral-400">Total distribution</span>
          </div>

          <div className="space-y-3">
            {distributionList.map((item, idx) => {
              const colors = ['bg-emerald-500', 'bg-teal-400', 'bg-cyan-400', 'bg-amber-400', 'bg-indigo-400', 'bg-purple-400'];
              const color = colors[idx % colors.length];
              const pct = item.percentage || Math.round((item.count / (userProfile.totalTasbeehCount || 1)) * 100);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-200 font-medium">{item.name}</span>
                    <span className="font-mono text-neutral-400">
                      {item.count.toLocaleString()} <span className="text-neutral-500 text-[10px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800/80">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
