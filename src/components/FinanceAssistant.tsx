import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Volume2,
  FileText,
  ShieldCheck,
  CreditCard,
  Building,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BillItem, SeniorProfile } from "../types";
import { seniorBankingJargon } from "../data/mockSeniorData";
import { speechHelper } from "../utils/speech";

interface FinanceAssistantProps {
  bills: BillItem[];
  onToggleBillStatus: (id: string) => void;
  profile: SeniorProfile;
}

export const FinanceAssistant: React.FC<FinanceAssistantProps> = ({
  bills,
  onToggleBillStatus,
  profile,
}) => {
  const [statementSnippet, setStatementSnippet] = useState(
    "18-SEP-2026 POS TXN #4902 PHARMACY MEDICINES - $24.80 DEBIT (BAL: $3,210.00)"
  );
  const [statementExplanation, setStatementExplanation] = useState<string | null>(
    "This is a normal debit of $24.80 for medicines purchased with your card at the pharmacy counter. Your remaining bank balance is $3,210.00."
  );
  const [selectedJargon, setSelectedJargon] = useState(seniorBankingJargon[0]);

  const handleExplainStatement = () => {
    const text = statementSnippet.toLowerCase();
    let explanation = "";

    if (text.includes("pension") || text.includes("cr")) {
      explanation = "This is a positive credit! Your monthly pension was deposited safely into your account.";
    } else if (text.includes("metro power") || text.includes("electric")) {
      explanation = "This is an authorized payment for your monthly electricity utility bill.";
    } else if (text.includes("pharmacy")) {
      explanation = "This is a legitimate card purchase for medical and pharmacy supplies.";
    } else {
      explanation = "This is a standard account transaction. Always check that the store name matches where you visited.";
    }

    setStatementExplanation(explanation);
    speechHelper.speak(explanation, {
      rate: profile.voiceSpeed,
      language: profile.language,
    });
  };

  return (
    <div id="finance-bills-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Finance & Bill Due-Date Assistant
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              Clear reminders for upcoming bills, easy statement explanation, and jargon-free banking guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Bills Widget */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-xl font-extrabold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-700" />
          Monthly Bills & Due-Dates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bills.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition shadow-2xs ${
                b.status === "paid"
                  ? "bg-stone-50 border-stone-200 opacity-80"
                  : b.status === "due_soon"
                  ? "bg-amber-50/70 border-amber-400"
                  : "bg-white border-stone-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    {b.provider}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                      b.status === "paid"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : b.status === "due_soon"
                        ? "bg-amber-200 text-amber-900 border-amber-400 animate-pulse"
                        : "bg-stone-100 text-stone-800 border-stone-300"
                    }`}
                  >
                    {b.status === "paid" ? "✓ Paid" : b.status === "due_soon" ? "Due Tomorrow" : "Upcoming"}
                  </span>
                </div>

                <h4 className="text-lg font-black text-stone-900">{b.title}</h4>
                <div className="text-2xl font-black text-amber-900 mt-2">{b.amount}</div>
                <p className="text-xs text-stone-600 font-semibold mt-1">
                  Due: <span className="font-bold text-stone-900">{b.dueDate}</span>
                </p>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Acct: {b.accountNumber}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  onClick={() => onToggleBillStatus(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer min-h-[38px] ${
                    b.status === "paid"
                      ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      : "bg-amber-700 text-white hover:bg-amber-800"
                  }`}
                >
                  {b.status === "paid" ? "Mark Unpaid" : "Mark as Paid"}
                </button>

                <button
                  onClick={() =>
                    speechHelper.speak(
                      `${b.title} of ${b.amount} is due ${b.dueDate}. Provider is ${b.provider}.`,
                      { rate: profile.voiceSpeed, language: profile.language }
                    )
                  }
                  className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4 text-amber-800" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Statement Explainer */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-xl font-extrabold text-stone-900 mb-1 flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-700" />
          Explain Bank Statement Charge
        </h3>
        <p className="text-xs text-stone-500 font-medium mb-4">
          Confused by an abbreviated charge on your passbook or SMS? Paste it here for an easy explanation.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={statementSnippet}
            onChange={(e) => setStatementSnippet(e.target.value)}
            placeholder="e.g. POS TXN #4902 METRO POWER - $42.50"
            className="flex-1 p-3.5 rounded-2xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-amber-600 bg-stone-50/70"
          />
          <button
            onClick={handleExplainStatement}
            className="px-6 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-sm sm:text-base shrink-0 transition active:scale-95 cursor-pointer shadow-xs min-h-[48px]"
          >
            Explain in Simple Words
          </button>
        </div>

        {statementExplanation && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm text-amber-950 block">Sathi's Explanation:</span>
              <p className="text-stone-800 text-base font-medium mt-0.5">{statementExplanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Senior Banking Jargon Buster */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-amber-700" />
          <h3 className="text-xl font-extrabold text-stone-900">
            Senior Banking Jargon Buster
          </h3>
        </div>
        <p className="text-xs text-stone-500 font-medium mb-4">
          Tap any modern banking word to understand what it actually means
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {seniorBankingJargon.map((j, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedJargon(j)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[40px] ${
                selectedJargon.term === j.term
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800"
              }`}
            >
              {j.term}
            </button>
          ))}
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-black text-xl text-stone-900">{selectedJargon.term}</h4>
            <button
              onClick={() =>
                speechHelper.speak(
                  `${selectedJargon.term}. Meaning: ${selectedJargon.meaning}. Golden safety rule: ${selectedJargon.goldenRule}`,
                  { rate: profile.voiceSpeed, language: profile.language }
                )
              }
              className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Read Aloud</span>
            </button>
          </div>

          <p className="text-base text-stone-800 font-medium leading-relaxed">
            {selectedJargon.meaning}
          </p>

          <div className="mt-3 p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Golden Rule: {selectedJargon.goldenRule}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
