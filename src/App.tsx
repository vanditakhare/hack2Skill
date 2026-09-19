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
import { speechHelper } from "./utils/speech";

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

  const [activeTab, setActiveTab] = useState<ModuleTab>("companion");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [bills, setBills] = useState<BillItem[]>(initialBills);
  const [vitals, setVitals] = useState<VitalLog[]>(initialVitals);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

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
      icon: <MessageCircleHeart className="w-5 h-5 text-amber-700" />,
    },
    {
      id: "daily",
      label: "Daily Schedule & Tasks",
      icon: <CalendarCheck className="w-5 h-5 text-amber-700" />,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: "document",
      label: "Document Simplifier",
      icon: <FileText className="w-5 h-5 text-amber-700" />,
    },
    {
      id: "tasks",
      label: "Digital Task Guide",
      icon: <MousePointerClick className="w-5 h-5 text-amber-700" />,
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
      icon: <DollarSign className="w-5 h-5 text-amber-700" />,
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
        profile.highContrast ? "high-contrast" : "bg-[#faf8f5]"
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
        {/* Quick Glance Senior Greeting & Status Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>Namaste, {profile.preferredHonorific || profile.name}!</span>
              </h1>
              <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Mitraa Ready
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-stone-500 hover:text-amber-800 font-semibold underline cursor-pointer"
                title="Switch user or sign in with a different name"
              >
                (Switch Profile)
              </button>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Today is a peaceful day. Have you had warm water and your morning walk?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Pill Reminder Chip */}
            <button
              onClick={() => setActiveTab("health")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                pendingMedicinesCount > 0
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100"
                  : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Pill className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {pendingMedicinesCount > 0
                  ? `${pendingMedicinesCount} medicine(s) to take`
                  : "All medicines taken"}
              </span>
            </button>

            {/* Listen to Day Briefing */}
            <button
              onClick={() => {
                speechHelper.speak(
                  `Namaste ${profile.preferredHonorific}. Welcome to Mitraa. You have ${pendingTasksCount} schedule tasks and ${pendingMedicinesCount} medicines remaining for today. I am right here whenever you need assistance.`,
                  { rate: profile.voiceSpeed, language: profile.language }
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[40px]"
            >
              <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Listen to Greeting</span>
            </button>
          </div>
        </div>

        {/* Tactile Senior Module Navigation Tabs */}
        <nav
          aria-label="Mitraa Modules"
          className="bg-white rounded-3xl p-2.5 border border-stone-200 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-extrabold text-sm sm:text-base shrink-0 transition active:scale-95 cursor-pointer min-h-[48px] ${
                activeTab === item.id
                  ? "bg-amber-800 text-white shadow-xs"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <span className={activeTab === item.id ? "text-white" : ""}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === item.id
                      ? "bg-white text-amber-900"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Active Module View */}
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

      {/* Emergency Assistance Modal (Module 8: Siren, countdown, medical ID, 1-tap call) */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        profile={profile}
      />
    </div>
  );
}
