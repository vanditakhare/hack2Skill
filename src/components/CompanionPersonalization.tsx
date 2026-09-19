import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Smile,
  Music,
  Play,
  Square,
  Sparkles,
  Volume2,
  Settings,
  HelpCircle,
  Newspaper,
  Save,
  CheckCircle2,
  Globe,
  Sliders,
  Type,
  Sun,
  Moon,
} from "lucide-react";
import { SeniorProfile, Language, TextSize } from "../types";
import { speechHelper } from "../utils/speech";
import { getTranslation } from "../utils/translations";

interface CompanionPersonalizationProps {
  profile: SeniorProfile;
  onUpdateProfile: (updated: Partial<SeniorProfile>) => void;
}

export const CompanionPersonalization: React.FC<CompanionPersonalizationProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const t = getTranslation(profile.language);

  const [activeTab, setActiveTab] = useState<"news" | "brain" | "relax" | "settings">("news");
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editHonorific, setEditHonorific] = useState(profile.preferredHonorific);
  const [editLanguage, setEditLanguage] = useState<Language>(profile.language);
  const [editTextSize, setEditTextSize] = useState<TextSize>(profile.textSize);
  const [editSpeed, setEditSpeed] = useState<number>(profile.voiceSpeed || 0.88);
  const [editContrast, setEditContrast] = useState<boolean>(profile.highContrast);

  useEffect(() => {
    setEditName(profile.name);
    setEditHonorific(profile.preferredHonorific);
    setEditLanguage(profile.language);
    setEditTextSize(profile.textSize);
    setEditSpeed(profile.voiceSpeed || 0.88);
    setEditContrast(profile.highContrast);
  }, [profile]);

  // Web Audio ambient sound synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  const startAmbientMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Pentatonic warm soothing scale frequencies
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C4, D4, E4, G4, A4, C5
      let noteIndex = 0;

      const playNextWarmTone = () => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % notes.length;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft gentle bell envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.0);
      };

      playNextWarmTone();
      intervalRef.current = setInterval(playNextWarmTone, 2200);
      setIsPlayingMelody(true);
    } catch (e) {
      console.warn("Melody audio error", e);
    }
  };

  const stopAmbientMelody = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlayingMelody(false);
  };

  useEffect(() => {
    return () => {
      stopAmbientMelody();
    };
  }, []);

  const positiveNewsHindi = [
    {
      title: "सामुदायिक पुष्प वाटिका में वरिष्ठ नागरिकों के लिए बना सुखद टहलने का पथ",
      snippet:
        "पड़ोस के युवाओं और स्वयंसेवकों ने पार्क में चमेली, गेंदे के पौधे लगाए और बुजुर्गों के सुबह सुकून से बैठने के लिए छायादार बेंचें बनाई हैं।",
      tag: "समाज व समुदाय",
    },
    {
      title: "सुबह की गुनगुनी धूप और धीमी सैर से स्मरण शक्ति और नींद में गहरा सुधार",
      snippet:
        "एक नए स्वास्थ्य अध्ययन के अनुसार केवल 20 मिनट की सुबह की धूप और अपनों के साथ सौम्य बातचीत से वरिष्ठजनों को बहुत गहरी नींद और प्रसन्नता मिलती है।",
      tag: "स्वास्थ्य व प्रसन्नता",
    },
    {
      title: "शहर के पुस्तकालयों में दादा-दादी के लिए निःशुल्क डिजिटल शिक्षण चौपाल",
      snippet:
        "स्थानीय पुस्तकालयों में दयालु स्वयंसेवक बुजुर्गों को दूर रहने वाले बच्चों से वीडियो कॉल करना और डिजिटल समाचार पत्र पढ़ना आराम से सिखा रहे हैं।",
      tag: "स्नेह व सहयोग",
    },
  ];

  const positiveNewsSpanish = [
    {
      title: "Jardín comunitario crea un sendero tranquilo para caminatas matutinas",
      snippet:
        "Jóvenes voluntarios del vecindario sembraron flores aromáticas e instalaron cómodos bancos con sombra para que los adultos mayores paseen cada mañana.",
      tag: "Comunidad",
    },
    {
      title: "El sol matutino y la caminata suave elevan la memoria y el buen dormir",
      snippet:
        "Un nuevo informe de bienestar confirma que solo 20 minutos de luz solar suave y charla relajada garantizan un sueño reparador y un ánimo alegre.",
      tag: "Salud y bienestar",
    },
    {
      title: "Círculos de lectura digital en bibliotecas para abuelos y abuelas",
      snippet:
        "Bibliotecas locales realizan talleres personalizados donde voluntarios amables enseñan a realizar videollamadas con sus nietos y leer libros digitales.",
      tag: "Amabilidad",
    },
  ];

  const positiveNewsEnglish = [
    {
      title: "Community Flower Garden Creates Peaceful Morning Walking Trail",
      snippet:
        "Neighborhood volunteers and youth have planted fragrant jasmine, marigolds, and shaded benches along the municipal park for senior citizens to stroll peacefully every morning.",
      tag: "Community",
    },
    {
      title: "Morning Sunlight & Mild Walking Proven to Elevate Memory and Sleep",
      snippet:
        "A heartwarming new wellness report reveals that just 20 minutes of relaxed morning sunlight and gentle conversation provides deeply restful sleep and mood joy for elders.",
      tag: "Health & Joy",
    },
    {
      title: "Free Digital Literacy Library Circles Welcoming Grandparents",
      snippet:
        "Local city libraries are hosting patient one-on-one sessions where friendly volunteers help seniors video call distant family, read digital newspapers, and enjoy audiobooks comfortably.",
      tag: "Kindness",
    },
  ];

  const currentNews =
    profile.language === "Hindi"
      ? positiveNewsHindi
      : profile.language === "Spanish"
      ? positiveNewsSpanish
      : positiveNewsEnglish;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      preferredHonorific: editHonorific,
      language: editLanguage,
      textSize: editTextSize,
      voiceSpeed: Number(editSpeed),
      highContrast: editContrast,
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div id="companion-personalization-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {t.modPersonalizationTitle}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium">
              {t.modPersonalizationDesc}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-stone-100 pb-1">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "news"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            📰{" "}
            {profile.language === "Hindi"
              ? "सकारात्मक दैनिक समाचार"
              : profile.language === "Spanish"
              ? "Noticias positivas"
              : "Positive Daily News"}
          </button>

          <button
            onClick={() => setActiveTab("brain")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "brain"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            🧩{" "}
            {profile.language === "Hindi"
              ? "दैनिक मस्तिष्क पहेली"
              : profile.language === "Spanish"
              ? "Acertijo mental"
              : "Daily Brain Riddle"}
          </button>

          <button
            onClick={() => setActiveTab("relax")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "relax"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            🎵{" "}
            {profile.language === "Hindi"
              ? "शांत सुरीली धुनें"
              : profile.language === "Spanish"
              ? "Melodías relajantes"
              : "Peaceful Ambient Melodies"}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "settings"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            ⚙️{" "}
            {profile.language === "Hindi"
              ? "व्यक्तिगत प्राथमिकताएं"
              : profile.language === "Spanish"
              ? "Preferencias personales"
              : "Personal Preferences"}
          </button>
        </div>
      </div>

      {/* Tab 1: Positive Daily News */}
      {activeTab === "news" && (
        <div className="space-y-4 animate-fadeIn">
          {currentNews.map((news, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {news.tag}
                </span>

                <button
                  onClick={() =>
                    speechHelper.speak(`${news.title}. ${news.snippet}`, {
                      rate: profile.voiceSpeed,
                      language: profile.language,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer min-h-[38px]"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.btnListen}</span>
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {news.title}
              </h3>
              <p className="text-stone-700 text-base sm:text-lg font-medium leading-relaxed">
                {news.snippet}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Daily Brain Riddle */}
      {activeTab === "brain" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-stone-900">
                {profile.language === "Hindi"
                  ? "सुबह की मधुर दिमागी पहेली"
                  : profile.language === "Spanish"
                  ? "Acertijo matutino suave"
                  : "Gentle Morning Brain Teaser"}
              </h3>
              <p className="text-sm font-medium text-stone-500">
                {profile.language === "Hindi"
                  ? "अपने ऊर्जावान मस्तिष्क को सक्रिय, चंचल और प्रसन्न रखें"
                  : profile.language === "Spanish"
                  ? "Mantén tu mente activa, despierta y alegre"
                  : "Keep your wonderful mind active, playful, and cheerful"}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
              {profile.language === "Hindi"
                ? "आज की पहेली:"
                : profile.language === "Spanish"
                ? "Acertijo del día:"
                : "Riddle of the Day:"}
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-relaxed">
              {profile.language === "Hindi"
                ? "\"मुझमें कुंजियां (Keys) हैं पर कोई ताला या दरवाजा नहीं। मुझमें स्पेस बार है पर कोई तारे नहीं। आप मुझ पर लिखकर अपने पोते-पोतियों को संदेश भेजते हैं। बताइए मैं कौन हूँ?\""
                : profile.language === "Spanish"
                ? "\"Tengo teclas pero no puertas. Tengo una barra espaciadora pero no estrellas. Me usas para escribirle a tus nietos. ¿Quién soy?\""
                : "\"I have keys, but no doors. I have a space bar, but no stars. You can type on me to write to your grandchildren. What am I?\""}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowRiddleAnswer(!showRiddleAnswer)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition active:scale-95 cursor-pointer shadow-xs min-h-[44px]"
              >
                {showRiddleAnswer
                  ? profile.language === "Hindi"
                    ? "उत्तर छिपाएं"
                    : profile.language === "Spanish"
                    ? "Ocultar respuesta"
                    : "Hide Answer"
                  : profile.language === "Hindi"
                  ? "उत्तर देखें"
                  : profile.language === "Spanish"
                  ? "Revelar respuesta"
                  : "Reveal Answer"}
              </button>
            </div>

            {showRiddleAnswer && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-lg animate-fadeIn flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                <span>
                  {profile.language === "Hindi"
                    ? "उत्तर: कंप्यूटर या मोबाइल का कीबोर्ड (Keyboard)! 😊"
                    : profile.language === "Spanish"
                    ? "¡Respuesta: El teclado de la computadora o del teléfono! 😊"
                    : "Answer: A Computer Keyboard or Phone Keyboard! 😊"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Peaceful Ambient Melodies */}
      {activeTab === "relax" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold shadow-sm">
              <Music className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              {profile.language === "Hindi"
                ? "शांत सुरम्य संगीतमय वातावरण"
                : profile.language === "Spanish"
                ? "Ambiente sonoro tranquilo"
                : "Peaceful Ambient Soundscape"}
            </h3>
            <p className="text-stone-600 text-base font-medium">
              {profile.language === "Hindi"
                ? "दोपहर के विश्राम या शाम की चाय के दौरान मन को शांति देने के लिए तैयार की गई मधुर व सौम्य घंटियों की धुन।"
                : profile.language === "Spanish"
                ? "Campanadas suaves y tonos armónicos diseñados para brindar tranquilidad en el descanso o la merienda."
                : "Gentle, relaxing soft chimes and harmonic tones designed to bring calm during afternoon rest or evening tea."}
            </p>

            <div className="pt-4">
              {isPlayingMelody ? (
                <button
                  onClick={stopAmbientMelody}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-md transition active:scale-95 cursor-pointer min-h-[52px]"
                >
                  <Square className="w-6 h-6" />
                  <span>
                    {profile.language === "Hindi"
                      ? "मधुर संगीत बंद करें"
                      : profile.language === "Spanish"
                      ? "Detener música suave"
                      : "Stop Gentle Music"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={startAmbientMelody}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-md transition active:scale-95 cursor-pointer min-h-[52px]"
                >
                  <Play className="w-6 h-6" />
                  <span>
                    {profile.language === "Hindi"
                      ? "शांत संगीत बजाएं"
                      : profile.language === "Spanish"
                      ? "Reproducir música relajante"
                      : "Play Soothing Music"}
                  </span>
                </button>
              )}
            </div>

            {isPlayingMelody && (
              <p className="text-xs font-bold text-emerald-800 animate-pulse pt-2">
                {profile.language === "Hindi"
                  ? "🎵 मधुर शांत घंटियों की धुन बज रही है... गहरी सांस लें और तनावमुक्त हों।"
                  : profile.language === "Spanish"
                  ? "🎵 Reproduciendo tonos relajantes... respira profundo y descansa."
                  : "🎵 Playing relaxing soft chime tones... take a deep breath and relax."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Preferences & Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs animate-fadeIn">
          <h3 className="text-2xl font-black text-stone-900 mb-2">
            {profile.language === "Hindi"
              ? "वरिष्ठ सुगमता और प्रोफ़ाइल प्राथमिकताएं"
              : profile.language === "Spanish"
              ? "Accesibilidad y preferencias de perfil"
              : "Senior Accessibility & Profile Preferences"}
          </h3>
          <p className="text-xs text-stone-500 font-medium mb-6">
            {profile.language === "Hindi"
              ? "अपनी अधिकतम सुविधा के लिए मित्रा के रूप-रंग और आवाज़ को अनुकूलित करें"
              : profile.language === "Spanish"
              ? "Personaliza cómo se ve y suena Mitraa para tu máxima comodidad"
              : "Customize how Mitraa looks and sounds for your maximum comfort"}
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  {profile.language === "Hindi"
                    ? "आपका पूरा नाम"
                    : profile.language === "Spanish"
                    ? "Tu nombre completo"
                    : "Your Full Name"}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  {profile.language === "Hindi"
                    ? "मित्रा आपको किस आदरसूचक नाम से संबोधित करे?"
                    : profile.language === "Spanish"
                    ? "¿Cómo debe llamarte Mitraa? (Tratamiento preferido)"
                    : "How should Mitraa address you? (Preferred Honorific)"}
                </label>
                <input
                  type="text"
                  value={editHonorific}
                  onChange={(e) => setEditHonorific(e.target.value)}
                  placeholder={
                    profile.language === "Hindi"
                      ? "जैसे: आशाजी, दादाजी, नानाजी, वर्मा जी"
                      : profile.language === "Spanish"
                      ? "ej. Don Roberto, Abuelo, Sra. María"
                      : "e.g. Ashaji, Dadaji, Grandpa, Mrs. Sharma"
                  }
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  {profile.language === "Hindi"
                    ? "पसंदीदा भाषा (Preferred Language)"
                    : profile.language === "Spanish"
                    ? "Idioma preferido"
                    : "Preferred Language"}
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value as Language)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700 block mb-1">
                  {profile.language === "Hindi"
                    ? "स्क्रीन टेक्स्ट आकार"
                    : profile.language === "Spanish"
                    ? "Tamaño del texto en pantalla"
                    : "Screen Text Size"}
                </label>
                <select
                  value={editTextSize}
                  onChange={(e) => setEditTextSize(e.target.value as TextSize)}
                  className="w-full p-3 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="normal">
                    {profile.language === "Hindi"
                      ? "मध्यम (मानक)"
                      : profile.language === "Spanish"
                      ? "Mediano (Estándar)"
                      : "Medium (Standard)"}
                  </option>
                  <option value="large">
                    {profile.language === "Hindi"
                      ? "बड़ा (वरिष्ठ नागरिकों के लिए अनुशंसित)"
                      : profile.language === "Spanish"
                      ? "Grande (Recomendado para adultos mayores)"
                      : "Large (Recommended for Seniors)"}
                  </option>
                  <option value="extra-large">
                    {profile.language === "Hindi"
                      ? "अति बड़ा (अधिकतम स्पष्टता)"
                      : profile.language === "Spanish"
                      ? "Extra grande (Máxima legibilidad)"
                      : "Extra Large (Maximum Legibility)"}
                  </option>
                </select>
              </div>
            </div>

            {/* Voice Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bold text-stone-700">
                  {profile.language === "Hindi"
                    ? `बोलने की गति: ${Math.round(editSpeed * 100)}%`
                    : profile.language === "Spanish"
                    ? `Velocidad de voz: ${Math.round(editSpeed * 100)}%`
                    : `Voice Speech Speed: ${Math.round(editSpeed * 100)}%`}
                </label>
                <span className="text-xs text-stone-500 font-semibold">
                  {editSpeed <= 0.85
                    ? profile.language === "Hindi"
                      ? "सौम्य और धीमी गति (अनुशंसित)"
                      : profile.language === "Spanish"
                      ? "Suave y pausada (Recomendada)"
                      : "Gentle & Slow (Recommended)"
                    : profile.language === "Hindi"
                    ? "सामान्य गति"
                    : profile.language === "Spanish"
                    ? "Velocidad normal"
                    : "Normal Speed"}
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.0"
                step="0.05"
                value={editSpeed}
                onChange={(e) => setEditSpeed(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  {profile.language === "Hindi"
                    ? "उच्च-कंट्रास्ट मोड (High-Contrast Mode)"
                    : profile.language === "Spanish"
                    ? "Modo de alto contraste"
                    : "High-Contrast Black & Gold Mode"}
                </span>
                <span className="text-xs text-stone-500">
                  {profile.language === "Hindi"
                    ? "कमज़ोर दृष्टि के लिए अधिकतम स्पष्टता"
                    : profile.language === "Spanish"
                    ? "Máximo contraste para descansar la vista"
                    : "Maximum contrast for low-vision comfort"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={editContrast}
                onChange={(e) => setEditContrast(e.target.checked)}
                className="w-6 h-6 accent-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSettingsNotice ? (
                <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5" />
                  {profile.language === "Hindi"
                    ? "प्राथमिकताएं सहेज ली गईं!"
                    : profile.language === "Spanish"
                    ? "¡Preferencias guardadas!"
                    : "Preferences saved!"}
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
              >
                <Save className="w-5 h-5" />
                <span>
                  {profile.language === "Hindi"
                    ? "प्राथमिकताएं सहेजें"
                    : profile.language === "Spanish"
                    ? "Guardar preferencias"
                    : "Save Preferences"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
