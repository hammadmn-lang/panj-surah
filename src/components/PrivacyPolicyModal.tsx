import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Copy,
  Check,
  Scale,
  Sparkles,
  MapPin,
  Compass,
  Volume2,
  Trash2,
  Download,
  Mail,
  HeartHandshake,
  Megaphone,
  UserX,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';
import { deleteUserAccountAndData } from '../utils/cloudSync';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  initialTab?: 'privacy' | 'copyright' | 'permissions' | 'data';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'copyright' | 'permissions' | 'data'>(initialTab);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const publicPrivacyUrl = 'https://panj-surah-privacy.netlify.app/privacy.html';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicPrivacyUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleExportData = () => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('panj_') || key.includes('prayer') || key.includes('tasbeeh'))) {
          allData[key] = localStorage.getItem(key);
        }
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `panj_surah_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleClearAllData = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Privacy Policy & Legal Terms</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  v2.4.0
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                User Privacy, Data Rights & Application Terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-neutral-950/40 border-b border-neutral-800 shrink-0 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('copyright')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'copyright'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Copyright & IP
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Permissions
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Your Data & Rights
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-neutral-300">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Sacred Privacy Commitment */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  1. Privacy Commitment &amp; Overview
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  <strong>Panj Surah: Daily Prayers &amp; Islamic Companion</strong> is created solely to facilitate your worship (Ibadah), Quran reading, Durood Sharif recitations, and daily prayer tracking. We believe spiritual apps must hold the absolute highest standards of user privacy and transparency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline-First Worship
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      All prayer calculations, Tasbeeh counts, and Surah completions stay securely on your physical device.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> No Personal Data Selling
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      We never sell, rent, or trade your personal data, identity, or location to data brokers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Information & Device Usage */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  2. Device Information &amp; Permissions
                </h3>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2.5 text-xs text-neutral-300">
                  <p>
                    <strong className="text-white">Location Data:</strong> Used strictly to calculate astronomical sunrise, sunset, and solar prayer times for Fajr, Dhuhr, Asr, Maghrib, and Isha, as well as the Qibla angle to the Holy Kaaba. Coordinates are calculated locally on your device and are never recorded or tracked. You may also choose your city manually without granting GPS permission.
                  </p>
                  <p>
                    <strong className="text-white">Orientation Sensor:</strong> Used exclusively in real time when you view the Qibla Compass to detect direction.
                  </p>
                  <p>
                    <strong className="text-white">Audio &amp; Notifications:</strong> Used solely to play Adhan prayer reminders and Quranic recitations. The application does not access your microphone or record any sound.
                  </p>
                </div>
              </div>

              {/* Advertising & Google AdMob Integration */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-emerald-400" />
                  3. Advertising &amp; Third-Party Services (Google AdMob)
                </h3>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3 text-xs text-neutral-300">
                  <p className="leading-relaxed">
                    To support ongoing development, cloud servers, and free distribution of Panj Surah to the global Muslim Ummah, this application includes or may integrate third-party mobile advertising through <strong>Google AdMob</strong> (Google LLC / Google Ireland Limited).
                  </p>
                  
                  <div className="space-y-1.5 pl-1 text-[11.5px] text-neutral-300">
                    <p><strong className="text-white">• Technical Data Collected by Ad Providers:</strong> To deliver and measure non-intrusive advertisements, Google AdMob and its certified mediation partners may process non-sensitive device telemetry, such as the Android Advertising ID (AAID), device model, OS version, and coarse IP-derived region (for language-relevant ads). They do not access your precise GPS coordinates, contact details, or prayer logs.</p>
                    <p><strong className="text-white">• User Consent &amp; Choices:</strong> In relevant regions (including the EU/EEA and UK), users are provided options via Google's Consent Management Platform to accept personalized ads or receive <strong>Non-Personalized Ads (NPA)</strong> based purely on contextual relevance. You can also reset or opt-out of your Advertising ID at any time via Android <em>Settings &rarr; Google &rarr; Ads</em>.</p>
                    <p><strong className="text-white">• Sacred Islamic Ad Standards:</strong> We enforce strict category blocking to prohibit advertisements containing adult themes, gambling, dating, alcohol, or un-Islamic imagery. Ads are never served during active Quran audio recitation or prayer times.</p>
                  </div>
                </div>
              </div>

              {/* Children's Privacy */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  4. Children's Privacy
                </h3>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 leading-relaxed space-y-2">
                  <p>
                    Panj Surah is safe for Muslims of all ages, including children learning Islamic prayers, Duas, and Quran recitation.
                  </p>
                  <p>
                    We do not knowingly collect personal identifiable information from children under 13. Any ad requests in family or child modes are flagged with child-directed treatment (TFCD / TFUA), disabling interest-based tracking and serving only child-appropriate contextual ads.
                  </p>
                </div>
              </div>

              {/* Data Rights & Contact Developer */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  5. Contact Developer &amp; Web Policy
                </h3>
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 space-y-3">
                  <p>
                    If you have questions, feedback, or requests regarding this Privacy Policy or your data, you can reach out directly to the developer:
                    <span className="font-mono text-emerald-300 font-semibold ml-1.5">hammadmn99@gmail.com</span>
                  </p>

                  <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-neutral-400">View complete web document:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyUrl}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedUrl ? 'Copied' : 'Copy Link'}
                      </button>
                      <a
                        href="https://panj-surah-privacy.netlify.app/privacy.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Online Policy ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COPYRIGHT & INTELLECTUAL PROPERTY */}
          {activeTab === 'copyright' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-neutral-950 border border-emerald-800/80 text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-mono font-semibold border border-emerald-700/50">
                  OFFICIAL COPYRIGHT NOTICE
                </div>
                <h3 className="text-lg font-bold text-white">
                  Copyright © 2026 Panj Surah. All Rights Reserved.
                </h3>
                <p className="text-xs text-neutral-400 max-w-lg mx-auto">
                  Registered intellectual property covering application source code, UI/UX design, visual identity, and software architecture.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    Proprietary Software Rights
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    The Panj Surah software application, its digital design system, icons, custom responsive layout, prayer calculation adaptations, and audio synchronization mechanisms are the exclusive intellectual property of the author and developers. Reproduction, decompilation, cloning, or commercial redistribution without prior written permission is strictly prohibited.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Sacred Islamic Texts Attribution
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    The Holy Quranic Arabic verses, Hadith narrations, traditional Durood Sharif, and Masnoon Duas are the universal spiritual heritage of the Islamic Ummah. No copyright is claimed over the divine words of Allah Subhanahu Wa Ta'ala. English and Urdu transliterations, translations, and compilations are presented respectfully for educational and worship purposes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    Audio Recitation Credits
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Quranic verse recitations are provided by world-renowned Qari <strong>Sheikh Mishary Rashid Alafasy</strong> via the EveryAyah open audio educational project.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS & DEVICE ACCESS */}
          {activeTab === 'permissions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-neutral-400">
                Panj Surah adheres to the principle of least privilege. We only request device permissions strictly necessary for Islamic worship features:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Location (ACCESS_COARSE / FINE_LOCATION)</div>
                    <p className="text-xs text-neutral-300 mt-1">
                      <strong>Why needed:</strong> Used exclusively on your device to calculate sunrise, sunset, and solar angles for Fajr, Dhuhr, Asr, Maghrib, and Isha, as well as the Qibla angle to the Holy Kaaba.
                    </p>
                    <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                      ✓ Not transmitted or stored on remote tracking servers. Works fully with manual city selection.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Orientation & Magnetometer Sensors</div>
                    <p className="text-xs text-neutral-300 mt-1">
                      <strong>Why needed:</strong> Powers the interactive 3D/2D Qibla Compass to show you the exact direction towards Makkah.
                    </p>
                    <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                      ✓ Sensor values processed solely on-device in real time and never retained.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Audio Playback & Notifications</div>
                    <p className="text-xs text-neutral-300 mt-1">
                      <strong>Why needed:</strong> Plays Adhan calls to prayer, 15-minute warnings, and Mishary Alafasy Quran recitation.
                    </p>
                    <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                      ✓ We NEVER access your microphone or record any sound. Purely audio output.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: YOUR DATA, ACCOUNT & DELETION RIGHTS */}
          {activeTab === 'data' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Account & Credentials Management */}
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  User Account &amp; Password Management
                </h4>
                <p className="text-xs text-neutral-300">
                  {userProfile?.isLoggedIn && userProfile.email
                    ? `You are currently logged in with ${userProfile.email}. Your credentials and cloud backups are fully manageable directly inside the app.`
                    : 'You can register an account with email and password to sync and preserve your worship logs across devices.'}
                </p>
                <div className="text-[11px] text-emerald-400 font-medium">
                  ✓ Full control to reset passwords or disconnect at any time.
                </div>
              </div>

              {/* Export Data */}
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Export Your Personal Worship Data
                </h4>
                <p className="text-xs text-neutral-300">
                  Download a complete JSON file containing all your prayer tracking logs, Tasbeeh counts, Durood statistics, and customized Dhikr items.
                </p>
                <button
                  onClick={handleExportData}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export All My Data (JSON)
                </button>
              </div>

              {/* Permanent Account & Data Deletion */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-rose-300 flex items-center gap-2">
                    <UserX className="w-4 h-4 text-rose-400" />
                    Google Play Policy &amp; GDPR Right to Erasure
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300">
                    Permanent Deletion
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  You have absolute ownership and control of your information. You may permanently delete your registered account, remove all cloud backups, and purge local prayer logs, offline audio cache, and settings.
                </p>

                {!resetConfirmOpen ? (
                  <button
                    onClick={() => setResetConfirmOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Permanently Delete Account &amp; Erase All Data
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-900/40 border border-rose-700/60 space-y-2">
                    <p className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      Are you sure? This will permanently delete your account and all history.
                    </p>
                    <p className="text-[11px] text-neutral-300">
                      This action cannot be undone. All cloud backups for {userProfile?.email || 'your account'} and local device storage will be completely destroyed.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={async () => {
                          if (userProfile?.email) {
                            await deleteUserAccountAndData(userProfile.email);
                          }
                          handleClearAllData();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Yes, Permanently Delete Everything
                      </button>
                      <button
                        onClick={() => setResetConfirmOpen(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Copyright statement */}
        <div className="p-3.5 sm:p-4 bg-neutral-950/80 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-neutral-400 shrink-0">
          <div className="text-center sm:text-left">
            <span>© 2026 Panj Surah. All Rights Reserved.</span>
            <span className="hidden sm:inline mx-1.5">•</span>
            <span className="text-neutral-500">Contact: hammadmn99@gmail.com</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
