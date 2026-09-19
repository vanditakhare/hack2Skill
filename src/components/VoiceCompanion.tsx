import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Send,
  Sparkles,
  Heart,
  Bot,
  User,
  HelpCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { SeniorProfile, ChatMessage } from "../types";
import { speechHelper, createSpeechRecognizer } from "../utils/speech";
import { getTranslation } from "../utils/translations";

interface VoiceCompanionProps {
  profile: SeniorProfile;
  initialMessage?: string;
  onNavigateModule?: (moduleId: string) => void;
  seniorContextSummary?: string;
}

export const VoiceCompanion: React.FC<VoiceCompanionProps> = ({
  profile,
  initialMessage,
  onNavigateModule,
  seniorContextSummary,
}) => {
  const t = getTranslation(profile.language);

  const getInitialGreeting = () => {
    const name = profile.preferredHonorific || profile.name;
    return t.welcomeMessage.replace("{name}", name);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: getInitialGreeting(),
      timestamp: "Just now",
      voiceAudioAvailable: true,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recognizerRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Update initial greeting when profile user or language changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${profile.preferredHonorific}-${profile.language}`,
        role: "assistant",
        text: getInitialGreeting(),
        timestamp: "Just now",
        voiceAudioAvailable: true,
      },
    ]);
  }, [profile.preferredHonorific, profile.language]);

  // Handle TTS playback
  const speakMessage = (text: string) => {
    setIsSpeaking(true);
    speechHelper.speak(text, {
      rate: profile.voiceSpeed || 0.88,
      language: profile.language,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    speechHelper.stop();
    setIsSpeaking(false);
  };

  // Setup Speech Recognition with auto-submit on completion
  const startListening = () => {
    stopSpeaking();
    latestTranscriptRef.current = "";

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        latestTranscriptRef.current = transcript;
        setInputQuery(transcript);
      },
      (error) => {
        console.warn("Speech error", error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
        // Automatically send the voice question when speech recognition finishes
        const spoken = latestTranscriptRef.current.trim();
        if (spoken) {
          latestTranscriptRef.current = "";
          handleSendMessage(spoken);
        }
      },
      profile.language
    );

    if (!recognizer) {
      setMicSupported(false);
      return;
    }

    recognizerRef.current = recognizer;
    try {
      recognizer.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Cannot start recognition", e);
      setIsListening(false);
    }
  };

  const stopListening = (sendIfPresent = true) => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    if (sendIfPresent) {
      const spoken = latestTranscriptRef.current.trim() || inputQuery.trim();
      if (spoken) {
        latestTranscriptRef.current = "";
        handleSendMessage(spoken);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    stopListening(false);
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    latestTranscriptRef.current = "";
    setIsLoading(true);

    try {
      const historyForAPI = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationHistory: historyForAPI,
          language: profile.language,
          seniorName: profile.preferredHonorific || profile.name,
          seniorContext: seniorContextSummary || "",
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I am right here with you. Please take your time.";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        voiceAudioAvailable: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Proactively speak response for a voice-first experience
      speakMessage(replyText);
    } catch (err) {
      console.error("Fetch chat error", err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "I am listening to you with care. Could you please ask me once more?",
        timestamp: "Now",
        voiceAudioAvailable: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: t.promptSchedule, query: t.promptSchedule },
    { label: t.promptMedicines, query: t.promptMedicines },
    { label: t.promptScam, query: t.promptScam },
    { label: t.promptStory, query: t.promptStory },
    { label: t.promptOtp, query: t.promptOtp },
  ];

  return (
    <div
      id="voice-companion-module"
      className="sanctuary-card rounded-3xl border border-[#dce7de] shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col h-[750px] max-h-[85vh]"
    >
      {/* Module Title Strip */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            मि
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950 tracking-tight">
              {t.modVoiceCompanionTitle}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              {t.chatSubtitle.replace("{name}", profile.preferredHonorific || profile.name)}
            </p>
          </div>
        </div>

        {/* Audio State Badge */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold animate-pulse cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> {t.btnSpeaking}
            </button>
          )}
          <span className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
            Pace: Relaxed ({(profile.voiceSpeed || 0.88) * 100}%)
          </span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              {isAssistant && (
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                  मि
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-2xs ${
                  isAssistant
                    ? "bg-emerald-50/70 border border-emerald-200 text-stone-900"
                    : "bg-emerald-800 text-white font-medium"
                }`}
              >
                <div
                  className={`leading-relaxed whitespace-pre-wrap ${
                    profile.textSize === "extra-large"
                      ? "text-xl sm:text-2xl"
                      : profile.textSize === "large"
                      ? "text-lg sm:text-xl"
                      : "text-base sm:text-lg"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Assistant Controls (Repeat That & Time) */}
                {isAssistant && (
                  <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-stone-500">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100 transition active:scale-95 cursor-pointer shadow-2xs text-xs sm:text-sm min-h-[38px]"
                      title="Listen to this message again"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.btnRepeat}</span>
                    </button>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-10 h-10 rounded-xl bg-stone-700 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-stone-500 py-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center animate-spin">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-base font-medium animate-pulse text-stone-700">
              {profile.language === "Hindi"
                ? "मित्रा विचार कर रहा है..."
                : profile.language === "Spanish"
                ? "Mitraa está pensando con cariño..."
                : profile.language === "Tamil"
                ? "மித்ரா யோசிக்கிறது..."
                : profile.language === "Bengali"
                ? "মিত্রা ভাবছে..."
                : profile.language === "Telugu"
                ? "మిత్రా ఆలోచిస్తోంది..."
                : profile.language === "Marathi"
                ? "मित्रा विचार करत आहे..."
                : profile.language === "Gujarati"
                ? "મિત્રા વિચારી રહ્યું છે..."
                : "Mitraa is thinking with care..."}
            </p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips for Elderly Convenience */}
      <div className="pt-2 pb-3 border-t border-stone-100">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Tap any question to ask Mitraa:
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              className="px-3 py-2 rounded-xl bg-stone-50 hover:bg-emerald-100 text-stone-800 border border-stone-200 font-semibold text-xs sm:text-sm shrink-0 transition active:scale-95 cursor-pointer shadow-2xs min-h-[40px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice-First Input Bar with Big Touch Friendly Buttons */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Big Microphone Button */}
          <button
            type="button"
            id="voice-companion-mic-btn"
            onClick={isListening ? () => stopListening(true) : startListening}
            className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-extrabold transition shadow-md active:scale-95 cursor-pointer shrink-0 ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse"
                : "bg-emerald-700 hover:bg-emerald-800 text-white"
            }`}
            title={isListening ? t.btnListening : t.btnSpeak}
          >
            {isListening ? <MicOff className="w-7 h-7 sm:w-8 sm:h-8" /> : <Mic className="w-7 h-7 sm:w-8 sm:h-8" />}
          </button>

          {/* Text input for seniors who prefer reading/typing */}
          <div className="flex-1 relative">
            <input
              id="voice-companion-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? t.btnListening : t.inputPlaceholder}
              className={`w-full rounded-2xl border-2 px-4 py-3.5 sm:py-4 focus:outline-none transition ${
                isListening
                  ? "border-rose-400 bg-rose-50/50 text-stone-900"
                  : "border-stone-300 focus:border-emerald-600 bg-stone-50/50 text-stone-900"
              } text-base sm:text-lg font-medium`}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            id="voice-companion-send-btn"
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold transition shadow-md active:scale-95 cursor-pointer shrink-0"
            title={t.btnSend}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

        {isListening && (
          <p className="text-center text-rose-600 font-bold text-xs sm:text-sm mt-2 animate-pulse">
            🎙️ {t.btnListening} {t.reassuranceCalm}
          </p>
        )}
      </div>
    </div>
  );
};
