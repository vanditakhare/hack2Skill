import { Language } from "../types";

export interface RawTranslationSet {
  // Brand & Header
  appName: string;
  appTagline: string;
  companionFor: string;
  timeMorning: string;
  timeAfternoon: string;
  timeEvening: string;
  morningGreeting: string;
  afternoonGreeting: string;
  eveningGreeting: string;
  morningGuidance: string;
  afternoonGuidance: string;
  eveningGuidance: string;
  btnSanctuaryDeck: string;
  btnActiveModule: string;
  btnCalmBreath: string;
  btnDaySummary: string;
  btnEmergencySOS: string;
  btnTextSize: string;
  btnContrast: string;
  btnSwitchUser: string;
  btnSignOut: string;
  chooseLanguage: string;
  
  // Overview Status
  dosePending: string;
  dosesPending: string;
  allDosesTaken: string;
  taskRemaining: string;
  tasksRemaining: string;
  allDoneToday: string;
  activeCompanionNotice: string;
  
  // Sanctuary Domains
  domainCareTitle: string;
  domainCareTagline: string;
  domainSafetyTitle: string;
  domainSafetyTagline: string;
  domainLifeTitle: string;
  domainLifeTagline: string;

  // Sanctuary Cards / Modules
  modVoiceCompanionTitle: string;
  modVoiceCompanionBadge: string;
  modVoiceCompanionDesc: string;
  modVoiceCompanionAction: string;

  modHealthTitle: string;
  modHealthDesc: string;
  modHealthAction: string;

  modDailyTitle: string;
  modDailyDesc: string;
  modDailyAction: string;

  modScamTitle: string;
  modScamBadge: string;
  modScamDesc: string;
  modScamAction: string;

  modDocTitle: string;
  modDocBadge: string;
  modDocDesc: string;
  modDocAction: string;

  modEmergencyTitle: string;
  modEmergencyBadge: string;
  modEmergencyDesc: string;
  modEmergencyAction: string;

  modFamilyTitle: string;
  modFamilyBadge: string;
  modFamilyDesc: string;
  modFamilyAction: string;

  modTasksTitle: string;
  modTasksBadge: string;
  modTasksDesc: string;
  modTasksAction: string;

  modFinanceTitle: string;
  modFinanceBadge: string;
  modFinanceDesc: string;
  modFinanceAction: string;

  modPersonalTitle: string;
  modPersonalBadge: string;
  modPersonalDesc: string;
  modPersonalAction: string;

  // Breathing & Comfort
  breathIn: string;
  breathHold: string;
  breathOut: string;
  breathRest: string;
  reassuranceCalm: string;
  reassuranceNoOtp: string;

  // Common UI Buttons & Controls
  btnBack: string;
  btnSave: string;
  btnCancel: string;
  btnDone: string;
  btnConfirm: string;
  btnRepeat: string;
  btnSpeak: string;
  btnSend: string;
  btnListening: string;
  btnSpeaking: string;
  btnMarkTaken: string;
  btnMarkPending: string;
  btnTaken: string;
  btnPending: string;
  btnVerify: string;
  btnSimplify: string;
  btnNextStep: string;
  btnPrevStep: string;
  btnCallAmbulance: string;
  btnCallDoctor: string;
  btnCallFamily: string;
  btnReadAloud: string;

  // Voice Companion Specifics
  welcomeMessage: string;
  promptSchedule: string;
  promptMedicines: string;
  promptScam: string;
  promptStory: string;
  promptOtp: string;
  inputPlaceholder: string;
  chatSubtitle: string;
}

export interface TranslationSet extends RawTranslationSet {
  statusActive: string;
  statusThinking: string;
  btnListen: string;
  emergencySOS: string;
  modPersonalizationTitle: string;
  modPersonalizationDesc: string;
  modTaskTitle: string;
  modTaskDesc: string;
}

export const translations: Record<Language, RawTranslationSet> = {
  English: {
    appName: "Mitraa",
    appTagline: "Senior Care Sanctuary",
    companionFor: "Personal Companion for",
    timeMorning: "🌅 Morning Sunrise",
    timeAfternoon: "☀️ Golden Afternoon",
    timeEvening: "🌙 Peaceful Twilight",
    morningGreeting: "Good Morning",
    afternoonGreeting: "Good Afternoon",
    eveningGreeting: "Good Evening",
    morningGuidance: "A peaceful morning has arrived. Drink warm water, stretch gently, and let us start the day with calmness.",
    afternoonGuidance: "Rest your eyes, stay hydrated, and enjoy soothing music, reading, or a quiet pause.",
    eveningGuidance: "The evening lamps are lit. Spend a gentle moment connecting with family, resting your feet, and taking evening medicines.",
    btnSanctuaryDeck: "Sanctuary Deck",
    btnActiveModule: "Active Module",
    btnCalmBreath: "Calm Breath",
    btnDaySummary: "Hear Day Summary",
    btnEmergencySOS: "SOS",
    btnTextSize: "Size",
    btnContrast: "Contrast",
    btnSwitchUser: "Switch User",
    btnSignOut: "Sign Out",
    chooseLanguage: "Choose Language",
    dosePending: "dose pending",
    dosesPending: "doses pending",
    allDosesTaken: "All doses taken",
    taskRemaining: "task remaining",
    tasksRemaining: "tasks remaining",
    allDoneToday: "All done today",
    activeCompanionNotice: "Mitraa is actively caring for you in English",
    domainCareTitle: "Care & Daily Vitality",
    domainCareTagline: "Your medicines, gentle daily rhythm, and conversational companion",
    domainSafetyTitle: "Peace of Mind & Safety",
    domainSafetyTagline: "Scam protection, plain-language letters, and immediate emergency help",
    domainLifeTitle: "Connection & Everyday Life",
    domainLifeTagline: "Stay close to family, navigate digital services, and enjoy peaceful leisure",
    modVoiceCompanionTitle: "Mitraa Voice Companion",
    modVoiceCompanionBadge: "AI Caring Friend",
    modVoiceCompanionDesc: "Speak naturally in your language. Ask about your day, health advice, or hear a comforting story.",
    modVoiceCompanionAction: "Talk with Mitraa",
    modHealthTitle: "Medicines & Health Log",
    modHealthDesc: "Visual pillbox with photos, reminder alarms, doctor appointments, and BP/Sugar log.",
    modHealthAction: "Open Pillbox",
    modDailyTitle: "Daily Routine & Schedule",
    modDailyDesc: "Paced day organizer: morning walk, prayer, hydration, family calls, and relaxing nap times.",
    modDailyAction: "View Schedule",
    modScamTitle: "Scam & Fraud Shield",
    modScamBadge: "Shield Active",
    modScamDesc: "Instant safety check for suspicious SMS, lottery calls, bank threats, and fake electricity cutoffs.",
    modScamAction: "Verify Scam SMS",
    modDocTitle: "Letter & Document Simplifier",
    modDocBadge: "5th-Grade Simple",
    modDocDesc: "Translates dense hospital discharge reports, utility notices, and insurance letters into simple words.",
    modDocAction: "Simplify Document",
    modEmergencyTitle: "Emergency SOS Siren",
    modEmergencyBadge: "One-Touch Alert",
    modEmergencyDesc: "Immediately alerts primary family caregiver and dials local ambulance or senior helpline.",
    modEmergencyAction: "Trigger Siren",
    modFamilyTitle: "Family Circle & Caregiver",
    modFamilyBadge: "Caregiver Sync",
    modFamilyDesc: "Share daily voice notes, view grandchild photos, and send one-tap 'I am safe' updates.",
    modFamilyAction: "Open Family Hub",
    modTasksTitle: "Easy Digital Task Guides",
    modTasksBadge: "Step-by-Step",
    modTasksDesc: "Large screenshot walkthroughs for booking a cab, ordering groceries, and WhatsApp calls.",
    modTasksAction: "Start Tutorial",
    modFinanceTitle: "Bills & Pension Assistant",
    modFinanceBadge: "Due Date Tracker",
    modFinanceDesc: "Large-print utility bills, pension reminders, and Jeevan Pramaan submission guide.",
    modFinanceAction: "View Bills",
    modPersonalTitle: "Peaceful Leisure & Mind Gym",
    modPersonalBadge: "Relaxation",
    modPersonalDesc: "Positive daily news summaries, relaxing ragas, stories, and gentle memory puzzles.",
    modPersonalAction: "Relax & Play",
    breathIn: "Gently Breathe In (1, 2, 3, 4)...",
    breathHold: "Hold Gently (1, 2, 3, 4)...",
    breathOut: "Slowly Breathe Out (1, 2, 3, 4)...",
    breathRest: "Rest & Feel at Peace...",
    reassuranceCalm: "You are completely safe. Take your time, there is no hurry.",
    reassuranceNoOtp: "Golden Rule: Never share your OTP, PIN, or password with anyone over call or SMS.",
    btnBack: "Back",
    btnSave: "Save",
    btnCancel: "Cancel",
    btnDone: "Done",
    btnConfirm: "Confirm",
    btnRepeat: "Repeat that",
    btnSpeak: "Speak",
    btnSend: "Send",
    btnListening: "Listening...",
    btnSpeaking: "Speaking (Tap to Stop)",
    btnMarkTaken: "Mark as Taken",
    btnMarkPending: "Mark as Pending",
    btnTaken: "✓ Taken",
    btnPending: "Pending",
    btnVerify: "Check Safety",
    btnSimplify: "Explain in Simple Words",
    btnNextStep: "Next Step",
    btnPrevStep: "Previous Step",
    btnCallAmbulance: "Call Ambulance (108)",
    btnCallDoctor: "Call Doctor",
    btnCallFamily: "Call Family",
    btnReadAloud: "Read Aloud",
    welcomeMessage: "Hello {name}! I am Mitraa, your caring daily companion. I am right here with you. Speak or type anytime—you can ask about your medicines, today's schedule, or simply chat. How are you feeling today?",
    promptSchedule: "📅 What is my schedule today?",
    promptMedicines: "💊 Read my medicines for today",
    promptScam: "🛡️ Is this SMS message safe?",
    promptStory: "📖 Tell me a peaceful uplifting story",
    promptOtp: "💡 Explain what OTP means simply",
    inputPlaceholder: "Ask Mitraa anything (e.g. Can I take paracetamol with food?)...",
    chatSubtitle: "Gentle, patient, natural conversation in English • {name}",
  },

  Hindi: {
    appName: "Mitraa",
    appTagline: "वरिष्ठ नागरिक सेवा केंद्र",
    companionFor: "आपके आदरणीय साथी",
    timeMorning: "🌅 शुभ प्रभात (सुबह)",
    timeAfternoon: "☀️ शुभ दोपहर",
    timeEvening: "🌙 शुभ संध्या (शाम)",
    morningGreeting: "शुभ प्रभात",
    afternoonGreeting: "शुभ दोपहर",
    eveningGreeting: "शुभ संध्या",
    morningGuidance: "एक शांत और सुखद सुबह आ गई है। गुनगुना पानी पिएं, थोड़ा टहलें, और दिन की शुरुआत शांति से करें।",
    afternoonGuidance: "आंखों को आराम दें, पानी पिएं, और मधुर संगीत या किसी अच्छी किताब का आनंद लें।",
    eveningGuidance: "शाम की बत्तियां जल चुकी हैं। परिवार से बात करें, पैरों को आराम दें और शाम की दवाइयां लें।",
    btnSanctuaryDeck: "मुख्य कक्ष (Sanctuary)",
    btnActiveModule: "सक्रिय सेवा",
    btnCalmBreath: "शांत सांस लें",
    btnDaySummary: "आज की दिनचर्या सुनें",
    btnEmergencySOS: "आपातकालीन SOS",
    btnTextSize: "अक्षर आकार",
    btnContrast: "कंट्रास्ट",
    btnSwitchUser: "उपयोगकर्ता बदलें",
    btnSignOut: "लॉग आउट",
    chooseLanguage: "भाषा चुनें",
    dosePending: "खुराक बाकी है",
    dosesPending: "खुराकें बाकी हैं",
    allDosesTaken: "सभी दवाइयां ली गईं",
    taskRemaining: "कार्य बाकी है",
    tasksRemaining: "कार्य बाकी हैं",
    allDoneToday: "आज के सभी काम पूरे",
    activeCompanionNotice: "मित्रा हिंदी में आपकी देखभाल कर रहा है",
    domainCareTitle: "स्वास्थ्य व दैनिक दिनचर्या",
    domainCareTagline: "आपकी दवाइयां, नियमित दिनचर्या, और सुखद बातचीत साथी",
    domainSafetyTitle: "सुरक्षा व मानसिक शांति",
    domainSafetyTagline: "धोखाधड़ी से बचाव, सरल भाषा में पत्र व आपातकालीन सहायता",
    domainLifeTitle: "परिवार व दैनिक जीवन",
    domainLifeTagline: "परिवार से जुड़ाव, डिजिटल सेवाएं व सुकून भरा मनोरंजन",
    modVoiceCompanionTitle: "मित्रा आवाज़ साथी",
    modVoiceCompanionBadge: "प्यारा मित्र साथी",
    modVoiceCompanionDesc: "अपनी मातृभाषा में सहजता से बात करें। दिनचर्या, स्वास्थ्य या प्रेरक कहानियों के बारे में पूछें।",
    modVoiceCompanionAction: "मित्रा से बात करें",
    modHealthTitle: "दवाइयां और स्वास्थ्य डायरी",
    modHealthDesc: "दवाइयों के चित्र, अनुस्मारक अलार्म, डॉक्टर की मुलाकातें और बीपी/शुगर रिकॉर्ड।",
    modHealthAction: "दवाई बॉक्स खोलें",
    modDailyTitle: "दैनिक दिनचर्या व समय-सारणी",
    modDailyDesc: "सुबह की सैर, पूजा, जलपान, परिवार से बातचीत और विश्राम का आसान प्रबंधन।",
    modDailyAction: "दिनचर्या देखें",
    modScamTitle: "धोखाधड़ी व सुरक्षा कवच",
    modScamBadge: "सुरक्षा कवच सक्रिय",
    modScamDesc: "संदिग्ध एसएमएस, लॉटरी कॉल, बैंक धमकी या बिजली कटने के फर्जी संदेशों की तुरंत जांच।",
    modScamAction: "एसएमएस की जांच करें",
    modDocTitle: "दस्तावेज़ व पत्र अनुवादक",
    modDocBadge: "सरल भाषा में",
    modDocDesc: "अस्पताल की पर्चियों, बिजली के बिलों और बैंक पत्रों को सरल व स्पष्ट शब्दों में समझें।",
    modDocAction: "दस्तावेज़ समझें",
    modEmergencyTitle: "आपातकालीन सायरन",
    modEmergencyBadge: "एक स्पर्श में सतर्क",
    modEmergencyDesc: "तुरंत परिवार के मुख्य सदस्य को सूचित करें और स्थानीय एम्बुलेंस या हेल्पलाइन से जुड़ें।",
    modEmergencyAction: "सायरन बजाएं",
    modFamilyTitle: "पारिवारिक मंडल व देखभाल",
    modFamilyBadge: "परिवार से जुड़ाव",
    modFamilyDesc: "दैनिक आवाज़ संदेश साझा करें, बच्चों के फोटो देखें और 'मैं सुरक्षित हूँ' का संदेश भेजें।",
    modFamilyAction: "परिवार केंद्र खोलें",
    modTasksTitle: "सरल डिजिटल कार्य मार्गदर्शिका",
    modTasksBadge: "कदम-दर-कदम",
    modTasksDesc: "टैक्सी बुक करने, ऑनलाइन खरीदारी और व्हाट्सएप कॉल करने के बड़े चित्रों वाले निर्देश।",
    modTasksAction: "ट्यूटोरियल शुरू करें",
    modFinanceTitle: "बिल व पेंशन सहायक",
    modFinanceBadge: "अंतिम तिथि ट्रैकर",
    modFinanceDesc: "बड़े अक्षरों में बिजली-पानी के बिल, पेंशन अनुस्मारक और जीवन प्रमाण पत्र जमा करने की विधि।",
    modFinanceAction: "बिल देखें",
    modPersonalTitle: "सुकून भरा मनोरंजन व मन का व्यायाम",
    modPersonalBadge: "विश्राम",
    modPersonalDesc: "दैनिक सकारात्मक समाचार, शांत शास्त्रीय राग, प्रेरणादायक कहानियां और पहेलियां।",
    modPersonalAction: "आराम करें व खेलें",
    breathIn: "धीमे से सांस अंदर लें (1, 2, 3, 4)...",
    breathHold: "आराम से रोकें (1, 2, 3, 4)...",
    breathOut: "धीरे-धीरे सांस बाहर छोड़ें (1, 2, 3, 4)...",
    breathRest: "विश्राम करें और शांति महसूस करें...",
    reassuranceCalm: "आप पूरी तरह सुरक्षित हैं। कोई जल्दबाजी न करें, आराम से समय लें।",
    reassuranceNoOtp: "स्वर्ण नियम: फोन या मैसेज पर किसी को भी अपना OTP, पिन या पासवर्ड कभी न बताएं।",
    btnBack: "पीछे जाएं",
    btnSave: "सहेजें",
    btnCancel: "रद्द करें",
    btnDone: "हो गया",
    btnConfirm: "पुष्टि करें",
    btnRepeat: "दोबारा बोलें (सुनें)",
    btnSpeak: "बोलें",
    btnSend: "भेजें",
    btnListening: "सुन रहा हूँ...",
    btnSpeaking: "बोल रहा हूँ (रोकने के लिए दबाएं)",
    btnMarkTaken: "दवाई ले ली",
    btnMarkPending: "बाकी रखें",
    btnTaken: "✓ ली गई",
    btnPending: "बाकी है",
    btnVerify: "सुरक्षा जांचें",
    btnSimplify: "सरल शब्दों में समझाएं",
    btnNextStep: "अगला कदम",
    btnPrevStep: "पिछला कदम",
    btnCallAmbulance: "एम्बुलेंस को फोन करें (108)",
    btnCallDoctor: "डॉक्टर को फोन करें",
    btnCallFamily: "परिवार को फोन करें",
    btnReadAloud: "आवाज़ में सुनें",
    welcomeMessage: "नमस्ते {name}! मैं आपका प्यारा साथी मित्रा (Mitraa) हूँ। मैं हमेशा आपके साथ हूँ। आप जब चाहें बोलकर या लिखकर अपनी दवाइयों, आज के काम या बातचीत के लिए पूछ सकते हैं। आज आपकी तबीयत कैसी है?",
    promptSchedule: "📅 आज मेरी क्या दिनचर्या है?",
    promptMedicines: "💊 आज मुझे कौन-सी दवाइयां लेनी हैं?",
    promptScam: "🛡️ क्या यह एसएमएस संदेश सुरक्षित है?",
    promptStory: "📖 मुझे एक प्रेरणादायक और शांतिदायक कहानी सुनाएं",
    promptOtp: "💡 ओटीपी (OTP) का क्या मतलब होता है, सरल भाषा में बताएं",
    inputPlaceholder: "मित्रा से कुछ भी पूछें (जैसे: क्या मैं खाने के बाद पैरासिटामोल ले सकता हूँ?)...",
    chatSubtitle: "हिंदी में सहज, धैर्यवान और आदरपूर्ण बातचीत • {name}",
  },

  Spanish: {
    appName: "Mitraa",
    appTagline: "Santuario de Cuidado para Adultos Mayores",
    companionFor: "Compañero personal de",
    timeMorning: "🌅 Amanecer Radiante",
    timeAfternoon: "☀️ Tarde Soleada",
    timeEvening: "🌙 Atardecer Tranquilo",
    morningGreeting: "Buenos Días",
    afternoonGreeting: "Buenas Tardes",
    eveningGreeting: "Buenas Noches",
    morningGuidance: "Ha llegado una mañana pacífica. Beba agua tibia, estírese suavemente y comencemos el día con serenidad.",
    afternoonGuidance: "Descanse la vista, manténgase hidratado y disfrute de música suave, lectura o una pausa tranquila.",
    eveningGuidance: "Las luces de la tarde están encendidas. Tómese un momento para hablar con la familia, descansar y tomar sus medicamentos.",
    btnSanctuaryDeck: "Inicio Santuario",
    btnActiveModule: "Módulo Activo",
    btnCalmBreath: "Respiración Serena",
    btnDaySummary: "Escuchar Resumen del Día",
    btnEmergencySOS: "SOS",
    btnTextSize: "Tamaño",
    btnContrast: "Contraste",
    btnSwitchUser: "Cambiar Usuario",
    btnSignOut: "Cerrar Sesión",
    chooseLanguage: "Elegir Idioma",
    dosePending: "dosis pendiente",
    dosesPending: "dosis pendientes",
    allDosesTaken: "Todas las dosis tomadas",
    taskRemaining: "tarea pendiente",
    tasksRemaining: "tareas pendientes",
    allDoneToday: "Todo completado hoy",
    activeCompanionNotice: "Mitraa le acompaña cariñosamente en español",
    domainCareTitle: "Cuidado y Vitalidad Diaria",
    domainCareTagline: "Sus medicamentos, ritmo apacible y compañero de conversación",
    domainSafetyTitle: "Tranquilidad y Seguridad",
    domainSafetyTagline: "Protección contra estafas, cartas explicadas y ayuda de emergencia",
    domainLifeTitle: "Conexión y Vida Cotidiana",
    domainLifeTagline: "Cerca de su familia, trámites digitales y entretenimiento sereno",
    modVoiceCompanionTitle: "Compañero de Voz Mitraa",
    modVoiceCompanionBadge: "Amigo Cercano con IA",
    modVoiceCompanionDesc: "Hable con naturalidad en su idioma. Pregunte sobre su día, consejos de salud o escuche una historia.",
    modVoiceCompanionAction: "Conversar con Mitraa",
    modHealthTitle: "Medicamentos y Registro de Salud",
    modHealthDesc: "Pastillero visual con fotos, recordatorios, citas médicas y registro de presión y azúcar.",
    modHealthAction: "Abrir Pastillero",
    modDailyTitle: "Rutina Diaria y Horario",
    modDailyDesc: "Organizador de su día: paseo matutino, oración, agua, llamadas y siesta reparadora.",
    modDailyAction: "Ver Horario",
    modScamTitle: "Escudo Anti-Fraude y Estafas",
    modScamBadge: "Escudo Activo",
    modScamDesc: "Verificación instantánea de SMS sospechosos, llamadas de lotería y amenazas bancarias.",
    modScamAction: "Verificar Mensaje",
    modDocTitle: "Simplificador de Documentos y Cartas",
    modDocBadge: "Lenguaje Sencillo",
    modDocDesc: "Traduce informes médicos, facturas de luz y cartas del banco a un lenguaje claro y fácil.",
    modDocAction: "Simplificar Documento",
    modEmergencyTitle: "Sirena de Emergencia SOS",
    modEmergencyBadge: "Alerta de Un Toque",
    modEmergencyDesc: "Alerta inmediatamente a su familiar cuidador y llama a la ambulancia o línea de ayuda.",
    modEmergencyAction: "Activar Sirena",
    modFamilyTitle: "Círculo Familiar y Cuidadores",
    modFamilyBadge: "Sincronizado con Familia",
    modFamilyDesc: "Comparta notas de voz, vea fotos de sus nietos y envíe avisos de 'estoy bien'.",
    modFamilyAction: "Abrir Centro Familiar",
    modTasksTitle: "Guías Prácticas Digitales",
    modTasksBadge: "Paso a Paso",
    modTasksDesc: "Instrucciones ilustradas para pedir transporte, compras en línea y videollamadas de WhatsApp.",
    modTasksAction: "Comenzar Guía",
    modFinanceTitle: "Asistente de Facturas y Pensión",
    modFinanceBadge: "Control de Vencimientos",
    modFinanceDesc: "Recibos en letra grande, avisos de pensión y guía para trámites de supervivencia.",
    modFinanceAction: "Ver Facturas",
    modPersonalTitle: "Descanso Sereno y Gimnasia Mental",
    modPersonalBadge: "Relajación",
    modPersonalDesc: "Noticias positivas del día, melodías relajantes, cuentos amenos y acertijos.",
    modPersonalAction: "Relajarse y Jugar",
    breathIn: "Inhale suavemente (1, 2, 3, 4)...",
    breathHold: "Mantenga con calma (1, 2, 3, 4)...",
    breathOut: "Exhale despacio (1, 2, 3, 4)...",
    breathRest: "Descanse y sienta paz...",
    reassuranceCalm: "Está completamente a salvo. Tómese todo su tiempo, no hay prisa.",
    reassuranceNoOtp: "Regla de Oro: Nunca comparta su código OTP, clave o contraseña con nadie por teléfono.",
    btnBack: "Atrás",
    btnSave: "Guardar",
    btnCancel: "Cancelar",
    btnDone: "Listo",
    btnConfirm: "Confirmar",
    btnRepeat: "Repetir (Escuchar)",
    btnSpeak: "Hablar",
    btnSend: "Enviar",
    btnListening: "Escuchando...",
    btnSpeaking: "Hablando (Toque para parar)",
    btnMarkTaken: "Marcar como tomada",
    btnMarkPending: "Dejar pendiente",
    btnTaken: "✓ Tomada",
    btnPending: "Pendiente",
    btnVerify: "Comprobar Seguridad",
    btnSimplify: "Explicar en Palabras Sencillas",
    btnNextStep: "Siguiente Paso",
    btnPrevStep: "Paso Anterior",
    btnCallAmbulance: "Llamar Ambulancia (108 / 911)",
    btnCallDoctor: "Llamar al Médico",
    btnCallFamily: "Llamar a la Familia",
    btnReadAloud: "Leer en Voz Alta",
    welcomeMessage: "¡Hola {name}! Soy Mitraa, tu compañero diario de confianza. Estoy aquí a tu lado. Habla o escribe cuando gustes: puedes preguntarme sobre tus medicamentos, tus planes del día o simplemente charlar. ¿Cómo te sientes hoy?",
    promptSchedule: "📅 ¿Cuál es mi horario para hoy?",
    promptMedicines: "💊 ¿Qué medicamentos debo tomar hoy?",
    promptScam: "🛡️ ¿Es seguro este mensaje SMS que recibí?",
    promptStory: "📖 Cuéntame una historia bonita y reconfortante",
    promptOtp: "💡 ¿Qué significa un código OTP en palabras sencillas?",
    inputPlaceholder: "Pregunte a Mitraa lo que desee (ej. ¿Puedo tomar paracetamol con comida?)...",
    chatSubtitle: "Conversación cálida, paciente y respetuosa en español • {name}",
  },

  Tamil: {
    appName: "Mitraa",
    appTagline: "முதியோர் நல்வாழ்வு இல்லம்",
    companionFor: "அன்பான தோழன்",
    timeMorning: "🌅 இனிய காலை விடியல்",
    timeAfternoon: "☀️ பொன்னான மதியம்",
    timeEvening: "🌙 அமைதியான மாலைப்பொழுது",
    morningGreeting: "காலை வணக்கம்",
    afternoonGreeting: "மதிய வணக்கம்",
    eveningGreeting: "மாலை வணக்கம்",
    morningGuidance: "அமைதியான காலை மலர்ந்துள்ளது. வெதுவெதுப்பான நீர் அருந்தி, மெதுவாக நடைபயிற்சி செய்து, அமைதியுடன் நாளைத் தொடங்குங்கள்.",
    afternoonGuidance: "கண்களுக்கு ஓய்வு கொடுங்கள், நீர் அருந்துங்கள், இனிமையான இசை அல்லது புத்தகத்தை ரசியுங்கள்.",
    eveningGuidance: "மாலை விளக்குகள் ஏற்றிவிட்டன. குடும்பத்தினருடன் பேசி, கால்களுக்கு ஓய்வளித்து, மாலை மருந்துகளை உட்கொள்ளுங்கள்.",
    btnSanctuaryDeck: "முதன்மை அறை (Sanctuary)",
    btnActiveModule: "தற்போதைய சேவை",
    btnCalmBreath: "அமைதியான மூச்சுப்பயிற்சி",
    btnDaySummary: "இன்றைய விவரங்களை கேட்க",
    btnEmergencySOS: "அவசர உதவி SOS",
    btnTextSize: "எழுத்து அளவு",
    btnContrast: "கான்ட்ராஸ்ட்",
    btnSwitchUser: "பயனர் மாற்றம்",
    btnSignOut: "வெளியேறு",
    chooseLanguage: "மொழி தேர்வு",
    dosePending: "மருந்து பாக்கி",
    dosesPending: "மருந்துகள் பாக்கி",
    allDosesTaken: "அனைத்து மருந்துகளும் எடுக்கப்பட்டன",
    taskRemaining: "வேலை பாக்கி",
    tasksRemaining: "வேலைகள் பாக்கி",
    allDoneToday: "இன்றைய பணிகள் நிறைவடைந்தன",
    activeCompanionNotice: "மித்ரா தமிழில் உங்களை அன்போடு கவனிக்கிறது",
    domainCareTitle: "சுகாதாரமும் தினசரி புத்துணர்வும்",
    domainCareTagline: "உங்கள் மருந்துகள், நிதானமான தினசரி வழக்கம் மற்றும் உரையாடல் துணை",
    domainSafetyTitle: "பாதுகாப்பும் மன அமைதியும்",
    domainSafetyTagline: "மோசடிகளில் இருந்து பாதுகாப்பு, எளிய மொழி ஆவணங்கள் மற்றும் உடனடி அவசர உதவி",
    domainLifeTitle: "குடும்பமும் அன்றாட வாழ்க்கையும்",
    domainLifeTagline: "குடும்பத்தினருடன் தொடர்பு, டிஜிட்டல் சேவைகள் மற்றும் நிம்மதியான பொழுதுபோக்கு",
    modVoiceCompanionTitle: "மித்ரா குரல் தோழன்",
    modVoiceCompanionBadge: "அன்பான AI நண்பன்",
    modVoiceCompanionDesc: "உங்கள் சொந்த மொழியில் இயல்பாகப் பேசுங்கள். மருந்து, வழக்கம் அல்லது கதைகள் பற்றி கேளுங்கள்.",
    modVoiceCompanionAction: "மித்ராவுடன் பேசுங்கள்",
    modHealthTitle: "மருந்துகளும் சுகாதாரக் குறிப்பேடும்",
    modHealthDesc: "மருந்துப் படங்கள், நினைவூட்டல் அலாரம், மருத்துவர் சந்திப்புகள் மற்றும் ரத்த அழுத்தம்/சர்க்கரை பதிவு.",
    modHealthAction: "மருந்து பெட்டியை திற",
    modDailyTitle: "தினசரி வழக்கம் மற்றும் அட்டவணை",
    modDailyDesc: "காலை நடைபயிற்சி, பிரார்த்தனை, தண்ணீர், குடும்ப அழைப்புகள் மற்றும் ஓய்வு நேரம்.",
    modDailyAction: "அட்டவணையை காண்க",
    modScamTitle: "மோசடி தடுப்பு கவசம்",
    modScamBadge: "கவசம் இயங்குகிறது",
    modScamDesc: "சந்தேகத்திற்குரிய எஸ்.எம்.எஸ், லாட்டரி அழைப்புகள், மின்சார கட்டணம் பற்றிய போலி செய்திகளை சோதிக்கவும்.",
    modScamAction: "எஸ்.எம்.எஸ்-ஐ சோதிக்கவும்",
    modDocTitle: "கடிதங்கள் மற்றும் ஆவணங்களை எளிதாக்கி",
    modDocBadge: "எளிய தமிழில்",
    modDocDesc: "மருத்துவமனை அறிக்கைகள், மின் கட்டணங்கள், வங்கி கடிதங்களை மிக எளிய தமிழில் விளக்குகிறது.",
    modDocAction: "ஆவணத்தை விளக்கு",
    modEmergencyTitle: "அவசரக்கால சைரன்",
    modEmergencyBadge: "ஒற்றை தொடுதல் உதவி",
    modEmergencyDesc: "குடும்பத்தினருக்கு உடனடியாக செய்தி அனுப்பி, அவசர ஆம்புலன்ஸ் அல்லது உதவி எண்ணை அழைக்கிறது.",
    modEmergencyAction: "சைரன் ஒலிக்க",
    modFamilyTitle: "குடும்ப வட்டமும் பராமரிப்பாளரும்",
    modFamilyBadge: "குடும்ப இணைப்பு",
    modFamilyDesc: "குரல் பதிவுகளை பகிருங்கள், பேரக்குழந்தைகளின் புகைப்படங்களை பாருங்கள், 'நான் நலம்' என்று தெரிவியுங்கள்.",
    modFamilyAction: "குடும்ப அரங்கை திற",
    modTasksTitle: "டிஜிட்டல் பணிகள் எளிய வழிகாட்டி",
    modTasksBadge: "படி படியாக",
    modTasksDesc: "டாக்சி பதிவு செய்தல், மளிகை வாங்குதல், வாட்ஸ்அப் அழைப்பு செய்வதற்கான எளிய வழிகாட்டி.",
    modTasksAction: "வழிகாட்டலை தொடங்கு",
    modFinanceTitle: "கட்டணங்கள் மற்றும் ஓய்வூதிய உதவியாளர்",
    modFinanceBadge: "கடைசி தேதி நினைவூட்டல்",
    modFinanceDesc: "பெரிய எழுத்துக்களில் மின் கட்டணம், ஓய்வூதிய நினைவூட்டல் மற்றும் வாழ்நாள் சான்றிதழ் வழிகாட்டி.",
    modFinanceAction: "கட்டணங்களை காண்க",
    modPersonalTitle: "அமைதியான பொழுதுபோக்கும் மனப்பயிற்சியும்",
    modPersonalBadge: "ஓய்வும் புத்துணர்வும்",
    modPersonalDesc: "தினசரி நற்செய்திகள், இனிமையான ராகங்கள், தன்னம்பிக்கை கதைகள் மற்றும் புதிர்கள்.",
    modPersonalAction: "ஓய்வெடுத்து மகிழுங்கள்",
    breathIn: "மெதுவாக மூச்சை உள்ளே இழுக்கவும் (1, 2, 3, 4)...",
    breathHold: "அமைதியாக நிறுத்தவும் (1, 2, 3, 4)...",
    breathOut: "மெதுவாக மூச்சை வெளியே விடவும் (1, 2, 3, 4)...",
    breathRest: "ஓய்வெடுத்து அமைதியை உணருங்கள்...",
    reassuranceCalm: "நீங்கள் முற்றிலும் பாதுகாப்பாக உள்ளீர்கள். நிதானமாக செய்யுங்கள், அவசரம் வேண்டாம்.",
    reassuranceNoOtp: "பொன்னான விதி: தொலைபேசியிலோ மெசேஜிலோ யாருக்கும் உங்கள் OTP அல்லது கடவுச்சொல்லை தராதீர்கள்.",
    btnBack: "பின்செல்க",
    btnSave: "சேமி",
    btnCancel: "ரத்து செய்",
    btnDone: "முடிந்தது",
    btnConfirm: "உறுதி செய்",
    btnRepeat: "மீண்டும் சொல் (கேட்க)",
    btnSpeak: "பேசுக",
    btnSend: "அனுப்பு",
    btnListening: "கேட்கிறது...",
    btnSpeaking: "பேசுகிறது (நிறுத்த தொடவும்)",
    btnMarkTaken: "மருந்து எடுத்துக்கொண்டேன்",
    btnMarkPending: "பாக்கி வைக்க",
    btnTaken: "✓ எடுக்கப்பட்டது",
    btnPending: "பாக்கி",
    btnVerify: "பாதுகாப்பை சோதி",
    btnSimplify: "எளிய வார்த்தைகளில் விளக்கு",
    btnNextStep: "அடுத்த படி",
    btnPrevStep: "முந்தைய படி",
    btnCallAmbulance: "ஆம்புலன்ஸ் அழைக்க (108)",
    btnCallDoctor: "மருத்துவரை அழைக்க",
    btnCallFamily: "குடும்பத்தை அழைக்க",
    btnReadAloud: "குரலில் வாசிக்க",
    welcomeMessage: "வணக்கம் {name}! நான் உங்கள் பாசமுள்ள தோழன் மித்ரா (Mitraa). நான் எப்போதும் உங்களுடன் இருக்கிறேன். நீங்கள் எப்போது வேண்டுமானாலும் உங்கள் மருந்துகள், இன்றைய பணிகள் பற்றி என்னிடம் பேசலாம் அல்லது தட்டச்சு செய்யலாம். இன்று உங்கள் உடல்நலம் எப்படி உள்ளது?",
    promptSchedule: "📅 இன்று எனது தினசரி திட்டம் என்ன?",
    promptMedicines: "💊 இன்று நான் என்னென்ன மருந்துகள் எடுக்க வேண்டும்?",
    promptScam: "🛡️ இந்த எஸ்.எம்.எஸ் செய்தி பாதுகாப்பானதா?",
    promptStory: "📖 எனக்கு ஒரு அழகான அமைதியான கதை கூறுங்கள்",
    promptOtp: "💡 OTP என்றால் என்ன என்பதை எளிய தமிழில் விளக்குங்கள்",
    inputPlaceholder: "மித்ராவிடம் எது வேண்டுமானாலும் கேளுங்கள்...",
    chatSubtitle: "தமிழில் கனிவான, பொறுமையான உரையாடல் • {name}",
  },

  Bengali: {
    appName: "Mitraa",
    appTagline: "প্রবীণ সেবা আশ্রম",
    companionFor: "আপনার স্নেহময় সঙ্গী",
    timeMorning: "🌅 সুপ্রভাত (সকাল)",
    timeAfternoon: "☀️ শুভ দুপুর",
    timeEvening: "🌙 শুভ সন্ধ্যা",
    morningGreeting: "সুপ্রভাত",
    afternoonGreeting: "শুভ দুপুর",
    eveningGreeting: "শুভ সন্ধ্যা",
    morningGuidance: "একটি শান্ত ও সুন্দর সকাল এসেছে। হালকা গরম জল পান করুন, একটু হাঁটাহাঁটি করুন এবং দিনটি শান্তভাবে শুরু করুন।",
    afternoonGuidance: "চোখকে বিশ্রাম দিন, জল পান করুন এবং সুমধুর গান বা কোনো ভালো বই উপভোগ করুন।",
    eveningGuidance: "সন্ধ্যার প্রদীপ জ্বলে উঠেছে। পরিবারের সাথে কথা বলুন, পা বিশ্রাম দিন এবং সন্ধ্যার ওষুধ নিন।",
    btnSanctuaryDeck: "মূল কক্ষ (Sanctuary)",
    btnActiveModule: "সক্রিয় সেবা",
    btnCalmBreath: "শান্ত শ্বাস নিন",
    btnDaySummary: "আজকের দিনের বিবরণ শুনুন",
    btnEmergencySOS: "জরুরি SOS",
    btnTextSize: "অক্ষরের মাপ",
    btnContrast: "কনট্রাস্ট",
    btnSwitchUser: "ব্যবহারকারী বদল",
    btnSignOut: "লগ আউট",
    chooseLanguage: "ভাষা নির্বাচন",
    dosePending: "ওষুধ বাকি",
    dosesPending: "ওষুধ বাকি আছে",
    allDosesTaken: "সব ওষুধ খাওয়া হয়েছে",
    taskRemaining: "কাজ বাকি",
    tasksRemaining: "কাজ বাকি আছে",
    allDoneToday: "আজকের সব কাজ সম্পন্ন",
    activeCompanionNotice: "মিত্রা বাংলায় আপনার যত্ন নিচ্ছে",
    domainCareTitle: "স্বাস্থ্য ও প্রাত্যহিক দিনলিপি",
    domainCareTagline: "আপনার ওষুধ, শান্ত দিনলিপি ও মিষ্টি আলাপচারিতার সঙ্গী",
    domainSafetyTitle: "সুরক্ষা ও মানসিক শান্তি",
    domainSafetyTagline: "জালিয়াতি থেকে রক্ষা, সহজ ভাষায় চিঠি ও তাৎক্ষণিক জরুরি সাহায্য",
    domainLifeTitle: "পরিবার ও প্রাত্যহিক জীবন",
    domainLifeTagline: "পরিবারের সাথে যোগাযোগ, ডিজিটাল সেবা ও মনোরম বিনোদন",
    modVoiceCompanionTitle: "মিত্রা ভয়েস সঙ্গী",
    modVoiceCompanionBadge: "স্নেহশীল AI বন্ধু",
    modVoiceCompanionDesc: "নিজের ভাষায় স্বচ্ছন্দে কথা বলুন। ওষুধ, দিনলিপি বা প্রেরণাদায়ী গল্প শুনুন।",
    modVoiceCompanionAction: "মিত্রার সাথে কথা বলুন",
    modHealthTitle: "ওষুধ ও স্বাস্থ্য ডায়েরি",
    modHealthDesc: "ওষুধের ছবি, মনে করিয়ে দেওয়ার অ্যালার্ম, ডাক্তারের পরামর্শ ও রক্তচাপ/সুগার রেকর্ড।",
    modHealthAction: "ওষুধের বাক্স খুলুন",
    modDailyTitle: "দৈনিক রুটিন ও সময়সূচী",
    modDailyDesc: "সকালের হাঁটা, প্রার্থনা, জল খাওয়া, পরিবারের সাথে কথা ও বিশ্রামের সময়।",
    modDailyAction: "সময়সূচী দেখুন",
    modScamTitle: "জালিয়াতি সুরক্ষা কবচ",
    modScamBadge: "কবচ সক্রিয়",
    modScamDesc: "সন্দেহজনক মেসেজ, লটারি কল, ব্যাংক বা বিদ্যুৎ বিলের ভুয়ো বার্তার দ্রুত যাচাই।",
    modScamAction: "মেসেজ যাচাই করুন",
    modDocTitle: "নথিপত্র ও চিঠির সরলীকরণ",
    modDocBadge: "সহজ বাংলায়",
    modDocDesc: "হাসপাতালের কাগজপত্র, বিদ্যুৎ বিল ও ব্যাংকের চিঠি সহজ সরল বাংলায় বুঝুন।",
    modDocAction: "নথিপত্র বুঝুন",
    modEmergencyTitle: "জরুরি সাইরেন",
    modEmergencyBadge: "এক স্পর্শে সতর্কতা",
    modEmergencyDesc: "পরিবারকে সঙ্গে সঙ্গে জানান এবং জরুরি অ্যাম্বুলেন্স বা হেল্পলাইনে কল করুন।",
    modEmergencyAction: "সাইরেন বাজান",
    modFamilyTitle: "পারিবারিক বৃত্ত ও যোগাযোগ",
    modFamilyBadge: "পরিবারের সংযোগ",
    modFamilyDesc: "ভয়েস মেসেজ পাঠান, নাতি-নাতনিদের ছবি দেখুন এবং 'আমি ভালো আছি' জানান।",
    modFamilyAction: "পরিবার কেন্দ্র খুলুন",
    modTasksTitle: "ডিজিটাল কাজের সহজ নির্দেশিকা",
    modTasksBadge: "ধাপে ধাপে",
    modTasksDesc: "গাড়ি বুক করা, অনলাইন বাজার ও হোয়াটসঅ্যাপ কল করার সচিত্র নির্দেশ।",
    modTasksAction: "নির্দেশিকা শুরু করুন",
    modFinanceTitle: "বিল ও পেনশন সহকারী",
    modFinanceBadge: "শেষ তারিখ ট্র্যাকার",
    modFinanceDesc: "বড় হরফে বিল দেখা, পেনশনের হিসাব ও জীবন প্রমাণপত্র জমার নিয়মাবলী।",
    modFinanceAction: "বিল দেখুন",
    modPersonalTitle: "শান্ত বিনোদন ও মনের ব্যায়াম",
    modPersonalBadge: "বিশ্রাম ও আনন্দ",
    modPersonalDesc: "ইতিবাচক খবর, শান্ত রাগসঙ্গীত, শিক্ষণীয় গল্প ও বুদ্ধিদীপ্ত ধাঁধা।",
    modPersonalAction: "বিশ্রাম নিন ও খেলুন",
    breathIn: "ধীরে ধীরে শ্বাস নিন (1, 2, 3, 4)...",
    breathHold: "ধীরে ধরে রাখুন (1, 2, 3, 4)...",
    breathOut: "ধীরে ধীরে শ্বাস ছাড়ুন (1, 2, 3, 4)...",
    breathRest: "বিশ্রাম নিন ও শান্তি অনুভব করুন...",
    reassuranceCalm: "আপনি পুরোপুরি সুরক্ষিত। ধীরে সুস্থে করুন, কোনো তাড়াহুড়ো নেই।",
    reassuranceNoOtp: "সোনালী নিয়ম: ফোন বা মেসেজে কাউকে কখনো নিজের OTP, পিন বা পাসওয়ার্ড দেবেন না।",
    btnBack: "ফিরে যান",
    btnSave: "সংরক্ষণ করুন",
    btnCancel: "বাতিল করুন",
    btnDone: "সম্পন্ন",
    btnConfirm: "নিশ্চিত করুন",
    btnRepeat: "আবার বলুন (শুনুন)",
    btnSpeak: "বলুন",
    btnSend: "পাঠান",
    btnListening: "শুনছি...",
    btnSpeaking: "বলছি (থামাতে স্পর্শ করুন)",
    btnMarkTaken: "ওষুধ খাওয়া হয়েছে",
    btnMarkPending: "বাকি রাখুন",
    btnTaken: "✓ খাওয়া হয়েছে",
    btnPending: "বাকি আছে",
    btnVerify: "সুরক্ষা পরীক্ষা",
    btnSimplify: "সহজ কথায় বুঝিয়ে দিন",
    btnNextStep: "পরবর্তী ধাপ",
    btnPrevStep: "পূর্ববর্তী ধাপ",
    btnCallAmbulance: "অ্যাম্বুলেন্সে কল (108)",
    btnCallDoctor: "ডাক্তারকে কল",
    btnCallFamily: "পরিবারকে কল",
    btnReadAloud: "পড়ে শুনুন",
    welcomeMessage: "নমস্কার {name}! আমি আপনার স্নেহময় সঙ্গী মিত্রা (Mitraa)। আমি সর্বদা আপনার পাশে আছি। আপনি যেকোনো সময় নিজের ওষুধ, কাজের তালিকা বা কথা বলার জন্য আমাকে বলতে পারেন। আজ কেমন আছেন?",
    promptSchedule: "📅 আজ আমার কী কী কাজ রয়েছে?",
    promptMedicines: "💊 আজ আমাকে কোন কোন ওষুধ খেতে হবে?",
    promptScam: "🛡️ এই মেসেজটি কি নিরাপদ নাকি প্রতারণা?",
    promptStory: "📖 আমাকে একটি সুন্দর অনুপ্রেরণামূলক গল্প শোনান",
    promptOtp: "💡 ওটিপি (OTP) বলতে সহজ কথায় কী বোঝায়?",
    inputPlaceholder: "মিত্রাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন...",
    chatSubtitle: "বাংলায় মিষ্টি ও ধৈর্যশীল কথোপকথন • {name}",
  },

  Telugu: {
    appName: "Mitraa",
    appTagline: "వృద్ధుల సంరక్షణ కేంద్రం",
    companionFor: "మీ ఆత్మీయ మిత్రుడు",
    timeMorning: "🌅 శుభోదయం (ఉదయం)",
    timeAfternoon: "☀️ శుభ మధ్యాహ్నం",
    timeEvening: "🌙 శుభ సాయంత్రం",
    morningGreeting: "శుభోదయం",
    afternoonGreeting: "శుభ మధ్యాహ్నం",
    eveningGreeting: "శుభ సాయంత్రం",
    morningGuidance: "ప్రశాంతమైన ఉదయం మొదలైంది. గోరువెచ్చని నీరు తాగి, చిన్నపాటి నడక చేసి, ప్రశాంతంగా రోజును ప్రారంభించండి.",
    afternoonGuidance: "కళ్లకు విశ్రాంతి ఇవ్వండి, నీరు తాగండి మరియు శ్రావ్యమైన సంగీతం లేదా మంచి పుస్తకాన్ని ఆస్వాదించండి.",
    eveningGuidance: "సాయంత్రపు దీపాలు వెలిగాయి. కుటుంబంతో మాట్లాడి, కాళ్లకు విశ్రాంతినిచ్చి, సాయంత్రపు మందులు తీసుకోండి.",
    btnSanctuaryDeck: "ప్రధాన గది (Sanctuary)",
    btnActiveModule: "ప్రస్తుత సేవ",
    btnCalmBreath: "ప్రశాంత శ్వాస",
    btnDaySummary: "నేటి వివరాలు వినండి",
    btnEmergencySOS: "అత్యవసర SOS",
    btnTextSize: "అక్షరాల పరిమాణం",
    btnContrast: "కాంట్రాస్ట్",
    btnSwitchUser: "యూజర్ మార్పు",
    btnSignOut: "లాగ్ అవుట్",
    chooseLanguage: "భాష ఎంచుకోండి",
    dosePending: "మోతాదు మిగిలింది",
    dosesPending: "మోతాదులు మిగిలాయి",
    allDosesTaken: "అన్ని మందులు తీసుకున్నారు",
    taskRemaining: "పని మిగిలింది",
    tasksRemaining: "పనులు మిగిలాయి",
    allDoneToday: "నేటి పనులన్నీ పూర్తయ్యాయి",
    activeCompanionNotice: "మిత్రా తెలుగులో మీకు అండగా ఉంది",
    domainCareTitle: "ఆరోగ్యం & దినచర్య",
    domainCareTagline: "మీ మందులు, నిదానమైన దినచర్య మరియు ఆత్మీయ సంభాషణల తోడు",
    domainSafetyTitle: "రక్షణ & మనశ్శాంతి",
    domainSafetyTagline: "మోసాల నుంచి రక్షణ, సులభమైన భాషలో పత్రాలు & అత్యవసర సహాయం",
    domainLifeTitle: "కుటుంబం & దైనందిన జీవితం",
    domainLifeTagline: "కుటుంబంతో అనుబంధం, డిజిటల్ సేవలు & ప్రశాంత వినోదం",
    modVoiceCompanionTitle: "మిత్రా వాయిస్ తోడు",
    modVoiceCompanionBadge: "ఆత్మీయ AI నేస్తం",
    modVoiceCompanionDesc: "మీ మాతృభాషలో సహజంగా మాట్లాడండి. మందులు, దినచర్య లేదా మంచి కథల గురించి అడగండి.",
    modVoiceCompanionAction: "మిత్రాతో మాట్లాడండి",
    modHealthTitle: "మందులు & ఆరోగ్య రికార్డు",
    modHealthDesc: "మందుల చిత్రాలు, రిమైండర్ అలారాలు, డాక్టర్ అపాయింట్‌మెంట్లు & బీపీ/షుగర్ వివరాలు.",
    modHealthAction: "మందుల పెట్టె తెరవండి",
    modDailyTitle: "దినచర్య & సమయ పట్టిక",
    modDailyDesc: "ఉదయపు నడక, పూజ, మంచినీరు, కుటుంబ పిలుపులు మరియు విశ్రాంతి సమయం.",
    modDailyAction: "పట్టికను చూడండి",
    modScamTitle: "మోసాల నివారణ కవచం",
    modScamBadge: "కవచం సిద్ధంగా ఉంది",
    modScamDesc: "అనుమానాస్పద సందేశాలు, లాటరీ కాల్స్, కరెంట్ బిల్లుల బెదిరింపుల తక్షణ తనిఖీ.",
    modScamAction: "సందేశం తనిఖీ చేయండి",
    modDocTitle: "పత్రాల సరళీకరణ",
    modDocBadge: "సులభమైన తెలుగులో",
    modDocDesc: "ఆసుపత్రి పత్రాలు, కరెంట్ బిల్లులు, బ్యాంక్ ఉత్తరాలను తేలికైన మాటల్లో అర్థం చేసుకోండి.",
    modDocAction: "పత్రం అర్థం చేసుకోండి",
    modEmergencyTitle: "అత్యవసర సైరన్",
    modEmergencyBadge: "ఒక్క స్పర్శతో అలర్ట్",
    modEmergencyDesc: "కుటుంబ సభ్యులకు తక్షణ సమాచారం పంపుతుంది మరియు అంబులెన్స్ సహాయం అందిస్తుంది.",
    modEmergencyAction: "సైరన్ మోగించండి",
    modFamilyTitle: "కుటుంబ బంధం & సంరక్షకులు",
    modFamilyBadge: "కుటుంబ అనుసంధానం",
    modFamilyDesc: "వాయిస్ సందేశాలు పంపండి, పిల్లల ఫోటోలు చూడండి, 'నేను క్షేమంగా ఉన్నాను' అని తెలపండి.",
    modFamilyAction: "కుటుంబ కేంద్రాన్ని తెరవండి",
    modTasksTitle: "డిజిటల్ పనుల సులభ గైడ్",
    modTasksBadge: "దశలవారీగా",
    modTasksDesc: "క్యాబ్ బుకింగ్, ఆన్‌లైన్ షాపింగ్, వాట్సాప్ కాల్స్ చేయడానికి స్పష్టమైన సూచనలు.",
    modTasksAction: "గైడ్ ప్రారంభించండి",
    modFinanceTitle: "బిల్లులు & పెన్షన్ సహాయకుడు",
    modFinanceBadge: "గడువు తేదీల సమాచారం",
    modFinanceDesc: "పెద్ద అక్షరాలతో బిల్లులు, పెన్షన్ వివరాలు & జీవన్ ప్రమాణ్ పత్ర సమర్పణ విధానం.",
    modFinanceAction: "బిల్లులు చూడండి",
    modPersonalTitle: "ప్రశాంత వినోదం & మెదడుకు కసరత్తు",
    modPersonalBadge: "విశ్రాంతి & ఉల్లాసం",
    modPersonalDesc: "మంచి వార్తలు, ప్రశాంత రాగాలు, స్ఫూర్తిదాయక కథలు మరియు సరదా పొడుపుకథలు.",
    modPersonalAction: "విశ్రాంతి తీసుకోండి",
    breathIn: "నెమ్మదిగా శ్వాస తీసుకోండి (1, 2, 3, 4)...",
    breathHold: "నెమ్మదిగా ఆపండి (1, 2, 3, 4)...",
    breathOut: "నెమ్మదిగా శ్వాస వదలండి (1, 2, 3, 4)...",
    breathRest: "విశ్రాంతి తీసుకోండి, ప్రశాంతతను అనుభవించండి...",
    reassuranceCalm: "మీరు పూర్తి రక్షణలో ఉన్నారు. నిదానంగా చేయండి, ఎలాంటి తొందర లేదు.",
    reassuranceNoOtp: "బంగారు నియమం: ఫోన్ లేదా సందేశాలలో మీ OTP లేదా పిన్ నంబర్ ఎవరికీ చెప్పవద్దు.",
    btnBack: "వెనక్కి",
    btnSave: "భద్రపరుచు",
    btnCancel: "రద్దు చేయి",
    btnDone: "పూర్తయింది",
    btnConfirm: "ధృవీకరించు",
    btnRepeat: "మళ్ళీ చెప్పండి (వినండి)",
    btnSpeak: "మాట్లాడండి",
    btnSend: "పంపండి",
    btnListening: "వింటున్నాను...",
    btnSpeaking: "మాట్లాడుతున్నాను (ఆపడానికి తాకండి)",
    btnMarkTaken: "మందు తీసుకున్నాను",
    btnMarkPending: "మిగిలి ఉంది",
    btnTaken: "✓ తీసుకున్నారు",
    btnPending: "మిగిలి ఉంది",
    btnVerify: "రక్షణ తనిఖీ",
    btnSimplify: "సరళమైన మాటల్లో వివరించండి",
    btnNextStep: "తర్వాతి దశ",
    btnPrevStep: "మునుపటి దశ",
    btnCallAmbulance: "అంబులెన్స్ కాల్ (108)",
    btnCallDoctor: "డాక్టర్ కాల్",
    btnCallFamily: "కుటుంబ సభ్యులకు కాల్",
    btnReadAloud: "చదివి వినిపించు",
    welcomeMessage: "నమస్కారం {name}! నేను మీ ఆత్మీయ మిత్రుడు మిత్రా (Mitraa). నేను ఎల్లప్పుడూ మీకు తోడుగా ఉంటాను. మీ మందులు, నేటి పనులు లేదా ముచ్చట్ల కోసం నాతో మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు. ఈరోజు మీ ఆరోగ్యం ఎలా ఉంది?",
    promptSchedule: "📅 ఈరోజు నా దినచర్య ఏమిటి?",
    promptMedicines: "💊 ఈరోజు నేను వేసుకోవాల్సిన మందులు ఏమిటి?",
    promptScam: "🛡️ ఈ సందేశం సురక్షితమైనదేనా?",
    promptStory: "📖 నాకు ఒక మంచి స్పూర్తిదాయక కథ చెప్పండి",
    promptOtp: "💡 ఓటీపీ (OTP) అంటే ఏమిటో సులభంగా చెప్పండి",
    inputPlaceholder: "మిత్రాని ఏదైనా అడగండి...",
    chatSubtitle: "తెలుగులో ఆత్మీయమైన, ఓపికతో కూడిన సంభాషణ • {name}",
  },

  Marathi: {
    appName: "Mitraa",
    appTagline: "ज्येष्ठ नागरिक सेवा केंद्र",
    companionFor: "आपला आदरणीय सोबती",
    timeMorning: "🌅 शुभ सकाळ",
    timeAfternoon: "☀️ शुभ दुपार",
    timeEvening: "🌙 शुभ संध्याकाळ",
    morningGreeting: "शुभ सकाळ",
    afternoonGreeting: "शुभ दुपार",
    eveningGreeting: "शुभ संध्याकाळ",
    morningGuidance: "शांत व प्रसन्न सकाळ झाली आहे. कोमट पाणी प्या, थोडे चाला आणि शांततेने दिवसाची सुरुवात करा.",
    afternoonGuidance: "डोळ्यांना विश्रांती द्या, पाणी प्या आणि मधुर संगीत किंवा चांगल्या पुस्तकाचा आनंद घ्या.",
    eveningGuidance: "संध्याकाळचे दिवे लागले आहेत. कुटुंबाशी बोला, पायांना विश्रांती द्या आणि संध्याकाळची औषधे घ्या.",
    btnSanctuaryDeck: "मुख्य कक्ष (Sanctuary)",
    btnActiveModule: "सक्रिय सेवा",
    btnCalmBreath: "शांत श्वास घ्या",
    btnDaySummary: "आजची दिनचर्या ऐका",
    btnEmergencySOS: "तातडीचा SOS",
    btnTextSize: "अक्षरांचा आकार",
    btnContrast: "कॉन्ट्रास्ट",
    btnSwitchUser: "वापरकर्ता बदला",
    btnSignOut: "लॉग आउट",
    chooseLanguage: "भाषा निवडा",
    dosePending: "डोस बाकी आहे",
    dosesPending: "डोस बाकी आहेत",
    allDosesTaken: "सर्व औषधे घेतली",
    taskRemaining: "काम बाकी आहे",
    tasksRemaining: "कामे बाकी आहेत",
    allDoneToday: "आजची सर्व कामे पूर्ण",
    activeCompanionNotice: "मित्रा मराठीत आपली काळजी घेत आहे",
    domainCareTitle: "आरोग्य व दैनंदिन दिनचर्या",
    domainCareTagline: "आपली औषधे, नियमित दिनचर्या आणि मनमोकळा संवाद सोबती",
    domainSafetyTitle: "सुरक्षा व मानसिक शांतता",
    domainSafetyTagline: "फसवणुकीपासून बचाव, सोप्या भाषेतील पत्रे व तातडीची मदत",
    domainLifeTitle: "कुटुंब व दैनंदिन जीवन",
    domainLifeTagline: "कुटुंबाशी जवळीक, डिजिटल सेवा व प्रसन्न मनोरंजन",
    modVoiceCompanionTitle: "मित्रा व्हॉईस सोबती",
    modVoiceCompanionBadge: "प्रेमळ AI मित्र",
    modVoiceCompanionDesc: "आपल्या मातृभाषेत सहज बोला. औषधे, दिनचर्या किंवा प्रेरणादायी गोष्टींविषयी विचारा.",
    modVoiceCompanionAction: "मित्राशी बोला",
    modHealthTitle: "औषधे व आरोग्य नोंदवही",
    modHealthDesc: "औषधांचे फोटो, आठवण करून देणारे अलार्म, डॉक्टरांच्या भेटी व बीपी/शुगर नोंद.",
    modHealthAction: "औषधांचा डबा उघडा",
    modDailyTitle: "दैनंदिन दिनचर्या व वेळापत्रक",
    modDailyDesc: "सकाळची फेरी, पूजा, पाणी पिणे, घरच्यांशी गप्पा आणि विश्रांतीची वेळ.",
    modDailyAction: "वेळापत्रक पहा",
    modScamTitle: "फसवणूक सुरक्षा कवच",
    modScamBadge: "कवच सक्रिय आहे",
    modScamDesc: "संशयास्पद मेसेज, लॉटरी कॉल्स, बँक किंवा वीज बिल बंद होण्याच्या खोट्या मेसेजची तपासणी.",
    modScamAction: "मेसेज तपासा",
    modDocTitle: "कागदपत्र व पत्र अनुवादक",
    modDocBadge: "सोप्या भाषेत",
    modDocDesc: "हॉस्पिटलच्या पावत्या, वीज बिल व बँकेची पत्रे अगदी सोप्या मराठीत समजून घ्या.",
    modDocAction: "कागदपत्र समजून घ्या",
    modEmergencyTitle: "आपत्कालीन सायरन",
    modEmergencyBadge: "एका स्पर्शात मदत",
    modEmergencyDesc: "कुटुंबाला तात्काळ संदेश पाठवा आणि ॲम्ब्युलन्स किंवा हेल्पलाईनशी संपर्क साधा.",
    modEmergencyAction: "सायरन वाजवा",
    modFamilyTitle: "कौटुंबिक मंडळ व काळजीवाहू",
    modFamilyBadge: "कुटुंबाशी जोडणी",
    modFamilyDesc: "व्हॉईस मेसेज पाठवा, नातवंडांचे फोटो पहा आणि 'मी सुरक्षित आहे' असा संदेश द्या.",
    modFamilyAction: "कुटुंब केंद्र उघडा",
    modTasksTitle: "डिजिटल कामे सोपी मार्गदर्शिका",
    modTasksBadge: "टप्प्याटप्प्याने",
    modTasksDesc: "गाडी बुक करणे, ऑनलाईन खरेदी व व्हॉट्सॲप कॉल करण्यासाठी सोप्या सूचना.",
    modTasksAction: "मार्गदर्शिका सुरू करा",
    modFinanceTitle: "बिल व पेन्शन सहाय्यक",
    modFinanceBadge: "अंतिम तारीख ट्रॅकर",
    modFinanceDesc: "मोठ्या अक्षरात बिले पाहणे, पेन्शनच्या नोंदी व जीवन प्रमाणपत्राची माहिती.",
    modFinanceAction: "बिले पहा",
    modPersonalTitle: "प्रसन्न मनोरंजन व मनाचा व्यायाम",
    modPersonalBadge: "विश्रांती व आनंद",
    modPersonalDesc: "सकारात्मक बातम्या, शांत रागसंगीत, बोधकथा आणि मनोरंजक कोडी.",
    modPersonalAction: "विश्रांती घ्या व खेळा",
    breathIn: "हळूच श्वास आत घ्या (1, 2, 3, 4)...",
    breathHold: "शांतपणे रोखून ठेवा (1, 2, 3, 4)...",
    breathOut: "हळूहळू श्वास बाहेर सोडा (1, 2, 3, 4)...",
    breathRest: "विश्रांती घ्या व शांतता अनुभवा...",
    reassuranceCalm: "तुम्ही पूर्णपणे सुरक्षित आहात. शांततेने करा, कसलीही घाई नाही.",
    reassuranceNoOtp: "सुवर्ण नियम: फोन किंवा मेसेजवर कोणालाही आपला OTP, पिन किंवा पासवर्ड सांगू नका.",
    btnBack: "मागे जा",
    btnSave: "जतन करा",
    btnCancel: "रद्द करा",
    btnDone: "झाले",
    btnConfirm: "नक्की करा",
    btnRepeat: "पुन्हा बोला (ऐका)",
    btnSpeak: "बोला",
    btnSend: "पाठवा",
    btnListening: "ऐकत आहे...",
    btnSpeaking: "बोलत आहे (थांबवण्यासाठी दाबा)",
    btnMarkTaken: "औषध घेतले",
    btnMarkPending: "बाकी ठेवा",
    btnTaken: "✓ घेतले",
    btnPending: "बाकी आहे",
    btnVerify: "सुरक्षा तपासा",
    btnSimplify: "सोप्या शब्दात सांगा",
    btnNextStep: "पुढचा टप्पा",
    btnPrevStep: "मागचा टप्पा",
    btnCallAmbulance: "ॲम्ब्युलन्स बोलवा (108)",
    btnCallDoctor: "डॉक्टरांना फोन करा",
    btnCallFamily: "कुटुंबाला फोन करा",
    btnReadAloud: "वाचून ऐकवा",
    welcomeMessage: "नमस्कार {name}! मी आपला प्रेमळ सोबती मित्रा (Mitraa) आहे. मी नेहमी आपल्या सोबत आहे. आपण केव्हाही आपल्या औषधांविषयी, आजच्या कामांविषयी विचारू शकता किंवा गप्पा मारू शकता. आज आपली प्रकृती कशी आहे?",
    promptSchedule: "📅 आज माझी दिनचर्या काय आहे?",
    promptMedicines: "💊 आज मला कोणती औषधे घ्यायची आहेत?",
    promptScam: "🛡️ हा मेसेज सुरक्षित आहे की फसवणूक?",
    promptStory: "📖 मला एक सुंदर प्रेरणादायी गोष्ट सांगा",
    promptOtp: "💡 ओटीपी (OTP) म्हणजे काय ते सोप्या भाषेत सांगा",
    inputPlaceholder: "मित्राला काहीही विचारा...",
    chatSubtitle: "मराठीत आदरयुक्त, संयमी व प्रेमळ संवाद • {name}",
  },

  Gujarati: {
    appName: "Mitraa",
    appTagline: "વરિષ્ઠ નાગરિક સેવા કેન્દ્ર",
    companionFor: "તમારા સ્નેહી સાથી",
    timeMorning: "🌅 શુભ સવાર (પ્રભાત)",
    timeAfternoon: "☀️ શુભ બપોર",
    timeEvening: "🌙 શુભ સાંજ",
    morningGreeting: "સુપ્રભાત",
    afternoonGreeting: "શુભ બપોર",
    eveningGreeting: "શુભ સાંજ",
    morningGuidance: "એક શાંત અને સુંદર સવાર આવી છે. નવશેકું પાણી પીવો, હળવું ચાલો અને શાંતિથી દિવસની શરૂઆત કરો.",
    afternoonGuidance: "આંખોને આરામ આપો, પાણી પીવો અને શાંત સંગીત અથવા સરસ પુસ્તકનો આનંદ લો.",
    eveningGuidance: "સાંજની બત્તીઓ પ્રગટી ગઈ છે. પરિવાર સાથે વાતો કરો, પગને આરામ આપો અને સાંજની દવાઓ લો.",
    btnSanctuaryDeck: "મુખ્ય ખંડ (Sanctuary)",
    btnActiveModule: "ચાલુ સેવા",
    btnCalmBreath: "શાંત શ્વાસ લો",
    btnDaySummary: "આજના દિવસની વિગત સાંભળો",
    btnEmergencySOS: "ઇમરજન્સી SOS",
    btnTextSize: "અક્ષરનું માપ",
    btnContrast: "કોન્ટ્રાસ્ટ",
    btnSwitchUser: "વપરાશકર્તા બદલો",
    btnSignOut: "લૉગ આઉટ",
    chooseLanguage: "ભાષા પસંદ કરો",
    dosePending: "ડોઝ બાકી છે",
    dosesPending: "ડોઝ બાકી છે",
    allDosesTaken: "બધી દવાઓ લેવાઈ ગઈ",
    taskRemaining: "કામ બાકી છે",
    tasksRemaining: "કામો બાકી છે",
    allDoneToday: "આજના બધા કામ પૂરા",
    activeCompanionNotice: "મિત્રા ગુજરાતીમાં તમારી સંભાળ રાખી રહ્યું છે",
    domainCareTitle: "આરોગ્ય અને દૈનિક જીવનશૈલી",
    domainCareTagline: "તમારી દવાઓ, નિયમિત દિનચર્યા અને પ્રેમાળ વાતચીતના સાથી",
    domainSafetyTitle: "સુરક્ષા અને માનસિક શાંતિ",
    domainSafetyTagline: "છેતરપિંડીથી રક્ષણ, સરળ ભાષામાં પત્રો અને તાત્કાલિક મદદ",
    domainLifeTitle: "પરિવાર અને રોજિંદુ જીવન",
    domainLifeTagline: "પરિવાર સાથે જોડાણ, ડિજિટલ સેવાઓ અને શાંત મનોરંજન",
    modVoiceCompanionTitle: "મિત્રા વૉઇસ સાથી",
    modVoiceCompanionBadge: "વહાલસોયો AI મિત્ર",
    modVoiceCompanionDesc: "તમારી માતૃભાષામાં સહજતાથી વાત કરો. દવાઓ, દિનચર્યા કે પ્રેરક વાર્તાઓ વિશે પૂછો.",
    modVoiceCompanionAction: "મિત્રા સાથે વાત કરો",
    modHealthTitle: "દવાઓ અને આરોગ્ય ડાયરી",
    modHealthDesc: "દવાઓના ફોટા, યાદ અપાવતા એલાર્મ, ડૉક્ટરની મુલાકાત અને બીપી/સુગર નોંધ.",
    modHealthAction: "દવાઓનું બોક્સ ખોલો",
    modDailyTitle: "દૈનિક દિનચર્યા અને સમયપત્રક",
    modDailyDesc: "સવારનું ચાલવું, પૂજા, પાણી પીવું, પરિવાર સાથે વાતચીત અને આરામનો સમય.",
    modDailyAction: "સમયપત્રક જુઓ",
    modScamTitle: "છેતરપિંડી સુરક્ષા કવચ",
    modScamBadge: "સુરક્ષા કવચ સક્રિય છે",
    modScamDesc: "શંકાસ્પદ મેસેજ, લોટરીના ફોન, બેંક કે લાઈટ બિલ કપાઈ જવાના નકલી મેસેજની તપાસ.",
    modScamAction: "મેસેજ ચકાસો",
    modDocTitle: "કાગળો અને પત્રોનું સરળીકરણ",
    modDocBadge: "સરળ ભાષામાં",
    modDocDesc: "હોસ્પિટલના કાગળો, વીજળીના બિલ અને બેંકના પત્રો સરળ શબ્દોમાં સમજો.",
    modDocAction: "કાગળ સમજો",
    modEmergencyTitle: "ઇમરજન્સી સાયરન",
    modEmergencyBadge: "એક સ્પર્શમાં મદદ",
    modEmergencyDesc: "પરિવારને તાત્કાલિક જાણ કરો અને એમ્બ્યુલન્સ અથવા હેલ્પલાઇન સાથે જોડાઓ.",
    modEmergencyAction: "સાયરન વગાડો",
    modFamilyTitle: "કૌટુંબિક મંડળ અને સંભાળ",
    modFamilyBadge: "પરિવાર સાથે જોડાણ",
    modFamilyDesc: "વૉઇસ મેસેજ મોકલો, પૌત્ર-પૌત્રીઓના ફોટા જુઓ અને 'હું મજામાં છું' તેવો સંદેશ આપો.",
    modFamilyAction: "પરિવાર કેન્દ્ર ખોલો",
    modTasksTitle: "ડિજિટલ કામોની સરળ માર્ગદર્શિકા",
    modTasksBadge: "પગલે પગલે",
    modTasksDesc: "ટેક્સી બુક કરવી, ઑનલાઇન ખરીદી અને વ્હોટ્સએપ કૉલ કરવા માટેની સરળ સમજ.",
    modTasksAction: "માર્ગદર્શિકા શરૂ કરો",
    modFinanceTitle: "બિલ અને પેન્શન સહાયક",
    modFinanceBadge: "છેલ્લી તારીખ ટ્રેકર",
    modFinanceDesc: "મોટા અક્ષરોમાં બિલ જોવા, પેન્શનની વિગતો અને જીવન પ્રમાણપત્ર જમા કરવાની રીત.",
    modFinanceAction: "બિલ જુઓ",
    modPersonalTitle: "શાંત મનોરંજન અને મગજની કસરત",
    modPersonalBadge: "વિશ્રાંતિ અને આનંદ",
    modPersonalDesc: "સારા સમાચારો, શાંત રાગ સંગીત, પ્રેરણાદાયી વાર્તાઓ અને રમૂજી ઉખાણાં.",
    modPersonalAction: "આરામ કરો અને રમો",
    breathIn: "ધીમેથી શ્વાસ અંદર લો (1, 2, 3, 4)...",
    breathHold: "શાંતિથી રોકી રાખો (1, 2, 3, 4)...",
    breathOut: "ધીમે ધીમે શ્વાસ બહાર કાઢો (1, 2, 3, 4)...",
    breathRest: "વિશ્રાંતિ લો અને શાંતિ અનુભવો...",
    reassuranceCalm: "તમે સંપૂર્ણપણે સુરક્ષિત છો. શાંતિથી કરો, કોઈ ઉતાવળ નથી.",
    reassuranceNoOtp: "સુવર્ણ નિયમ: ફોન કે મેસેજ પર કોઈને પણ તમારો OTP, પિન કે પાસવર્ડ ક્યારેય ન આપો.",
    btnBack: "પાછા જાઓ",
    btnSave: "સાચવો",
    btnCancel: "રદ કરો",
    btnDone: "પૂર્ણ",
    btnConfirm: "ખાતરી કરો",
    btnRepeat: "ફરી બોલો (સાંભળો)",
    btnSpeak: "બોલો",
    btnSend: "મોકલો",
    btnListening: "સાંભળી રહ્યો છું...",
    btnSpeaking: "બોલી રહ્યો છું (રોકવા સ્પર્શ કરો)",
    btnMarkTaken: "દવા લઈ લીધી",
    btnMarkPending: "બાકી રાખો",
    btnTaken: "✓ લેવાઈ ગઈ",
    btnPending: "બાકી છે",
    btnVerify: "સુરક્ષા તપાસો",
    btnSimplify: "સરળ શબ્દોમાં સમજાવો",
    btnNextStep: "આગળનું પગલું",
    btnPrevStep: "પાછલું પગલું",
    btnCallAmbulance: "એમ્બ્યુલન્સ બોલાવો (108)",
    btnCallDoctor: "ડૉક્ટરને ફોન કરો",
    btnCallFamily: "પરિવારને ફોન કરો",
    btnReadAloud: "વાંચીને સંભળાવો",
    welcomeMessage: "નમસ્તે {name}! હું તમારો પ્રેમાળ સાથી મિત્રા (Mitraa) છું. હું હંમેશા તમારી સાથે છું. તમે કોઈપણ સમયે તમારી દવાઓ, આજના કામો અથવા વાતો કરવા માટે મને કહી શકો છો. આજે તમારી તબિયત કેવી છે?",
    promptSchedule: "📅 આજે મારી શું દિનચર્યા છે?",
    promptMedicines: "💊 આજે મારે કઈ દવાઓ લેવાની છે?",
    promptScam: "🛡️ શું આ મેસેજ સુરક્ષિત છે કે છેતરપિંડી?",
    promptStory: "📖 મને એક સરસ પ્રેરણાદાયક વાર્તા સંભળાવો",
    promptOtp: "💡 ઓટીપી (OTP) એટલે શું, સરળ ભાષામાં સમજાવો",
    inputPlaceholder: "મિત્રાને કંઈપણ પૂછો...",
    chatSubtitle: "ગુજરાતીમાં પ્રેમાળ, ધીરજવાન અને આદરપૂર્ણ સંવાદ • {name}",
  },
};

export const getTranslation = (lang: Language): TranslationSet => {
  const base = translations[lang] || translations.English;
  const isHindi = lang === "Hindi";
  const isSpanish = lang === "Spanish";
  const isTamil = lang === "Tamil";
  const isBengali = lang === "Bengali";
  const isTelugu = lang === "Telugu";
  const isMarathi = lang === "Marathi";
  const isGujarati = lang === "Gujarati";

  return {
    ...base,
    statusActive:
      (base as any).statusActive ||
      (isHindi
        ? "सक्रिय"
        : isSpanish
        ? "Activo"
        : isTamil
        ? "செயலில்"
        : isBengali
        ? "সক্রিয়"
        : isTelugu
        ? "యాక్టివ్"
        : isMarathi
        ? "सक्रिय"
        : isGujarati
        ? "સક્રિય"
        : "Active"),
    statusThinking:
      (base as any).statusThinking ||
      (isHindi
        ? "सोच रहा है..."
        : isSpanish
        ? "Pensando..."
        : isTamil
        ? "யோசிக்கிறது..."
        : isBengali
        ? "চিন্তা করছে..."
        : isTelugu
        ? "ఆలోచిస్తోంది..."
        : isMarathi
        ? "विचार करत आहे..."
        : isGujarati
        ? "વિચારી રહ્યું છે..."
        : "Thinking..."),
    btnListen:
      (base as any).btnListen ||
      (isHindi
        ? "सुनें"
        : isSpanish
        ? "Escuchar"
        : isTamil
        ? "கேளுங்கள்"
        : isBengali
        ? "শুনুন"
        : isTelugu
        ? "వినండి"
        : isMarathi
        ? "ऐका"
        : isGujarati
        ? "સાંભળો"
        : "Listen"),
    emergencySOS: (base as any).emergencySOS || base.btnEmergencySOS,
    modPersonalizationTitle: (base as any).modPersonalizationTitle || base.modPersonalTitle,
    modPersonalizationDesc: (base as any).modPersonalizationDesc || base.modPersonalDesc,
    modTaskTitle: (base as any).modTaskTitle || base.modTasksTitle,
    modTaskDesc: (base as any).modTaskDesc || base.modTasksDesc,
  };
};
