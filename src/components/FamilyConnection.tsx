import React, { useState } from "react";
import {
  Users,
  PhoneCall,
  MessageCircle,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Send,
  Bell,
  Sparkles,
  UserCheck,
  Clock,
  Pill,
  Activity,
} from "lucide-react";
import { TrustedContact, SeniorProfile, Medicine } from "../types";
import { speechHelper } from "../utils/speech";
import { getTranslation } from "../utils/translations";

interface FamilyConnectionProps {
  contacts: TrustedContact[];
  profile: SeniorProfile;
  medicines: Medicine[];
}

export const FamilyConnection: React.FC<FamilyConnectionProps> = ({
  contacts,
  profile,
  medicines,
}) => {
  const t = getTranslation(profile.language);
  const [safeCheckInSent, setSafeCheckInSent] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<string>("08:30 AM Today");
  const [activeView, setActiveView] = useState<"senior" | "caregiver">("senior");
  const [customHelpRequest, setCustomHelpRequest] = useState("");
  const [helpSentMessage, setHelpSentMessage] = useState<string | null>(null);

  const pillsTakenToday = medicines.filter((m) => m.takenToday).length;
  const pillAdherenceRate = Math.round((pillsTakenToday / (medicines.length || 1)) * 100);

  const handleSendSafeCheckIn = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setLastCheckInTime(`${timeNow}`);
    setSafeCheckInSent(true);
    const msg =
      profile.language === "Hindi"
        ? `मैंने ${profile.emergencyContact.name} को सूचित कर दिया है कि आप सुरक्षित, स्वस्थ और प्रसन्न हैं!`
        : profile.language === "Spanish"
        ? `He notificado a ${profile.emergencyContact.name} que estás a salvo, cómodo y bien!`
        : `I have notified ${profile.emergencyContact.name} that you are safe, comfortable, and well!`;
    speechHelper.speak(msg, {
      rate: profile.voiceSpeed,
      language: profile.language,
    });
    setTimeout(() => setSafeCheckInSent(false), 5000);
  };

  const handleSendHelpPreset = (presetText: string) => {
    setHelpSentMessage(
      profile.language === "Hindi"
        ? `${profile.emergencyContact.name} को भेजा गया: "${presetText}"`
        : profile.language === "Spanish"
        ? `Enviado a ${profile.emergencyContact.name}: "${presetText}"`
        : `Sent to ${profile.emergencyContact.name}: "${presetText}"`
    );
    const voiceMsg =
      profile.language === "Hindi"
        ? `परिवार को संदेश भेजा गया: ${presetText}`
        : profile.language === "Spanish"
        ? `Mensaje enviado a tu familia: ${presetText}`
        : `Message sent to your family: ${presetText}`;
    speechHelper.speak(voiceMsg, {
      rate: profile.voiceSpeed,
      language: profile.language,
    });
    setTimeout(() => setHelpSentMessage(null), 4500);
  };

  return (
    <div id="family-connection-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {t.modFamilyTitle}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-medium">
                {t.modFamilyDesc}
              </p>
            </div>
          </div>

          {/* Toggle between Senior View & Caregiver Dashboard View */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveView("senior")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer min-h-[40px] ${
                activeView === "senior"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {profile.language === "Hindi"
                ? "वरिष्ठ दृश्य"
                : profile.language === "Spanish"
                ? "Vista senior"
                : "Senior View"}
            </button>
            <button
              onClick={() => setActiveView("caregiver")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-1.5 min-h-[40px] ${
                activeView === "caregiver"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>
                {profile.language === "Hindi"
                  ? "देखभालकर्ता डैशबोर्ड"
                  : profile.language === "Spanish"
                  ? "Panel de cuidador"
                  : "Caregiver Dashboard"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeView === "senior" ? (
        <div className="space-y-6 animate-fadeIn">
          {/* 1-Tap "I Am Safe" Check-In Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider">
                {profile.language === "Hindi"
                  ? "मन की शांति"
                  : profile.language === "Spanish"
                  ? "Tranquilidad"
                  : "Peace of Mind"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {profile.language === "Hindi"
                  ? "«मैं सुरक्षित और सकुशल हूँ» चेक-इन"
                  : profile.language === "Spanish"
                  ? "«Estoy seguro y bien» Check-In"
                  : "\"I Am Safe & Doing Well\" Check-In"}
              </h3>
              <p className="text-emerald-100 text-base max-w-xl">
                {profile.language === "Hindi"
                  ? `एक टैप से ${profile.emergencyContact.name} को तत्काल संदेश भेजा जाता है ताकि परिवार जान सके कि आप सकुशल हैं।`
                  : profile.language === "Spanish"
                  ? `Un toque envía un mensaje inmediato a ${profile.emergencyContact.name} para que tu familia sepa que estás bien.`
                  : `One tap sends an instant reassuring message to ${profile.emergencyContact.name} so your family knows you are happy and comfortable.`}
              </p>
              <div className="text-xs text-emerald-200 pt-1 font-semibold">
                {profile.language === "Hindi"
                  ? "अंतिम चेक-इन:"
                  : profile.language === "Spanish"
                  ? "Último registro:"
                  : "Last check-in sent:"}{" "}
                <span className="text-white font-bold">{lastCheckInTime}</span>
              </div>
            </div>

            <button
              onClick={handleSendSafeCheckIn}
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-black text-lg transition shadow-lg active:scale-95 cursor-pointer shrink-0 min-h-[52px]"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>
                {profile.language === "Hindi"
                  ? "यहाँ दबाएं: मैं सुरक्षित हूँ!"
                  : profile.language === "Spanish"
                  ? "Toca aquí: ¡Estoy bien!"
                  : "Tap Here: I'm Safe!"}
              </span>
            </button>
          </div>

          {safeCheckInSent && (
            <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-base flex items-center gap-2 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <span>
                {profile.language === "Hindi"
                  ? `${profile.emergencyContact.name} को सूचना भेजी गई: "चेक-इन ${lastCheckInTime} — सब कुछ बहुत अच्छा है!"`
                  : profile.language === "Spanish"
                  ? `Notificación enviada a ${profile.emergencyContact.name}: "Registro enviado a las ${lastCheckInTime} — ¡Todo excelente!"`
                  : `Notification Sent to ${profile.emergencyContact.name}: "Checked in at ${lastCheckInTime} — Everything is wonderful!"`}
              </span>
            </div>
          )}

          {/* Trusted Family Contacts Cards */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h3 className="text-xl font-extrabold text-stone-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-700" />
              {profile.language === "Hindi"
                ? "विश्वसनीय परिवार और मित्र संपर्क"
                : profile.language === "Spanish"
                ? "Contactos de familiares y amigos de confianza"
                : "Trusted Family & Friends Contacts"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${c.avatarColor} text-white font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-stone-900">{c.name}</h4>
                      <p className="text-xs text-stone-500 font-medium">{c.relation}</p>
                      <p className="text-xs font-semibold text-stone-700 mt-0.5">{c.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-2xs active:scale-95 cursor-pointer"
                      title={`Call ${c.name}`}
                    >
                      <PhoneCall className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-2xs active:scale-95 cursor-pointer"
                      title={`WhatsApp message to ${c.name}`}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Request-Help Presets */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-extrabold text-stone-900">
                {profile.language === "Hindi"
                  ? "परिवार से सहज सहायता मांगें"
                  : profile.language === "Spanish"
                  ? "Pedir ayuda con delicadeza a la familia"
                  : "Ask Family for Gentle Help"}
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-medium mb-4">
              {profile.language === "Hindi"
                ? "बिना किसी संकोच के परिवार को विनम्र संदेश भेजने के लिए किसी भी विकल्प को दबाएं"
                : profile.language === "Spanish"
                ? "Toca cualquier mensaje para avisar amablemente a tu familia sin sentirte una carga"
                : "Tap any message to politely notify your family without feeling like a burden"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() =>
                  handleSendHelpPreset(
                    profile.language === "Hindi"
                      ? "नमस्ते बेटा, जब आप मिलने आएं तो कृपया मेरी बीपी की दवा मंगाने में मदद कर देना।"
                      : profile.language === "Spanish"
                      ? "Hola, ¿podrías ayudarme a reponer mi medicina para la presión cuando vengas?"
                      : "Hi beta, could you please help me refill my blood pressure medicine when you visit?"
                  )
                }
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-left font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                💊{" "}
                {profile.language === "Hindi"
                  ? "«मेरी दवा का नुस्खा मंगाने में मदद करें»"
                  : profile.language === "Spanish"
                  ? "«Ayuda para reponer mi medicamento»"
                  : "\"Help refill my medicine prescription\""}
              </button>

              <button
                onClick={() =>
                  handleSendHelpPreset(
                    profile.language === "Hindi"
                      ? "नमस्ते बेटा, इस सप्ताहांत जब भी समय मिले, क्या आप कुछ किराने का सामान लाने में मदद कर सकते हैं?"
                      : profile.language === "Spanish"
                      ? "Hola, cuando tengas tiempo este fin de semana, ¿me ayudas con las compras?"
                      : "Hi Priya, when you are free this weekend, could you help me pick up a few grocery items?"
                  )
                }
                className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 text-left font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                🛒{" "}
                {profile.language === "Hindi"
                  ? "«सप्ताहांत किराने के सामान में मदद करें»"
                  : profile.language === "Spanish"
                  ? "«Ayuda con las compras de la semana»"
                  : "\"Help me with weekend groceries\""}
              </button>

              <button
                onClick={() =>
                  handleSendHelpPreset(
                    profile.language === "Hindi"
                      ? "नमस्ते बेटा, कोई जल्दी नहीं है, आज जब भी आपको समय मिले मुझे एक बार फ़ोन कर लेना।"
                      : profile.language === "Spanish"
                      ? "Hola, sin prisa, llámame cuando tengas un descanso hoy."
                      : "Hi beta, no rush at all, please give me a quick phone call whenever you take a break today."
                  )
                }
                className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 text-left font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                📞{" "}
                {profile.language === "Hindi"
                  ? "«समय मिलने पर एक छोटा फ़ोन करें»"
                  : profile.language === "Spanish"
                  ? "«Llámame cuando estés libre»"
                  : "\"Give me a quick call when you are free\""}
              </button>
            </div>

            {helpSentMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{helpSentMessage}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Caregiver Dashboard View */
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-blue-700" />
              <div>
                <h3 className="text-xl font-extrabold text-blue-950">
                  {profile.language === "Hindi"
                    ? `देखभालकर्ता पोर्टल दृश्य (${profile.emergencyContact.name} के लिए)`
                    : profile.language === "Spanish"
                    ? `Portal de cuidador (Para ${profile.emergencyContact.name})`
                    : `Caregiver Portal View (For ${profile.emergencyContact.name})`}
                </h3>
                <p className="text-sm text-blue-800 font-medium">
                  {profile.language === "Hindi"
                    ? `${profile.name} के लिए रीयल-टाइम स्वास्थ्य अनुपालन और मन की शांति`
                    : profile.language === "Spanish"
                    ? `Seguimiento de salud en tiempo real para ${profile.name}`
                    : `Real-time health adherence & peace-of-mind telemetry for ${profile.name}`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pill Compliance Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  {profile.language === "Hindi"
                    ? "दवा सेवन नियमिता"
                    : profile.language === "Spanish"
                    ? "Adherencia al medicamento"
                    : "Medication Adherence"}
                </span>
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{pillAdherenceRate}%</div>
              <p className="text-xs text-stone-600 mt-1 font-semibold">
                {profile.language === "Hindi"
                  ? `आज ${medicines.length} में से ${pillsTakenToday} खुराक ली गईं`
                  : profile.language === "Spanish"
                  ? `${pillsTakenToday} de ${medicines.length} dosis registradas hoy`
                  : `${pillsTakenToday} of ${medicines.length} doses logged today`}
              </p>
            </div>

            {/* Check-In Status */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  {profile.language === "Hindi"
                    ? "नवीनतम चेक-इन"
                    : profile.language === "Spanish"
                    ? "Último registro seguro"
                    : "Latest Safe Check-In"}
                </span>
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xl font-black text-stone-900">{lastCheckInTime}</div>
              <p className="text-xs text-stone-600 mt-1 font-semibold">
                {profile.language === "Hindi"
                  ? "स्थिति: घर पर सक्रिय और कुशल"
                  : profile.language === "Spanish"
                  ? "Estado: Activo y bien en casa"
                  : "Status: Active & Alert at Home"}
              </p>
            </div>

            {/* Vitals Summary */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  {profile.language === "Hindi"
                    ? "नवीनतम बीपी रीडिंग"
                    : profile.language === "Spanish"
                    ? "Última lectura de PA"
                    : "Latest BP Reading"}
                </span>
                <Activity className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">122 / 80 mmHg</div>
              <p className="text-xs text-emerald-700 font-bold mt-1">
                {profile.language === "Hindi"
                  ? "उत्कृष्ट एवं स्थिर (दर्ज: 08:00 AM)"
                  : profile.language === "Spanish"
                  ? "Óptimo y estable (a las 08:00 AM)"
                  : "Optimal & Stable (Logged at 08:00 AM)"}
              </p>
            </div>
          </div>

          {/* Configurable Sharing Controls */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <h4 className="font-bold text-base text-stone-900 mb-3">
              {profile.language === "Hindi"
                ? "गोपनीयता और साझाकरण अनुमतियां"
                : profile.language === "Spanish"
                ? "Permisos de privacidad y compartición"
                : "Configurable Privacy & Sharing Permissions"}
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-sm text-stone-800">
                  {profile.language === "Hindi"
                    ? `यदि सुबह 10:00 बजे तक दवा न ली जाए तो ${profile.emergencyContact.name} को सूचित करें`
                    : profile.language === "Spanish"
                    ? `Avisar a ${profile.emergencyContact.name} si la medicina se retrasa más allá de las 10:00 AM`
                    : `Notify ${profile.emergencyContact.name} if morning medicine is delayed past 10:00 AM`}
                </span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-sm text-stone-800">
                  {profile.language === "Hindi"
                    ? "डॉक्टर की मुलाकात के प्रश्नों और नोट्स का सारांश साझा करें"
                    : profile.language === "Spanish"
                    ? "Compartir resumen de preguntas y notas de visitas médicas"
                    : "Share summary of Doctor visit questions and notes"}
                </span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-sm text-stone-800">
                  {profile.language === "Hindi"
                    ? "आपातकालीन SOS बटन दबाए जाने पर तुरंत SMS अलर्ट भेजें"
                    : profile.language === "Spanish"
                    ? "Enviar alerta SMS inmediata si se presiona el botón SOS"
                    : "Send immediate SMS alert if Emergency SOS button is pressed"}
                </span>
                <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-rose-600 rounded" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
