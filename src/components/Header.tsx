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

  const languages: { id: Language; label: string }[] = [
    { id: "English", label: "English" },
    { id: "Hindi", label: "हिंदी (Hindi)" },
    { id: "Spanish", label: "Español (Spanish)" },
    { id: "Tamil", label: "தமிழ் (Tamil)" },
    { id: "Bengali", label: "বাংলা (Bengali)" },
    { id: "Telugu", label: "తెలుగు (Telugu)" },
    { id: "Marathi", label: "मराठी (Marathi)" },
    { id: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  ];

  const cycleTextSize = () => {
    const order: TextSize[] = ["normal", "large", "extra-large"];
    const nextIndex = (order.indexOf(profile.textSize) + 1) % order.length;
    onUpdateProfile({ textSize: order[nextIndex] });
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Morning";
    if (hour < 17) return "☀️ Afternoon";
    return "🌙 Evening";
  };

  return (
    <header
      id="sathi-main-header"
      className={`border-b sticky top-0 z-40 transition-all ${
        profile.highContrast
          ? "bg-black text-amber-300 border-amber-500 shadow-xl"
          : "bg-[#fbfdfb]/95 backdrop-blur-md text-stone-900 border-[#dce7de] shadow-xs"
      }`}
    >
      {/* Top utility & accessibility strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Artisanal Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-md font-bold text-2xl tracking-wide border-2 border-emerald-400/40 shrink-0">
            मि
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-emerald-950 flex items-center gap-2">
                Mitraa
                <span className="text-sm font-sans font-medium px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-900 border border-emerald-200">
                  मित्रा
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Senior Care Sanctuary
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium flex items-center gap-1.5 mt-0.5">
              <span>Personal Companion for</span>
              <span className="font-bold text-emerald-950 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                {profile.preferredHonorific || profile.name}
              </span>
            </p>
          </div>
        </div>

        {/* Dynamic Time & Ambient Mood Widget */}
        <div className="hidden lg:flex items-center gap-2.5 bg-emerald-50/80 px-4 py-1.5 rounded-2xl border border-emerald-200/80 text-stone-700">
          <Clock className="w-4 h-4 text-emerald-800" />
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
            {getGreetingIcon()}
          </span>
          <span className="text-stone-300">•</span>
          <span className="font-semibold text-sm text-stone-900">{currentTime}</span>
          <span className="text-stone-300">•</span>
          <span className="text-xs font-medium text-stone-600">{currentDate}</span>
        </div>

        {/* Accessibility & Voice Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Text Size Stepper */}
          <button
            id="accessibility-text-size-btn"
            onClick={cycleTextSize}
            title="Cycle text size: Normal, Large, Extra-Large"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 font-bold text-xs sm:text-sm text-stone-800 transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px]"
          >
            <Type className="w-4 h-4 text-emerald-700" />
            <span className="hidden xs:inline text-stone-600 font-medium">Size:</span>
            <span className="uppercase text-xs font-extrabold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200">
              {profile.textSize === "extra-large" ? "XL" : profile.textSize === "large" ? "Large" : "Medium"}
            </span>
          </button>

          {/* High Contrast Toggle */}
          <button
            id="accessibility-contrast-btn"
            onClick={() => onUpdateProfile({ highContrast: !profile.highContrast })}
            title="Toggle high contrast vision mode"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition active:scale-95 shadow-2xs cursor-pointer min-h-[44px] ${
              profile.highContrast
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-white text-stone-800 border-stone-200 hover:bg-stone-100 hover:border-emerald-400"
            }`}
          >
            {profile.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              Choose Language
            </label>
            <div className="flex items-center bg-white border border-stone-200 hover:border-emerald-500 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <Globe className="w-4 h-4 text-emerald-700 mr-1.5 shrink-0" />
              <select
                id="language-select"
                value={profile.language}
                onChange={(e) => onUpdateProfile({ language: e.target.value as Language })}
                className="bg-transparent text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer py-1 pr-1"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                {profile.preferredHonorific ? profile.preferredHonorific.charAt(0) : "U"}
              </div>
              <span className="hidden sm:inline font-black text-xs text-emerald-950 truncate max-w-[120px]">
                {profile.preferredHonorific}
              </span>
              <LogOut className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            </button>
          )}

          {/* Big Emergency SOS Button */}
          <button
            id="header-sos-button"
            onClick={onTriggerEmergency}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm transition active:scale-95 shadow-md animate-pulse cursor-pointer min-h-[44px]"
            title="Press for Emergency SOS Assistance"
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
