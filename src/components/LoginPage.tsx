import React, { useState } from "react";
import {
  User,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Check,
  Volume2,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Users,
} from "lucide-react";
import { SeniorProfile, Language } from "../types";
import { presetSeniorProfiles } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";

interface LoginPageProps {
  onLogin: (profile: SeniorProfile) => void;
  currentProfile?: SeniorProfile;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  currentProfile,
}) => {
  const [loginMode, setLoginMode] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState<SeniorProfile>(
    currentProfile || presetSeniorProfiles[0]
  );

  // Custom form state
  const [customName, setCustomName] = useState<string>("");
  const [customHonorific, setCustomHonorific] = useState<string>("");
  const [customLanguage, setCustomLanguage] = useState<Language>("English");
  const [customAge, setCustomAge] = useState<number>(70);
  const [customPin, setCustomPin] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [emergencyPhone, setEmergencyPhone] = useState<string>("+1 (555) 987-6543");
  const [emergencyName, setEmergencyName] = useState<string>("Family Contact");
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  // Auto-suggest honorific when user types name
  const handleNameChange = (val: string) => {
    setCustomName(val);
    if (!customHonorific || customHonorific === `${customName.trim()}ji` || customHonorific === customName.trim()) {
      const firstName = val.trim().split(" ")[0];
      if (firstName) {
        setCustomHonorific(`${firstName}ji`);
      } else {
        setCustomHonorific("");
      }
    }
    setErrorMsg("");
  };

  const handleSelectHonorificSuggestion = (suggestion: string) => {
    setCustomHonorific(suggestion);
  };

  const handleTestVoice = (textToSpeak: string, lang: Language) => {
    speechHelper.speak(textToSpeak, { rate: 0.88, language: lang });
  };

  const handlePresetLogin = () => {
    speechHelper.speak(
      `Welcome back, ${selectedPreset.preferredHonorific || selectedPreset.name}. Mitraa is ready to assist you today.`,
      { rate: selectedPreset.voiceSpeed, language: selectedPreset.language }
    );
    onLogin(selectedPreset);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = customName.trim();
    if (!trimmedName) {
      setErrorMsg("Please enter your name so Mitraa knows how to address you.");
      return;
    }

    const finalHonorific = customHonorific.trim() || trimmedName;

    const newProfile: SeniorProfile = {
      name: trimmedName,
      preferredHonorific: finalHonorific,
      age: customAge || 70,
      bloodGroup: "O+",
      allergies: ["None known"],
      medicalConditions: ["General senior wellness"],
      primaryDoctor: "Family Physician",
      doctorPhone: "+1 (555) 000-1122",
      address: "Home Residence",
      emergencyContact: {
        name: emergencyName.trim() || "Primary Family Contact",
        relation: "Family",
        phone: emergencyPhone.trim() || "+1 (555) 987-6543",
      },
      language: customLanguage,
      textSize: "large",
      highContrast: false,
      voiceSpeed: 0.88,
      soundAlerts: true,
    };

    speechHelper.speak(
      `Namaste, ${finalHonorific}! Welcome to Mitraa. I am your caring companion.`,
      { rate: newProfile.voiceSpeed, language: newProfile.language }
    );

    onLogin(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg text-4xl font-bold mb-3 border-2 border-emerald-400/40 animate-companion-pulse">
            मि
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-emerald-950 tracking-tight">
            Mitraa
            <span className="font-sans text-2xl font-normal text-emerald-800 ml-2.5">(मित्रा)</span>
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-emerald-900/80 mt-1">
            "A caring companion for every grandparent & elder"
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-950 text-xs font-bold border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Gentle • Accessible • Private • Dignified Care</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#dce7de] overflow-hidden">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-2 bg-[#f0f5f1] border-b border-[#dce7de]">
            <button
              type="button"
              id="login-tab-preset"
              onClick={() => {
                setLoginMode("preset");
                setErrorMsg("");
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                loginMode === "preset"
                  ? "bg-white text-emerald-950 shadow-sm border border-[#cbe0cf]"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Users className="w-5 h-5 text-emerald-800" />
              <span>Saved Profiles</span>
            </button>
            <button
              type="button"
              id="login-tab-custom"
              onClick={() => {
                setLoginMode("custom");
                setErrorMsg("");
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                loginMode === "custom"
                  ? "bg-white text-emerald-950 shadow-sm border border-[#cbe0cf]"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <UserPlus className="w-5 h-5 text-emerald-800" />
              <span>Enter New Name</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Mode 1: Preset Profiles */}
            {loginMode === "preset" && (
              <div>
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    Welcome to Your Sanctuary
                  </h2>
                  <p className="text-sm text-stone-600 mt-1 font-medium">
                    Tap your profile card below to sign in with your personalized voice & care routine:
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {presetSeniorProfiles.map((p) => {
                    const isSelected = selectedPreset.name === p.name;
                    return (
                      <div
                        key={p.name}
                        onClick={() => setSelectedPreset(p)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/90 shadow-sm"
                            : "border-stone-200 hover:border-emerald-300 hover:bg-[#fcfffc]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-2xs ${
                              isSelected
                                ? "bg-emerald-800 text-white"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {p.preferredHonorific.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-base sm:text-lg text-stone-900">
                                {p.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200/80 text-emerald-950">
                                {p.preferredHonorific}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-500 font-medium">
                              Age {p.age} • Language: {p.language} • {p.medicalConditions[0]}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestVoice(
                                `Namaste ${p.preferredHonorific}! I am Mitraa, ready for you.`,
                                p.language
                              );
                            }}
                            title="Hear Mitraa's greeting"
                            className="p-2 rounded-xl text-emerald-800 hover:bg-emerald-200/60 transition cursor-pointer"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-stone-300"
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  id="login-preset-submit-btn"
                  onClick={handlePresetLogin}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-black text-lg shadow-md transition active:scale-98 flex items-center justify-center gap-3 cursor-pointer min-h-[54px]"
                >
                  <span>Enter Sanctuary as {selectedPreset.preferredHonorific}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mode 2: Custom Name / New Senior Sign-In */}
            {loginMode === "custom" && (
              <form onSubmit={handleCustomLogin}>
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold text-stone-900">
                    Create Your Senior Profile
                  </h2>
                  <p className="text-sm text-stone-600 mt-1 font-medium">
                    Enter the senior's name below. Mitraa will personalize all greetings, reminders, and voice interactions for them.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2">
                    <span>⚠️ {errorMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="custom-name-input"
                      className="block text-sm font-black text-stone-900 mb-1"
                    >
                      Senior's Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="custom-name-input"
                        type="text"
                        value={customName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Vandita Sharma, Robert Miller, Asha Devi"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900 font-semibold text-base placeholder-stone-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Calling Name / Honorific */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="custom-honorific-input"
                        className="block text-sm font-black text-stone-900"
                      >
                        How should Mitraa address you? (Calling Name)
                      </label>
                      <span className="text-xs text-stone-500 font-medium">e.g. Ashaji, Grandma, Mr. Rao</span>
                    </div>
                    <input
                      id="custom-honorific-input"
                      type="text"
                      value={customHonorific}
                      onChange={(e) => setCustomHonorific(e.target.value)}
                      placeholder="e.g. Ashaji, Dadaji, Grandpa Bob, Vandita"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900 font-semibold text-base"
                    />

                    {/* Suggestions */}
                    {customName.trim() && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-stone-500 font-bold">Quick pick:</span>
                        {[
                          `${customName.trim().split(" ")[0]}ji`,
                          `Grandpa ${customName.trim().split(" ")[0]}`,
                          `Grandma ${customName.trim().split(" ")[0]}`,
                          `Dada ji`,
                          `Dadi ji`,
                          customName.trim().split(" ")[0],
                        ].map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => handleSelectHonorificSuggestion(sug)}
                            className={`text-xs px-2.5 py-1 rounded-full border font-bold transition cursor-pointer ${
                              customHonorific === sug
                                ? "bg-emerald-700 text-white border-emerald-700"
                                : "bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200"
                            }`}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Language and Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="custom-language-select"
                        className="block text-sm font-black text-stone-900 mb-1"
                      >
                        Preferred Language
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <select
                          id="custom-language-select"
                          value={customLanguage}
                          onChange={(e) => setCustomLanguage(e.target.value as Language)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900 font-semibold text-sm bg-white"
                        >
                          {languages.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="custom-age-input"
                        className="block text-sm font-black text-stone-900 mb-1"
                      >
                        Age (Years)
                      </label>
                      <input
                        id="custom-age-input"
                        type="number"
                        min={50}
                        max={110}
                        value={customAge}
                        onChange={(e) => setCustomAge(parseInt(e.target.value) || 70)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900 font-semibold text-sm"
                      />
                    </div>
                  </div>

                  {/* Optional PIN / Security */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="custom-pin-input"
                        className="block text-sm font-black text-stone-900"
                      >
                        Security PIN <span className="text-xs font-normal text-stone-500">(Optional 4 digits)</span>
                      </label>
                      <span className="text-xs text-stone-500 font-medium">Leave blank for quick instant access</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="custom-pin-input"
                        type={showPin ? "text" : "password"}
                        maxLength={6}
                        value={customPin}
                        onChange={(e) => setCustomPin(e.target.value)}
                        placeholder="e.g. 1234"
                        className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900 font-semibold text-sm tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-600" />
                      Emergency SOS Notification Contact
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Contact Name (e.g. Daughter Priya)"
                        className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white"
                      />
                      <input
                        type="text"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="Phone (e.g. +1 555-987-6543)"
                        className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    id="login-custom-submit-btn"
                    className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-black text-base sm:text-lg shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-h-[52px]"
                  >
                    <span>Enter Mitraa Sanctuary</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const name = customName.trim() || "Friend";
                      handleTestVoice(
                        `Namaste ${customHonorific || name}! Mitraa is listening and here for you.`,
                        customLanguage
                      );
                    }}
                    className="w-full sm:w-auto py-3.5 px-4 rounded-2xl border-2 border-[#d2e0d5] hover:bg-stone-100 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[52px]"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>Test Voice</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer reassurance */}
          <div className="px-6 py-4 bg-[#f4f8f5] border-t border-[#dce7de] text-center text-xs text-stone-600 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              All information is kept securely on your device and used solely to assist you with care and dignity.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
