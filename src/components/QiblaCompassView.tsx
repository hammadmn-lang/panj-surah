import React, { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, MapPin, Sparkles, Check, RotateCw, AlertCircle, Sun, Smartphone } from 'lucide-react';
import { UserLocation } from '../types';
import { calculateQibla } from '../utils/prayerCalculator';

interface QiblaCompassViewProps {
  location: UserLocation;
  onOpenLocationModal: () => void;
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({ location, onOpenLocationModal }) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(false);
  const [sensorPermission, setSensorPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const compassRef = useRef<HTMLDivElement | null>(null);

  const { qiblaBearing, distanceKm, distanceMiles, compassDirection } = calculateQibla(
    location.latitude,
    location.longitude
  );

  // Listen to deviceorientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // Webkit iOS heading (True North)
      if ('webkitCompassHeading' in e && typeof (e as any).webkitCompassHeading === 'number') {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android heading
        heading = 360 - e.alpha;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(heading);
        setHasSensor(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  // Request iOS 13+ sensor permissions if needed
  const requestSensorPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setSensorPermission('granted');
        } else {
          setSensorPermission('denied');
        }
      } catch (err) {
        console.error('Sensor permission error', err);
      }
    }
  };

  // Active compass heading
  const currentHeading = isManualMode || !hasSensor ? manualHeading : deviceHeading;

  // Angle between current device facing direction and Qibla bearing
  const diffAngle = (qiblaBearing - currentHeading + 360) % 360;
  const isAligned = diffAngle <= 4 || diffAngle >= 356;

  // Handle manual dragging rotation on desktop / fallback
  const handlePointerDown = () => {
    setIsDragging(true);
    setIsManualMode(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !compassRef.current) return;
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let deg = (rad * 180) / Math.PI + 90;
    deg = (deg + 360) % 360;
    setManualHeading(Math.round(deg));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12 max-w-2xl mx-auto px-2 sm:px-0 animate-fade-in text-center">
      {/* Title & Coordinates Card */}
      <div className="bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-800">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="text-left">
            <h2 className="text-xl font-medium font-serif text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Qibla Direction & Compass
            </h2>
            <p className="text-xs text-neutral-400">
              Direct Great Circle bearing to the Holy Kaaba in Makkah al-Mukarramah
            </p>
          </div>

          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{location.city}</span>
          </button>
        </div>

        {/* Primary Alignment Status Badge */}
        <div
          className={`mt-4 p-4 rounded-2xl border transition-all flex items-center justify-between ${
            isAligned
              ? 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60 shadow-lg shadow-emerald-950/50'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-200'
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                isAligned ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-emerald-400'
              }`}
            >
              {isAligned ? <Check className="w-6 h-6" /> : <Navigation className="w-5 h-5 animate-pulse" />}
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base text-white">
                {isAligned ? '✨ Perfect! Facing Holy Kaaba' : `Rotate ${Math.round(diffAngle)}° to face Qibla`}
              </div>
              <div className="text-xs text-neutral-400">
                Target Bearing: <span className="font-bold font-mono text-emerald-400">{qiblaBearing}°</span> ({compassDirection}) from True North
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-neutral-400">Distance</div>
            <div className="font-bold font-mono text-emerald-400 text-sm sm:text-base">{distanceKm.toLocaleString()} km</div>
          </div>
        </div>
      </div>

      {/* Interactive Compass Dial */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Alignment Glow backdrop */}
        {isAligned && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse rounded-3xl" />
        )}

        {/* Compass Outer Housing */}
        <div
          ref={compassRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-neutral-800 bg-neutral-950 shadow-2xl flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Compass Dial Face (Rotates relative to device heading) */}
          <div
            className="absolute inset-2 rounded-full border border-neutral-800/80 transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* Cardinal Points */}
            <span className="absolute top-2 font-bold text-rose-500 text-sm font-mono">N</span>
            <span className="absolute right-3 font-bold text-neutral-500 text-xs font-mono">E</span>
            <span className="absolute bottom-2 font-bold text-neutral-500 text-xs font-mono">S</span>
            <span className="absolute left-3 font-bold text-neutral-500 text-xs font-mono">W</span>

            {/* Degree Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full flex justify-center pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div
                  className={`w-0.5 rounded-full ${
                    deg % 90 === 0
                      ? 'h-3 bg-neutral-400'
                      : 'h-1.5 bg-neutral-700'
                  }`}
                />
              </div>
            ))}

            {/* Kaaba Direction Marker on the dial */}
            <div
              className="absolute w-full h-full flex justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="flex flex-col items-center -mt-3.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/40 text-xs animate-bounce border-2 border-neutral-900">
                  🕋
                </div>
                <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 to-transparent rounded-full" />
              </div>
            </div>
          </div>

          {/* Center Device Reference Needle (Static forward pointer) */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-neutral-900 shadow-md border-2 border-emerald-500 flex flex-col items-center justify-center pointer-events-none">
            <Navigation
              className={`w-8 h-8 transition-colors ${
                isAligned ? 'text-emerald-400' : 'text-neutral-300'
              }`}
            />
            <span className="text-[10px] font-mono font-bold mt-0.5 text-neutral-400">
              {Math.round(currentHeading)}°
            </span>
          </div>

          {/* Heading Top Pointer */}
          <div className="absolute top-0 w-3 h-3 bg-emerald-500 rotate-45 -translate-y-1.5 rounded-xs" />
        </div>

        {/* Drag Hint or Sensor Status */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>
              {hasSensor && !isManualMode
                ? 'Live Gyroscope Active (Hold device flat)'
                : 'Interactive Compass Mode (Drag dial to calibrate manually)'}
            </span>
          </div>

          {/* Reset manual mode */}
          {isManualMode && hasSensor && (
            <button
              onClick={() => setIsManualMode(false)}
              className="text-xs text-emerald-400 font-semibold underline hover:text-emerald-300 cursor-pointer"
            >
              Switch back to auto device sensor
            </button>
          )}

          {/* iOS permission button */}
          {!hasSensor && typeof (DeviceOrientationEvent as any)?.requestPermission === 'function' && (
            <button
              onClick={requestSensorPermission}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-lg"
            >
              Enable Motion / Gyroscope Sensor
            </button>
          )}
        </div>
      </div>

      {/* Calibration Tips Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            How to Calibrate Compass:
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Hold your smartphone level with the ground and move it in a slow <strong>Figure-8 (∞)</strong> motion to clear any magnetic interference from electronics.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs space-y-1.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            Coordinates & Bearing:
          </div>
          <p className="text-neutral-400 leading-relaxed font-mono">
            Lat: {location.latitude.toFixed(4)}°, Lng: {location.longitude.toFixed(4)}° • Kaaba Azimuth: {qiblaBearing}° ({compassDirection})
          </p>
        </div>
      </div>
    </div>
  );
};
