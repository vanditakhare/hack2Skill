import React from "react";
import {
  Calendar,
  Pill,
  CreditCard,
  ShieldAlert,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { SeniorProfile, ModuleTab } from "../types";

interface EverydayPillarsHubProps {
  profile: SeniorProfile;
  onOpenModule: (tab: ModuleTab) => void;
}

export const EverydayPillarsHub: React.FC<EverydayPillarsHubProps> = ({
  profile,
  onOpenModule,
}) => {
  const isHindi = profile.language === "Hindi";
  const isSpanish = profile.language === "Spanish";

  const pillars = [
    {
      id: "appointments",
      targetTab: "health" as ModuleTab,
      icon: <Calendar className="w-6 h-6 text-blue-700" />,
      bg: "bg-blue-50/70 border-blue-200/90 hover:border-blue-400",
      accent: "text-blue-900",
      badge: isHindi ? "अपॉइंटमेंट सहायता" : isSpanish ? "Citas médicas" : "Appointments",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      title: isHindi
        ? "डॉक्टर अपॉइंटमेंट बुक व तैयारी"
        : isSpanish
        ? "Reservar y preparar consultas médicas"
        : "Booking & Managing Appointments",
      description: isHindi
        ? "क्लिनिक रिसेप्शनिस्ट से बात करने का सरल संवाद, डॉक्टर से पूछने वाले 3 प्रश्न और साथ ले जाने वाली सामग्री की सूची।"
        : isSpanish
        ? "Guión para llamar a la clínica, 3 preguntas preparadas para su médico y lista de documentos."
        : "Simple clinic call scripts, 3 prepared doctor questions, and carry checklist to make visits stress-free.",
      actionLabel: isHindi ? "अपॉइंटमेंट तैयार करें" : isSpanish ? "Planificar consulta" : "Plan Doctor Visit",
    },
    {
      id: "medications",
      targetTab: "health" as ModuleTab,
      icon: <Pill className="w-6 h-6 text-emerald-700" />,
      bg: "bg-emerald-50/70 border-emerald-200/90 hover:border-emerald-400",
      accent: "text-emerald-900",
      badge: isHindi ? "दवा प्रबंधन" : isSpanish ? "Medicamentos" : "Medications",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: isHindi
        ? "दवाओं व पर्चियों का सरल प्रबंधन"
        : isSpanish
        ? "Gestión sencilla de recetas y pastillas"
        : "Managing Medications & Prescriptions",
      description: isHindi
        ? "डॉक्टर की पर्ची का सरल भाषा में विश्लेषण, भोजन के साथ दवा लेने का समय और वॉयस रिमाइंडर।"
        : isSpanish
        ? "Explicación clara de recetas con IA, recordatorios por voz y control diario de dosis."
        : "AI prescription simplifier, clear meal instructions, audio readouts, and remaining pill tracking.",
      actionLabel: isHindi ? "दवाएं व पर्ची देखें" : isSpanish ? "Ver medicamentos" : "Check Medications",
    },
    {
      id: "bills",
      targetTab: "finance" as ModuleTab,
      icon: <CreditCard className="w-6 h-6 text-amber-700" />,
      bg: "bg-amber-50/70 border-amber-200/90 hover:border-amber-400",
      accent: "text-amber-900",
      badge: isHindi ? "बिल व खर्च" : isSpanish ? "Facturas" : "Bills & Banking",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      title: isHindi
        ? "बिल समझना और सुरक्षित भुगतान"
        : isSpanish
        ? "Entender y pagar facturas con seguridad"
        : "Understanding & Paying Bills",
      description: isHindi
        ? "बिजली, पानी व फ़ोन बिल की जटिलता दूर करें। कोई छुपा शुल्क नहीं, धोखाधड़ी-मुक्त भुगतान कदम।"
        : isSpanish
        ? "Desglose claro de recibos de luz, agua y teléfono sin recargos sorpresa y pagos seguros."
        : "Plain-language bill breakdown, clear due dates, zero technical jargon, and fraud-safe payment steps.",
      actionLabel: isHindi ? "बिल समीक्षा करें" : isSpanish ? "Revisar facturas" : "Review Bills Safely",
    },
    {
      id: "scams",
      targetTab: "scam" as ModuleTab,
      icon: <ShieldAlert className="w-6 h-6 text-rose-700" />,
      bg: "bg-rose-50/70 border-rose-200/90 hover:border-rose-400",
      accent: "text-rose-900",
      badge: isHindi ? "धोखाधड़ी ढाल" : isSpanish ? "Protección antifraude" : "Scam Protection",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
      title: isHindi
        ? "संदिग्ध संदेश व फोन कॉल पहचान"
        : isSpanish
        ? "Identificar estafas y llamadas falsas"
        : "Identifying Scams & Fraud",
      description: isHindi
        ? "फर्जी बिजली कटने के एसएमएस, बैंक ओटीपी कॉल व लॉटरी लिंक की तत्काल जांच और परिवार को तुरंत अलर्ट।"
        : isSpanish
        ? "Análisis inmediato de mensajes sospechosos, corte falso de servicios y aviso instantáneo a la familia."
        : "Real-time AI verification of suspicious SMS, electricity cut-off threats, fake lottery links, and one-tap family alert.",
      actionLabel: isHindi ? "संदेश जांचें" : isSpanish ? "Analizar mensaje" : "Verify SMS / Call",
    },
    {
      id: "family",
      targetTab: "family" as ModuleTab,
      icon: <Users className="w-6 h-6 text-purple-700" />,
      bg: "bg-purple-50/70 border-purple-200/90 hover:border-purple-400",
      accent: "text-purple-900",
      badge: isHindi ? "पारिवारिक जुड़ाव" : isSpanish ? "Conexión familiar" : "Family Connection",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      title: isHindi
        ? "परिवार व बच्चों से सहज संपर्क"
        : isSpanish
        ? "Estar conectado con hijos y nietos"
        : "Staying Socially Connected with Family",
      description: isHindi
        ? "एक स्पर्श में वॉयस आशीर्वाद भेजें, पुरानी यादें साझा करें और बच्चों को दैनिक कुशलता का आश्वासन दें।"
        : isSpanish
        ? "Mensajes de voz con un toque, compartir recuerdos familiares y actualizaciones automáticas de bienestar."
        : "One-touch voice blessings, memory sharing, and automatic peaceful daily check-ins so family always knows you are well.",
      actionLabel: isHindi ? "परिवार से जुड़ें" : isSpanish ? "Contactar familia" : "Connect with Family",
    },
  ];

  return (
    <section aria-label="Everyday Senior Independence Pillars" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              {isHindi
                ? "आत्मनिर्भर दैनिक जीवन के 5 मुख्य स्तंभ"
                : isSpanish
                ? "5 Pilares de independencia diaria"
                : "Five Pillars of Everyday Senior Independence"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            {isHindi
              ? "दैनिक कार्यों में आत्मविश्वास और स्वतंत्रता"
              : isSpanish
              ? "Navegue sus tareas diarias con calma y confianza"
              : "Navigate Everyday Tasks with Ease, Confidence & Independence"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md font-medium">
          {isHindi
            ? "बिना किसी पर निर्भर हुए या तनाव लिए — सब कुछ आपकी गति और समझ के अनुसार।"
            : isSpanish
            ? "Sin depender de otros ni sentirse abrumado — diseñado a su propio ritmo."
            : "No more feeling rushed or dependent on others. Generative AI tailored to your pace, comfort, and safety."}
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className={`rounded-3xl border-2 ${pillar.bg} p-6 flex flex-col justify-between transition-all hover:shadow-md`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-white shadow-2xs">
                  {pillar.icon}
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${pillar.badgeColor}`}>
                  {pillar.badge}
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 mb-2 leading-snug">
                {pillar.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium mb-4">
                {pillar.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200/70">
              <button
                type="button"
                onClick={() => onOpenModule(pillar.targetTab)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm shadow-2xs transition active:scale-95 cursor-pointer min-h-[44px]"
              >
                <span>{pillar.actionLabel}</span>
                <ArrowRight className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
