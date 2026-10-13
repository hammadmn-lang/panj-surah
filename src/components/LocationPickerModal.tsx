import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, X, Globe, Settings, Sliders, Moon } from 'lucide-react';
import { CalculationMethodKey, CalculationSettings, JuristicMethod, UserLocation } from '../types';
import { CALCULATION_METHODS } from '../utils/prayerCalculator';
import { getRegionalDefaultHijriOffset, getRegionalSightingInfo } from '../utils/hijriCalendar';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: UserLocation;
  onSaveLocation: (loc: UserLocation) => void;
  settings: CalculationSettings;
  onSaveSettings: (settings: CalculationSettings) => void;
}

const POPULAR_CITIES: Array<{
  city: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  hijriOffset: number;
  defaultMethod: CalculationMethodKey;
  defaultJuristic?: JuristicMethod;
}> = [
  { city: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Rawalpindi', country: 'Pakistan', lat: 33.5651, lng: 73.0169, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Faisalabad', country: 'Pakistan', lat: 31.4504, lng: 73.135, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Multan', country: 'Pakistan', lat: 30.1575, lng: 71.5249, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Peshawar', country: 'Pakistan', lat: 34.0151, lng: 71.5249, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Quetta', country: 'Pakistan', lat: 30.1798, lng: 66.975, timezone: 'Asia/Karachi', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Delhi', country: 'India', lat: 28.6139, lng: 77.209, timezone: 'Asia/Kolkata', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka', hijriOffset: -1, defaultMethod: 'Karachi', defaultJuristic: 'hanafi' },
  { city: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, timezone: 'Asia/Riyadh', hijriOffset: 0, defaultMethod: 'Makkah' },
  { city: 'Madinah', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh', hijriOffset: 0, defaultMethod: 'Makkah' },
  { city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, timezone: 'Asia/Riyadh', hijriOffset: 0, defaultMethod: 'Makkah' },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', hijriOffset: 0, defaultMethod: 'Gulf' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lng: 54.3773, timezone: 'Asia/Dubai', hijriOffset: 0, defaultMethod: 'Gulf' },
  { city: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, timezone: 'Asia/Qatar', hijriOffset: 0, defaultMethod: 'Gulf' },
  { city: 'Muscat', country: 'Oman', lat: 23.588, lng: 58.3829, timezone: 'Asia/Muscat', hijriOffset: -1, defaultMethod: 'Gulf' },
  { city: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, timezone: 'Africa/Casablanca', hijriOffset: -1, defaultMethod: 'MWL' },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', hijriOffset: 0, defaultMethod: 'Egypt' },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', hijriOffset: 0, defaultMethod: 'Turkey' },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', hijriOffset: 0, defaultMethod: 'MWL' },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, timezone: 'America/New_York', hijriOffset: 0, defaultMethod: 'ISNA' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', hijriOffset: 0, defaultMethod: 'ISNA' },
  { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', hijriOffset: 0, defaultMethod: 'MWL' },
  { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', hijriOffset: 0, defaultMethod: 'Egypt' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 'Australia/Sydney', hijriOffset: -1, defaultMethod: 'MWL' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', hijriOffset: 0, defaultMethod: 'Singapore' },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', hijriOffset: 0, defaultMethod: 'MWL' },
  { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, timezone: 'Europe/Berlin', hijriOffset: 0, defaultMethod: 'MWL' },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  location,
  onSaveLocation,
  settings,
  onSaveSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [activeTab, setActiveTab] = useState<'city' | 'settings'>('city');
  const [tempSettings, setTempSettings] = useState<CalculationSettings>(settings);

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const derivedCountry = timeZone.replace(/_/g, ' ') || 'Local Device';
        const sighting = getRegionalSightingInfo(derivedCountry, '', timeZone);

        // Find closest known city within ~60km (e.g., Lahore or Karachi)
        let resolvedCity = 'Device GPS Location';
        let resolvedCountry = derivedCountry;
        let resolvedOffset = sighting.offset;

        for (const pc of POPULAR_CITIES) {
          const dLat = Math.abs(pc.lat - lat);
          const dLng = Math.abs(pc.lng - lng);
          if (dLat < 0.6 && dLng < 0.6) {
            resolvedCity = pc.city;
            resolvedCountry = pc.country;
            resolvedOffset = pc.hijriOffset;
            break;
          }
        }

        const newLoc: UserLocation = {
          city: resolvedCity,
          country: resolvedCountry,
          latitude: lat,
          longitude: lng,
          isAuto: true,
          timezone: timeZone,
          hijriOffset: resolvedOffset,
        };
        onSaveLocation(newLoc);
        onClose();
      },
      (err) => {
        setIsLocating(false);
        alert('Could not detect device GPS: ' + err.message + '. Please select your city or ensure location permissions are granted. Your saved location will work 100% offline.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (c: (typeof POPULAR_CITIES)[0]) => {
    const sighting = getRegionalSightingInfo(c.country, c.city, c.timezone);
    onSaveLocation({
      city: c.city,
      country: c.country,
      latitude: c.lat,
      longitude: c.lng,
      timezone: c.timezone,
      hijriOffset: c.hijriOffset ?? sighting.offset,
      isAuto: false,
    });
    // Auto adjust recommended calculation method & juristic rule for region
    const updated = {
      ...tempSettings,
      method: c.defaultMethod,
      juristic: c.defaultJuristic || tempSettings.juristic,
    };
    setTempSettings(updated);
    onSaveSettings(updated);
    onClose();
  };

  const handleSaveSettings = () => {
    onSaveSettings(tempSettings);
    onClose();
  };

  return (
    <div id="location-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div id="location-modal-container" className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium font-serif text-white text-lg">Location & Prayer Settings</h3>
              <p className="text-xs text-neutral-400">Accurate prayer times & Qibla for your region</p>
            </div>
          </div>
          <button
            id="close-location-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 px-5 pt-3 gap-4 bg-neutral-950/30">
          <button
            id="modal-tab-city"
            onClick={() => setActiveTab('city')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'city'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Choose Location
          </button>
          <button
            id="modal-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Calculation Rules
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'city' ? (
            <>
              {/* GPS Auto Button */}
              <button
                id="use-gps-btn"
                onClick={handleUseGPS}
                disabled={isLocating}
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Detecting GPS Coordinates...' : 'Use Current Device GPS Location'}
              </button>

              {/* Quick 1-Click City Selectors */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Quick Select:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.slice(0, 6).map((c) => {
                    const isSelected = location.city.toLowerCase() === c.city.toLowerCase();
                    return (
                      <button
                        key={c.city}
                        type="button"
                        onClick={() => handleSelectCity(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400 font-bold'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{c.city}</span>
                        {isSelected && <span className="text-[10px] bg-emerald-700 px-1 py-0.2 rounded">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="city-search-input"
                  type="text"
                  placeholder="Search city or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Current Selection */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-neutral-400 block font-medium">Selected Location:</span>
                    <span className="font-bold text-white text-sm">
                      {location.city}, {location.country}
                    </span>
                  </div>
                  <div className="text-right text-neutral-400 font-mono text-[11px]">
                    {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800/60 text-[11px] text-emerald-400">
                  <Moon className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Moon Sighting: {getRegionalSightingInfo(location.country, location.city, location.timezone).authority}</span>
                </div>
              </div>

              {/* Popular Cities Grid */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Major Islamic Cities</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {filteredCities.map((c) => {
                    const isSelected = location.city === c.city && location.country === c.country;
                    return (
                      <button
                        key={`${c.city}-${c.country}`}
                        onClick={() => handleSelectCity(c)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200 font-semibold'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-1.5">
                            <span>{c.city}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal">
                              {c.hijriOffset === -1 ? 'Ruet (-1d)' : 'Umm al-Qura'}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400">{c.country}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Calculation Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Calculation Method
                </label>
                <select
                  id="calc-method-select"
                  value={tempSettings.method}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, method: e.target.value as CalculationMethodKey })
                  }
                  className="w-full p-3 rounded-xl bg-neutral-800 text-neutral-100 border border-neutral-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.entries(CALCULATION_METHODS).map(([key, item]) => (
                    <option key={key} value={key} className="bg-neutral-900 text-white">
                      {item.name} ({key})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  {CALCULATION_METHODS[tempSettings.method]?.desc}
                </p>
              </div>

              {/* Juristic / Asr Madhab */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Asr Juristic Method (Madhab)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, juristic: 'standard' })}
                    className={`p-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer ${
                      tempSettings.juristic === 'standard'
                        ? 'border-emerald-700/60 bg-emerald-950/60 text-emerald-200 font-bold'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-white">Standard / Shafi'i</div>
                    <div className="text-xs opacity-75 font-normal text-neutral-400">Shadow length = 1x (Majority)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, juristic: 'hanafi' })}
                    className={`p-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer ${
                      tempSettings.juristic === 'hanafi'
                        ? 'border-emerald-700/60 bg-emerald-950/60 text-emerald-200 font-bold'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-white">Hanafi</div>
                    <div className="text-xs opacity-75 font-normal text-neutral-400">Shadow length = 2x</div>
                  </button>
                </div>
              </div>

              {/* Save Settings */}
              <div className="pt-3">
                <button
                  id="save-settings-btn"
                  onClick={handleSaveSettings}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow cursor-pointer"
                >
                  Apply & Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
