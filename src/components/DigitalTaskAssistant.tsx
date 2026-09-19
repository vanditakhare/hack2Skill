import React, { useState } from "react";
import {
  MousePointerClick,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  ShieldCheck,
  Lightbulb,
  Sparkles,
  Smartphone,
  CreditCard,
  Video,
  FileCheck,
  Search,
  RotateCcw,
} from "lucide-react";
import { SeniorProfile, DigitalTaskGuide } from "../types";
import { prebuiltTaskGuides } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";

interface DigitalTaskAssistantProps {
  profile: SeniorProfile;
}

export const DigitalTaskAssistant: React.FC<DigitalTaskAssistantProps> = ({ profile }) => {
  const [activeTaskId, setActiveTaskId] = useState<string>("pay-bill");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [customGuide, setCustomGuide] = useState<DigitalTaskGuide | null>(null);
  const [isLoadingCustom, setIsLoadingCustom] = useState<boolean>(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState<boolean>(false);

  const currentGuide: DigitalTaskGuide =
    customGuide || prebuiltTaskGuides[activeTaskId] || prebuiltTaskGuides["pay-bill"];

  const currentStep = currentGuide.steps[currentStepIndex] || currentGuide.steps[0];

  const handleSelectPreset = (taskId: string) => {
    setActiveTaskId(taskId);
    setCustomGuide(null);
    setCurrentStepIndex(0);
    setIsTaskCompleted(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentGuide.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      // Speak the new step
      const step = currentGuide.steps[nextIdx];
      speechHelper.speak(`Step ${step.stepNumber}: ${step.title}. ${step.instruction}`, {
        rate: profile.voiceSpeed,
        language: profile.language,
      });
    } else {
      setIsTaskCompleted(true);
      speechHelper.speak("Congratulations! You have completed all steps for this task.", {
        rate: profile.voiceSpeed,
        language: profile.language,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsTaskCompleted(false);
    }
  };

  const handleSpeakCurrentStep = () => {
    speechHelper.speak(
      `Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.instruction}. Helpful tip: ${currentStep.tip}`,
      { rate: profile.voiceSpeed, language: profile.language }
    );
  };

  const handleGenerateCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim() || isLoadingCustom) return;

    setIsLoadingCustom(true);
    try {
      const response = await fetch("/api/companion/task-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: customQuery.trim(),
          language: profile.language,
        }),
      });

      const data: DigitalTaskGuide = await response.json();
      if (data && data.steps) {
        setCustomGuide(data);
        setCurrentStepIndex(0);
        setIsTaskCompleted(false);
      }
    } catch (err) {
      console.error("Custom task error:", err);
    } finally {
      setIsLoadingCustom(false);
    }
  };

  return (
    <div id="digital-task-assistant-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Digital Task Step-by-Step Guide
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              We guide you through everyday online forms, banking, ticket booking, and video calls one calm step at a time.
            </p>
          </div>
        </div>

        {/* Preset Task Buttons */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Choose a common task to practice or follow:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSelectPreset("pay-bill")}
              className={`p-4 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                activeTaskId === "pay-bill" && !customGuide
                  ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-base">Pay Bill Online</span>
              </div>
              <span className="text-xs text-stone-600 block">Electricity, water, or phone bill safely</span>
            </button>

            <button
              onClick={() => handleSelectPreset("whatsapp-call")}
              className={`p-4 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                activeTaskId === "whatsapp-call" && !customGuide
                  ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-base">WhatsApp Video Call</span>
              </div>
              <span className="text-xs text-stone-600 block">Call children & grandchildren easily</span>
            </button>

            <button
              onClick={() => handleSelectPreset("life-certificate")}
              className={`p-4 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                activeTaskId === "life-certificate" && !customGuide
                  ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-5 h-5 text-blue-700" />
                <span className="font-bold text-base">Life Certificate</span>
              </div>
              <span className="text-xs text-stone-600 block">Annual pension verification from home</span>
            </button>
          </div>
        </div>

        {/* Custom Task Generator Form */}
        <form onSubmit={handleGenerateCustomTask} className="mt-4 pt-4 border-t border-stone-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Need help with something else? (e.g. How to order medicine online, book cab)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-300 focus:border-emerald-600 focus:outline-none text-sm sm:text-base font-medium text-stone-800 bg-stone-50/70"
            />
          </div>
          <button
            type="submit"
            disabled={!customQuery.trim() || isLoadingCustom}
            className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-sm sm:text-base shrink-0 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isLoadingCustom ? "Creating Guide..." : "Guide Me"}</span>
          </button>
        </form>
      </div>

      {/* Interactive Step-by-Step Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Task Header & Progress */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {currentGuide.estimatedTime} Guide
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                {currentGuide.taskTitle}
              </h3>
            </div>

            <button
              onClick={handleSpeakCurrentStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm cursor-pointer shadow-2xs min-h-[44px]"
            >
              <Volume2 className="w-4 h-4 text-emerald-800" />
              <span>Read Step Out Loud</span>
            </button>
          </div>

          {/* Stepper Dots & Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            {currentGuide.steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsTaskCompleted(false);
                }}
                className={`h-3 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? "bg-emerald-600 ring-2 ring-emerald-300"
                    : idx < currentStepIndex
                    ? "bg-emerald-500"
                    : "bg-stone-200"
                }`}
                title={`Go to Step ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mt-2">
            <span>
              Step {currentStepIndex + 1} of {currentGuide.steps.length}
            </span>
            <span>{Math.round(((currentStepIndex + 1) / currentGuide.steps.length) * 100)}% Finished</span>
          </div>
        </div>

        {/* Current Active Step Box or Completed Screen */}
        {!isTaskCompleted ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Step Number & Title */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                  {currentStep.stepNumber}
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                    {currentStep.title}
                  </h4>
                  <p className="text-stone-800 text-lg sm:text-xl font-medium mt-2 leading-relaxed">
                    {currentStep.instruction}
                  </p>
                </div>
              </div>

              {/* Helpful Tip */}
              <div className="mt-4 pt-4 border-t border-emerald-200/60 flex items-start gap-3 text-stone-700">
                <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm text-emerald-950 block">Comfort Tip:</span>
                  <p className="text-sm font-medium">{currentStep.tip}</p>
                </div>
              </div>

              {/* Safety Check Reminder */}
              {currentStep.safetyCheck && (
                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-2.5 text-emerald-950 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Digital Safety Check:</span>
                    <span>{currentStep.safetyCheck}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prerequisites on Step 1 */}
            {currentStepIndex === 0 && currentGuide.prerequisites && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Things to keep handy before starting:
                </span>
                <ul className="space-y-1.5 text-sm font-medium text-stone-700">
                  {currentGuide.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Task Completed Successfully!
            </h4>
            <p className="text-stone-700 text-base max-w-md mx-auto">
              You navigated this digital task with confidence. You can always come back and practice anytime with Mitraa.
            </p>
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsTaskCompleted(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-md cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Practice Again From Step 1</span>
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-stone-300 hover:bg-stone-100 disabled:opacity-30 text-stone-700 font-bold text-base cursor-pointer min-h-[48px]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </button>

          {!isTaskCompleted && (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-md cursor-pointer active:scale-95 min-h-[48px]"
            >
              <span>{currentStepIndex === currentGuide.steps.length - 1 ? "Finish Task" : "Next Step"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
