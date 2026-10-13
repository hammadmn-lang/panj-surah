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
} from 'lucide-react';
import { HijriDate } from '../utils/hijriCalendar';
import { ActiveTab, UserLocation, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  location: UserLocation;
  hijriDate: HijriDate;
  theme: 'dark' | 'light' | 'emerald-light' | 'emerald-dark';
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
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/app_logo_1791491470615.jpg"
              alt="Panj Surah App Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl shadow-lg border border-emerald-600/40 object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-semibold tracking-tight text-white font-sans">
                  Panj Surah
                </span>
                <button
                  id="navbar-hijri-date-badge"
                  onClick={onOpenHijriModal}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50 hover:border-emerald-700 transition-colors cursor-pointer"
                  title="Adjust Hijri Date / Moon Sighting"
                >
                  <Moon className="w-3 h-3 text-emerald-400" />
                  <span>{hijriDate.formattedEn}</span>
                </button>
              </div>
              <p
                onClick={onOpenHijriModal}
                className="text-[11px] text-neutral-400 font-medium hidden sm:block hover:text-emerald-400 transition-colors cursor-pointer"
                title="Click to view/adjust Islamic calendar"
              >
                {hijriDate.formattedAr} ({hijriDate.formattedUr}) {hijriDate.isSacredMonth && '• شهر حرام'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-950/70 p-1.5 rounded-2xl border border-neutral-800/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
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
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/80 animate-pulse'
                  : 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/80 text-neutral-300'
              }`}
              title={isMeetingActive ? 'Meeting Mode Active (Azaan Silenced) - Click to manage' : 'Disable Azaan during meetings'}
            >
              {isMeetingActive ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline font-semibold">In Meeting</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
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
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                  : 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/80 text-neutral-300'
              }`}
              title="Cloud Backup & Account Sync (Restore upon reinstallation)"
            >
              <Cloud className={`w-3.5 h-3.5 ${userProfile?.isLoggedIn ? 'text-emerald-400' : 'text-neutral-400'} shrink-0`} />
              <span className="hidden xl:inline max-w-[120px] truncate font-mono">
                {userProfile?.isLoggedIn && userProfile.email ? userProfile.email.split('@')[0] : 'Sync'}
              </span>
            </button>


            {/* Location Selector */}
            <button
              id="navbar-location-btn"
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 text-xs font-medium transition-all cursor-pointer max-w-[120px] sm:max-w-xs truncate"
              title="Change Location & Calculation Method"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{location.city}</span>
            </button>

            {/* Privacy Policy & Copyright Modal */}
            {onOpenPrivacyModal && (
              <button
                id="navbar-privacy-btn"
                onClick={onOpenPrivacyModal}
                className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-emerald-400 transition-all cursor-pointer"
                title="Privacy Policy & Copyright Notice"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              id="navbar-theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

