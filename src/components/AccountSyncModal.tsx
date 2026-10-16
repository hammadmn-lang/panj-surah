import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Cloud,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  X,
  AlertCircle,
  Clock,
  UserPlus,
  LogIn,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginUserAccount,
  registerUserAccount,
  resetUserPassword,
  syncUserDataToCloud,
  exportProfileBackupJSON,
} from '../utils/cloudSync';

interface AccountSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSuccessLogon?: () => void;
}

export const AccountSyncModal: React.FC<AccountSyncModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onSuccessLogon,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailInput, setEmailInput] = useState(userProfile.email || 'hammadmn99@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput || !emailInput.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!passwordInput || passwordInput.trim().length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if ((authMode === 'register' || authMode === 'forgot') && passwordInput !== confirmPasswordInput) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const handleSuccessAndRedirect = (msg: string) => {
      setStatusMessage({ type: 'success', text: msg });
      setTimeout(() => {
        if (onSuccessLogon) {
          onSuccessLogon();
        } else {
          onClose();
        }
      }, 500);
    };

    if (authMode === 'register') {
      const result = await registerUserAccount(emailInput, passwordInput, userProfile);
      setIsLoading(false);
      if (result.success && result.syncedProfile) {
        onUpdateProfile({
          ...result.syncedProfile,
          password: passwordInput,
        });
        handleSuccessAndRedirect(result.message + ' Taking you to home page...');
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    } else if (authMode === 'forgot') {
      // Reset password mode
      const result = await resetUserPassword(emailInput, passwordInput, userProfile);
      setIsLoading(false);
      if (result.success && result.syncedProfile) {
        onUpdateProfile({
          ...result.syncedProfile,
          password: passwordInput,
        });
        handleSuccessAndRedirect(`Password reset successfully for ${emailInput}. Taking you to home page...`);
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    } else {
      // Login mode
      const result = await loginUserAccount(emailInput, passwordInput, userProfile);
      setIsLoading(false);
      if (result.success && result.syncedProfile) {
        onUpdateProfile({
          ...result.syncedProfile,
          password: passwordInput,
        });
        handleSuccessAndRedirect(result.message + ' Taking you to home page...');
      } else {
        setStatusMessage({ type: 'error', text: result.message });
      }
    }
  };

  const handleSyncNow = async () => {
    if (!userProfile.email) {
      setStatusMessage({ type: 'error', text: 'Please log in with your email and password first.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const result = await syncUserDataToCloud(userProfile);
    setIsLoading(false);

    if (result.success && result.syncedProfile) {
      onUpdateProfile(result.syncedProfile);
      setStatusMessage({ type: 'success', text: result.message });
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleLogout = () => {
    onUpdateProfile({
      email: '',
      password: '',
      isLoggedIn: false,
    });
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setStatusMessage({ type: 'info', text: 'Logged out successfully. Your local worship records remain preserved.' });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onUpdateProfile(parsed);
          setStatusMessage({
            type: 'success',
            text: 'Backup file imported successfully! All records restored.',
          });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Invalid backup file format.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-800 space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-medium font-serif text-white">
              {authMode === 'forgot' ? 'Reset Account Password' : 'User Account & Cloud Sync'}
            </h3>
            <p className="text-xs text-neutral-400">
              {authMode === 'forgot'
                ? 'Create a new secure password for your registered email address'
                : 'Register or log in with your email & password to restore prayers, fasting & tasbeeh'}
            </p>
          </div>
        </div>

        {/* Status notification if any */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-800/60 text-rose-300'
                : 'bg-teal-950/60 border-teal-800/60 text-teal-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Active Account / Login Form */}
        {userProfile.isLoggedIn && userProfile.email ? (
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-white">Logged In &amp; Synced</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium font-mono text-neutral-100">{userProfile.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Disconnect Account"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>

            {userProfile.lastSyncedAt && (
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Last Synced: {new Date(userProfile.lastSyncedAt).toLocaleString()}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleSyncNow}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Syncing...' : 'Sync & Pull Historical Data'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mode Switch: Log In vs Register (Hidden if in Forgot mode) */}
            {authMode !== 'forgot' ? (
              <div className="flex rounded-2xl bg-neutral-950/70 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setStatusMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register New Account
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setStatusMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Log In
                </button>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Reset Mode
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitAuth} className="space-y-3.5">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. hammadmn99@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-neutral-300">
                    {authMode === 'forgot' ? 'New Password' : 'Password'}
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-neutral-500">Min 6 characters</span>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setStatusMessage(null);
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={authMode === 'forgot' ? 'Enter new password' : 'Enter password'}
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register or Forgot mode) */}
              {(authMode === 'register' || authMode === 'forgot') && (
                <div className="space-y-1 animate-fade-in">
                  <label className="block text-xs font-semibold text-neutral-300">
                    {authMode === 'forgot' ? 'Confirm New Password' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Re-enter password"
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
                  </div>
                </div>
              )}

              <p className="text-[11px] text-neutral-400">
                {authMode === 'register'
                  ? 'Your credentials protect your cloud-saved prayer history, fasting logs, and tasbeeh counts.'
                  : authMode === 'forgot'
                  ? 'Enter your email and define your new password to restore access immediately.'
                  : 'Log in to instantly retrieve and restore your worship history onto this device.'}
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : authMode === 'register' ? (
                  <UserPlus className="w-4 h-4" />
                ) : authMode === 'forgot' ? (
                  <KeyRound className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoading
                  ? 'Processing...'
                  : authMode === 'register'
                  ? 'Register & Save Cloud Data'
                  : authMode === 'forgot'
                  ? 'Reset Password & Log In'
                  : 'Log In & Restore History'}
              </button>
            </form>
          </div>
        )}

        {/* Benefits Grid */}
        <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 space-y-2.5 text-xs text-neutral-300">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Secure Cloud Backup includes:
          </div>
          <ul className="space-y-1 text-neutral-400 list-disc list-inside text-[11px]">
            <li>Daily &amp; Weekly 5-Prayer tracking streaks &amp; history</li>
            <li>Lifetime Tasbeeh count, custom dhikrs &amp; daily logs</li>
            <li>Ramadan &amp; voluntary fasting calendar records</li>
            <li>Completed Surahs, favorite duas &amp; custom wazaif</li>
          </ul>
        </div>

        {/* Manual Export / Import Backup Section */}
        <div className="pt-2 border-t border-neutral-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Offline Backup File (JSON)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportProfileBackupJSON(userProfile)}
              className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export File</span>
            </button>

            <label className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
