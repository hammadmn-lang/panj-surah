import React, { useState } from 'react';
import {
  VolumeX,
  Volume2,
  Clock,
  Briefcase,
  CheckCircle2,
  X,
  Shield,
  BellOff,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MeetingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const MeetingModeModal: React.FC<MeetingModeModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const now = Date.now();
  const isMeetingActive =
    userProfile.meetingModeActive &&
    (!userProfile.meetingModeUntil || now < userProfile.meetingModeUntil);

  const getRemainingTimeFormatted = () => {
    if (!userProfile.meetingModeUntil) return 'Until manually resumed';
    const diff = userProfile.meetingModeUntil - now;
    if (diff <= 0) return 'Expiring now';
    const mins = Math.ceil(diff / (1000 * 60));
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins > 0 ? `${remainingMins}m` : ''} remaining`;
    }
    return `${mins} minutes remaining`;
  };

  const handleSetMeetingDuration = (durationMinutes: number | null) => {
    if (durationMinutes === null) {
      // Indefinite
      onUpdateProfile({
        meetingModeActive: true,
        meetingModeUntil: null,
      });
    } else {
      const untilTimestamp = Date.now() + durationMinutes * 60 * 1000;
      onUpdateProfile({
        meetingModeActive: true,
        meetingModeUntil: untilTimestamp,
      });
    }
    onClose();
  };

  const handleResumeAdhan = () => {
    onUpdateProfile({
      meetingModeActive: false,
      meetingModeUntil: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-800 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800/40 text-amber-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-medium font-serif text-white">
              Meeting Mode (Silent Azaan)
            </h3>
            <p className="text-xs text-neutral-400">
              Mute all audible Adhan & warning alarms during meetings and calls
            </p>
          </div>
        </div>

        {/* Active Status Banner */}
        {isMeetingActive ? (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Meeting Mode Active
                </span>
              </div>
              <span className="text-xs font-mono text-amber-200 font-medium">
                {getRemainingTimeFormatted()}
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              All prayer azaan sounds, chimes, and 15-minute closing audio alerts are currently silenced. Visual notifications will continue silently.
            </p>

            <button
              onClick={handleResumeAdhan}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Volume2 className="w-4 h-4" />
              Resume Adhan Audio Now
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Adhan audio is currently active. Select a meeting duration below to mute temporarily.</span>
          </div>
        )}

        {/* Duration Selection Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Quick Mute Presets
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSetMeetingDuration(30)}
              className="p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 block">
                30 Minutes
              </span>
              <span className="text-[11px] text-neutral-400">Quick standup / sync</span>
            </button>

            <button
              onClick={() => handleSetMeetingDuration(60)}
              className="p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 block">
                1 Hour
              </span>
              <span className="text-[11px] text-neutral-400">Standard meeting</span>
            </button>

            <button
              onClick={() => handleSetMeetingDuration(120)}
              className="p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 block">
                2 Hours
              </span>
              <span className="text-[11px] text-neutral-400">Extended workshop / review</span>
            </button>

            <button
              onClick={() => handleSetMeetingDuration(240)}
              className="p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 block">
                4 Hours
              </span>
              <span className="text-[11px] text-neutral-400">Half day conference</span>
            </button>
          </div>

          <button
            onClick={() => handleSetMeetingDuration(null)}
            className="w-full mt-2 p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/80 text-left transition-all cursor-pointer group flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 block">
                Mute Indefinitely
              </span>
              <span className="text-[10px] text-neutral-500">Muted until you manually re-enable sound</span>
            </div>
            <BellOff className="w-4 h-4 text-neutral-500 group-hover:text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
