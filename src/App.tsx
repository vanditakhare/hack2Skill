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
  const [breathingText, setBreathingText] = useState<string>("Gently Breathe In...");

  const handleStartBreathing = () => {
    playCalmChime();
    setBreathingActive(true);
    setBreathingText("Gently Breathe In (1, 2, 3, 4)...");
    setTimeout(() => {
      setBreathingText("Hold Gently (1, 2, 3, 4)...");
      setTimeout(() => {
        setBreathingText("Slowly Breathe Out (1, 2, 3, 4)...");
        setTimeout(() => {
          setBreathingText("Rest & Feel at Peace...");
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
    if (hour < 12) {
      return {
        greeting: `Subha Prabhat, ${profile.preferredHonorific || profile.name}`,
        period: "Morning Sunrise",
        icon: <Sun className="w-5 h-5 text-amber-600" />,
        guidance: "A peaceful morning has arrived. Drink warm water, stretch your legs, and let us start the day with calmness.",
      };
    } else if (hour < 17) {
      return {
        greeting: `Shubh Madhyahan, ${profile.preferredHonorific || profile.name}`,
        period: "Golden Afternoon",
        icon: <Sun className="w-5 h-5 text-orange-600" />,
        guidance: "Rest your eyes, stay hydrated, and enjoy soothing music, reading, or a quiet pause.",
      };
    } else {
      return {
        greeting: `Shubh Sandhya, ${profile.preferredHonorific || profile.name}`,
        period: "Peaceful Twilight",
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        guidance: "The evening lamps are lit. Spend a gentle moment connecting with family, resting your feet, and taking evening medicines.",
      };
    }
  };

  const sanctuaryDomains = [
    {
      id: "care",
      title: "Care & Daily Vitality",
      hindi: "स्वास्थ्य व दिनचर्या",
      tagline: "Your medicines, gentle daily rhythm, and conversational companion",
      accentBorder: "border-emerald-200/90 hover:border-emerald-400",
      accentBg: "bg-emerald-50/40",
      iconBg: "bg-emerald-100 text-emerald-800",
      icon: <HeartPulse className="w-6 h-6 text-emerald-700" />,
      modules: [
        {
          id: "companion" as ModuleTab,
          name: "Mitraa Voice Companion",
          badge: "AI Caring Friend",
          badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
          desc: "Speak naturally in your language. Ask about your day, health advice, or hear a comforting story.",
          icon: <MessageCircleHeart className="w-5 h-5 text-emerald-700" />,
          action: "Talk with Mitraa",
        },
        {
          id: "health" as ModuleTab,
          name: "Medicines & Health Log",
          badge: pendingMedicinesCount > 0 ? `${pendingMedicinesCount} dose pending` : "All doses taken",
          badgeColor: pendingMedicinesCount > 0 ? "bg-amber-100 text-amber-950 border-amber-300" : "bg-emerald-100 text-emerald-900 border-emerald-300",
          desc: "Visual pillbox with photos, reminder alarms, doctor appointments, and BP/Sugar log.",
          icon: <Pill className="w-5 h-5 text-emerald-700" />,
          action: "Open Pillbox",
        },
        {
          id: "daily" as ModuleTab,
          name: "Daily Routine & Schedule",
          badge: pendingTasksCount > 0 ? `${pendingTasksCount} tasks remaining` : "All done today",
          badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
          desc: "Paced day organizer: morning walk, prayer, hydration, family calls, and relaxing nap times.",
          icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
          action: "View Schedule",
        },
      ],
    },
    {
      id: "safety",
      title: "Peace of Mind & Safety",
      hindi: "सुरक्षा व सतर्कता",
      tagline: "Scam protection, plain-language letters, and immediate emergency help",
      accentBorder: "border-emerald-200/90 hover:border-emerald-400",
      accentBg: "bg-emerald-50/30",
      iconBg: "bg-emerald-100 text-emerald-900",
      icon: <ShieldAlert className="w-6 h-6 text-emerald-800" />,
      modules: [
        {
          id: "scam" as ModuleTab,
          name: "Scam & Fraud Shield",
          badge: "Shield Active",
          badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
          desc: "Instant safety check for suspicious SMS, lottery calls, bank threats, and fake electricity cutoffs.",
          icon: <ShieldAlert className="w-5 h-5 text-rose-700" />,
          action: "Verify Scam SMS",
        },
        {
          id: "document" as ModuleTab,
          name: "Letter & Document Simplifier",
          badge: "5th-Grade Simple",
          badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
          desc: "Translates dense hospital discharge reports, utility notices, and insurance letters into simple words.",
          icon: <FileText className="w-5 h-5 text-emerald-800" />,
          action: "Simplify Document",
        },
        {
          id: "emergency" as any,
          name: "Emergency SOS Siren",
          badge: "One-Touch Alert",
          badgeColor: "bg-rose-600 text-white",
          desc: "Immediately alerts primary family caregiver and dials local ambulance or senior helpline.",
          icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
          action: "Trigger Siren",
          isEmergency: true,
        },
      ],
    },
    {
      id: "life",
      title: "Connection & Everyday Life",
      hindi: "परिवार व दैनिक जीवन",
      tagline: "Stay close to family, navigate digital services, and enjoy peaceful leisure",
      accentBorder: "border-sky-200/90 hover:border-sky-400",
      accentBg: "bg-sky-50/40",
      iconBg: "bg-sky-100 text-sky-900",
      icon: <Users className="w-6 h-6 text-sky-800" />,
      modules: [
        {
          id: "family" as ModuleTab,
          name: "Family Circle & Caregiver",
          badge: "Caregiver Sync",
          badgeColor: "bg-sky-100 text-sky-950 border-sky-300",
          desc: "Share daily voice notes, view grandchild photos, and send one-tap 'I am safe' updates.",
          icon: <Users className="w-5 h-5 text-sky-700" />,
          action: "Open Family Hub",
        },
        {
          id: "tasks" as ModuleTab,
          name: "Easy Digital Task Guides",
          badge: "Step-by-Step",
          badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
          desc: "Large screenshot walkthroughs for booking an Uber, ordering groceries, and WhatsApp calls.",
          icon: <MousePointerClick className="w-5 h-5 text-sky-700" />,
          action: "Start Tutorial",
        },
        {
          id: "finance" as ModuleTab,
          name: "Bills & Pension Assistant",
          badge: "Due Date Tracker",
          badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300",
          desc: "Large-print utility bills, pension reminders, and Jeevan Pramaan submission guide.",
          icon: <DollarSign className="w-5 h-5 text-emerald-800" />,
          action: "View Bills",
        },
        {
          id: "personal" as ModuleTab,
          name: "Peaceful Leisure & Mind Gym",
          badge: "Relaxation",
          badgeColor: "bg-purple-100 text-purple-950 border-purple-300",
          desc: "Positive daily news summaries, relaxing ragas, stories, and gentle memory puzzles.",
          icon: <Sparkles className="w-5 h-5 text-purple-700" />,
          action: "Relax & Play",
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
    setProfile((prev) => ({ ...prev, ...updated }));
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
      label: "Mitraa Voice Companion",
      icon: <MessageCircleHeart className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "daily",
      label: "Daily Schedule & Tasks",
      icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: "document",
      label: "Document Simplifier",
      icon: <FileText className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "tasks",
      label: "Digital Task Guide",
      icon: <MousePointerClick className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "scam",
      label: "Scam & Safety Shield",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
    },
    {
      id: "health",
      label: "Medicines & Health",
      icon: <HeartPulse className="w-5 h-5 text-emerald-600" />,
      badge: pendingMedicinesCount > 0 ? `${pendingMedicinesCount} pending` : "Done",
    },
    {
      id: "family",
      label: "Family & Caregiver",
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "finance",
      label: "Bills & Finance",
      icon: <DollarSign className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: "personal",
      label: "News & Preferences",
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
              <span>Sanctuary Deck</span>
            </button>

            {viewMode === "module" && (
              <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Active Module: {navItems.find((n) => n.id === activeTab)?.label}
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
              <span>Calm Breath</span>
            </button>

            <button
              type="button"
              onClick={() => {
                speechHelper.speak(
                  `Namaste ${profile.preferredHonorific}. You have ${pendingMedicinesCount} medicines pending and ${pendingTasksCount} schedule activities remaining. Tap any sanctuary card to begin.`,
                  { rate: profile.voiceSpeed, language: profile.language }
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[42px]"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>Briefing</span>
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
                  Follow the gentle bell. Inhale calmness, exhale all strain.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBreathingActive(false)}
              className="px-4 py-2 rounded-2xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Close Guide
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
                          Mitraa AI Active
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
                        <span>Speak with Mitraa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEmergencyModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm sm:text-base transition cursor-pointer min-h-[54px]"
                      >
                        <AlertOctagon className="w-5 h-5 text-rose-600" />
                        <span>Emergency SOS</span>
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
                      Medicines & Doses
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {pendingMedicinesCount > 0
                        ? `${pendingMedicinesCount} dose(s) pending today`
                        : "All daily medicines taken!"}
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
                      Day Routine
                    </h3>
                    <p className="text-xs text-stone-500 font-medium truncate max-w-[170px]">
                      {nextScheduledItem
                        ? `${nextScheduledItem.time}: ${nextScheduledItem.title}`
                        : "Routine completed for today"}
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
                      Fraud Shield
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Active • Contact: {profile.emergencyContact?.name || "Priya Sharma"}
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
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                              {domain.title}
                            </h3>
                            <span className="text-xs font-bold text-stone-500">
                              ({domain.hindi})
                            </span>
                          </div>
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
                  <span>Return to Sanctuary Deck</span>
                </button>

                <div className="hidden sm:block">
                  <p className="text-xs text-stone-500 font-medium">Current Tool</p>
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
