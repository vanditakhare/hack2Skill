import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Volume2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  DollarSign,
  Calendar,
} from "lucide-react";
import { SeniorProfile, SimplifiedDocResult } from "../types";
import { sampleDocuments } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";

interface DocumentSimplifierProps {
  profile: SeniorProfile;
}

export const DocumentSimplifier: React.FC<DocumentSimplifierProps> = ({ profile }) => {
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [documentText, setDocumentText] = useState<string>(sampleDocuments[0].preview);
  const [docType, setDocType] = useState<string>("bill");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimplifiedDocResult | null>(null);

  const handleSelectSample = (sample: typeof sampleDocuments[0]) => {
    setSelectedSample(sample.id);
    setDocumentText(sample.preview);
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocumentText(content);
      setSelectedSample("");
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleSimplify = async () => {
    if (!documentText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/companion/simplify-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          docType,
          language: profile.language,
        }),
      });

      const data: SimplifiedDocResult = await response.json();
      setResult(data);

      // Speak summary automatically for voice accessibility
      if (data.summary) {
        speechHelper.speak(
          `${data.summary}. ${data.actionRequired}. ${data.safeAdvice}`,
          { rate: profile.voiceSpeed, language: profile.language }
        );
      }
    } catch (error) {
      console.error("Failed to simplify document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadResult = () => {
    if (!result) return;
    const textToRead = `Here is what this document means: ${result.summary}. Do you need to do anything? ${result.actionRequired}. Key points: ${result.keyPoints.join(". ")}. Safety advice: ${result.safeAdvice}`;
    speechHelper.speak(textToRead, {
      rate: profile.voiceSpeed || 0.88,
      language: profile.language,
    });
  };

  return (
    <div id="document-simplifier-module" className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Document & Letter Simplifier
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              We translate confusing bills, medical papers, bank letters & government circulars into simple plain language.
            </p>
          </div>
        </div>

        {/* Try with Sample Documents */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Try with an example document (Tap any to test):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {sampleDocuments.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-3 rounded-2xl border text-left transition active:scale-95 cursor-pointer min-h-[48px] ${
                  selectedSample === s.id
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                    : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium"
                }`}
              >
                <span className="text-xs font-bold text-emerald-700 block uppercase mb-0.5">
                  {s.tag}
                </span>
                <span className="text-sm font-semibold line-clamp-1">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input / Upload Area */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-700">
              Document Text (Paste or Edit text below):
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 cursor-pointer transition">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document (.txt)</span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            value={documentText}
            onChange={(e) => {
              setDocumentText(e.target.value);
              setSelectedSample("");
            }}
            rows={5}
            placeholder="Paste any confusing letter, bill text, or hospital discharge note here..."
            className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-emerald-600 focus:outline-none text-base text-stone-800 font-medium leading-relaxed bg-stone-50/50"
          />

          <div className="flex items-center justify-end">
            <button
              onClick={handleSimplify}
              disabled={isLoading || !documentText.trim()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold text-base transition shadow-md active:scale-95 cursor-pointer min-h-[48px]"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>{isLoading ? "Reading with Mitraa..." : "Explain This Document Simply"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Output Section */}
      {result && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
          {/* Top Result Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Mitraa Plain-Language Explanation
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                What This Document Means For You
              </h3>
            </div>

            <button
              onClick={handleReadResult}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm cursor-pointer shadow-2xs min-h-[44px]"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>Listen to Explanation</span>
            </button>
          </div>

          {/* Core Answers in 3 Senior-Friendly Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: What is it? */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                1. What is this document?
              </span>
              <p className="text-lg font-bold text-stone-900 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Card 2: Do I need to pay or do anything? */}
            <div
              className={`p-5 rounded-2xl border ${
                result.isUrgent
                  ? "bg-emerald-100/70 border-emerald-400"
                  : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                2. Do I need to pay or take action?
              </span>
              <p
                className={`text-lg font-black leading-relaxed ${
                  result.isUrgent ? "text-emerald-950" : "text-emerald-900"
                }`}
              >
                {result.actionRequired}
              </p>

              {(result.amountDue !== "None" || result.dueDate !== "None") && (
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 border-t border-stone-200 text-sm">
                  {result.amountDue && result.amountDue !== "None" && (
                    <div className="flex items-center gap-1 font-extrabold text-stone-900">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      Amount: {result.amountDue}
                    </div>
                  )}
                  {result.dueDate && result.dueDate !== "None" && (
                    <div className="flex items-center gap-1 font-extrabold text-stone-900">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      Due Date: {result.dueDate}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Key Points in Simple Words */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <h4 className="font-extrabold text-base text-emerald-950 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Key Details in Plain Language:
            </h4>
            <ul className="space-y-2">
              {result.keyPoints.map((pt, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-stone-800 text-base font-medium leading-relaxed"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Reassurance Advice */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-stone-900">Mitraa Reassurance Note:</h5>
              <p className="text-sm text-stone-600 font-medium mt-0.5">{result.safeAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
