import React from "react";
import { ShieldCheck, Clock, Eye, HeartHandshake, Languages } from "lucide-react";
import { SeniorProfile } from "../types";

interface SeniorTrustBannerProps {
  profile: SeniorProfile;
}

export const SeniorTrustBanner: React.FC<SeniorTrustBannerProps> = ({ profile }) => {
  const isHindi = profile.language === "Hindi";
  const isSpanish = profile.language === "Spanish";

  return (
    <section
      aria-label="Senior Trust and Accessible Design Philosophy"
      className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            {isHindi
              ? "वरिष्ठ नागरिकों के लिए विशेष रूप से निर्मित"
              : isSpanish
              ? "Diseñado especialmente para personas mayores"
              : "Thoughtfully Crafted for Older Adults & Grandparents"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {isHindi
              ? "मित्रा क्यों अलग है? तकनीक अब आपका सहारा है, तनाव नहीं।"
              : isSpanish
              ? "¿Por qué Mitraa es diferente? Tecnología como apoyo, no como estrés."
              : "Why Mitraa is Different: Digital Life as a Comfort, Not a Burden"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg font-medium leading-relaxed">
          {isHindi
            ? "आज के अधिकांश डिजिटल ऐप्स युवा उपयोगकर्ताओं के अनुसार बने हैं। मित्रा आपकी गति, सम्मान और आराम को सर्वोच्च प्राथमिकता देता है।"
            : isSpanish
            ? "La mayoría de herramientas están hechas para jóvenes. Mitraa respeta su ritmo, comodidad y dignidad sin prisas."
            : "Most digital tools today leave older adults feeling excluded or overwhelmed. Mitraa adapts to your rhythm, respect, and peace of mind."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-white mb-1">
            {isHindi ? "आंखों के अनुकूल स्पष्टता" : isSpanish ? "Claridad visual" : "Designed for Aging Eyes"}
          </h3>
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            {isHindi
              ? "बड़ा स्पष्ट फ़ॉन्ट, उच्च कंट्रास्ट और बड़े बटन ताकि कोई गलत क्लिक न हो।"
              : isSpanish
              ? "Tipografía grande, alto contraste y botones amplios para evitar toques erróneos."
              : "Large crisp typography, gentle high contrast, and spacious 48px+ touch targets."}
          </p>
        </div>

        <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60">
          <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-white mb-1">
            {isHindi ? "आपकी गति, कोई जल्दबाजी नहीं" : isSpanish ? "A su propio ritmo" : "Never Rushed or Timed"}
          </h3>
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            {isHindi
              ? "कोई उलझाने वाले टाइमर या अचानक लॉगआउट नहीं। जब तक चाहें सोचें और समझें।"
              : isSpanish
              ? "Sin cuentas regresivas ni cierres de sesión apresurados. Tómese el tiempo necesario."
              : "Zero stress timers or sudden logouts. Take all the time you need to read and decide."}
          </p>
        </div>

        <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60">
          <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-white mb-1">
            {isHindi ? "धोखाधड़ी से पूर्ण सुरक्षा" : isSpanish ? "Seguridad y confianza" : "Scam Shield & Family Link"}
          </h3>
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            {isHindi
              ? "संदिग्ध संदेशों की तुरंत जांच और किसी भी खतरे पर परिवार को स्वचालित सूचना।"
              : isSpanish
              ? "Verificación inmediata de mensajes dudosos y aviso automático a sus familiares."
              : "Instant AI verification of suspicious requests and one-tap alerts to your family."}
          </p>
        </div>

        <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700/60">
          <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-3">
            <Languages className="w-5 h-5" />
          </div>
          <h3 className="font-black text-sm text-white mb-1">
            {isHindi ? "मातृभाषा में संवाद" : isSpanish ? "En su idioma nativo" : "Your Native Language"}
          </h3>
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            {isHindi
              ? "हिंदी, अंग्रेजी, स्पेनिश, तमिल व अन्य भारतीय भाषाओं में सहज वॉयस व टेक्स्ट।"
              : isSpanish
              ? "Explicaciones en lenguaje cotidiano, sin jerga informática incomprensible."
              : "Converses naturally in English, Hindi, Spanish, and 5 Indian regional languages."}
          </p>
        </div>
      </div>
    </section>
  );
};
