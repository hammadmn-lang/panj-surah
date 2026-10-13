import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenMobileGuide?: () => void;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenMobileGuide, className }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
      }
    } else if (onOpenMobileGuide) {
      onOpenMobileGuide();
    }
  };

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span>Installed on Device</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={isIOS ? () => setShowIOSGuide(true) : handleInstallClick}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-900/30 transition-all cursor-pointer ${className || ''}`}
        title="Install Panj Surah app directly to mobile phone or desktop"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install App</span>
        {isInstallable && (
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
        )}
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Apple iOS Safari lets you install directly without the App Store:
            </p>

            <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80 text-xs text-neutral-200">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    Tap the Share button <Share2 className="w-3.5 h-3.5 text-cyan-400 inline" />
                  </p>
                  <p className="text-[11px] text-neutral-400">Located at the bottom of Safari on iPhone or top on iPad.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    Select &apos;Add to Home Screen&apos; <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </p>
                  <p className="text-[11px] text-neutral-400">Scroll down the sharing menu to find the plus icon.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <div>
                  <p className="font-semibold text-white">Tap &apos;Add&apos; in Top-Right</p>
                  <p className="text-[11px] text-neutral-400">The app icon will immediately appear on your mobile home screen.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
