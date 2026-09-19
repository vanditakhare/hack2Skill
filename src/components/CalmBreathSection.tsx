import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  Check,
  Music,
} from "lucide-react";
import { SeniorProfile } from "../types";
import { getTranslation } from "../utils/translations";
import {
  soothingSoundsEngine,
  SOOTHING_SOUND_OPTIONS,
  SoothingSoundId,
  getLocalizedSoundText,
  getCalmSectionLabels,
} from "../utils/soothingSounds";
import { playCalmChime } from "../utils/speech";

interface CalmBreathSectionProps {
  profile: SeniorProfile;
  onClose: () => void;
}

export const CalmBreathSection: React.FC<CalmBreathSectionProps> = ({
  profile,
  onClose,
}) => {
  const t = getTranslation(profile.language);
  const labels = getCalmSectionLabels(profile.language);

  // Breathing cycle states
  // 4s Inhale -> 4s Hold -> 4s Exhale -> 3s Rest (Total 15s)
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "rest">("in");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [isBreathingPaused, setIsBreathingPaused] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(1);

  // Soothing sound states
  const [selectedSound, setSelectedSound] = useState<SoothingSoundId>("none");
  const [volume, setVolume] = useState<number>(0.6); // 60% default comfort level
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Initial peaceful chime on opening
  useEffect(() => {
    playCalmChime();
  }, []);

  // Breathing rhythm timer
  useEffect(() => {
    if (isBreathingPaused) return;

    timerRef.current = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        if (phase === "in") {
          setPhase("hold");
          return 4;
        } else if (phase === "hold") {
          setPhase("out");
          return 4;
        } else if (phase === "out") {
          setPhase("rest");
          return 3;
        } else {
          // New cycle
          setCycleCount((c) => c + 1);
          setPhase("in");
          return 4;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, isBreathingPaused]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      soothingSoundsEngine.stop();
    };
  }, []);

  // Handle sound selection
  const handleSelectSound = (soundId: SoothingSoundId) => {
    if (soundId === "none" || soundId === selectedSound) {
      if (soundId === selectedSound && isPlayingSound) {
        // Toggle off if already playing
        soothingSoundsEngine.stop();
        setSelectedSound("none");
        setIsPlayingSound(false);
        return;
      }
      soothingSoundsEngine.stop();
      setSelectedSound("none");
      setIsPlayingSound(false);
      return;
    }

    soothingSoundsEngine.setVolume(volume);
    soothingSoundsEngine.play(soundId);
    setSelectedSound(soundId);
    setIsPlayingSound(true);
  };

  // Handle volume changes
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    soothingSoundsEngine.setVolume(newVolume);
  };

  // Phase text and scale styling
  const getPhaseDisplay = () => {
    switch (phase) {
      case "in":
        return {
          title: t.breathIn,
          hint: `${phaseSecondsLeft}s`,
          scaleClass: "scale-110 sm:scale-125 bg-teal-500/25 border-teal-400 text-teal-900 ring-8 ring-teal-200/50",
          orbColor: "bg-teal-600",
        };
      case "hold":
        return {
          title: t.breathHold,
          hint: `${phaseSecondsLeft}s`,
          scaleClass: "scale-110 sm:scale-125 bg-amber-500/25 border-amber-400 text-amber-950 ring-8 ring-amber-200/50",
          orbColor: "bg-amber-600",
        };
      case "out":
        return {
          title: t.breathOut,
          hint: `${phaseSecondsLeft}s`,
          scaleClass: "scale-90 sm:scale-95 bg-emerald-500/20 border-emerald-400 text-emerald-950 ring-4 ring-emerald-200/40",
          orbColor: "bg-emerald-600",
        };
      case "rest":
      default:
        return {
          title: t.breathRest,
          hint: `${phaseSecondsLeft}s`,
          scaleClass: "scale-100 bg-stone-500/15 border-stone-300 text-stone-900 ring-2 ring-stone-200",
          orbColor: "bg-stone-500",
        };
    }
  };

  const phaseDisplay = getPhaseDisplay();

  const handleCloseSection = () => {
    soothingSoundsEngine.stop();
    onClose();
  };

  const activeSoundInfo =
    selectedSound !== "none" ? getLocalizedSoundText(selectedSound, profile.language) : null;

  return (
    <div
      id="calm-breath-section"
      className="sanctuary-card-warm rounded-3xl border-2 border-teal-300 shadow-lg overflow-hidden animate-fadeIn"
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-700/80 flex items-center justify-center font-black text-xl shadow-inner">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-black text-white">
                {labels.title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-700/80 text-teal-100 text-xs font-bold tracking-wide">
                {labels.cycleCount} {cycleCount}
              </span>
            </div>
            <p className="text-teal-200 text-xs sm:text-sm font-medium line-clamp-1">
              {labels.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="calm-breath-close-btn"
          onClick={handleCloseSection}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white border border-teal-600/50 text-xs sm:text-sm font-bold transition cursor-pointer min-h-[42px]"
          title="Finish & Close Calm Breath"
        >
          <X className="w-4 h-4" />
          <span>{t.btnBack}</span>
        </button>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* TOP ROW: Visual Breathing Orb & Instructions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-teal-50/70 border border-teal-200/80 rounded-3xl p-6 sm:p-8">
          {/* Animated Visual Orb */}
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 shrink-0">
            {/* Pulsing ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ease-in-out ${phaseDisplay.scaleClass}`}
            />
            {/* Center Orb */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ${phaseDisplay.orbColor} text-white flex flex-col items-center justify-center font-black text-2xl sm:text-3xl shadow-md transition-colors duration-700 z-10`}
            >
              <span>ॐ</span>
              <span className="text-xs font-bold text-teal-100 opacity-90 mt-0.5">
                {phaseDisplay.hint}
              </span>
            </div>
          </div>

          {/* Phase Information & Controls */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-950 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>
                {phase === "in"
                  ? "Phase 1: Inhale"
                  : phase === "hold"
                  ? "Phase 2: Hold"
                  : phase === "out"
                  ? "Phase 3: Exhale"
                  : "Phase 4: Rest"}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-teal-950 leading-tight">
              {phaseDisplay.title}
            </h3>

            <p className="text-stone-600 text-sm sm:text-base font-medium max-w-xl">
              {t.reassuranceCalm}
            </p>

            {/* Breathing Controls */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <button
                type="button"
                id="calm-breath-pause-btn"
                onClick={() => setIsBreathingPaused(!isBreathingPaused)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer min-h-[44px]"
              >
                {isBreathingPaused ? (
                  <>
                    <Play className="w-4 h-4 text-emerald-700" />
                    <span>{labels.btnResume}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-stone-700" />
                    <span>{labels.btnPause}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="calm-breath-repeat-btn"
                onClick={() => {
                  setPhase("in");
                  setPhaseSecondsLeft(4);
                  setCycleCount(1);
                  setIsBreathingPaused(false);
                  playCalmChime();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-100/70 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-teal-800" />
                <span>{labels.btnRepeatCycle}</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Soothing / Relaxing Sounds (User Controlled & Optional) */}
        <div className="bg-white border border-teal-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
          {/* Sounds Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-teal-700" />
                <h4 className="text-lg sm:text-xl font-black text-stone-900">
                  {labels.soothingSoundsTitle}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
                  Optional
                </span>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm font-medium mt-0.5">
                {labels.soothingSoundsDesc}
              </p>
            </div>

            {/* Currently playing status pill */}
            {isPlayingSound && activeSoundInfo ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-xs shrink-0 animate-fadeIn">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span>
                  {labels.nowPlaying} <strong>{activeSoundInfo.name}</strong>
                </span>
                <button
                  type="button"
                  id="mute-soothing-sound-btn"
                  onClick={() => handleSelectSound("none")}
                  className="ml-1 p-1 hover:bg-emerald-200 rounded-lg text-emerald-800 transition cursor-pointer"
                  title={labels.btnStopSound}
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-2xl border border-stone-200 shrink-0">
                🔇 {getLocalizedSoundText("none", profile.language).name}
              </div>
            )}
          </div>

          {/* Sound Choices Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SOOTHING_SOUND_OPTIONS.map((opt) => {
              const isCurrent = selectedSound === opt.id && (opt.id === "none" || isPlayingSound);
              const localized = getLocalizedSoundText(opt.id, profile.language);

              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`soothing-sound-${opt.id}`}
                  onClick={() => handleSelectSound(opt.id)}
                  className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition text-center cursor-pointer min-h-[110px] relative ${
                    isCurrent
                      ? "bg-teal-50/90 border-teal-600 text-teal-950 shadow-md ring-2 ring-teal-300/60 scale-[1.02]"
                      : "bg-stone-50/70 hover:bg-stone-100/90 border-stone-200/90 text-stone-800 hover:border-teal-300"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  <span className="text-2xl sm:text-3xl mb-1 select-none">
                    {opt.icon}
                  </span>

                  <span className="font-extrabold text-xs sm:text-sm leading-snug line-clamp-1">
                    {localized.name}
                  </span>

                  <span className="text-[11px] text-stone-500 line-clamp-2 mt-1 font-medium leading-tight">
                    {localized.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Volume Control Row (Shows when any sound is active) */}
          {isPlayingSound && (
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-teal-700 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-stone-900">
                  {labels.volumeLabel}: {Math.round(volume * 100)}%
                </span>
                <input
                  type="range"
                  id="soothing-sound-volume-slider"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-32 sm:w-44 accent-teal-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  aria-label={labels.volumeLabel}
                />
              </div>

              {/* Volume Quick Presets for Senior Touch Convenience */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVolumeChange(0.3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    Math.abs(volume - 0.3) < 0.05
                      ? "bg-teal-700 text-white border-teal-800"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {labels.softPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleVolumeChange(0.6)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    Math.abs(volume - 0.6) < 0.05
                      ? "bg-teal-700 text-white border-teal-800"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {labels.mediumPreset}
                </button>
                <button
                  type="button"
                  onClick={() => handleVolumeChange(0.9)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    Math.abs(volume - 0.9) < 0.05
                      ? "bg-teal-700 text-white border-teal-800"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {labels.richPreset}
                </button>
              </div>
            </div>
          )}

          {/* Calming Senior Guidance Tip */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-xs text-amber-950 font-medium">
            {labels.tip}
          </div>
        </div>
      </div>
    </div>
  );
};
