import React, { useState } from "react";
import {
  MessageCircleHeart,
  CalendarCheck,
  FileText,
  MousePointerClick,
  ShieldAlert,
  HeartPulse,
  Users,
  AlertOctagon,
  DollarSign,
  Sparkles,
  Volume2,
  CheckCircle2,
  Clock,
  Pill,
  Sun,
  Moon,
  Home,
  ArrowLeft,
  Wind,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { SeniorProfile, ModuleTab, ScheduleItem, Medicine, BillItem, VitalLog } from "./types";
import {
  initialSeniorProfile,
  initialSchedule,
  initialMedicines,
  initialBills,
  initialTrustedContacts,
  initialVitals,
} from "./data/mockSeniorData";
import { Header } from "./components/Header";
import { VoiceCompanion } from "./components/VoiceCompanion";
import { DailyLifeAssistant } from "./components/DailyLifeAssistant";
import { DocumentSimplifier } from "./components/DocumentSimplifier";
import { DigitalTaskAssistant } from "./components/DigitalTaskAssistant";
import { ScamProtection } from "./components/ScamProtection";
import { HealthOrganizer } from "./components/HealthOrganizer";
import { FamilyConnection } from "./components/FamilyConnection";
import { FinanceAssistant } from "./components/FinanceAssistant";
import { CompanionPersonalization } from "./components/CompanionPersonalization";
import { EmergencyModal } from "./components/EmergencyModal";
import { LoginPage } from "./components/LoginPage";
import { speechHelper, playCalmChime } from "./utils/speech";
import { getTranslation } from "./utils/translations";

export default function App() {
  const [profile, setProfile] = useState<SeniorProfile>(() => {
    try {
      const saved = localStorage.getItem("mitraa_active_profile");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load saved profile", e);
    }
    return initialSeniorProfile;
  });

  const t = getTranslation(profile.language);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("mitraa_logged_in");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const [viewMode, setViewMode] = useState<"sanctuary" | "module">("sanctuary");
  const [activeTab, setActiveTab] = useState<ModuleTab>("companion");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [bills, setBills] = useState<BillItem[]>(initialBills);
  const [vitals, setVitals] = useState<VitalLog[]>(initialVitals);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathingText, setBreathingText] = useState<string>(t.breathIn);

  const handleStartBreathing = () => {
    playCalmChime();
    setBreathingActive(true);
    setBreathingText(t.breathIn);
    setTimeout(() => {
      setBreathingText(t.breathHold);
      setTimeout(() => {
        setBreathingText(t.breathOut);
        setTimeout(() => {
          setBreathingText(t.breathRest);
          setTimeout(() => {
            setBreathingActive(false);
          }, 3000);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const handleLogin = (loggedInProfile: SeniorProfile) => {
    setProfile(loggedInProfile);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("mitraa_logged_in", "true");
      localStorage.setItem("mitraa_active_profile", JSON.stringify(loggedInProfile));
    } catch (e) {
      console.error("Failed to save login state", e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem("mitraa_logged_in", "false");
    } catch (e) {
      console.error("Failed to update logout state", e);
    }
  };

  // Quick calculations for the senior overview bar
  const pendingMedicinesCount = medicines.filter((m) => !m.takenToday).length;
  const pendingTasksCount = schedule.filter((s) => !s.completed).length;
  const nextScheduledItem = schedule.find((s) => !s.completed) || schedule[0];

  const getGreetingData = () => {
    const hour = new Date().getHours();
    const honorific = profile.preferredHonorific || profile.name;
    if (hour < 12) {
      return {
        greeting: `${t.morningGreeting}, ${honorific}`,
        period: t.timeMorning,
        icon: <Sun className="w-5 h-5 text-amber-600" />,
        guidance: t.morningGuidance,
      };
    } else if (hour < 17) {
      return {
        greeting: `${t.afternoonGreeting}, ${honorific}`,
        period: t.timeAfternoon,
        icon: <Sun className="w-5 h-5 text-orange-600" />,
        guidance: t.afternoonGuidance,
      };
    } else {
      return {
        greeting: `${t.eveningGreeting}, ${honorific}`,
        period: t.timeEvening,
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        guidance: t.eveningGuidance,
      };
    }
  };

  const sanctuaryDomains = [
    {
      id: "care",
      title: t.domainCareTitle,
      tagline: t.domainCareTagline,
      accentBorder: "border-emerald-200/90 hover:border-emerald-400",
      accentBg: "bg-emerald-50/40",
      iconBg: "bg-emerald-100 text-emerald-800",
      icon: <HeartPulse className="w-6 h-6 text-emerald-700" />,
      modules: [
        {
          id: "companion" as ModuleTab,
          name: t.modVoiceCompanionTitle,
          badge: t.modVoiceCompanionBadge,
          badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
          desc: t.modVoiceCompanionDesc,
          icon: <MessageCircleHeart className="w-5 h-5 text-emerald-700" />,
          action: t.modVoiceCompanionAction,
        },
        {
          id: "health" as ModuleTab,
          name: t.modHealthTitle,
          badge:
            pendingMedicinesCount > 0
              ? `${pendingMedicinesCount} ${
                  pendingMedicinesCount === 1 ? t.dosePending : t.dosesPending
                }`
              : t.allDosesTaken,
          badgeColor:
            pendingMedicinesCount > 0
              ? "bg-amber-100 text-amber-950 border-amber-300"
              : "bg-emerald-100 text-emerald-900 border-emerald-300",
          desc: t.modHealthDesc,
          icon: <Pill className="w-5 h-5 text-emerald-700" />,
          action: t.modHealthAction,
        },
        {
          id: "daily" as ModuleTab,
          name: t.modDailyTitle,
          badge:
            pendingTasksCount > 0
              ? `${pendingTasksCount} ${
                  pendingTasksCount === 1 ? t.taskRemaining : t.tasksRemaining
                }`
              : t.allDoneToday,
          badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
          desc: t.modDailyDesc,
          icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
          action: t.modDailyAction,
        },
      ],
    },
    {
      id: "safety",
      title: t.domainSafetyTitle,
      tagline: t.domainSafetyTagline,
      accentBorder: "border-emerald-200/90 hover:border-emerald-400",
      accentBg: "bg-emerald-50/30",
      iconBg: "bg-emerald-100 text-emerald-900",
      icon: <ShieldAlert className="w-6 h-6 text-emerald-800" />,
      modules: [
        {
          id: "scam" as ModuleTab,
          name: t.modScamTitle,
          badge: t.modScamBadge,
          badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
          desc: t.modScamDesc,
          icon: <ShieldAlert className="w-5 h-5 text-rose-700" />,
          action: t.modScamAction,
        },
        {
          id: "document" as ModuleTab,
          name: t.modDocTitle,
          badge: t.modDocBadge,
          badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
          desc: t.modDocDesc,
          icon: <FileText className="w-5 h-5 text-emerald-800" />,
          action: t.modDocAction,
        },
        {
          id: "emergency" as any,
          name: t.modEmergencyTitle,
          badge: t.modEmergencyBadge,
          badgeColor: "bg-rose-600 text-white",
          desc: t.modEmergencyDesc,
          icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
          action: t.modEmergencyAction,
          isEmergency: true,
        },
      ],
    },
    {
      id: "life",
      title: t.domainLifeTitle,
      tagline: t.domainLifeTagline,
      accentBorder: "border-sky-200/90 hover:border-sky-400",
      accentBg: "bg-sky-50/40",
      iconBg: "bg-sky-100 text-sky-900",
      icon: <Users className="w-6 h-6 text-sky-800" />,
      modules: [
        {
          id: "family" as ModuleTab,
          name: t.modFamilyTitle,
          badge: t.modFamilyBadge,
          badgeColor: "bg-sky-100 text-sky-950 border-sky-300",
          desc: t.modFamilyDesc,
          icon: <Users className="w-5 h-5 text-sky-700" />,
          action: t.modFamilyAction,
        },
        {
          id: "tasks" as ModuleTab,
          name: t.modTasksTitle,
          badge: t.modTasksBadge,
          badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
          desc: t.modTasksDesc,
          icon: <MousePointerClick className="w-5 h-5 text-sky-700" />,
          action: t.modTasksAction,
        },
        {
          id: "finance" as ModuleTab,
          name: t.modFinanceTitle,
          badge: t.modFinanceBadge,
          badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
          desc: t.modFinanceDesc,
          icon: <DollarSign className="w-5 h-5 text-emerald-800" />,
          action: t.modFinanceAction,
        },
        {
          id: "personal" as ModuleTab,
          name: t.modPersonalTitle,
          badge: t.modPersonalBadge,
          badgeColor: "bg-purple-100 text-purple-950 border-purple-300",
          desc: t.modPersonalDesc,
          icon: <Sparkles className="w-5 h-5 text-purple-700" />,
          action: t.modPersonalAction,
        },
      ],
    },
  ];

  const handleToggleScheduleItem = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddScheduleItem = (newItem: Omit<ScheduleItem, "id">) => {
    const item: ScheduleItem = {
      ...newItem,
      id: `task-${Date.now()}`,
    };
    setSchedule((prev) => [item, ...prev]);
  };

  const handleToggleMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, takenToday: !m.takenToday } : m
      )
    );
  };

  const handleToggleBillStatus = (id: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "paid" ? "due_soon" : "paid",
            }
          : b
      )
    );
  };

  const handleAddVital = (vital: Omit<VitalLog, "id">) => {
    const newVital: VitalLog = {
      ...vital,
      id: `vital-${Date.now()}`,
    };
    setVitals((prev) => [newVital, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<SeniorProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem("mitraa_active_profile", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save profile update", e);
      }
      return next;
    });
  };

  // Nav Items for all modules
  const navItems: {
    id: ModuleTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: "companion",
      label: t.modVoiceCompanionTitle,
      icon: <MessageCircleHeart className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "daily",
      label: t.modDailyTitle,
      icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: "document",
      label: t.modDocTitle,
      icon: <FileText className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "tasks",
      label: t.modTasksTitle,
      icon: <MousePointerClick className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "scam",
      label: t.modScamTitle,
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
    },
    {
      id: "health",
      label: t.modHealthTitle,
      icon: <HeartPulse className="w-5 h-5 text-emerald-600" />,
      badge:
        pendingMedicinesCount > 0
          ? `${pendingMedicinesCount} ${t.dosePending}`
          : undefined,
    },
    {
      id: "family",
      label: t.modFamilyTitle,
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "finance",
      label: t.modFinanceTitle,
      icon: <DollarSign className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "personal",
      label: t.modPersonalTitle,
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    },
  ];

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        currentProfile={profile}
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        profile.highContrast ? "high-contrast" : "bg-[#f7faf8]"
      } text-size-${profile.textSize}`}
    >
      {/* Top Header with Emergency Button & Accessibility Controls */}
      <Header
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onTriggerEmergency={() => setShowEmergencyModal(true)}
        onSelectVoiceCompanion={() => setActiveTab("companion")}
        onSwitchUser={handleLogout}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation & Mode Toggle Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-3xl border border-[#dce7de] shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="view-sanctuary-deck-btn"
              onClick={() => setViewMode("sanctuary")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition cursor-pointer min-h-[46px] ${
                viewMode === "sanctuary"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.btnSanctuaryDeck}</span>
            </button>

            {viewMode === "module" && (
              <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {t.btnActiveModule}: {navItems.find((n) => n.id === activeTab)?.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartBreathing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[42px]"
              title="Play peaceful chime and take a calming breath"
            >
              <Wind className="w-4 h-4 text-teal-700" />
              <span>{t.btnCalmBreath}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const briefingText = `${t.morningGreeting} ${
                  profile.preferredHonorific || profile.name
                }. ${
                  pendingMedicinesCount > 0
                    ? `${pendingMedicinesCount} ${
                        pendingMedicinesCount === 1 ? t.dosePending : t.dosesPending
                      }.`
                    : `${t.allDosesTaken}.`
                } ${
                  pendingTasksCount > 0
                    ? `${pendingTasksCount} ${
                        pendingTasksCount === 1 ? t.taskRemaining : t.tasksRemaining
                      }.`
                    : `${t.allDoneToday}.`
                }`;
                speechHelper.speak(briefingText, {
                  rate: profile.voiceSpeed,
                  language: profile.language,
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[42px]"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{t.btnDaySummary}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Calming Breathing Modal / Banner */}
        {breathingActive && (
          <div className="sanctuary-card-warm p-6 rounded-3xl border-2 border-teal-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl animate-companion-pulse shadow-sm">
                ॐ
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-teal-950">
                  {breathingText}
                </h3>
                <p className="text-xs sm:text-sm text-teal-800 font-medium">
                  {t.reassuranceCalm}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBreathingActive(false)}
              className="px-4 py-2 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              {t.btnBack}
            </button>
          </div>
        )}

        {/* VIEW MODE 1: SANCTUARY DECK (Unique Senior Portal Hub) */}
        {viewMode === "sanctuary" ? (
          <div className="space-y-6">
            {/* 1. Hero Companion Presence Card */}
            {(() => {
              const greetingInfo = getGreetingData();
              return (
                <div className="sanctuary-card-warm p-6 sm:p-8 rounded-3xl border border-[#d2e5d6] shadow-sm relative overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-bold">
                          {greetingInfo.icon}
                          <span>{greetingInfo.period}</span>
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {t.statusActive}
                        </span>
                      </div>
                      <h1 className="font-display text-2xl sm:text-4xl font-bold text-emerald-950 tracking-tight">
                        {greetingInfo.greeting}!
                      </h1>
                      <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
                        {greetingInfo.guidance}
                      </p>
                    </div>

                    {/* Quick Senior Action Trio */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                      <button
                        type="button"
                        id="hero-talk-to-mitraa-btn"
                        onClick={() => {
                          setActiveTab("companion");
                          setViewMode("module");
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[54px]"
                      >
                        <MessageCircleHeart className="w-5 h-5 text-emerald-200" />
                        <span>{t.modVoiceCompanionAction}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEmergencyModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm sm:text-base transition cursor-pointer min-h-[54px]"
                      >
                        <AlertOctagon className="w-5 h-5 text-rose-600" />
                        <span>{t.emergencySOS}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. Senior 3-Point Pulse Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Medicines */}
              <div
                onClick={() => {
                  setActiveTab("health");
                  setViewMode("module");
                }}
                className="sanctuary-card p-5 rounded-3xl border border-[#dce7de] hover:border-emerald-400 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {t.modHealthTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {pendingMedicinesCount > 0
                        ? `${pendingMedicinesCount} ${
                            pendingMedicinesCount === 1 ? t.dosePending : t.dosesPending
                          }`
                        : t.allDosesTaken}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
              </div>

              {/* Card 2: Daily Routine */}
              <div
                onClick={() => {
                  setActiveTab("daily");
                  setViewMode("module");
                }}
                className="sanctuary-card p-5 rounded-3xl border border-[#dce7de] hover:border-emerald-400 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {t.modDailyTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium truncate max-w-[170px]">
                      {nextScheduledItem
                        ? `${nextScheduledItem.time}: ${nextScheduledItem.title}`
                        : t.allDoneToday}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
              </div>

              {/* Card 3: Shield & Safety */}
              <div
                onClick={() => {
                  setActiveTab("scam");
                  setViewMode("module");
                }}
                className="sanctuary-card p-5 rounded-3xl border border-[#dce7de] hover:border-emerald-400 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {t.modScamTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {t.statusActive} • {profile.emergencyContact?.name || "Priya Sharma"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
              </div>
            </div>

            {/* 3. The 3 Grand Sanctuary Portals */}
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950">
                  Care & Living Portals
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                  Tap any doorway below to open gentle, accessible tools designed with love for you.
                </p>
              </div>

              <div className="space-y-6">
                {sanctuaryDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="bg-white rounded-3xl border border-[#dce7de] p-6 sm:p-7 shadow-xs space-y-4"
                  >
                    {/* Domain Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl ${domain.iconBg}`}>
                          {domain.icon}
                        </div>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                            {domain.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-600 font-medium">
                            {domain.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domain.modules.map((m: any) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            if (m.isEmergency) {
                              setShowEmergencyModal(true);
                            } else {
                              setActiveTab(m.id);
                              setViewMode("module");
                            }
                          }}
                          className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-4 ${domain.accentBg} ${domain.accentBorder} hover:shadow-sm`}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-white shadow-2xs">
                                  {m.icon}
                                </span>
                                <h4 className="font-bold text-base text-stone-900">
                                  {m.name}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                              {m.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor || "bg-stone-100 text-stone-800 border-stone-300"}`}
                            >
                              {m.badge}
                            </span>
                            <span className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1">
                              <span>{m.action}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: FOCUSED MODULE VIEW WITH SANCTUARY BREADCRUMB */
          <div className="space-y-4">
            {/* Sanctuary Breadcrumb Banner */}
            <div className="sanctuary-card p-4 rounded-3xl border border-[#dce7de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="return-to-sanctuary-btn"
                  onClick={() => setViewMode("sanctuary")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-300 transition cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.btnBack} ({t.btnSanctuaryDeck})</span>
                </button>

                <div className="hidden sm:block">
                  <p className="text-xs text-stone-500 font-medium">{t.btnActiveModule}</p>
                  <h3 className="font-bold text-base text-stone-900">
                    {navItems.find((n) => n.id === activeTab)?.label}
                  </h3>
                </div>
              </div>

              {/* Sibling Jump Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition cursor-pointer ${
                      activeTab === item.id
                        ? "bg-emerald-800 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {item.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactile Senior Module Navigation Strip */}
            <nav
              aria-label="Mitraa Modules"
              className="bg-white rounded-3xl p-2.5 border border-[#dce7de] shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-sm shrink-0 transition active:scale-95 cursor-pointer min-h-[44px] ${
                    activeTab === item.id
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-stone-700 hover:bg-emerald-50/60"
                  }`}
                >
                  <span className={activeTab === item.id ? "text-white" : ""}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeTab === item.id
                          ? "bg-white text-emerald-900"
                          : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Active Module Canvas */}
            <main className="transition-all duration-200">
          {activeTab === "companion" && (
            <VoiceCompanion
              profile={profile}
              seniorContextSummary={`Senior Name: ${profile.name} (Prefers: ${profile.preferredHonorific}), Age: ${profile.age}.
Prescribed Medicines: ${medicines.map((m) => `${m.name} (${m.dosage}, ${m.timeSlot}, taken today: ${m.takenToday ? "Yes" : "No"})`).join("; ")}.
Today's Schedule: ${schedule.map((s) => `${s.time} - ${s.title} (${s.completed ? "Done" : "Pending"})`).join("; ")}.
Doctor: Dr. ${profile.primaryDoctor} (${profile.doctorPhone}).
Emergency Contact: ${profile.emergencyContact.name} (${profile.emergencyContact.relation}, ${profile.emergencyContact.phone}).
Known Conditions: ${profile.medicalConditions.join(", ") || "None"}.`}
              onNavigateModule={(mod) => {
                if (mod === "emergency") {
                  setShowEmergencyModal(true);
                } else if (mod === "daily-life") {
                  setActiveTab("daily");
                } else if (mod === "health-organizer") {
                  setActiveTab("health");
                } else if (mod === "scam-protection") {
                  setActiveTab("scam");
                } else if (mod === "document-simplifier") {
                  setActiveTab("document");
                } else if (mod === "digital-tasks") {
                  setActiveTab("tasks");
                } else if (mod === "family-connection") {
                  setActiveTab("family");
                } else if (mod === "finance-bills") {
                  setActiveTab("finance");
                } else if (mod === "companion-leisure") {
                  setActiveTab("personal");
                }
              }}
            />
          )}

          {activeTab === "daily" && (
            <DailyLifeAssistant
              schedule={schedule}
              onToggleScheduleItem={handleToggleScheduleItem}
              onAddScheduleItem={handleAddScheduleItem}
              profile={profile}
            />
          )}

          {activeTab === "document" && (
            <DocumentSimplifier profile={profile} />
          )}

          {activeTab === "tasks" && (
            <DigitalTaskAssistant profile={profile} />
          )}

          {activeTab === "scam" && (
            <ScamProtection profile={profile} />
          )}

          {activeTab === "health" && (
            <HealthOrganizer
              medicines={medicines}
              onToggleMedicine={handleToggleMedicine}
              appointments={profile.emergencyContact ? [
                {
                  id: "apt-1",
                  doctorName: "Dr. Arvind Mehta",
                  specialty: "Senior Cardiologist",
                  date: "Friday, Sep 26",
                  time: "10:30 AM",
                  location: "City Heart Care Clinic, Room 204",
                  questionsToAsk: [
                    "Should I adjust my blood pressure medicine dose?",
                    "Is it safe to continue 30 minutes of morning walking?",
                    "When is my next ECG due?",
                  ],
                },
                {
                  id: "apt-2",
                  doctorName: "Dr. Sunita Rao",
                  specialty: "Ophthalmology / Eye Care",
                  date: "Oct 12",
                  time: "03:00 PM",
                  location: "Vision Eye Care Center",
                  questionsToAsk: [
                    "Is my reading glass power still correct?",
                    "Are my dry eye lubricating drops sufficient?",
                  ],
                },
              ] : []}
              vitals={vitals}
              onAddVital={handleAddVital}
              profile={profile}
            />
          )}

          {activeTab === "family" && (
            <FamilyConnection
              contacts={initialTrustedContacts}
              profile={profile}
              medicines={medicines}
            />
          )}

          {activeTab === "finance" && (
            <FinanceAssistant
              bills={bills}
              onToggleBillStatus={handleToggleBillStatus}
              profile={profile}
            />
          )}

          {activeTab === "personal" && (
            <CompanionPersonalization
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
          </div>
        )}
      </div>

      {/* Emergency Assistance Modal (Module 8: Siren, countdown, medical ID, 1-tap call) */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        profile={profile}
      />
    </div>
  );
}
