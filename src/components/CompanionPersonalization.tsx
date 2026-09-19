import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Smile,
  Music,
  Play,
  Square,
  Sparkles,
  Volume2,
  Settings,
  HelpCircle,
  Newspaper,
  Save,
  CheckCircle2,
  Globe,
  Sliders,
  Type,
  Sun,
  Moon,
} from "lucide-react";
import { SeniorProfile, Language, TextSize } from "../types";
import { speechHelper } from "../utils/speech";

interface CompanionPersonalizationProps {
  profile: SeniorProfile;
  onUpdateProfile: (updated: Partial<SeniorProfile>) => void;
}

export const CompanionPersonalization: React.FC<CompanionPersonalizationProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"news" | "brain" | "relax" | "settings">("news");
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editHonorific, setEditHonorific] = useState(profile.preferredHonorific);
  const [editLanguage, setEditLanguage] = useState<Language>(profile.language);
  const [editTextSize, setEditTextSize] = useState<TextSize>(profile.textSize);
  const [editSpeed, setEditSpeed] = useState<number>(profile.voiceSpeed || 0.88);
  const [editContrast, setEditContrast] = useState<boolean>(profile.highContrast);

  // Web Audio ambient sound synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  const startAmbientMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Pentatonic warm soothing scale frequencies
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C4, D4, E4, G4, A4, C5
      let noteIndex = 0;

      const playNextWarmTone = () => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % notes.length;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft gentle bell envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.0);
      };

      playNextWarmTone();
      intervalRef.current = setInterval(playNextWarmTone, 2200);
      setIsPlayingMelody(true);
    } catch (e) {
      console.warn("Melody audio error", e);
    }
  };

  const stopAmbientMelody = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlayingMelody(false);
  };

  useEffect(() => {
    return () => {
      stopAmbientMelody();
    };
  }, []);

  const positiveNews = [
    {
      title: "Community Flower Garden Creates Peaceful Morning Walking Trail",
      snippet:
        "Neighborhood volunteers and youth have planted fragrant jasmine, marigolds, and shaded benches along the municipal park for senior citizens to stroll peacefully every morning.",
      tag: "Community",
    },
    {
      title: "Morning Sunlight & Mild Walking Proven to Elevate Memory and Sleep",
      snippet:
        "A heartwarming new wellness report reveals that just 20 minutes of relaxed morning sunlight and gentle conversation provides deeply restful sleep and mood joy for elders.",
      tag: "Health & Joy",
    },
    {
      title: "Free Digital Literacy Library Circles Welcoming Grandparents",
      snippet:
        "Local city libraries are hosting patient one-on-one sessions where friendly volunteers help seniors video call distant family, read digital newspapers, and enjoy audiobooks comfortably.",
      tag: "Kindness",
    },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      preferredHonorific: editHonorific,
      language: editLanguage,
      textSize: editTextSize,
      voiceSpeed: Number(editSpeed),
      highContrast: editContrast,
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div id="companion-personalization-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Companion, Positive News & Settings
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              Uplifting wholesome stories, gentle mind games, soothing ambient melodies, and custom comfort preferences.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-stone-100 pb-1">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "news"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            📰 Positive Daily News
          </button>

          <button
            onClick={() => setActiveTab("brain")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "brain"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            🧩 Daily Brain Riddle
          </button>

          <button
            onClick={() => setActiveTab("relax")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "relax"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            🎵 Peaceful Ambient Melodies
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "settings"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            ⚙️ Personal Preferences
          </button>
        </div>
      </div>

      {/* Tab 1: Positive Daily News */}
      {activeTab === "news" && (
        <div className="space-y-4 animate-fadeIn">
          {positiveNews.map((news, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {news.tag}
                </span>

                <button
                  onClick={() =>
                    speechHelper.speak(`${news.title}. ${news.snippet}`, {
                      rate: profile.voiceSpeed,
                      language: profile.language,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer min-h-[38px]"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Listen to Story</span>
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {news.title}
              </h3>
              <p className="text-stone-700 text-base sm:text-lg font-medium leading-relaxed">
                {news.snippet}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Daily Brain Riddle */}
      {activeTab === "brain" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-stone-900">
                Gentle Morning Brain Teaser
              </h3>
              <p className="text-sm font-medium text-stone-500">
                Keep your wonderful mind active, playful, and cheerful
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Riddle of the Day:
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-relaxed">
              "I have keys, but no doors. I have a space bar, but no stars. You can type on me to write to your grandchildren. What am I?"
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowRiddleAnswer(!showRiddleAnswer)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition active:scale-95 cursor-pointer shadow-xs min-h-[44px]"
              >
                {showRiddleAnswer ? "Hide Answer" : "Reveal Answer"}
              </button>
            </div>

            {showRiddleAnswer && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-lg animate-fadeIn flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                <span>Answer: A Computer Keyboard or Phone Keyboard! 😊</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Peaceful Ambient Melodies */}
      {activeTab === "relax" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold shadow-sm">
              <Music className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              Peaceful Ambient Soundscape
            </h3>
            <p className="text-stone-600 text-base font-medium">
              Gentle, relaxing soft chimes and harmonic tones designed to bring calm during afternoon rest or evening tea.
            </p>

            <div className="pt-4">
              {isPlayingMelody ? (
                <button
                  onClick={stopAmbientMelody}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-md transition active:scale-95 cursor-pointer min-h-[52px]"
                >
                  <Square className="w-6 h-6" />
                  <span>Stop Gentle Music</span>
                </button>
              ) : (
                <button
                  onClick={startAmbientMelody}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-md transition active:scale-95 cursor-pointer min-h-[52px]"
                >
                  <Play className="w-6 h-6" />
                  <span>Play Soothing Music</span>
                </button>
              )}
            </div>

            {isPlayingMelody && (
              <p className="text-xs font-bold text-emerald-800 animate-pulse pt-2">
                🎵 Playing relaxing soft chime tones... take a deep breath and relax.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Preferences & Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs animate-fadeIn">
          <h3 className="text-2xl font-black text-stone-900 mb-2">
            Senior Accessibility & Profile Preferences
          </h3>
          <p className="text-xs text-stone-500 font-medium mb-6">
            Customize how Mitraa looks and sounds for your maximum comfort
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  How should Mitraa address you? (Preferred Honorific)
                </label>
                <input
                  type="text"
                  value={editHonorific}
                  onChange={(e) => setEditHonorific(e.target.value)}
                  placeholder="e.g. Ashaji, Dadaji, Grandpa, Mrs. Sharma"
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  Preferred Language
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value as Language)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  Screen Text Size
                </label>
                <select
                  value={editTextSize}
                  onChange={(e) => setEditTextSize(e.target.value as TextSize)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="normal">Medium (Standard)</option>
                  <option value="large">Large (Recommended for Seniors)</option>
                  <option value="extra-large">Extra Large (Maximum Legibility)</option>
                </select>
              </div>
            </div>

            {/* Voice Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bold text-stone-700">
                  Voice Speech Speed: {Math.round(editSpeed * 100)}%
                </label>
                <span className="text-xs text-stone-500 font-semibold">
                  {editSpeed <= 0.85 ? "Gentle & Slow (Recommended)" : "Normal Speed"}
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.0"
                step="0.05"
                value={editSpeed}
                onChange={(e) => setEditSpeed(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  High-Contrast Black & Gold Mode
                </span>
                <span className="text-xs text-stone-500">
                  Maximum contrast for low-vision comfort
                </span>
              </div>
              <input
                type="checkbox"
                checked={editContrast}
                onChange={(e) => setEditContrast(e.target.checked)}
                className="w-6 h-6 accent-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSettingsNotice ? (
                <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5" /> Preferences saved!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
              >
                <Save className="w-5 h-5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
