import React, { useState } from "react";
import {
  HeartPulse,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Volume2,
  Sparkles,
  FileSpreadsheet,
  Activity,
  User,
  MapPin,
  Check,
  RotateCcw,
  PhoneCall,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Medicine, DoctorAppointment, VitalLog, SeniorProfile } from "../types";
import { speechHelper } from "../utils/speech";
import { getTranslation } from "../utils/translations";

interface HealthOrganizerProps {
  medicines: Medicine[];
  onToggleMedicine: (id: string) => void;
  appointments: DoctorAppointment[];
  onAddAppointment?: (apt: DoctorAppointment) => void;
  vitals: VitalLog[];
  onAddVital: (vital: Omit<VitalLog, "id">) => void;
  profile: SeniorProfile;
}

export const HealthOrganizer: React.FC<HealthOrganizerProps> = ({
  medicines,
  onToggleMedicine,
  appointments,
  onAddAppointment,
  vitals,
  onAddVital,
  profile,
}) => {
  const t = getTranslation(profile.language);
  const [activeTab, setActiveTab] = useState<"pills" | "appointments" | "vitals">("pills");
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [sugar, setSugar] = useState<number>(110);
  const [mealContext, setMealContext] = useState<"Fasting" | "Post Meal">("Fasting");
  const [vitalNotes, setVitalNotes] = useState<string>("");
  const [showVitalSuccess, setShowVitalSuccess] = useState<boolean>(false);

  // New appointment builder state
  const [showAptBuilder, setShowAptBuilder] = useState<boolean>(false);
  const [aptDoctor, setAptDoctor] = useState<string>("Dr. Arvind Mehta");
  const [aptSpecialty, setAptSpecialty] = useState<string>("Cardiologist");
  const [aptDate, setAptDate] = useState<string>("Tuesday, Oct 3, 2026");
  const [aptReason, setAptReason] = useState<string>("Blood pressure review & routine checkup");
  const [aptGeneratedPlan, setAptGeneratedPlan] = useState<{
    callScript: string;
    questions: string[];
    whatToBring: string[];
  } | null>(null);

  const handleGenerateAptPlan = () => {
    const honorific = profile.preferredHonorific || profile.name;
    let callScript = "";
    let questions: string[] = [];
    let whatToBring: string[] = [];

    if (profile.language === "Hindi") {
      callScript = `नमस्ते, मैं वरिष्ठ नागरिक ${honorific} के लिए ${aptDoctor} (${aptSpecialty}) से अपॉइंटमेंट बुक करने हेतु कॉल कर रहा/रही हूँ। क्या ${aptDate} के आसपास का सुबह का स्लॉट उपलब्ध है? कारण: ${aptReason}।`;
      questions = [
        "क्या मेरी वर्तमान दवाओं से बीपी और शुगर अच्छी तरह नियंत्रित है?",
        "क्या मुझे अपनी नियमित दिनचर्या या आहार में कोई नया बदलाव करने की आवश्यकता है?",
        "अगली जांच या टेस्ट रिपोर्ट कब आवश्यक होगी?",
      ];
      whatToBring = [
        "वर्तमान दवाओं की मूल पर्ची व सूची",
        "पिछले 2 हफ्तों का बीपी/शुगर डायरी रिकॉर्ड",
        "रीडिंग चश्मा व पहचान पत्र",
      ];
    } else if (profile.language === "Spanish") {
      callScript = `Hola, llamo para reservar una consulta médica con el ${aptDoctor} (${aptSpecialty}) para ${honorific}. ¿Tienen disponibilidad para ${aptDate}? Motivo: ${aptReason}.`;
      questions = [
        "¿Están mis medicamentos actuales manteniendo estables mis valores?",
        "¿Necesito realizarme algún análisis de laboratorio previo?",
        "¿Hay alguna indicación dietética o de caminata que deba ajustar?",
      ];
      whatToBring = [
        "Lista completa de medicamentos actuales",
        "Registro de lecturas recientes de presión y glucosa",
        "Gafas de lectura y tarjeta médica",
      ];
    } else {
      callScript = `Hello, I am calling to book a consultation with ${aptDoctor} (${aptSpecialty}) for senior patient ${honorific}. Is there a morning slot available on ${aptDate}? Reason: ${aptReason}.`;
      questions = [
        "Are my current blood pressure and vital readings safely in target range?",
        "Are there any side effects or timing changes needed for my daily medications?",
        "Do I need any routine lab tests done before my next follow-up?",
      ];
      whatToBring = [
        "Current prescription bottles & medication list",
        "Recent blood pressure and sugar log from Mitraa",
        "Reading glasses and clinic appointment card",
      ];
    }

    setAptGeneratedPlan({ callScript, questions, whatToBring });
    speechHelper.speak(
      profile.language === "Hindi"
        ? "आपके डॉक्टर अपॉइंटमेंट के लिए क्लिनिक स्क्रिप्ट और प्रश्न तैयार हैं।"
        : "Your clinic call script and doctor questions are prepared.",
      { rate: profile.voiceSpeed, language: profile.language }
    );
  };

  const handleSaveAptToSchedule = () => {
    if (!onAddAppointment) return;
    const newApt: DoctorAppointment = {
      id: `apt-${Date.now()}`,
      doctorName: aptDoctor,
      specialty: aptSpecialty,
      date: aptDate,
      time: "10:30 AM",
      location: "City Health Care Clinic, Suite 204",
      questionsToAsk: aptGeneratedPlan
        ? aptGeneratedPlan.questions
        : [
            "Are my morning vital readings stable?",
            "Can I continue my gentle daily walking routine?",
          ],
    };
    onAddAppointment(newApt);
    setShowAptBuilder(false);
    setAptGeneratedPlan(null);
    speechHelper.speak(
      profile.language === "Hindi"
        ? "अपॉइंटमेंट सफलतापूर्वक सहेज लिया गया है।"
        : "Appointment saved to your Mitraa schedule.",
      { rate: profile.voiceSpeed, language: profile.language }
    );
  };

  const pendingMedicines = medicines.filter((m) => !m.takenToday);

  const handleLogVital = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital({
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      bloodSugar: Number(sugar),
      mealContext,
      notes: vitalNotes.trim() || undefined,
    });
    setVitalNotes("");
    setShowVitalSuccess(true);
    setTimeout(() => setShowVitalSuccess(false), 3000);
  };

  const readPillSchedule = () => {
    if (pendingMedicines.length === 0) {
      const msg =
        profile.language === "Hindi"
          ? "आपने आज के लिए अपनी सभी निर्धारित दवाएं ले ली हैं। बहुत बढ़िया!"
          : profile.language === "Spanish"
          ? "Has tomado todos tus medicamentos programados para hoy. ¡Excelente!"
          : "You have taken all your scheduled medicines for today. Wonderful work!";
      speechHelper.speak(msg, {
        rate: profile.voiceSpeed,
        language: profile.language,
      });
      return;
    }
    const pillNames = pendingMedicines.map((m) => `${m.name} (${m.timeSlot})`).join(", ");
    const msg =
      profile.language === "Hindi"
        ? `आज आपके पास ${pendingMedicines.length} दवाएं शेष हैं: ${pillNames}। कृपया इन्हें समय पर लेना न भूलें।`
        : profile.language === "Spanish"
        ? `Te quedan ${pendingMedicines.length} medicamentos hoy: ${pillNames}. Por favor recuerda tomarlos a tiempo.`
        : `You have ${pendingMedicines.length} medicines remaining today: ${pillNames}. Please remember to take them on time.`;
    speechHelper.speak(msg, { rate: profile.voiceSpeed, language: profile.language });
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80)
      return {
        label:
          profile.language === "Hindi"
            ? "उत्कृष्ट / सामान्य"
            : profile.language === "Spanish"
            ? "Óptimo / Normal"
            : "Optimal / Normal",
        color: "text-emerald-700 bg-emerald-100",
      };
    if (sys <= 129 && dia < 80)
      return {
        label:
          profile.language === "Hindi"
            ? "हल्का बढ़ा हुआ"
            : profile.language === "Spanish"
            ? "Elevado"
            : "Elevated",
        color: "text-amber-700 bg-amber-100",
      };
    if (sys <= 139 || dia <= 89)
      return {
        label:
          profile.language === "Hindi"
            ? "स्टेज 1 उच्च"
            : profile.language === "Spanish"
            ? "Etapa 1"
            : "Stage 1",
        color: "text-amber-800 bg-amber-200",
      };
    return {
      label:
        profile.language === "Hindi"
          ? "उच्च / डॉक्टर से परामर्श लें"
          : profile.language === "Spanish"
          ? "Alto / Consulte al médico"
          : "High / Consult Doctor",
      color: "text-rose-700 bg-rose-100",
    };
  };

  return (
    <div id="health-organizer-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {t.modHealthTitle}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-medium">
                {t.modHealthDesc}
              </p>
            </div>
          </div>

          <button
            onClick={readPillSchedule}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-sm border border-emerald-300 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>
              {profile.language === "Hindi"
                ? "दवाओं के रिमाइंडर सुनें"
                : profile.language === "Spanish"
                ? "Escuchar recordatorios"
                : "Read Pill Reminders"}
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-stone-100 pb-1">
          <button
            onClick={() => setActiveTab("pills")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "pills"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            💊 {profile.language === "Hindi" ? "दवाओं का डिब्बा" : profile.language === "Spanish" ? "Pastillero de hoy" : "Today's Pill Box"} ({medicines.filter((m) => m.takenToday).length}/{medicines.length})
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "appointments"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            👨‍⚕️ {profile.language === "Hindi" ? "डॉक्टर अपॉइंटमेंट" : profile.language === "Spanish" ? "Citas médicas" : "Doctor Appointments"} ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("vitals")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "vitals"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            📊 {profile.language === "Hindi" ? "बीपी और शुगर रिकॉर्ड" : profile.language === "Spanish" ? "Signos vitales BP y azúcar" : "BP & Sugar Vitals"}
          </button>
        </div>
      </div>

      {/* Tab 1: Today's Pill Box */}
      {activeTab === "pills" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className={`p-5 rounded-3xl border-2 transition shadow-xs flex flex-col justify-between ${
                  med.takenToday
                    ? "bg-emerald-50/70 border-emerald-300"
                    : "bg-white border-stone-200 hover:border-emerald-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                      {med.timeSlot} • {med.timeLabel}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                        med.takenToday
                          ? "bg-emerald-200 text-emerald-900 border-emerald-400"
                          : "bg-emerald-50 text-emerald-900 border-emerald-300"
                      }`}
                    >
                      {med.takenToday
                        ? profile.language === "Hindi"
                          ? "✓ ली गई"
                          : profile.language === "Spanish"
                          ? "✓ Tomado"
                          : "✓ Taken"
                        : profile.language === "Hindi"
                        ? "बाकी है"
                        : profile.language === "Spanish"
                        ? "Pendiente"
                        : "Pending"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-emerald-700" />
                    {med.name}
                  </h3>
                  <div className="text-sm font-bold text-emerald-800 mt-0.5">{med.dosage}</div>
                  <p className="text-stone-600 text-sm mt-2 font-medium leading-relaxed">
                    {med.instructions}
                  </p>
                  {med.doctorNotes && (
                    <p className="text-xs text-stone-500 mt-1 italic">
                      {profile.language === "Hindi"
                        ? `डॉक्टर की सलाह: ${med.doctorNotes}`
                        : profile.language === "Spanish"
                        ? `Nota del médico: ${med.doctorNotes}`
                        : `Note from doctor: ${med.doctorNotes}`}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">
                    {profile.language === "Hindi"
                      ? `शेष गोलियां: ${med.remainingPills}`
                      : profile.language === "Spanish"
                      ? `Pastillas restantes: ${med.remainingPills}`
                      : `Remaining: ${med.remainingPills} pills`}
                  </span>

                  <button
                    onClick={() => onToggleMedicine(med.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-sm transition active:scale-95 cursor-pointer shadow-xs min-h-[44px] ${
                      med.takenToday
                        ? "bg-stone-200 hover:bg-stone-300 text-stone-800"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {med.takenToday ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>
                          {profile.language === "Hindi"
                            ? "पूर्ववत करें / नहीं ली"
                            : profile.language === "Spanish"
                            ? "Deshacer / No tomada"
                            : "Undo / Mark Not Taken"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>
                          {profile.language === "Hindi"
                            ? "ले ली चिह्नित करें"
                            : profile.language === "Spanish"
                            ? "Marcar como tomada"
                            : "Mark as Taken"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Appointments & Questions */}
      {activeTab === "appointments" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Appointment Assistant Card */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200/90 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900">
                    {profile.language === "Hindi"
                      ? "डॉक्टर अपॉइंटमेंट बुक व तैयारी सहायक"
                      : profile.language === "Spanish"
                      ? "Asistente de reserva y preparación de citas médicas"
                      : "Doctor Appointment Booking & Prep Assistant"}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {profile.language === "Hindi"
                      ? "क्लिनिक कॉल हेतु सरल संवाद, प्रश्न सूची व आवश्यक सामग्री तैयार करें"
                      : profile.language === "Spanish"
                      ? "Guión de llamada a la clínica, preguntas preparadas y qué llevar"
                      : "Generate polite clinic calling script, smart doctor questions & carry checklist"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAptBuilder(!showAptBuilder)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {showAptBuilder
                    ? profile.language === "Hindi"
                      ? "फॉर्म बंद करें"
                      : "Close Form"
                    : profile.language === "Hindi"
                    ? "नया अपॉइंटमेंट तैयार करें"
                    : "Plan New Appointment"}
                </span>
                {showAptBuilder ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showAptBuilder && (
              <div className="mt-6 pt-6 border-t border-emerald-100 space-y-5 animate-fadeIn">
                {/* Specialty Preset Chips */}
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                    {profile.language === "Hindi"
                      ? "विशेषज्ञता चुनें:"
                      : profile.language === "Spanish"
                      ? "Especialidad médica:"
                      : "Choose Specialty:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { spec: "Cardiologist", doc: "Dr. Arvind Mehta", icon: "🫀" },
                      { spec: "Ophthalmologist", doc: "Dr. Sunita Rao", icon: "👁️" },
                      { spec: "General Physician", doc: "Dr. K. S. Raman", icon: "🩺" },
                      { spec: "Orthopedic", doc: "Dr. Ananya Sen", icon: "🦴" },
                    ].map((item) => (
                      <button
                        key={item.spec}
                        type="button"
                        onClick={() => {
                          setAptSpecialty(item.spec);
                          setAptDoctor(item.doc);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                          aptSpecialty === item.spec
                            ? "bg-emerald-100 text-emerald-950 border-emerald-400 shadow-2xs"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.spec} ({item.doc})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {profile.language === "Hindi" ? "डॉक्टर का नाम" : "Doctor Name"}
                    </label>
                    <input
                      type="text"
                      value={aptDoctor}
                      onChange={(e) => setAptDoctor(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {profile.language === "Hindi" ? "तारीख व पसंदीदा समय" : "Preferred Date & Time"}
                    </label>
                    <input
                      type="text"
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-stone-300 font-bold text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi" ? "मुलाकात का कारण / लक्षण" : "Reason for Visit / Symptoms"}
                  </label>
                  <input
                    type="text"
                    value={aptReason}
                    onChange={(e) => setAptReason(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                    placeholder="e.g. Blood pressure review, knee joint pain, prescription renewal"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateAptPlan}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition active:scale-95 shadow-xs cursor-pointer min-h-[46px]"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>
                      {profile.language === "Hindi"
                        ? "क्लिनिक स्क्रिप्ट व प्रश्न तैयार करें"
                        : profile.language === "Spanish"
                        ? "Generar guión y preguntas"
                        : "Generate Clinic Script & Questions"}
                    </span>
                  </button>
                </div>

                {/* Generated Plan Output */}
                {aptGeneratedPlan && (
                  <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-4 animate-fadeIn">
                    {/* Receptionist Calling Script */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                          <PhoneCall className="w-4 h-4 text-emerald-700" />
                          <span>
                            {profile.language === "Hindi"
                              ? "क्लिनिक रिसेप्शनिस्ट से बातचीत हेतु संवाद:"
                              : "Receptionist Calling Script (Read or Show to Clinic):"}
                          </span>
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            speechHelper.speak(aptGeneratedPlan.callScript, {
                              rate: profile.voiceSpeed,
                              language: profile.language,
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t.btnListen}</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-stone-800 bg-white p-3.5 rounded-xl border border-emerald-200/80 leading-relaxed">
                        "{aptGeneratedPlan.callScript}"
                      </p>
                    </div>

                    {/* Questions Checklist */}
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>
                          {profile.language === "Hindi"
                            ? "डॉक्टर से पूछने हेतु 3 महत्वपूर्ण प्रश्न:"
                            : "3 Important Questions to Ask Your Doctor:"}
                        </span>
                      </h4>
                      <ul className="space-y-1 bg-white p-3 rounded-xl border border-emerald-200/80">
                        {aptGeneratedPlan.questions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-stone-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to Bring Checklist */}
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>
                          {profile.language === "Hindi"
                            ? "साथ ले जाने वाली आवश्यक सामग्री:"
                            : "Checklist: What to Carry to the Clinic:"}
                        </span>
                      </h4>
                      <ul className="space-y-1 bg-white p-3 rounded-xl border border-emerald-200/80">
                        {aptGeneratedPlan.whatToBring.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-stone-800">
                            <span className="text-emerald-700 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Save to Mitraa Appointments Button */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSaveAptToSchedule}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition active:scale-95 cursor-pointer min-h-[46px]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>
                          {profile.language === "Hindi"
                            ? "मेरे अपॉइंटमेंट शेड्यूल में जोड़ें"
                            : "Confirm & Add to My Appointments"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* List of Existing Appointments */}
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {apt.specialty}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{apt.doctorName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-stone-900">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      {apt.date} at {apt.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      {apt.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    speechHelper.speak(
                      `Appointment with ${apt.doctorName} on ${apt.date}. Questions to ask include: ${apt.questionsToAsk.join(". ")}`,
                      { rate: profile.voiceSpeed, language: profile.language }
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer min-h-[40px]"
                >
                  <Volume2 className="w-4 h-4 text-stone-700" />
                  <span>{t.btnListen}</span>
                </button>
              </div>

              {/* Questions to Ask Doctor Checklist */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-emerald-950 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  {profile.language === "Hindi"
                    ? "डॉक्टर से पूछने हेतु प्रश्न सूची:"
                    : profile.language === "Spanish"
                    ? "Preguntas preparadas para esta visita:"
                    : "Questions Prepared for This Visit:"}
                </h4>
                <ul className="space-y-1.5">
                  {apt.questionsToAsk.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-medium text-stone-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: BP & Blood Sugar Log */}
      {activeTab === "vitals" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Fast Logger Form */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h3 className="text-xl font-extrabold text-stone-900 mb-1 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-700" />
              {profile.language === "Hindi"
                ? "रक्तचाप (बीपी) या शुगर दर्ज करें"
                : profile.language === "Spanish"
                ? "Registrar presión arterial o azúcar en sangre"
                : "Log Blood Pressure or Blood Sugar"}
            </h3>
            <p className="text-xs text-stone-500 font-medium mb-4">
              {profile.language === "Hindi"
                ? "अपने घरेलू मॉनिटर से सुबह की रीडिंग दर्ज करें"
                : profile.language === "Spanish"
                ? "Ingresa la lectura de la mañana de tu monitor casero"
                : "Enter your morning reading from your home monitor"}
            </p>

            <form onSubmit={handleLogVital} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi"
                      ? "सिस्टोलिक बीपी (ऊपर की संख्या)"
                      : profile.language === "Spanish"
                      ? "PA Sistólica (Número superior)"
                      : "Systolic BP (Top Number)"}
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    min={70}
                    max={220}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">
                    {profile.language === "Hindi"
                      ? "सामान्य: लगभग 120"
                      : profile.language === "Spanish"
                      ? "Estándar: aprox. 120"
                      : "Standard: around 120"}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi"
                      ? "डायस्टोलिक बीपी (नीचे की संख्या)"
                      : profile.language === "Spanish"
                      ? "PA Diastólica (Número inferior)"
                      : "Diastolic BP (Bottom Number)"}
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    min={40}
                    max={140}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">
                    {profile.language === "Hindi"
                      ? "सामान्य: लगभग 80"
                      : profile.language === "Spanish"
                      ? "Estándar: aprox. 80"
                      : "Standard: around 80"}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi"
                      ? "ब्लड शुगर (mg/dL)"
                      : profile.language === "Spanish"
                      ? "Glucosa en sangre (mg/dL)"
                      : "Blood Sugar (mg/dL)"}
                  </label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    min={50}
                    max={400}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">
                    {profile.language === "Hindi"
                      ? "खाली पेट: 80 - 120"
                      : profile.language === "Spanish"
                      ? "En ayunas: 80 - 120"
                      : "Fasting: 80 - 120"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi"
                      ? "माप का समय"
                      : profile.language === "Spanish"
                      ? "Momento de la medición"
                      : "Reading Timing"}
                  </label>
                  <select
                    value={mealContext}
                    onChange={(e) => setMealContext(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Fasting">
                      {profile.language === "Hindi"
                        ? "खाली पेट (नाश्ते से पहले)"
                        : profile.language === "Spanish"
                        ? "En ayunas (Antes del desayuno)"
                        : "Fasting (Before Breakfast)"}
                    </option>
                    <option value="Post Meal">
                      {profile.language === "Hindi"
                        ? "भोजन के बाद (2 घंटे बाद)"
                        : profile.language === "Spanish"
                        ? "Después de comer (2 horas después)"
                        : "Post Meal (2 hrs after food)"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {profile.language === "Hindi"
                      ? "कैफियत / कैसा महसूस हुआ?"
                      : profile.language === "Spanish"
                      ? "Notas (¿Cómo te sentiste?)"
                      : "Notes (How did you feel?)"}
                  </label>
                  <input
                    type="text"
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder={
                      profile.language === "Hindi"
                        ? "जैसे: तरोताजा महसूस किया, सुबह की सैर पूरी की"
                        : profile.language === "Spanish"
                        ? "ej. Con energía, caminata matutina realizada"
                        : "e.g. Felt energetic, light morning walk done"
                    }
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {showVitalSuccess ? (
                  <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5" />
                    {profile.language === "Hindi"
                      ? "रीडिंग सफलतापूर्वक सहेजी गई!"
                      : profile.language === "Spanish"
                      ? "¡Lectura guardada con éxito!"
                      : "Reading saved successfully!"}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
                >
                  {profile.language === "Hindi"
                    ? "स्वास्थ्य रीडिंग सहेजें"
                    : profile.language === "Spanish"
                    ? "Guardar lectura de signos vitales"
                    : "Save Vitals Reading"}
                </button>
              </div>
            </form>
          </div>

          {/* Past Vitals History */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h4 className="font-black text-lg text-stone-900 mb-3">
              {profile.language === "Hindi"
                ? "हाल की स्वास्थ्य रीडिंग"
                : profile.language === "Spanish"
                ? "Lecturas de salud recientes"
                : "Recent Health Readings"}
            </h4>
            <div className="space-y-3">
              {vitals.map((v) => {
                const status = getBPStatus(v.systolicBP, v.diastolicBP);
                return (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-500 block">
                        {v.date} {profile.language === "Hindi" ? "को" : profile.language === "Spanish" ? "a las" : "at"} {v.time}
                      </span>
                      <div className="font-extrabold text-lg text-stone-900 mt-0.5">
                        BP: {v.systolicBP}/{v.diastolicBP} mmHg{" "}
                        {v.bloodSugar && (
                          <span className="text-sm font-semibold text-stone-700 ml-2">
                            • Sugar: {v.bloodSugar} mg/dL ({v.mealContext})
                          </span>
                        )}
                      </div>
                      {v.notes && (
                        <p className="text-xs text-stone-600 mt-1 font-medium">{v.notes}</p>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
