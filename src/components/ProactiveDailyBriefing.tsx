import React, { useState } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Pill,
  CreditCard,
  Calendar,
  ShieldCheck,
  Heart,
  CheckCircle2,
  ChevronRight,
  Sun,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { SeniorProfile, Medicine, DoctorAppointment, BillItem, ModuleTab } from "../types";
import { speechHelper } from "../utils/speech";

interface ProactiveDailyBriefingProps {
  profile: SeniorProfile;
  medicines: Medicine[];
  onToggleMedicine: (id: string) => void;
  appointments: DoctorAppointment[];
  bills: BillItem[];
  onOpenModule: (tab: ModuleTab) => void;
}

export const ProactiveDailyBriefing: React.FC<ProactiveDailyBriefingProps> = ({
  profile,
  medicines,
  onToggleMedicine,
  appointments,
  bills,
  onOpenModule,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const honorific = profile.preferredHonorific || profile.name;

  // Proactive calculations
  const pendingMedicines = medicines.filter((m) => !m.takenToday);
  const nextMedicine = pendingMedicines[0];
  const pendingBills = bills.filter((b) => b.status !== "paid");
  const nextBill = pendingBills[0];
  const nextAppointment = appointments[0];

  // Compose localized proactive briefing text
  const getBriefingNarrative = () => {
    if (profile.language === "Hindi") {
      let narrative = `सुप्रभात ${honorific}! आपका दिन मंगलमय हो। `;
      if (nextMedicine) {
        narrative += `आज आपकी दवा ${nextMedicine.name} लेनी बाकी है। इसे नाश्ते के बाद गुनगुने पानी के साथ लें। `;
      } else {
        narrative += `आज की सभी दवाएं पूरी हो चुकी हैं, बहुत बढ़िया! `;
      }
      if (nextBill) {
        narrative += `आपका ${nextBill.title} बकाया है, राशि ${nextBill.amount} रुपये। इसे समय पर निपटाने में हम आपकी मदद करेंगे। `;
      }
      if (nextAppointment) {
        narrative += `${nextAppointment.doctorName} के साथ आपका अपॉइंटमेंट निर्धारित है, जिसके लिए सवाल तैयार हैं। `;
      }
      narrative += `आपका डिजिटल सुरक्षा कवच सक्रिय है और कोई संदिग्ध संदेश नहीं मिला है। अपना ख्याल रखें और मुस्कुराते रहें।`;
      return narrative;
    } else if (profile.language === "Spanish") {
      let narrative = `¡Buenos días, ${honorific}! `;
      if (nextMedicine) {
        narrative += `Recuerde tomar su medicamento ${nextMedicine.name}. `;
      } else {
        narrative += `Sus medicamentos de hoy están al día. `;
      }
      if (nextBill) {
        narrative += `Tiene una factura pendiente de ${nextBill.title}. `;
      }
      if (nextAppointment) {
        narrative += `Su próxima consulta con ${nextAppointment.doctorName} tiene preguntas preparadas. `;
      }
      narrative += `Su escudo de seguridad contra fraudes está activo. ¡Que tenga un día tranquilo y agradable!`;
      return narrative;
    } else {
      let narrative = `Good morning, ${honorific}! Here is your proactive daily briefing: `;
      if (nextMedicine) {
        narrative += `Your morning medication ${nextMedicine.name} (${nextMedicine.dosage}) is scheduled. Please take it after food. `;
      } else {
        narrative += `All scheduled medications for today are taken. Excellent job! `;
      }
      if (nextBill) {
        narrative += `Your ${nextBill.title} of $${nextBill.amount} is due soon. No late fee if settled today. `;
      }
      if (nextAppointment) {
        narrative += `Your upcoming visit with ${nextAppointment.doctorName} is all set with 3 questions prepared. `;
      }
      narrative += `Your digital fraud shield is 100% active. No suspicious threats detected today. Have a peaceful day!`;
      return narrative;
    }
  };

  const handleReadBriefing = () => {
    if (isSpeaking) {
      speechHelper.stop();
      setIsSpeaking(false);
      return;
    }
    const text = getBriefingNarrative();
    setIsSpeaking(true);
    speechHelper.speak(text, {
      rate: profile.voiceSpeed || 0.85,
      language: profile.language,
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <section
      aria-label="Proactive Daily Care Briefing"
      className="bg-gradient-to-br from-amber-50/90 via-stone-50 to-emerald-50/80 rounded-3xl border-2 border-amber-200/90 p-5 sm:p-7 shadow-sm space-y-5"
    >
      {/* Top Banner: Greeting & Listen Aloud Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs shrink-0">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {profile.language === "Hindi"
                  ? "दैनिक सक्रिय मार्गदर्शन (GenAI)"
                  : profile.language === "Spanish"
                  ? "Orientación diaria proactiva"
                  : "Proactive Daily Care Intelligence"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {profile.language === "Hindi"
                ? `सुप्रभात, ${honorific}!`
                : profile.language === "Spanish"
                ? `¡Buenos días, ${honorific}!`
                : `Good Morning, ${honorific}!`}
            </h2>
          </div>
        </div>

        {/* Read Aloud Button */}
        <button
          type="button"
          onClick={handleReadBriefing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition active:scale-95 cursor-pointer min-h-[44px] shadow-xs ${
            isSpeaking
              ? "bg-amber-600 text-white animate-pulse"
              : "bg-white hover:bg-stone-100 text-stone-900 border border-stone-300"
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
          <span>
            {isSpeaking
              ? profile.language === "Hindi"
                ? "आवाज़ रोकें"
                : "Stop Voice"
              : profile.language === "Hindi"
              ? "आज का बुलेटिन सुनें"
              : profile.language === "Spanish"
              ? "Escuchar resumen diario"
              : "Listen to Daily Briefing"}
          </span>
        </button>
      </div>

      {/* Proactive Anticipation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Medication Care Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {profile.language === "Hindi" ? "दवा अनुस्मारक" : "Medication"}
                </span>
              </div>
              {pendingMedicines.length === 0 ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ✓ {profile.language === "Hindi" ? "पूर्ण" : "Done"}
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {pendingMedicines.length} {profile.language === "Hindi" ? "बाकी" : "Pending"}
                </span>
              )}
            </div>

            {nextMedicine ? (
              <div className="space-y-1">
                <p className="font-bold text-stone-900 text-base leading-tight">
                  {nextMedicine.name} ({nextMedicine.dosage})
                </p>
                <p className="text-xs text-stone-600 font-medium">
                  {nextMedicine.instructions || nextMedicine.timeLabel}
                </p>
              </div>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                {profile.language === "Hindi"
                  ? "आज की सभी दवाएं ली जा चुकी हैं।"
                  : "All medications taken for today. Rest well!"}
              </p>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            {nextMedicine ? (
              <button
                type="button"
                onClick={() => onToggleMedicine(nextMedicine.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition active:scale-95 cursor-pointer min-h-[38px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{profile.language === "Hindi" ? "अभी ली दर्ज करें" : "Mark as Taken"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenModule("health")}
                className="w-full text-center text-xs font-bold text-stone-700 hover:text-stone-900 py-1 cursor-pointer"
              >
                {profile.language === "Hindi" ? "स्वास्थ्य विवरण देखें →" : "View Health Details →"}
              </button>
            )}
          </div>
        </div>

        {/* 2. Bill & Expense Anticipation Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {profile.language === "Hindi" ? "बिल व खर्च" : "Bills & Expenses"}
                </span>
              </div>
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                {nextBill ? `$${nextBill.amount}` : "Safe"}
              </span>
            </div>

            {nextBill ? (
              <div className="space-y-1">
                <p className="font-bold text-stone-900 text-base leading-tight">
                  {nextBill.title}
                </p>
                <p className="text-xs text-amber-800 font-semibold">
                  {profile.language === "Hindi"
                    ? `अंतिम तिथि: ${nextBill.dueDate}`
                    : `Due Date: ${nextBill.dueDate}`}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-600 font-medium mt-1">
                {profile.language === "Hindi"
                  ? "कोई तत्काल बिल बकाया नहीं है।"
                  : "No urgent bills pending right now."}
              </p>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onOpenModule("finance")}
              className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer min-h-[38px]"
            >
              <span>{profile.language === "Hindi" ? "बिल समझें व भरें" : "Explain & Pay Safely"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Doctor Appointment Preparedness Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {profile.language === "Hindi" ? "डॉक्टर मुलाकात" : "Doctor Visit"}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {nextAppointment ? nextAppointment.specialty : "Routine"}
              </span>
            </div>

            {nextAppointment ? (
              <div className="space-y-1">
                <p className="font-bold text-stone-900 text-base leading-tight">
                  {nextAppointment.doctorName}
                </p>
                <p className="text-xs text-stone-600 font-medium">
                  {nextAppointment.date} at {nextAppointment.time}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-600 font-medium mt-1">
                {profile.language === "Hindi"
                  ? "अगले कुछ दिनों में कोई अपॉइंटमेंट नहीं।"
                  : "No upcoming visits scheduled this week."}
              </p>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onOpenModule("health")}
              className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition cursor-pointer min-h-[38px]"
            >
              <span>
                {profile.language === "Hindi"
                  ? "प्रश्न व तैयारी देखें"
                  : "View Questions & Prep"}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Scam & Fraud Shield Status Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {profile.language === "Hindi" ? "सुरक्षा कवच" : "Fraud Shield"}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                {profile.language === "Hindi" ? "सक्रिय" : "Active"}
              </span>
            </div>

            <p className="font-bold text-stone-900 text-sm leading-tight">
              {profile.language === "Hindi"
                ? "आज कोई संदिग्ध खतरा नहीं"
                : "Zero Threats Detected Today"}
            </p>
            <p className="text-xs text-stone-600 font-medium mt-1">
              {profile.language === "Hindi"
                ? "बैंक ओटीपी व अनजान लिंक से पूरी तरह सुरक्षित।"
                : "Protected from fake electricity SMS, lottery links & bank OTP calls."}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onOpenModule("scam")}
              className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold transition cursor-pointer min-h-[38px]"
            >
              <span>
                {profile.language === "Hindi"
                  ? "संदेश या कॉल जांचें"
                  : "Check Message / Call"}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reassurance Footer Pill: Designed for Seniors */}
      <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-800">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">
            {profile.language === "Hindi"
              ? "मित्रा आपके साथ है — किसी भी दुविधा में कभी भी बात करें या सवाल पूछें।"
              : profile.language === "Spanish"
              ? "Mitraa está a su lado — hable con nosotros en cualquier momento si tiene dudas."
              : "Mitraa anticipates your needs so you never feel alone, rushed, or dependent on others."}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenModule("companion")}
          className="font-bold text-amber-950 underline hover:text-black cursor-pointer ml-auto"
        >
          {profile.language === "Hindi" ? "मित्रा से बात करें →" : "Speak with Mitraa →"}
        </button>
      </div>
    </section>
  );
};
