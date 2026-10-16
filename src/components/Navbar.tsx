import React from 'react';
import {
  MapPin,
  Clock,
  BookOpen,
  Compass,
  Heart,
  Sparkles,
  CircleDot,
  User,
  Sun,
  Moon,
  Bell,
  BellRing,
  VolumeX,
  Volume2,
  Cloud,
  CloudCheck,
  Briefcase,
  AlertTriangle,
  Shield,
  Eye,
} from 'lucide-react';
import { HijriDate } from '../utils/hijriCalendar';
import { ActiveTab, UserLocation, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  location: UserLocation;
  hijriDate: HijriDate;
  theme: 'dark' | 'light' | 'emerald-light' | 'emerald-dark' | 'bright';
  userProfile?: UserProfile;
  isSyncExpired?: boolean;
  onOpenInternetUpdateModal?: () => void;
  onToggleTheme: () => void;
  onOpenLocationModal: () => void;
  onOpenHijriModal?: () => void;
  onOpenMeetingModeModal?: () => void;
  onOpenAccountSyncModal?: () => void;
  onOpenPrivacyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  location,
  hijriDate,
  theme,
  userProfile,
  isSyncExpired,
  onOpenInternetUpdateModal,
  onToggleTheme,
  onOpenLocationModal,
  onOpenHijriModal,
  onOpenMeetingModeModal,
  onOpenAccountSyncModal,
  onOpenPrivacyModal,
}) => {
  const isMeetingActive =
    userProfile?.meetingModeActive &&
    (!userProfile?.meetingModeUntil || Date.now() < userProfile?.meetingModeUntil);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'prayers', label: 'Dashboard', icon: <Clock className="w-4 h-4" /> },
    { id: 'surahs', label: 'Surahs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'durood', label: 'Durood', icon: <Heart className="w-4 h-4" /> },
    { id: 'duas', label: 'Duas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'qibla', label: 'Qibla', icon: <Compass className="w-4 h-4" /> },
    { id: 'tasbeeh', label: 'Tasbeeh', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-emerald-200/90 text-slate-800 backdrop-blur-md shadow-xs transition-colors dark:bg-neutral-900/95 dark:border-neutral-800 dark:text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/app_logo_1791491470615.jpg"
              alt="Panj Surah App Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl shadow-md border border-emerald-600/40 object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-950 font-sans dark:text-white">
                  Panj Surah
                </span>
                <button
                  id="navbar-hijri-date-badge"
                  onClick={onOpenHijriModal}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200/80 transition-colors cursor-pointer dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/40 dark:hover:bg-emerald-900/50"
                  title="Adjust Hijri Date / Moon Sighting"
                >
                  <Moon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{hijriDate.formattedEn}</span>
                </button>
              </div>
              <p
                onClick={onOpenHijriModal}
                className="text-[11px] text-slate-500 font-medium hidden sm:block hover:text-emerald-700 transition-colors cursor-pointer dark:text-neutral-400 dark:hover:text-emerald-400"
                title="Click to view/adjust Islamic calendar"
              >
                {hijriDate.formattedAr} ({hijriDate.formattedUr}) {hijriDate.isSacredMonth && '• شهر حرام'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-emerald-50/90 p-1.5 rounded-2xl border border-emerald-200/90 shadow-xs dark:bg-neutral-950/70 dark:border-neutral-800/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/40'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-100/60 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 bg-emerald-300 dark:bg-emerald-400 rounded-full" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* 3-Day Update Required Warning Badge */}
            {isSyncExpired && (
              <button
                id="navbar-sync-expired-btn"
                onClick={onOpenInternetUpdateModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-500/80 text-amber-300 text-xs font-bold animate-pulse transition-all cursor-pointer shadow-md shadow-amber-950/50"
                title="3 days passed since prayer times were verified online. Click to connect to internet & update schedule."
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Update (3d)</span>
              </button>
            )}

            {/* Meeting Mode Toggle */}
            <button
              id="navbar-meeting-mode-btn"
              onClick={onOpenMeetingModeModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isMeetingActive
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-emerald-950 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:border-neutral-700/80 dark:text-neutral-300'
              }`}
              title={isMeetingActive ? 'Meeting Mode Active (Azaan Silenced) - Click to manage' : 'Disable Azaan during meetings'}
            >
              {isMeetingActive ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="hidden sm:inline font-semibold">In Meeting</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700 dark:text-neutral-400 shrink-0" />
                  <span className="hidden lg:inline">Meeting Mode</span>
                </>
              )}
            </button>

            {/* Cloud Sync / Email Login */}
            <button
              id="navbar-cloud-sync-btn"
              onClick={onOpenAccountSyncModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                userProfile?.isLoggedIn
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-emerald-950 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:border-neutral-700/80 dark:text-neutral-300'
              }`}
              title="Cloud Backup & Account Sync (Restore upon reinstallation)"
            >
              <Cloud className={`w-3.5 h-3.5 ${userProfile?.isLoggedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-700 dark:text-neutral-400'} shrink-0`} />
              <span className="hidden xl:inline max-w-[120px] truncate font-mono">
                {userProfile?.isLoggedIn && userProfile.email ? userProfile.email.split('@')[0] : 'Sync'}
              </span>
            </button>

            {/* Location Selector */}
            <button
              id="navbar-location-btn"
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-semibold transition-all cursor-pointer max-w-[120px] sm:max-w-xs truncate dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:border-neutral-700/80 dark:text-neutral-200"
              title="Change Location & Calculation Method"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{location.city}</span>
            </button>

            {/* Privacy Policy & Copyright Modal */}
            {onOpenPrivacyModal && (
              <button
                id="navbar-privacy-btn"
                onClick={onOpenPrivacyModal}
                className="p-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:border-neutral-700/80 dark:text-neutral-300 dark:hover:text-emerald-400"
                title="Privacy Policy & Copyright Notice"
              >
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            )}

            {/* 3-Theme Cycle Toggle Button (Light -> Bright High-Contrast -> Dark -> Light) */}
            <button
              id="navbar-theme-toggle-btn"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold text-xs transition-all cursor-pointer dark:bg-neutral-800/80 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              title={
                theme === 'dark'
                  ? 'Active: Dark Mode. Click to switch to Light (Green & White)'
                  : theme === 'bright'
                  ? 'Active: Bright (High Contrast for Seniors). Click to switch to Dark Mode'
                  : 'Active: Light Theme. Click to switch to Bright (High Contrast for Seniors)'
              }
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span className="hidden xl:inline text-[11px]">Dark</span>
                </>
              ) : theme === 'bright' ? (
                <>
                  <Eye className="w-4 h-4 text-emerald-800 dark:text-emerald-300 font-bold" />
                  <span className="hidden xl:inline text-[11px] font-bold">Bright</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-emerald-600" />
                  <span className="hidden xl:inline text-[11px]">Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

