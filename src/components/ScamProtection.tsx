import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Volume2,
  Sparkles,
  PhoneCall,
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { SeniorProfile, ScamCheckResult } from "../types";
import { sampleScams } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";

interface ScamProtectionProps {
  profile: SeniorProfile;
}

export const ScamProtection: React.FC<ScamProtectionProps> = ({ profile }) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>("");
  const [messageText, setMessageText] = useState<string>(sampleScams[0].text);
  const [senderInfo, setSenderInfo] = useState<string>(sampleScams[0].sender);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);

  // Before you pay interactive checklist
  const [checklist, setChecklist] = useState({
    knowPerson: false,
    verifiedVoice: false,
    noRush: false,
    noOtpAsked: false,
  });

  const allChecklistPassed =
    checklist.knowPerson &&
    checklist.verifiedVoice &&
    checklist.noRush &&
    checklist.noOtpAsked;

  const handleSelectSample = (sample: typeof sampleScams[0]) => {
    setSelectedSampleId(sample.id);
    setMessageText(sample.text);
    setSenderInfo(sample.sender);
    setResult(null);
  };

  const handleCheckScam = async () => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/companion/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageText,
          sender: senderInfo,
          language: profile.language,
        }),
      });

      const data: ScamCheckResult = await response.json();
      setResult(data);

      if (data.headline) {
        speechHelper.speak(`${data.headline}. ${data.explanation}`, {
          rate: profile.voiceSpeed,
          language: profile.language,
        });
      }
    } catch (err) {
      console.error("Scam check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="scam-protection-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Safety & Scam Protection Shield
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              Check suspicious SMS, WhatsApp, emails, or fake lottery and electricity disconnect threats before doing anything.
            </p>
          </div>
        </div>

        {/* Pre-loaded Sample Scam Messages */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Try with real-world scam messages sent to seniors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {sampleScams.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-3 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                  selectedSampleId === s.id
                    ? "bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs"
                    : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium"
                }`}
              >
                <span
                  className={`text-xs font-extrabold uppercase block mb-0.5 ${
                    s.isScam ? "text-rose-600" : "text-emerald-700"
                  }`}
                >
                  {s.isScam ? "⚠️ Common Scam" : "✅ Safe Alert"}
                </span>
                <span className="text-xs font-bold text-stone-900 block truncate">
                  {s.type}
                </span>
                <span className="text-[11px] text-stone-500">From: {s.sender}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/3">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Sender Phone or Name (Optional):
              </label>
              <input
                type="text"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                placeholder="e.g. +1 555-0199 or Unknown"
                className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-800 focus:outline-none focus:border-rose-500 bg-stone-50/60"
              />
            </div>
            <div className="w-full sm:w-2/3">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Message Content (Paste the SMS, WhatsApp or email):
              </label>
              <input
                type="text"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  setSelectedSampleId("");
                }}
                placeholder="Paste the suspicious text here..."
                className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-800 focus:outline-none focus:border-rose-500 bg-stone-50/60"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleCheckScam}
              disabled={isLoading || !messageText.trim()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-extrabold text-base transition shadow-md active:scale-95 cursor-pointer min-h-[48px]"
            >
              <ShieldAlert className="w-5 h-5 text-yellow-300" />
              <span>{isLoading ? "Analyzing Risk..." : "Check If This Is A Scam"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result Banner */}
      {result && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-3 shadow-lg space-y-5 animate-fadeIn ${
            result.verdict === "DANGEROUS_SCAM"
              ? "bg-rose-50/90 border-rose-500 text-stone-900"
              : result.verdict === "CAUTION"
              ? "bg-amber-50 border-amber-400 text-stone-900"
              : "bg-emerald-50 border-emerald-400 text-stone-900"
          }`}
        >
          {/* Header Verdict */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              {result.verdict === "DANGEROUS_SCAM" ? (
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  <XCircle className="w-9 h-9" />
                </div>
              ) : result.verdict === "CAUTION" ? (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  <AlertTriangle className="w-9 h-9" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
              )}

              <div>
                <span
                  className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                    result.verdict === "DANGEROUS_SCAM"
                      ? "bg-rose-200 text-rose-900 border-rose-400"
                      : result.verdict === "CAUTION"
                      ? "bg-amber-200 text-amber-900 border-amber-400"
                      : "bg-emerald-200 text-emerald-900 border-emerald-400"
                  }`}
                >
                  {result.verdict === "DANGEROUS_SCAM"
                    ? "High Danger — Scam Detected"
                    : result.verdict === "CAUTION"
                    ? "Caution Advised"
                    : "Looks Safe"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1 leading-tight">
                  {result.headline}
                </h3>
              </div>
            </div>

            <button
              onClick={() =>
                speechHelper.speak(`${result.headline}. ${result.explanation}`, {
                  rate: profile.voiceSpeed,
                  language: profile.language,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-sm shadow-2xs cursor-pointer min-h-[44px]"
            >
              <Volume2 className="w-4 h-4 text-stone-700" />
              <span>Read Warning</span>
            </button>
          </div>

          {/* Explanation in plain words */}
          <div className="p-4 bg-white/90 rounded-2xl border border-stone-200 shadow-2xs">
            <h4 className="font-extrabold text-base text-stone-900 mb-1">
              Why this message is suspicious:
            </h4>
            <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Detected Red Flags */}
          {result.redFlags.length > 0 && (
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-rose-900 mb-2">
                Tricks & Red Flags Detected:
              </h4>
              <div className="space-y-1.5">
                {result.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-rose-100/70 border border-rose-200 rounded-xl text-sm font-bold text-rose-950"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Advice: What you should do */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h4 className="font-black text-lg text-stone-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              What You Should Do Right Now:
            </h4>
            <ol className="space-y-2">
              {result.whatToDo.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-stone-800 font-bold text-base leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-black">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* "Before You Pay" Interactive Checklist & Golden OTP Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive "Before You Pay" Checklist */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-stone-900">
                "Before You Pay" Senior Safety Check
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Answer these 4 questions before transferring any money
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.knowPerson}
                onChange={(e) =>
                  setChecklist({ ...checklist, knowPerson: e.target.checked })
                }
                className="w-5 h-5 mt-0.5 accent-amber-600 rounded"
              />
              <span className="text-sm font-semibold text-stone-800">
                1. Do you personally know the person or official receiving the money?
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.verifiedVoice}
                onChange={(e) =>
                  setChecklist({ ...checklist, verifiedVoice: e.target.checked })
                }
                className="w-5 h-5 mt-0.5 accent-amber-600 rounded"
              />
              <span className="text-sm font-semibold text-stone-800">
                2. If it's a family member asking for money, did you call them on their regular phone to verify their voice?
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.noRush}
                onChange={(e) =>
                  setChecklist({ ...checklist, noRush: e.target.checked })
                }
                className="w-5 h-5 mt-0.5 accent-amber-600 rounded"
              />
              <span className="text-sm font-semibold text-stone-800">
                3. Are you feeling calm and NOT being rushed with threats of "pay within 10 minutes"?
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.noOtpAsked}
                onChange={(e) =>
                  setChecklist({ ...checklist, noOtpAsked: e.target.checked })
                }
                className="w-5 h-5 mt-0.5 accent-amber-600 rounded"
              />
              <span className="text-sm font-semibold text-stone-800">
                4. Confirmed that NO ONE has asked for your bank OTP, password, or PIN?
              </span>
            </label>
          </div>

          <div
            className={`p-3.5 rounded-2xl text-center font-bold text-sm transition ${
              allChecklistPassed
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-amber-50 text-amber-900 border border-amber-300"
            }`}
          >
            {allChecklistPassed ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" /> All 4 safety checks verified. Safe to proceed with caution.
              </span>
            ) : (
              <span>⚠️ Complete all 4 checkmarks above before sending any payment.</span>
            )}
          </div>
        </div>

        {/* The Golden OTP Rule Card */}
        <div className="bg-gradient-to-br from-amber-600 to-stone-900 text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4" /> Lifetime Golden Rule
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              The Golden Rule of Your Bank OTP & PIN
            </h3>
            <p className="text-amber-100 text-base sm:text-lg mt-3 leading-relaxed font-medium">
              No real bank manager, police officer, or government official will{" "}
              <span className="font-black text-amber-300 underline">EVER</span> call or message you asking for:
            </p>

            <ul className="mt-4 space-y-2 text-sm sm:text-base font-bold text-white">
              <li className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Your 4 or 6 digit OTP SMS code</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Your ATM or Net Banking Password</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Your 3-digit CVV on the back of your card</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-500/30 text-xs text-amber-200 font-medium">
            If anyone asks for these numbers over phone or WhatsApp, hang up immediately and tell your family or Sathi.
          </div>
        </div>
      </div>
    </div>
  );
};
