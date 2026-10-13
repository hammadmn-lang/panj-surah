import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, CheckCircle2, Calendar, Award, Flame } from 'lucide-react';
import { PrayerKey, UserProfile } from '../types';

interface WeeklyPrayerChartProps {
  userProfile: UserProfile;
}

const OBLIGATORY_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const WeeklyPrayerChart: React.FC<WeeklyPrayerChartProps> = ({ userProfile }) => {
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

    const dayLog = userProfile.prayerLog?.[dateKey] || {};
    const completedPrayers = OBLIGATORY_PRAYERS.filter((k) => !!dayLog[k]);
    const completedCount = completedPrayers.length;
    const percentage = Math.round((completedCount / 5) * 100);

    return {
      dateKey,
      day: dayNameShort,
      fullDate: formattedDate,
      percentage,
      completedCount,
      total: 5,
      fajr: !!dayLog.fajr,
      dhuhr: !!dayLog.dhuhr,
      asr: !!dayLog.asr,
      maghrib: !!dayLog.maghrib,
      isha: !!dayLog.isha,
      isToday,
    };
  });

  // Calculate 7-day metrics
  const totalCompletedWeek = daysData.reduce((acc, curr) => acc + curr.completedCount, 0);
  const totalPossible = 7 * 5; // 35 prayers
  const weeklyAveragePercentage = Math.round((totalCompletedWeek / totalPossible) * 100);
  const fullDaysCount = daysData.filter((d) => d.completedCount === 5).length;

  const getConsistencyTier = (pct: number) => {
    if (pct >= 90) return { label: 'Mumtaz (Exemplary)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
    if (pct >= 70) return { label: 'Jayyid Jiddan (Strong)', color: 'text-teal-400 bg-teal-950/60 border-teal-800/60' };
    if (pct >= 50) return { label: 'Steadily Improving', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
    return { label: 'Needs Focus & Dua', color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' };
  };

  const tier = getConsistencyTier(weeklyAveragePercentage);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-2xl shadow-xl text-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-1.5">
            <span className="font-semibold text-white">
              {data.day} ({data.fullDate})
            </span>
            <span className="font-bold font-mono text-emerald-400">
              {data.percentage}%
            </span>
          </div>
          <div className="text-neutral-300 font-mono text-[11px]">
            {data.completedCount} of 5 Prayers Completed
          </div>
          <div className="grid grid-cols-5 gap-1 pt-1 text-[10px]">
            <span className={`px-1 py-0.5 rounded text-center font-bold ${data.fajr ? 'bg-emerald-900/60 text-emerald-300' : 'bg-neutral-800 text-neutral-500'}`}>F</span>
            <span className={`px-1 py-0.5 rounded text-center font-bold ${data.dhuhr ? 'bg-emerald-900/60 text-emerald-300' : 'bg-neutral-800 text-neutral-500'}`}>D</span>
            <span className={`px-1 py-0.5 rounded text-center font-bold ${data.asr ? 'bg-emerald-900/60 text-emerald-300' : 'bg-neutral-800 text-neutral-500'}`}>A</span>
            <span className={`px-1 py-0.5 rounded text-center font-bold ${data.maghrib ? 'bg-emerald-900/60 text-emerald-300' : 'bg-neutral-800 text-neutral-500'}`}>M</span>
            <span className={`px-1 py-0.5 rounded text-center font-bold ${data.isha ? 'bg-emerald-900/60 text-emerald-300' : 'bg-neutral-800 text-neutral-500'}`}>I</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm space-y-5 text-left">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-medium font-serif text-white">
                Weekly Prayer Completion Consistency
              </h3>
              <p className="text-xs text-neutral-400">
                Visualizing your 7-day adherence to all 5 obligatory daily prayers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-3 py-1 rounded-xl border font-semibold ${tier.color}`}>
            {tier.label}
          </span>
          <div className="px-3 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs font-mono font-bold text-emerald-400">
            {weeklyAveragePercentage}% Avg
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">7-Day Score</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {totalCompletedWeek} <span className="text-xs text-neutral-500 font-normal">/ 35</span>
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Full 5/5 Days</span>
          <span className="text-xl font-bold font-mono text-teal-300">
            {fullDaysCount} <span className="text-xs text-neutral-500 font-normal">/ 7</span>
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Weekly Completion</span>
          <span className="text-xl font-bold font-mono text-emerald-300">
            {weeklyAveragePercentage}%
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-56 sm:h-64 w-full pt-2">
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
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <ReferenceLine y={100} stroke="#059669" strokeDasharray="3 3" strokeOpacity={0.4} />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]} maxBarSize={42}>
              {daysData.map((entry, index) => {
                let barColor = '#10b981'; // default emerald
                if (entry.percentage === 100) {
                  barColor = '#059669'; // full green
                } else if (entry.percentage >= 60) {
                  barColor = '#14b8a6'; // teal
                } else if (entry.percentage > 0) {
                  barColor = '#f59e0b'; // amber
                } else {
                  barColor = '#3f3f46'; // zinc dark
                }

                if (entry.isToday) {
                  barColor = '#34d399'; // bright emerald for today
                }

                return <Cell key={`cell-${index}`} fill={barColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Footnote */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            100% (All 5 Prayers)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
            60-80% (3-4 Prayers)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            20-40% (1-2 Prayers)
          </span>
        </div>
        <span className="text-[11px] text-neutral-500">
          Tip: Tap any prayer box above to update
        </span>
      </div>
    </div>
  );
};
