import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  X,
  MapPin,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { OfflinePrayerSyncStatus, UserLocation } from '../types';

interface InternetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: OfflinePrayerSyncStatus;
  location: UserLocation;
  onRefreshOnline: () => Promise<void> | void;
  onSimulateExpired?: () => void;
  onResetFresh?: () => void;
}

export const InternetUpdateModal: React.FC<InternetUpdateModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  location,
  onRefreshOnline,
  onSimulateExpired,
  onResetFresh,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [onlineState, setOnlineState] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setOnlineState(true);
    const handleOffline = () => setOnlineState(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!onlineState) {
      alert('Your device is currently offline. Please turn on Wi-Fi or mobile data to update prayer times.');
      return;
    }

    setIsUpdating(true);
    try {
      // Small simulated network verification delay for authentic feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      await onRefreshOnline();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsUpdating(false);
        onClose();
      }, 1200);
    } catch {
      setIsUpdating(false);
    }
  };

  return (
    <div
      id="internet-update-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="internet-update-modal"
        className="bg-neutral-900 border border-neutral-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with warning accent */}
        <div className={`p-6 border-b ${syncStatus.isExpired ? 'bg-amber-950/40 border-amber-900/50' : 'bg-emerald-950/30 border-neutral-800'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  syncStatus.isExpired
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {syncStatus.isExpired ? (
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {syncStatus.isExpired ? 'Internet Connection Required' : 'Prayer Times 3-Day Sync'}
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {syncStatus.isExpired
                    ? '3-day offline window expired • Please connect to internet'
                    : 'Prayer times saved ahead for 3 days'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Notice Banner */}
          <div
            className={`p-4 rounded-2xl border ${
              syncStatus.isExpired
                ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
              <div className="text-xs leading-relaxed space-y-1">
                <p className="font-semibold text-white">
                  {syncStatus.isExpired
                    ? '3 days have passed since your last online prayer times update.'
                    : 'Your prayer times are currently saved ahead for 3 full days.'}
                </p>
                <p className="text-neutral-300">
                  To ensure astronomical accuracy, solar declination angles, and regional moon sighting
                  alignments, the application asks for an internet connection every 3 days to refresh and verify
                  prayer times.
                </p>
              </div>
            </div>
          </div>

          {/* Current Connection & Device Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Internet Status Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                {onlineState ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
                Device Connection
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    onlineState ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className={`text-sm font-semibold ${onlineState ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {onlineState ? 'Connected to Internet' : 'Offline / No Internet'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {onlineState
                  ? 'Ready to sync and extend 3-day prayer cache.'
                  : 'Turn on Wi-Fi or cellular data to update.'}
              </p>
            </div>

            {/* Sync Age Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                3-Day Sync Window
              </span>
              <div className="text-sm font-semibold font-mono text-white">
                {syncStatus.isExpired ? (
                  <span className="text-amber-400 font-bold">Expired ({syncStatus.daysElapsed}d ago)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">{syncStatus.hoursRemaining}h remaining</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">
                Last verified: {syncStatus.lastUpdateFormatted}
              </p>
            </div>
          </div>

          {/* Local Device Accuracy & Location Guarantee */}
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Active Location & Device Settings
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/50">
                {location.isAuto ? 'GPS Setting Active' : 'Offline Saved City'}
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              {location.city}, {location.country} ({location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°)
            </p>
            <div className="text-[11px] text-neutral-400 bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Offline Protection:</strong> Even if offline, your local device clock and saved coordinates
                keep your prayers accurate without delay.
              </span>
            </div>
          </div>

          {/* Developer / Testing Simulator Controls */}
          {(onSimulateExpired || onResetFresh) && (
            <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Test Sync Simulation:
              </span>
              <div className="flex items-center gap-2">
                {onSimulateExpired && (
                  <button
                    type="button"
                    onClick={onSimulateExpired}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-amber-300 border border-neutral-700 cursor-pointer"
                    title="Simulate 3 days elapsed to test prompt"
                  >
                    Simulate 3 Days Passed
                  </button>
                )}
                {onResetFresh && (
                  <button
                    type="button"
                    onClick={onResetFresh}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-emerald-300 border border-neutral-700 cursor-pointer"
                  >
                    Reset Fresh
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-medium transition-colors cursor-pointer text-center"
          >
            Continue with Saved Times
          </button>

          <button
            type="button"
            id="btn-update-prayer-times-now"
            onClick={handleUpdate}
            disabled={isUpdating || !onlineState}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              !onlineState
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : isSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating for Next 3 Days...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Updated for 3 Days Ahead!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Update Prayer Times Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
