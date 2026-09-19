import React, { useState, useEffect } from "react";
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
import { getTranslation } from "../utils/translations";

interface FinanceAssistantProps {
  bills: BillItem[];
  onToggleBillStatus: (id: string) => void;
  profile: SeniorProfile;
}

const localizedJargonHindi = [
  {
    term: "OTP (एक-बारीय पासवर्ड)",
    meaning: "यह आपके व्यक्तिगत मोबाइल फ़ोन पर भेजा जाने वाला 4 या 6 अंकों का एक गुप्त अस्थायी कोड है, जिससे यह सुनिश्चित हो सके कि भुगतान आप ही कर रहे हैं।",
    goldenRule: "फ़ोन या एसएमएस पर यह कोड कभी किसी को न बताएं। बैंक अधिकारी कभी भी यह नहीं मांगते।",
  },
  {
    term: "CVV (कार्ड सुरक्षा कोड)",
    meaning: "आपके डेबिट या क्रेडिट कार्ड के पीछे सफ़ेद पट्टी पर छपे हुए 3 छोटे अंक।",
    goldenRule: "यह नंबर पूर्णतः गोपनीय रखें। कभी किसी अपरिचित को अपने कार्ड का फ़ोटो न खींचने दें।",
  },
  {
    term: "ऑटो-डेबिट / NACH",
    meaning: "आपके द्वारा बैंक को दिया गया स्थायी निर्देश, जिससे हर महीने का नियमित बिल (जैसे बिजली या बीमा) अपने-आप कट जाता है।",
    goldenRule: "हर महीने बैंक पासबुक ज़रूर जांचें कि कटी हुई राशि आपके बिल से मेल खाती है या नहीं।",
  },
  {
    term: "फ़िशिंग (धोखाधड़ी का संदेश)",
    meaning: "एक चाल जिसमें धोखेबाज बैंक के नाम से नकली संदेश भेजकर लिंक दबाने को कहते हैं ताकि आपका पासवर्ड चुरा सकें।",
    goldenRule: "यदि संदेश में 'खाता बंद' लिखा हो, तो लिंक न दबाएं। सीधे बैंक के आधिकारिक नंबर पर फ़ोन करें।",
  },
  {
    term: "UPI / NEFT",
    meaning: "बैंकों द्वारा निर्मित सुरक्षित इलेक्ट्रॉनिक माध्यम जिससे कुछ सेकंडों में सीधे बैंक खाते में पैसे भेजे जा सकते हैं।",
    goldenRule: "पैसे भेजने या 'पुष्टि' दबाने से पहले पाने वाले का नाम ध्यान से ज़रूर जांचें।",
  },
];

const localizedJargonSpanish = [
  {
    term: "OTP (Código de un solo uso)",
    meaning: "Un código temporal secreto de 4 o 6 dígitos que llega a tu teléfono móvil personal para confirmar que eres tú quien realiza el pago.",
    goldenRule: "NUNCA compartas este código con nadie por teléfono o SMS. Los bancos jamás te lo pedirán.",
  },
  {
    term: "CVV (Código de verificación)",
    meaning: "Los 3 números pequeños impresos en el reverso de tu tarjeta bancaria en la franja blanca.",
    goldenRule: "Mantén este número privado. Nunca permitas que extraños tomen fotografías de tu tarjeta.",
  },
  {
    term: "Débito automático",
    meaning: "Una orden dada al banco para que pague mensualmente facturas fijas (como luz o seguro) directamente de tu cuenta.",
    goldenRule: "Revisa tu estado de cuenta una vez al mes para comprobar que los importes sean exactos.",
  },
  {
    term: "Phishing (Mensajes trampa)",
    meaning: "Un engaño donde estafadores fingen ser de tu banco y te piden abrir un enlace para robar tus claves.",
    goldenRule: "Si un mensaje dice 'Cuenta suspendida', no abras el enlace. Llama al número oficial de tu banco.",
  },
  {
    term: "Transferencia electrónica / Bizum",
    meaning: "Métodos electrónicos seguros respaldados por bancos para enviar dinero de cuenta a cuenta en segundos.",
    goldenRule: "Verifica siempre el nombre del destinatario antes de presionar 'Confirmar'.",
  },
];

export const FinanceAssistant: React.FC<FinanceAssistantProps> = ({
  bills,
  onToggleBillStatus,
  profile,
}) => {
  const t = getTranslation(profile.language);

  const jargonList =
    profile.language === "Hindi"
      ? localizedJargonHindi
      : profile.language === "Spanish"
      ? localizedJargonSpanish
      : seniorBankingJargon;

  const [statementSnippet, setStatementSnippet] = useState(
    "18-SEP-2026 POS TXN #4902 PHARMACY MEDICINES - $24.80 DEBIT (BAL: $3,210.00)"
  );

  const getDefaultExplanation = () => {
    if (profile.language === "Hindi") {
      return "यह फार्मेसी काउंटर पर आपके कार्ड से दवाओं की खरीद के लिए $24.80 की सामान्य कटौती है। आपका शेष बैंक बैलेंस $3,210.00 है।";
    }
    if (profile.language === "Spanish") {
      return "Este es un débito normal de $24.80 por medicamentos comprados con tu tarjeta en la farmacia. Tu saldo restante es de $3,210.00.";
    }
    return "This is a normal debit of $24.80 for medicines purchased with your card at the pharmacy counter. Your remaining bank balance is $3,210.00.";
  };

  const [statementExplanation, setStatementExplanation] = useState<string | null>(getDefaultExplanation());
  const [selectedJargon, setSelectedJargon] = useState(jargonList[0]);

  useEffect(() => {
    setSelectedJargon(jargonList[0]);
    setStatementExplanation(getDefaultExplanation());
  }, [profile.language]);

  const handleExplainStatement = () => {
    const text = statementSnippet.toLowerCase();
    let explanation = "";

    if (text.includes("pension") || text.includes("cr")) {
      explanation =
        profile.language === "Hindi"
          ? "यह एक शुभ जमा राशि है! आपकी मासिक पेंशन सुरक्षित रूप से आपके खाते में जमा कर दी गई है।"
          : profile.language === "Spanish"
          ? "¡Este es un crédito positivo! Tu pensión mensual fue depositada con éxito en tu cuenta."
          : "This is a positive credit! Your monthly pension was deposited safely into your account.";
    } else if (text.includes("metro power") || text.includes("electric") || text.includes("power")) {
      explanation =
        profile.language === "Hindi"
          ? "यह आपके मासिक बिजली बिल का अधिकृत भुगतान है।"
          : profile.language === "Spanish"
          ? "Este es un pago autorizado correspondiente a tu factura mensual de electricidad."
          : "This is an authorized payment for your monthly electricity utility bill.";
    } else if (text.includes("pharmacy") || text.includes("medicine")) {
      explanation =
        profile.language === "Hindi"
          ? "यह दवाओं एवं स्वास्थ्य सामग्री के लिए कार्ड से की गई वैध खरीदारी है।"
          : profile.language === "Spanish"
          ? "Esta es una compra legítima con tarjeta de suministros médicos y de farmacia."
          : "This is a legitimate card purchase for medical and pharmacy supplies.";
    } else {
      explanation =
        profile.language === "Hindi"
          ? "यह एक सामान्य खाता लेनदेन है। हमेशा यह जांचें कि दुकान का नाम वही है जहां आप गए थे।"
          : profile.language === "Spanish"
          ? "Esta es una transacción estándar. Siempre verifica que el nombre del establecimiento coincida con el lugar que visitaste."
          : "This is a standard account transaction. Always check that the store name matches where you visited.";
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {t.modFinanceTitle}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              {t.modFinanceDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Bills Widget */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-xl font-extrabold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          {profile.language === "Hindi"
            ? "मासिक बिल और अंतिम तिथियां"
            : profile.language === "Spanish"
            ? "Facturas mensuales y fechas de vencimiento"
            : "Monthly Bills & Due-Dates"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bills.map((b) => {
            const statusLabel =
              b.status === "paid"
                ? profile.language === "Hindi"
                  ? "✓ चुकता (Paid)"
                  : profile.language === "Spanish"
                  ? "✓ Pagada"
                  : "✓ Paid"
                : b.status === "due_soon"
                ? profile.language === "Hindi"
                  ? "कल देय (Due Tomorrow)"
                  : profile.language === "Spanish"
                  ? "Vence mañana"
                  : "Due Tomorrow"
                : profile.language === "Hindi"
                ? "आगामी"
                : profile.language === "Spanish"
                ? "Próxima"
                : "Upcoming";

            const btnStatusText =
              b.status === "paid"
                ? profile.language === "Hindi"
                  ? "अदत्त चिह्नित करें"
                  : profile.language === "Spanish"
                  ? "Marcar no pagada"
                  : "Mark Unpaid"
                : profile.language === "Hindi"
                ? "चुकता चिह्नित करें"
                : profile.language === "Spanish"
                ? "Marcar como pagada"
                : "Mark as Paid";

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition shadow-2xs ${
                  b.status === "paid"
                    ? "bg-stone-50 border-stone-200 opacity-80"
                    : b.status === "due_soon"
                    ? "bg-emerald-50/70 border-emerald-400"
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
                          ? "bg-emerald-200 text-emerald-950 border-emerald-400 animate-pulse"
                          : "bg-stone-100 text-stone-800 border-stone-300"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-stone-900">{b.title}</h4>
                  <div className="text-2xl font-black text-emerald-950 mt-2">{b.amount}</div>
                  <p className="text-xs text-stone-600 font-semibold mt-1">
                    {profile.language === "Hindi"
                      ? "अंतिम तिथि:"
                      : profile.language === "Spanish"
                      ? "Vence:"
                      : "Due:"}{" "}
                    <span className="font-bold text-stone-900">{b.dueDate}</span>
                  </p>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {profile.language === "Hindi"
                      ? "खाता सं:"
                      : profile.language === "Spanish"
                      ? "Cuenta:"
                      : "Acct:"}{" "}
                    {b.accountNumber}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <button
                    onClick={() => onToggleBillStatus(b.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer min-h-[38px] ${
                      b.status === "paid"
                        ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                        : "bg-emerald-700 text-white hover:bg-emerald-800"
                    }`}
                  >
                    {btnStatusText}
                  </button>

                  <button
                    onClick={() => {
                      const speechText =
                        profile.language === "Hindi"
                          ? `${b.title}, राशि ${b.amount}, अंतिम तिथि ${b.dueDate}। सेवा प्रदाता ${b.provider} है।`
                          : profile.language === "Spanish"
                          ? `${b.title} de ${b.amount} vence el ${b.dueDate}. Proveedor: ${b.provider}.`
                          : `${b.title} of ${b.amount} is due ${b.dueDate}. Provider is ${b.provider}.`;
                      speechHelper.speak(speechText, {
                        rate: profile.voiceSpeed,
                        language: profile.language,
                      });
                    }}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 cursor-pointer"
                    title={t.btnListen}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-800" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Statement Explainer */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <h3 className="text-xl font-extrabold text-stone-900 mb-1 flex items-center gap-2">
          <Building className="w-5 h-5 text-emerald-700" />
          {profile.language === "Hindi"
            ? "बैंक स्टेटमेंट कटौती का सरल अर्थ समझें"
            : profile.language === "Spanish"
            ? "Explicar cargo del estado de cuenta"
            : "Explain Bank Statement Charge"}
        </h3>
        <p className="text-xs text-stone-500 font-medium mb-4">
          {profile.language === "Hindi"
            ? "क्या अपनी पासबुक या बैंक SMS में किसी संक्षिप्त प्रविष्टि को लेकर उलझन है? सरल व्याख्या के लिए यहाँ पेस्ट करें।"
            : profile.language === "Spanish"
            ? "¿Dudas con una abreviatura en tu libreta o SMS? Pégala aquí para una explicación sencilla."
            : "Confused by an abbreviated charge on your passbook or SMS? Paste it here for an easy explanation."}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={statementSnippet}
            onChange={(e) => setStatementSnippet(e.target.value)}
            placeholder={
              profile.language === "Hindi"
                ? "जैसे: POS TXN #4902 METRO POWER - $42.50"
                : profile.language === "Spanish"
                ? "ej. POS TXN #4902 METRO POWER - $42.50"
                : "e.g. POS TXN #4902 METRO POWER - $42.50"
            }
            className="flex-1 p-3.5 rounded-2xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-emerald-600 bg-stone-50/70"
          />
          <button
            onClick={handleExplainStatement}
            className="px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shrink-0 transition active:scale-95 cursor-pointer shadow-xs min-h-[48px]"
          >
            {profile.language === "Hindi"
              ? "सरल शब्दों में समझाइए"
              : profile.language === "Spanish"
              ? "Explicar en palabras sencillas"
              : "Explain in Simple Words"}
          </button>
        </div>

        {statementExplanation && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm text-emerald-950 block">
                {profile.language === "Hindi"
                  ? "मित्रा का स्पष्टीकरण:"
                  : profile.language === "Spanish"
                  ? "Explicación de Mitraa:"
                  : "Mitraa's Explanation:"}
              </span>
              <p className="text-stone-800 text-base font-medium mt-0.5">{statementExplanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Senior Banking Jargon Buster */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <h3 className="text-xl font-extrabold text-stone-900">
            {profile.language === "Hindi"
              ? "वरिष्ठ बैंकिंग पारिभाषिक शब्दकोश"
              : profile.language === "Spanish"
              ? "Guía de términos bancarios para adultos mayores"
              : "Senior Banking Jargon Buster"}
          </h3>
        </div>
        <p className="text-xs text-stone-500 font-medium mb-4">
          {profile.language === "Hindi"
            ? "आधुनिक बैंकिंग शब्दों का वास्तविक और सीधा अर्थ समझने के लिए किसी भी शब्द को दबाएं"
            : profile.language === "Spanish"
            ? "Toca cualquier término bancario para entender su significado real y práctico"
            : "Tap any modern banking word to understand what it actually means"}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {jargonList.map((j, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedJargon(j)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition active:scale-95 cursor-pointer min-h-[40px] ${
                selectedJargon.term === j.term
                  ? "bg-emerald-700 text-white shadow-xs"
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
                  `${selectedJargon.term}. ${
                    profile.language === "Hindi" ? "अर्थ:" : profile.language === "Spanish" ? "Significado:" : "Meaning:"
                  } ${selectedJargon.meaning}. ${
                    profile.language === "Hindi" ? "सुरक्षा नियम:" : profile.language === "Spanish" ? "Regla de oro:" : "Golden safety rule:"
                  } ${selectedJargon.goldenRule}`,
                  { rate: profile.voiceSpeed, language: profile.language }
                )
              }
              className="flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.btnListen}</span>
            </button>
          </div>

          <p className="text-base text-stone-800 font-medium leading-relaxed">
            {selectedJargon.meaning}
          </p>

          <div className="mt-3 p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              {profile.language === "Hindi"
                ? "सुरक्षा का स्वर्णिम नियम:"
                : profile.language === "Spanish"
                ? "Regla de oro de seguridad:"
                : "Golden Rule:"}{" "}
              {selectedJargon.goldenRule}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
