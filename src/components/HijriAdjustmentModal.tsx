import React from 'react';
import { X, Moon, Globe, Check, Info, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { HijriDate, getHijriDate } from '../utils/hijriCalendar';
import { UserLocation, UserProfile } from '../types';

interface HijriAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  hijriDate: HijriDate;
  location: UserLocation;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onRefreshLiveDate?: () => void;
}

export const HijriAdjustmentModal: React.FC<HijriAdjustmentModalProps> = ({
  isOpen,
  onClose,
  hijriDate,
  location,
  userProfile,
  onUpdateProfile,
  onRefreshLiveDate,
}) => {
  if (!isOpen) return null;

  const currentAdj = userProfile.hijriDayAdjustment ?? 0;

  const handleSelectPreset = (offset: number) => {
    onUpdateProfile({ hijriDayAdjustment: offset });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="hijri-adjustment-modal"
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                Islamic Hijri Calendar Sighting
              </h3>
              <p className="text-xs text-neutral-400">
                Regional moon sighting & Google local date synchronization
              </p>
            </div>
          </div>

          <button
            id="close-hijri-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Date Showcase */}
        <div className="p-6 space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-neutral-950 to-neutral-900 border border-emerald-800/40 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Current Islamic Date ({location.city}, {location.country})
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight my-1">
              {hijriDate.formattedEn}
            </div>

            <div className="text-lg font-arabic text-emerald-300 my-0.5">
              {hijriDate.formattedAr} • <span className="font-sans font-medium text-sm text-neutral-300">{hijriDate.formattedUr}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300">
                <Globe className="w-3 h-3 text-emerald-400" />
                {hijriDate.sightingStandard || `${location.country} Sighting`}
              </span>
              {hijriDate.isAfterMaghrib && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 font-medium">
                  🌙 Maghrib Passed (Night of {hijriDate.day} {hijriDate.monthNameEn})
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300">
                {hijriDate.source === 'live_google_aladhan'
                  ? '🌐 Google/Aladhan Synced'
                  : hijriDate.source === 'regional_ruet'
                  ? '🌙 Regional Ruet (-1 Day)'
                  : `Offset: ${currentAdj >= 0 ? '+' : ''}${currentAdj} Day`}
              </span>
            </div>
          </div>

          {/* Preset Sighting Options */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
              Select Regional Moon Sighting Standard
            </label>

            <div className="space-y-2.5">
              {/* Regional Ruet-e-Hilal (South Asia / Visual Sighting) */}
              <button
                id="preset-pakistan-ruet"
                onClick={() => handleSelectPreset(-1)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  currentAdj === -1
                    ? 'bg-emerald-950/60 border-emerald-600 text-white ring-1 ring-emerald-500'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    <span>🌙 Visual Moon Sighting (Ruet-e-Hilal: -1 Day)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600/80 text-white font-bold">
                      {getHijriDate(new Date(), -1, location).formattedEn}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Official naked-eye sighting standard followed in Pakistan, India, Bangladesh, Morocco, Oman & Australia.
                  </p>
                </div>
                {currentAdj === -1 && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

              {/* Saudi Arabia / Umm al-Qura */}
              <button
                id="preset-saudi-umm-alqura"
                onClick={() => handleSelectPreset(0)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  currentAdj === 0
                    ? 'bg-emerald-950/60 border-emerald-600 text-white ring-1 ring-emerald-500'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    <span>🇸🇦 Umm al-Qura Standard, Makkah (0 Day)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-bold">
                      {getHijriDate(new Date(), 0, location).formattedEn}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Astronomical lunar calendar adopted in Saudi Arabia, Arabian Gulf, Turkey, Egypt, and FCNA North America.
                  </p>
                </div>
                {currentAdj === 0 && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Fine Tuning +/- 2 Days Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Manual Fine-Tuning Offset
              </label>
              <span className="text-xs font-mono text-emerald-400">
                Offset: {currentAdj >= 0 ? `+${currentAdj}` : currentAdj} Day(s)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[-2, -1, 0, 1, 2].map((val) => (
                <button
                  key={val}
                  id={`adjust-day-btn-${val}`}
                  onClick={() => handleSelectPreset(val)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentAdj === val
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {val === 0 ? '0 (Auto)' : val > 0 ? `+${val} Day` : `${val} Day`}
                </button>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Islamic months depend on the visual crescent moon sighting and sunset. In your location (<strong className="text-white">{location.city}, {location.country}</strong>), the active standard is <strong className="text-emerald-300">{hijriDate.sightingStandard || 'Location Standard'}</strong>. The Islamic day automatically advances after Maghrib (sunset).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950/70 border-t border-neutral-800 flex items-center justify-between">
          {onRefreshLiveDate && (
            <button
              onClick={onRefreshLiveDate}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Re-sync Live
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-colors"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
