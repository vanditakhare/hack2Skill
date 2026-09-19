import React, { useState, useEffect } from "react";
import {
  Heart,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  AlertTriangle,
  Type,
  Globe,
  Clock,
  Sparkles,
  PhoneCall,
  User,
  LogOut,
} from "lucide-react";
import { SeniorProfile, Language, TextSize } from "../types";

interface HeaderProps {
  profile: SeniorProfile;
  onUpdateProfile: (updated: Partial<SeniorProfile>) => void;
  onTriggerEmergency: () => void;
  onSelectVoiceCompanion: () => void;
  onSwitchUser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onTriggerEmergency,
  onSelectVoiceCompanion,
  onSwitchUser,
}) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages: Language[] = [
    "English",
    "Hindi",
    "Spanish",
    "Tamil",
    "Bengali",
    "Telugu",
    "Marathi",
    "Gujarati",
  ];

  const cycleTextSize = () => {
    const order: TextSize[] = ["normal", "large", "extra-large"];
    const nextIndex = (order.indexOf(profile.textSize) + 1) % order.length;
    onUpdateProfile({ textSize: order[nextIndex] });
  };

  return (
    <header
      id="sathi-main-header"
      className={`border-b sticky top-0 z-40 transition-colors ${
        profile.highContrast
          ? "bg-black text-amber-300 border-amber-500 shadow-lg"
          : "bg-amber-50/95 backdrop-blur-md text-stone-900 border-amber-200/80 shadow-xs"
      }`}
    >
      {/* Top utility & accessibility strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Welcome */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md font-bold text-2xl tracking-wide">
            मि
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-2xl tracking-tight text-amber-900 flex items-center gap-1.5">
                Mitraa <span className="text-base font-medium text-amber-700 hidden sm:inline">(मित्रा)</span>
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Senior Care AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Daily Companion for <span className="font-bold text-stone-900">{profile.preferredHonorific}</span>
            </p>
          </div>
        </div>

        {/* Date & Time Widget */}
        <div className="hidden md:flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-xl border border-amber-200/70 shadow-2xs text-stone-700">
          <Clock className="w-4 h-4 text-amber-700" />
          <span className="font-semibold text-sm">{currentTime}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs font-medium text-stone-600">{currentDate}</span>
        </div>

        {/* Accessibility & Voice Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Text Size Switcher */}
          <button
            id="accessibility-text-size-btn"
            onClick={cycleTextSize}
            title="Increase or decrease text size"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 font-bold text-sm text-stone-800 transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px]"
          >
            <Type className="w-4 h-4 text-amber-700" />
            <span className="hidden xs:inline">Text:</span>
            <span className="uppercase text-xs bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
              {profile.textSize === "extra-large" ? "XL" : profile.textSize === "large" ? "L" : "M"}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            id="accessibility-contrast-btn"
            onClick={() => onUpdateProfile({ highContrast: !profile.highContrast })}
            title="Toggle high contrast mode"
            className={`flex items-center gap-1 px-3 py-2 rounded-xl border font-bold text-sm transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px] ${
              profile.highContrast
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-white text-stone-800 border-stone-300 hover:bg-stone-100"
            }`}
          >
            {profile.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-stone-600" />}
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              Choose Language
            </label>
            <div className="flex items-center bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <Globe className="w-4 h-4 text-amber-700 mr-1.5" />
              <select
                id="language-select"
                value={profile.language}
                onChange={(e) => onUpdateProfile({ language: e.target.value as Language })}
                className="bg-transparent text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer py-1"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Profile & Switch Button */}
          {onSwitchUser && (
            <button
              id="header-switch-user-btn"
              onClick={onSwitchUser}
              title={`Signed in as ${profile.name} (${profile.preferredHonorific}). Tap to switch user or sign out.`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
            >
              <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                {profile.preferredHonorific ? profile.preferredHonorific.charAt(0) : "U"}
              </div>
              <span className="hidden md:inline font-black text-xs text-amber-950 truncate max-w-[120px]">
                {profile.preferredHonorific}
              </span>
              <LogOut className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            </button>
          )}

          {/* Big Emergency SOS Button */}
          <button
            id="header-sos-button"
            onClick={onTriggerEmergency}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base transition active:scale-95 shadow-md animate-pulse cursor-pointer min-h-[44px]"
            title="Press for Emergency SOS Assistance"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span>SOS HELP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
