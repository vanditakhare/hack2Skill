import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Volume2,
  Sparkles,
  Pill,
  Heart,
  Users,
  FileText,
  Coffee,
  X,
} from "lucide-react";
import { ScheduleItem, SeniorProfile } from "../types";
import { speechHelper } from "../utils/speech";

interface DailyLifeAssistantProps {
  schedule: ScheduleItem[];
  onToggleScheduleItem: (id: string) => void;
  onAddScheduleItem: (item: Omit<ScheduleItem, "id">) => void;
  profile: SeniorProfile;
}

export const DailyLifeAssistant: React.FC<DailyLifeAssistantProps> = ({
  schedule,
  onToggleScheduleItem,
  onAddScheduleItem,
  profile,
}) => {
  const [filter, setFilter] = useState<"all" | "medicine" | "family" | "health" | "bill">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newCategory, setNewCategory] = useState<ScheduleItem["category"]>("health");
  const [newNotes, setNewNotes] = useState("");
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const completedCount = schedule.filter((s) => s.completed).length;
  const totalCount = schedule.length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  const filteredSchedule = schedule.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleScheduleItem(id);
    if (!currentlyCompleted) {
      setCelebrationMsg("Shabash! Great job completing this task on time!");
      setTimeout(() => setCelebrationMsg(null), 4000);
    }
  };

  const handleReadSchedule = () => {
    const pending = schedule.filter((s) => !s.completed);
    let speechText = `Namaste ${profile.preferredHonorific}. `;
    if (pending.length === 0) {
      speechText += "You have completed all your planned activities for today! Wonderful job. You can rest and relax.";
    } else {
      speechText += `Today you have ${pending.length} tasks remaining. Next up: ${pending[0].title} at ${pending[0].time}. `;
      if (pending.length > 1) {
        speechText += `Later, you also have ${pending[1].title}.`;
      }
    }
    speechHelper.speak(speechText, {
      rate: profile.voiceSpeed || 0.88,
      language: profile.language,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddScheduleItem({
      title: newTitle.trim(),
      time: newTime,
      category: newCategory,
      completed: false,
      notes: newNotes.trim() || undefined,
    });

    setNewTitle("");
    setNewNotes("");
    setShowAddModal(false);
  };

  const getCategoryBadge = (category: ScheduleItem["category"]) => {
    switch (category) {
      case "medicine":
        return {
          icon: <Pill className="w-4 h-4 text-emerald-700" />,
          label: "Medicine",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        };
      case "health":
        return {
          icon: <Heart className="w-4 h-4 text-rose-700" />,
          label: "Health & Care",
          bg: "bg-rose-100 text-rose-900 border-rose-300",
        };
      case "family":
        return {
          icon: <Users className="w-4 h-4 text-blue-700" />,
          label: "Family & Call",
          bg: "bg-blue-100 text-blue-900 border-blue-300",
        };
      case "bill":
        return {
          icon: <FileText className="w-4 h-4 text-emerald-700" />,
          label: "Bills & Finance",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        };
      case "leisure":
      default:
        return {
          icon: <Coffee className="w-4 h-4 text-purple-700" />,
          label: "Relaxation",
          bg: "bg-purple-100 text-purple-900 border-purple-300",
        };
    }
  };

  return (
    <div id="daily-life-module" className="space-y-6">
      {/* "What Should I Do Today?" Proactive Briefing Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600/40 text-emerald-200 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider">
                Morning Briefing
              </span>
              <span className="text-emerald-200 text-sm font-medium">Thursday • Pleasant 24°C</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              "What Should I Do Today, Mitraa?"
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl leading-relaxed">
              You have completed <span className="font-extrabold text-white">{completedCount} of {totalCount}</span> daily activities.
              Stay hydrated, take your evening medicines after dinner, and remember to enjoy your afternoon rest.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleReadSchedule}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
            >
              <Volume2 className="w-5 h-5 text-emerald-700" />
              <span>Listen to My Day</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-extrabold text-base border border-emerald-400/40 shadow-sm transition active:scale-95 cursor-pointer min-h-[48px]"
            >
              <Plus className="w-5 h-5 text-emerald-200" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>

        {/* Celebratory toast when completing task */}
        {celebrationMsg && (
          <div className="mt-4 p-3 bg-emerald-500 text-white font-extrabold rounded-2xl flex items-center gap-2 shadow-lg animate-fadeIn text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>{celebrationMsg}</span>
          </div>
        )}

        {/* Visual Progress Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-600/30 flex items-center gap-4">
          <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-100">{progressPercent}% Completed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[44px] ${
            filter === "all"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          All Items ({schedule.length})
        </button>
        <button
          onClick={() => setFilter("medicine")}
          className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[44px] ${
            filter === "medicine"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          💊 Medicines
        </button>
        <button
          onClick={() => setFilter("family")}
          className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[44px] ${
            filter === "family"
              ? "bg-blue-700 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          👨‍👩‍👧 Family Calls
        </button>
        <button
          onClick={() => setFilter("health")}
          className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[44px] ${
            filter === "health"
              ? "bg-rose-700 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          ❤️ Walks & Health
        </button>
        <button
          onClick={() => setFilter("bill")}
          className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[44px] ${
            filter === "bill"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
          }`}
        >
          💰 Bill Due Dates
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredSchedule.map((item) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition shadow-2xs flex items-start justify-between gap-4 ${
                item.completed
                  ? "bg-stone-50/80 border-stone-200 opacity-75"
                  : "bg-white border-stone-200 hover:border-emerald-400"
              }`}
            >
              {/* Checkbox & Details */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggle(item.id, item.completed)}
                  className="mt-0.5 cursor-pointer transition active:scale-90"
                  title={item.completed ? "Mark as pending" : "Mark as completed"}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-8 h-8 text-stone-300 hover:text-emerald-600 shrink-0" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {item.time}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${badge.bg}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-base sm:text-lg ${
                      item.completed ? "line-through text-stone-500" : "text-stone-900"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {item.notes && (
                    <p className="text-sm text-stone-600 mt-1 font-medium">{item.notes}</p>
                  )}
                </div>
              </div>

              {/* Read single item aloud */}
              <button
                onClick={() =>
                  speechHelper.speak(`${item.title} at ${item.time}. ${item.notes || ""}`, {
                    rate: profile.voiceSpeed,
                    language: profile.language,
                  })
                }
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 cursor-pointer shrink-0"
                title="Listen to this task"
              >
                <Volume2 className="w-4 h-4 text-emerald-800" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3 border-stone-100">
              <h3 className="font-extrabold text-xl text-stone-900">Add a New Daily Reminder</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  What is the task or reminder?
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Drink warm turmeric milk, call Priya"
                  className="w-full p-3 border rounded-xl font-medium text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Time of Day
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 05:00 PM"
                    className="w-full p-3 border rounded-xl font-medium text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 border rounded-xl font-medium text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="medicine">💊 Medicine</option>
                    <option value="health">❤️ Health & Walk</option>
                    <option value="family">👨‍👩‍👧 Family & Call</option>
                    <option value="bill">💰 Bill Payment</option>
                    <option value="leisure">☕ Rest & Leisure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Helpful Note (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Take with a glass of water"
                  className="w-full p-3 border rounded-xl font-medium text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
