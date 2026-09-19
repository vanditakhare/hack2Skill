// Multilingual fallbacks for "Explain My Document" across all 8 supported languages:
// English, Hindi, Spanish, Tamil, Bengali, Telugu, Marathi, Gujarati

export interface FallbackDocResult {
  documentTitle: string;
  documentType: "prescription" | "medical_bill" | "lab_report" | "appointment" | "pharmacy_bill" | "utility_bill" | "insurance" | "other";
  documentTypeLabel: string;
  simpleSummary: string;
  confidenceLevel: "high" | "moderate" | "review_needed";
  extractedTextPreview?: string;
  keyDates: {
    label: string;
    date: string;
    isUrgent?: boolean;
  }[];
  medicines?: {
    name: string;
    dosage: string;
    timing: string;
    instructions: string;
    quantity?: string;
  }[];
  testsAndResults?: {
    testName: string;
    resultValue: string;
    normalRange?: string;
    plainMeaning: string;
    status: "normal" | "borderline" | "attention_needed";
  }[];
  billingDetails?: {
    totalAmount: string;
    amountPaid?: string;
    balanceDue?: string;
    dueDate?: string;
    breakdown: { item: string; cost: string }[];
  } | null;
  appointmentDetails?: {
    doctorOrClinic: string;
    dateTime: string;
    location: string;
    preparationInstructions: string[];
  } | null;
  actionItems: {
    priority: "must_do" | "optional" | "for_records";
    action: string;
    tip: string;
  }[];
  medicalTermsExplained: {
    term: string;
    plainMeaning: string;
  }[];
  safeAdvice: string;
  disclaimer: string;
}

export const getFallbackExplainedDocument = (
  text: string,
  category: string,
  language: string = "English"
): FallbackDocResult => {
  const lower = (text || "").toLowerCase();
  const lang = (language || "English").toLowerCase();

  // Category Detection
  const isPrescription =
    category === "prescription" ||
    lower.includes("rx") ||
    lower.includes("metformin") ||
    lower.includes("amlodipine") ||
    lower.includes("tablet") ||
    lower.includes("capsule") ||
    lower.includes("prescription");

  const isMedicalBill =
    category === "medical_bill" ||
    lower.includes("invoice") ||
    lower.includes("consultation fee") ||
    lower.includes("apollo") ||
    lower.includes("co-pay") ||
    lower.includes("billed amount");

  const isLabReport =
    category === "lab_report" ||
    lower.includes("blood sugar") ||
    lower.includes("hba1c") ||
    lower.includes("lipid") ||
    lower.includes("cholesterol") ||
    lower.includes("laboratory");

  const isPharmacyBill =
    category === "pharmacy_bill" ||
    lower.includes("pharmacy") ||
    lower.includes("cash memo") ||
    lower.includes("strips") ||
    lower.includes("drugstore");

  const isAppointment =
    category === "appointment" ||
    lower.includes("appointment") ||
    lower.includes("cataract") ||
    lower.includes("dilation") ||
    lower.includes("clinic");

  // ==========================================
  // 1. PRESCRIPTION
  // ==========================================
  if (isPrescription) {
    if (lang === "hindi") {
      return {
        documentTitle: "डॉक्टर की दवा पर्ची (प्रिस्क्रिप्शन)",
        documentType: "prescription",
        documentTypeLabel: "दवा की पर्ची (Medicine Prescription)",
        simpleSummary: "यह डॉक्टर की लिखी हुई दवा पर्ची है। इसमें आपके रक्तचाप (BP) और शुगर को सामान्य रखने के लिए नियमित दवाएं लिखी गई हैं।",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "डॉक्टर अरविंद मेहता - दवा पर्ची",
        keyDates: [
          { label: "पर्ची जारी तिथि", date: "14 सितंबर 2026", isUrgent: false },
          { label: "अगली डॉक्टर मुलाकात", date: "28 अक्टूबर 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "टैबलेट मेटफॉर्मिन 500mg (Metformin 500mg)",
            dosage: "1 गोली दिन में दो बार (सुबह व रात)",
            timing: "भोजन के तुरंत बाद (नाश्ते और रात के खाने के बाद)",
            instructions: "पानी के साथ पूरी गोली निगलें। खाली पेट न लें।",
            quantity: "60 गोलियाँ (1 माह की खुराक)",
          },
          {
            name: "टैबलेट एम्लोडिपिन 5mg (Amlodipine 5mg)",
            dosage: "1 गोली दिन में एक बार",
            timing: "सुबह नाश्ते के बाद",
            instructions: "रक्तचाप (BP) को नियंत्रित रखने के लिए। रोज़ एक ही समय पर लें।",
            quantity: "30 गोलियाँ (1 माह की खुराक)",
          },
          {
            name: "कैप्सूल विटामिन D3 60,000 IU",
            dosage: "1 कैप्सूल प्रति सप्ताह",
            timing: "प्रत्येक रविवार दोपहर भोजन के बाद",
            instructions: "हड्डियों व जोड़ों की मजबूती के लिए। दूध या पानी के साथ लें।",
            quantity: "8 कैप्सूल (2 माह)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "डॉ. अरविंद मेहता (सिटी हेल्थ केयर क्लिनिक)",
          dateTime: "28 अक्टूबर 2026 (सुबह 10:30 बजे)",
          location: "कमरा नं 204, सिटी हेल्थ केयर, रिंग रोड",
          preparationInstructions: [
            "आने से 2 दिन पहले खाली पेट का शुगर टेस्ट करवा लें",
            "अपनी दैनिक BP डायरी साथ लेकर आएं",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "केमिस्ट की दुकान से नई दवाइयों का पत्ता लाएं",
            tip: "दवा के डिब्बे पर केमिस्ट से सुबह और रात का निशान बनवा लें।",
          },
          {
            priority: "must_do",
            action: "खाने में नमक की मात्रा कम रखें",
            tip: "अचार, पापड़ और ऊपर से अतिरिक्त नमक डालने से बचें।",
          },
          {
            priority: "optional",
            action: "रोजाना 20 मिनट हल्की सैर करें",
            tip: "सुबह की ताज़ा धूप में आराम से टहलें।",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "डॉक्टर द्वारा सुझाई गई दवाएं" },
          { term: "OD", plainMeaning: "दिन में केवल 1 बार दवा लेना" },
          { term: "BD", plainMeaning: "दिन में 2 बार दवा लेना (सुबह और शाम)" },
        ],
        safeAdvice: "दवाइयों को हमेशा मूल पत्ते में और ठंडी, सूखी जगह पर रखें। डॉक्टर की सलाह के बिना कोई खुराक न बदलें।",
        disclaimer: "यह व्याख्या आपकी सुविधा के लिए है। किसी भी बदलाव से पहले हमेशा अपने डॉक्टर से परामर्श लें।",
      };
    }

    if (lang === "spanish") {
      return {
        documentTitle: "Receta Médica del Doctor (Presión Arterial y Glucosa)",
        documentType: "prescription",
        documentTypeLabel: "Receta Médica",
        simpleSummary: "Esta es una receta médica emitida por el Dr. Arvind Mehta. Contiene medicamentos diarios para mantener la presión y la glucosa en rangos saludables.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "Clínica de Salud - Receta Médica Dr. Mehta",
        keyDates: [
          { label: "Fecha de Emisión", date: "14 de Septiembre de 2026", isUrgent: false },
          { label: "Próxima Consulta", date: "28 de Octubre de 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "Metformina 500mg (Liberación Prolongada)",
            dosage: "1 tableta dos veces al día",
            timing: "Con las comidas (desayuno y cena)",
            instructions: "Tomar con abundante agua después de comer para evitar molestias estomacales.",
            quantity: "60 tabletas (suministro de 1 mes)",
          },
          {
            name: "Amlodipino 5mg",
            dosage: "1 tableta al día",
            timing: "Por la mañana después del desayuno",
            instructions: "Mantiene la presión arterial regular. Tomar a la misma hora cada día.",
            quantity: "30 tabletas (1 mes)",
          },
          {
            name: "Vitamina D3 60,000 UI",
            dosage: "1 cápsula semanal",
            timing: "Cada domingo después del almuerzo",
            instructions: "Fortalece los huesos y las articulaciones.",
            quantity: "8 cápsulas (2 meses)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "Dr. Arvind Mehta (Clínica City Health)",
          dateTime: "28 de Octubre de 2026 (10:30 AM)",
          location: "Consultorio 204, Clínica City Health",
          preparationInstructions: [
            "Hacerse una prueba de glucosa en ayunas 2 días antes",
            "Llevar el cuaderno de registros de presión arterial",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "Comprar las medicinas en su farmacia de confianza",
            tip: "Pida al farmacéutico que marque claramente las cajas para mañana y noche.",
          },
          {
            priority: "must_do",
            action: "Moderar el consumo de sal en las comidas",
            tip: "Evite agregar sal adicional a las comidas ya preparadas.",
          },
          {
            priority: "optional",
            action: "Caminar suavemente 20 minutos cada mañana",
            tip: "Use zapatos cómodos para cuidar sus articulaciones.",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "Tratamiento o medicamentos prescritos por el médico" },
          { term: "OD", plainMeaning: "Tomar una sola vez al día" },
          { term: "BD", plainMeaning: "Tomar dos veces al día" },
        ],
        safeAdvice: "Guarde sus pastillas en un pastillero limpio, lejos del calor de la cocina.",
        disclaimer: "Esta explicación es informativa. Siempre consulte a su médico antes de modificar medicamentos.",
      };
    }

    if (lang === "tamil") {
      return {
        documentTitle: "மருத்துவரின் மருந்து சீட்டு (இரத்த அழுத்தம் & சர்க்கரை)",
        documentType: "prescription",
        documentTypeLabel: "மருந்து சீட்டு (Prescription)",
        simpleSummary: "இது உங்கள் மருத்துவர் டாக்டர் அர்விந்த் மேத்தா வழங்கிய மருந்து சீட்டு. உங்கள் இரத்த அழுத்தம் மற்றும் சர்க்கரையை சீராக வைக்க பரிந்துரைக்கப்பட்டுள்ளது.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "மருத்துவர் மேத்தா மருந்து சீட்டு",
        keyDates: [
          { label: "சீட்டு வழங்கிய தேதி", date: "14 செப்டம்பர் 2026", isUrgent: false },
          { label: "அடுத்த பரிசோதனை தேதி", date: "28 அக்டோபர் 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "மெட்பார்மின் 500mg (Metformin)",
            dosage: "1 மாத்திரை தினமும் இரண்டு வேளை",
            timing: "உணவுக்குப் பிறகு (காலை மற்றும் இரவு உணவுக்குப் பின்)",
            instructions: "வெறும் வயிற்றில் எடுக்க வேண்டாம். தண்ணீருடன் முழு மாத்திரையையும் விழுங்கவும்.",
            quantity: "60 மாத்திரைகள் (1 மாத அளவு)",
          },
          {
            name: "ஆம்லோடிபின் 5mg (Amlodipine)",
            dosage: "1 மாத்திரை தினமும் ஒரு வேளை",
            timing: "காலை உணவுக்குப் பின்",
            instructions: "இரத்த அழுத்தத்தை சீராக வைக்க உதவும். தினமும் ஒரே நேரத்தில் எடுக்கவும்.",
            quantity: "30 மாத்திரைகள் (1 மாத அளவு)",
          },
          {
            name: "வைட்டமின் D3 60,000 IU",
            dosage: "வாரத்திற்கு 1 காப்ஸ்யூல்",
            timing: "ஒவ்வொரு ஞாயிற்றுக்கிழமை மதிய உணவுக்குப் பின்",
            instructions: "எலும்பு வலிமைக்கு உதவும்.",
            quantity: "8 காப்ஸ்யூல்கள் (2 மாதங்கள்)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "டாக்டர் அர்விந்த் மேத்தா (சிட்டி கிளினிக்)",
          dateTime: "28 அக்டோபர் 2026 (காலை 10:30 மணி)",
          location: "அறை 204, சிட்டி கிளினிக், ரிங் ரோடு",
          preparationInstructions: [
            "வருவதற்கு முன் வெறும் வயிற்று சர்க்கரை சோதனை செய்யவும்",
            "உங்கள் தினசரி இரத்த அழுத்த குறிப்பேட்டை கொண்டு வாருங்கள்",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "மருந்தகத்தில் புதிய மாத்திரைகளை வாங்கவும்",
            tip: "காலை மற்றும் இரவு என அட்டை மீது தெளிவாக குறிக்கச் சொல்லவும்.",
          },
          {
            priority: "must_do",
            action: "உணவில் உப்பைக் குறைக்கவும்",
            tip: "ஊறுகாய், அப்பளம் மற்றும் கூடுதல் உப்பைத் தவிர்க்கவும்.",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "மருத்துவர் பரிந்துரைத்த மருந்துகள்" },
          { term: "OD", plainMeaning: "ஒரு நாளைக்கு 1 வேளை மட்டும்" },
          { term: "BD", plainMeaning: "ஒரு நாளைக்கு 2 வேளைகள்" },
        ],
        safeAdvice: "மருந்துகளை குழந்தைகளுக்கு எட்டாதவாறு குளிர்ந்த, உலர்ந்த இடத்தில் பாதுகாக்கவும்.",
        disclaimer: "இது உங்கள் புரிதலுக்கான எளிய வழிகாட்டி. மருத்துவ மாற்றங்களுக்கு மருத்துவரை அணுகவும்.",
      };
    }

    if (lang === "bengali") {
      return {
        documentTitle: "ডাক্তারের প্রেসক্রিপশন (প্রেসার ও সুগারের ওষুধ)",
        documentType: "prescription",
        documentTypeLabel: "ওষুধের প্রেসক্রিপশন",
        simpleSummary: "এটি আপনার ডাক্তারবাবু ডঃ অরবিন্দ মেহতার দেওয়া প্রেসক্রিপশন। এতে আপনার রক্তচাপ ও ব্লাড সুগার নিয়ন্ত্রণে রাখার ওষুধ লেখা আছে।",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "ডাক্তারের প্রেসক্রিপশন চিরকুট",
        keyDates: [
          { label: "প্রেসক্রিপশনের তারিখ", date: "১৪ সেপ্টেম্বর ২০২৬", isUrgent: false },
          { label: "পরবর্তী ভিজিট", date: "২৮ অক্টোবর ২০২৬", isUrgent: true },
        ],
        medicines: [
          {
            name: "মেটফর্মিন ৫০০ মিলিগ্রাম (Metformin 500mg)",
            dosage: "১টি ট্যাবলেট দিনে দুইবার",
            timing: "খাবারের পরে (সকালের জলখাবার ও রাতের খাবারের পর)",
            instructions: "খালি পেটে খাবেন না। জল দিয়ে গিলে নিন।",
            quantity: "৬০টি ট্যাবলেট (১ মাসের জন্য)",
          },
          {
            name: "অ্যামলোডিপিন ৫ মিলিগ্রাম (Amlodipine 5mg)",
            dosage: "১টি ট্যাবলেট দিনে একবার",
            timing: "সকালে জলখাবারের পরে",
            instructions: "রক্তচাপ ঠিক রাখতে প্রতিদিন একই সময়ে খান।",
            quantity: "৩০টি ট্যাবলেট (১ মাসের জন্য)",
          },
          {
            name: "ভিটামিন ডি৩ ৬০,০০০ আইইউ",
            dosage: "সপ্তাহে ১টি ক্যাপসুল",
            timing: "প্রতি রবিবার দুপুরের খাবারের পরে",
            instructions: "হাড় ও গাঁটের সুস্থতার জন্য।",
            quantity: "৮টি ক্যাপসুল (২ মাসের জন্য)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "ডঃ অরবিন্দ মেহতা (সিটি হেলথ কেয়ার)",
          dateTime: "২৮ অক্টোবর ২০২৬ (সকাল ১০:৩০)",
          location: "রুম ২০৪, সিটি হেলথ কেয়ার ক্লিনিক",
          preparationInstructions: [
            "আসার আগে খালি পেটের সুগার টেস্ট রিপোর্ট তৈরি রাখুন",
            "প্রেসারের খাতা সাথে আনবেন",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "ওষুধের দোকান থেকে নতুন পাতা কিনে নিন",
            tip: "দোকানদারকে দিয়ে সকাল আর রাতের ওষুধের খাপের উপর দাগ দিয়ে নিন।",
          },
          {
            priority: "must_do",
            action: "খাবারে কাঁচা নুন খাবেন না",
            tip: "আচার ও পাঁপড় খাওয়া কমিয়ে দিন।",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "ডাক্তারবাবুর নির্ধারিত চিকিৎসা বা ওষুধ" },
          { term: "OD", plainMeaning: "দিনে একবার ওষুধ খাওয়া" },
          { term: "BD", plainMeaning: "দিনে দুইবার ওষুধ খাওয়া" },
        ],
        safeAdvice: "ওষুধের পাতা ভিজে জায়গায় রাখবেন না। নিজে থেকে ওষুধের মাত্রা বদলাবেন না।",
        disclaimer: "এই বিবরণ আপনার বোঝার সুবিধার জন্য। কোনো পরিবর্তনের আগে চিকিৎসকের পরামর্শ নিন।",
      };
    }

    if (lang === "telugu") {
      return {
        documentTitle: "డాక్టర్ మందుల ప్రిస్క్రిప్షన్ (బీపీ & షుగర్ కేర్)",
        documentType: "prescription",
        documentTypeLabel: "మందుల చీటీ (Prescription)",
        simpleSummary: "ఇది డాక్టర్ అరవింద్ మెహతా రాసిన ప్రిస్క్రిప్షన్. మీ రక్తపోటు (బీపీ) మరియు షుగర్ స్థాయిలను నియంత్రణలో ఉంచడానికి ఈ మందులు సూచించారు.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "డాక్టర్ మెహతా ప్రిస్క్రిప్షన్",
        keyDates: [
          { label: "ప్రిస్క్రిప్షన్ తేదీ", date: "14 సెప్టెంబర్ 2026", isUrgent: false },
          { label: "తదుపరి డాక్టర్ సందర్శన", date: "28 అక్టోబర్ 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "టాబ్లెట్ మెట్‌ఫార్మిన్ 500mg (Metformin)",
            dosage: "రోజుకు 2 సార్లు (ఉదయం & రాత్రి)",
            timing: "భోజనం తర్వాత (టిఫిన్ & రాత్రి భోజనం తర్వాత)",
            instructions: "ఖాళీ కడుపుతో తీసుకోకండి. తగినంత నీటితో మింగండి.",
            quantity: "60 మాత్రలు (1 నెల కోటా)",
          },
          {
            name: "టాబ్లెట్ ఆమ్లోడిపైన్ 5mg (Amlodipine)",
            dosage: "రోజుకు 1 సారి",
            timing: "ఉదయం టిఫిన్ చేసిన తర్వాత",
            instructions: "బీపీ సాధారణంగా ఉండడానికి రోజూ ఒకే సమయానికి వేసుకోండి.",
            quantity: "30 మాత్రలు (1 నెల కోటా)",
          },
          {
            name: "విటమిన్ D3 60,000 IU",
            dosage: "వారానికి 1 క్యాప్సూల్",
            timing: "ప్రతి ఆదివారం మధ్యాహ్నం భోజనం తర్వాత",
            instructions: "ఎముకల బలానికి మంచిది.",
            quantity: "8 క్యాప్సూల్స్ (2 నెలలు)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "డాక్టర్ అరవింద్ మెహతా (సిటీ హెల్త్‌కేర్ క్లినిక్)",
          dateTime: "28 అక్టోబర్ 2026 (ఉదయం 10:30)",
          location: "రూమ్ నెం 204, సిటీ హెల్త్‌కేర్ క్లినిక్",
          preparationInstructions: [
            "రావడానికి ముందు పరగడుపున షుగర్ టెస్ట్ చేయించుకోండి",
            "బీపీ రీడింగుల డైరీ వెంట తీసుకురండి",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "మెడికల్ షాపు నుండి తాజా మందుల స్ట్రిప్స్ తీసుకోండి",
            tip: "ఉదయం వేసుకోవాల్సినవి, రాత్రి వేసుకోవాల్సినవి బాక్సులపై స్పష్టంగా గుర్తు పెట్టించుకోండి.",
          },
          {
            priority: "must_do",
            action: "ఆహారంలో ఉప్పు తగ్గించండి",
            tip: "ఊరగాయలు, అప్పడాలు తీసుకోవడం తగ్గించండి.",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "డాక్టర్ సూచించిన చికిత్స లేదా మందులు" },
          { term: "OD", plainMeaning: "రోజుకు ఒకసారి మాత్రమే వేసుకోవాలి" },
          { term: "BD", plainMeaning: "రోజుకు రెండుసార్లు వేసుకోవాలి" },
        ],
        safeAdvice: "మందులను ఎండ తగలని చల్లని, పొడి ప్రదేశంలో భద్రపరుచుకోండి.",
        disclaimer: "ఈ సమాచారం మీ అవగాహన కొరకు మాత్రమే. మార్పులకు మీ వైద్యుడిని సంప్రదించండి.",
      };
    }

    if (lang === "marathi") {
      return {
        documentTitle: "डॉक्टरांची औषध चिठ्ठी (बीपी व शुगर काळजी)",
        documentType: "prescription",
        documentTypeLabel: "औषध चिठ्ठी (Prescription)",
        simpleSummary: "ही डॉ. अरविंद मेहता यांनी दिलेली औषध चिठ्ठी आहे. यात तुमचा रक्तदाब (BP) आणि साखर नियंत्रित ठेवण्यासाठी नियमित गोळ्या लिहिल्या आहेत.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "डॉक्टर मेहता औषध चिठ्ठी",
        keyDates: [
          { label: "चिठ्ठी दिल्याची तारीख", date: "14 सप्टेंबर 2026", isUrgent: false },
          { label: "पुढील तपासणी तारीख", date: "28 ऑक्टोबर 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "मेटफॉर्मिन 500mg (Metformin 500mg)",
            dosage: "दिवसातून 2 वेळा (सकाळी व रात्री)",
            timing: "जेवणानंतर (नाश्ता आणि रात्रीच्या जेवणानंतर)",
            instructions: "रिकाम्या पोटी घेऊ नका. भरपूर पाण्यासोबत गोळी गिळा.",
            quantity: "60 गोळ्या (1 महिन्याचा साठा)",
          },
          {
            name: "अॅम्लोडिपिन 5mg (Amlodipine 5mg)",
            dosage: "दिवसातून 1 वेळा",
            timing: "सकाळी नाश्त्यानंतर",
            instructions: "रक्तदाब नियंत्रित ठेवण्यासाठी दररोज एकाच वेळी घ्या.",
            quantity: "30 गोळ्या (1 महिन्याचा साठा)",
          },
          {
            name: "व्हिटॅमिन D3 60,000 IU",
            dosage: "आठवड्यातून 1 कॅप्सूल",
            timing: "प्रत्येक रविवारी दुपारच्या जेवणानंतर",
            instructions: "हाडे व सांध्यांच्या बळकटीसाठी दुधासोबत किंवा पाण्यासोबत घ्या.",
            quantity: "8 कॅप्सूल (2 महिने)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "डॉ. अरविंद मेहता (सिटी क्लिनिक)",
          dateTime: "28 ऑक्टोबर 2026 (सकाळी 10:30)",
          location: "खोली क्र. 204, सिटी क्लिनिक, रिंग रोड",
          preparationInstructions: [
            "येण्यापूर्वी उपाशीपोटी रक्तातील साखरेची तपासणी करा",
            "रक्तदाबाची डायरी सोबत आणा",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "मेडिकल स्टोअरमधून नवीन गोळ्या आणून घ्या",
            tip: "सकाळच्या आणि रात्रीच्या गोळ्यांच्या पाकिटावर खूण करून घ्या.",
          },
          {
            priority: "must_do",
            action: "जेवणातील मिठाचे प्रमाण कमी ठेवा",
            tip: "लोणचे आणि पापड खाणे टाळा.",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "डॉक्टरांनी दिलेली औषधे" },
          { term: "OD", plainMeaning: "दिवसातून फक्त 1 वेळा घेणे" },
          { term: "BD", plainMeaning: "दिवसातून 2 वेळा घेणे" },
        ],
        safeAdvice: "गोळ्या नेहमी कोरड्या जागी ठेवा. डॉक्टरांच्या सल्ल्याशिवाय डोस बदलू नका.",
        disclaimer: "हे स्पष्टीकरण तुमच्या सोयीसाठी आहे. काही अडचण असल्यास डॉक्टरांचा सल्ला घ्या.",
      };
    }

    if (lang === "gujarati") {
      return {
        documentTitle: "ડોક્ટરની દવા ચિઠ્ઠી (બીપી અને ડાયાબિટીસ કાળજી)",
        documentType: "prescription",
        documentTypeLabel: "દવા ચિઠ્ઠી (Prescription)",
        simpleSummary: "આ ડૉ. અરવિંદ મહેતા દ્વારા આપવામાં આવેલ દવા ચિઠ્ઠી છે. તમારા બ્લડ પ્રેશર (BP) અને સુગરને નિયંત્રણમાં રાખવા માટે નિયમિત દવાઓ લખેલી છે.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "ડૉક્ટર મહેતા દવા ચિઠ્ઠી",
        keyDates: [
          { label: "ચિઠ્ઠી તારીખ", date: "14 સપ્ટેમ્બર 2026", isUrgent: false },
          { label: "આગામી મુલાકાત", date: "28 ઓક્ટોબર 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "ટેબ્લેટ મેટફોર્મિન 500mg (Metformin)",
            dosage: "દિવસમાં 2 વખત (સવાર અને સાંજ)",
            timing: "જમ્યા પછી (નાસ્તા અને રાતના ભોજન પછી)",
            instructions: "ખાલી પેટે ન લેવી. પાણી સાથે આખી ગોળી ગળી જવી.",
            quantity: "60 ગોળીઓ (1 મહિનાનો જથ્થો)",
          },
          {
            name: "ટેબ્લેટ એમ્લોડિપિન 5mg (Amlodipine)",
            dosage: "દિવસમાં 1 વખત",
            timing: "સવારે નાસ્તા પછી",
            instructions: "બ્લડ પ્રેશર બરાબર રાખવા રોજ એક જ સમયે લેવી.",
            quantity: "30 ગોળીઓ (1 મહિનાનો જથ્થો)",
          },
          {
            name: "વિટામિન D3 60,000 IU",
            dosage: "અઠવાડિયે 1 કેપ્સૂલ",
            timing: "દર રવિવારે બપોરે જમ્યા પછી",
            instructions: "હાડકાંની મજબૂતી માટે દૂધ અથવા પાણી સાથે લેવી.",
            quantity: "8 કેપ્સૂલ (2 મહિના)",
          },
        ],
        testsAndResults: [],
        billingDetails: null,
        appointmentDetails: {
          doctorOrClinic: "ડૉ. અરવિંદ મહેતા (સિટી ક્લિનિક)",
          dateTime: "28 ઓક્ટોબર 2026 (સવારે 10:30)",
          location: "રૂમ નં. 204, સિટી ક્લિનિક, રિંગ રોડ",
          preparationInstructions: [
            "આવતા પહેલા ભૂખ્યા પેટે સુગર રિપોર્ટ કરાવો",
            "બીપી માપવાની ડાયરી સાથે લાવવી",
          ],
        },
        actionItems: [
          {
            priority: "must_do",
            action: "મેડિકલ સ્ટોરમાંથી દવાનો નવો જથ્થો મેળવી લો",
            tip: "દવા પર સવાર-સાંજનું નિશાન કરાવી લો જેથી ભૂલ ન પડે.",
          },
          {
            priority: "must_do",
            action: "ખોરાકમાં મીઠું ઓછું રાખવું",
            tip: "અથાણાં અને પાપડનું સેવન ટાળવું.",
          },
        ],
        medicalTermsExplained: [
          { term: "Rx", plainMeaning: "ડૉક્ટર દ્વારા સૂચવાયેલી દવાઓ" },
          { term: "OD", plainMeaning: "દિવસમાં માત્ર 1 વખત લેવી" },
          { term: "BD", plainMeaning: "દિવસમાં 2 વખત લેવી" },
        ],
        safeAdvice: "દવાઓને ભેજ વગરની ઠંડી જગ્યાએ સાચવવી. ડૉક્ટરને પૂછ્યા વગર ડોઝ ન બદલવો.",
        disclaimer: "આ સમજૂતી તમારી સરળતા માટે છે. કોઈપણ ફેરફાર પહેલાં ડૉક્ટરની સલાહ લેવી.",
      };
    }

    // Default English Prescription
    return {
      documentTitle: "Doctor's Medicine Prescription (Hypertension & Diabetes Care)",
      documentType: "prescription",
      documentTypeLabel: "Medicine Prescription",
      simpleSummary: "This is an official doctor's prescription from Dr. Arvind Mehta. It outlines daily maintenance medicines to keep your blood pressure and blood sugar safely in balance.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "City Health Care Clinic - Dr. Arvind Mehta Rx Note",
      keyDates: [
        { label: "Prescription Issued", date: "14 September 2026", isUrgent: false },
        { label: "Follow-up Doctor Visit", date: "28 October 2026", isUrgent: true },
      ],
      medicines: [
        {
          name: "Tab Metformin 500mg (Extended Release)",
          dosage: "1 tablet twice daily (BD)",
          timing: "With meals (after breakfast and after dinner)",
          instructions: "Take with a glass of water. Taking it with meals prevents stomach discomfort.",
          quantity: "60 tablets (1 month supply)",
        },
        {
          name: "Tab Amlodipine 5mg",
          dosage: "1 tablet once daily (OD)",
          timing: "Morning after breakfast",
          instructions: "Helps maintain smooth blood circulation and normal blood pressure.",
          quantity: "30 tablets (1 month supply)",
        },
        {
          name: "Cap Vitamin D3 60,000 IU",
          dosage: "1 capsule once weekly",
          timing: "Every Sunday after lunch",
          instructions: "Supports bone and joint strength. Take with water or milk.",
          quantity: "8 capsules (8 weeks)",
        },
      ],
      testsAndResults: [],
      billingDetails: null,
      appointmentDetails: {
        doctorOrClinic: "Dr. Arvind Mehta (City Health Care Clinic)",
        dateTime: "28 October 2026 (10:30 AM)",
        location: "Room 204, City Health Care Clinic, Ring Road",
        preparationInstructions: [
          "Get a fresh fasting blood sugar report 2 days before the visit",
          "Bring your weekly blood pressure readings diary",
        ],
      },
      actionItems: [
        {
          priority: "must_do",
          action: "Purchase fresh medicine strips from your trusted pharmacy",
          tip: "Ask the pharmacist to clearly mark 'Morning' and 'Night' on the medicine strip.",
        },
        {
          priority: "must_do",
          action: "Keep daily dietary salt intake under 2 grams",
          tip: "Avoid canned foods, extra table salt, and heavy pickles.",
        },
        {
          priority: "optional",
          action: "Take a gentle 20-minute morning walk",
          tip: "Walk on flat, even pavements wearing comfortable walking shoes.",
        },
      ],
      medicalTermsExplained: [
        { term: "Rx", plainMeaning: "Short for medical recipe, meaning 'Prescribed medicines to take'" },
        { term: "OD (Once Daily)", plainMeaning: "Take only once in 24 hours, ideally at the same time each morning" },
        { term: "BD (Twice Daily)", plainMeaning: "Take twice in 24 hours, approximately 10 to 12 hours apart" },
      ],
      safeAdvice: "Keep your pills in a clean pill organizer box away from direct kitchen heat or bathroom dampness.",
      disclaimer: "This explanation is designed to help you understand your medical paperwork. Always verify medicine changes with your doctor or pharmacist.",
    };
  }

  // ==========================================
  // 2. MEDICAL BILL
  // ==========================================
  if (isMedicalBill) {
    if (lang === "hindi") {
      return {
        documentTitle: "अस्पताल व डॉक्टर परामर्श बिल (Hospital & Doctor Bill)",
        documentType: "medical_bill",
        documentTypeLabel: "अस्पताल का बिल",
        simpleSummary: "यह अपोलो मेमोरियल अस्पताल का बिल है। कुल ₹200 में से बीमा और वरिष्ठ नागरिक छूट के बाद केवल ₹40 का भुगतान बाकी है।",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "अपोलो मेमोरियल अस्पताल इनवॉइस INV-2026-98124",
        keyDates: [
          { label: "बिल की तारीख", date: "12 सितंबर 2026", isUrgent: false },
          { label: "भुगतान की अंतिम तारीख", date: "25 सितंबर 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (बीमा + छूट)",
          balanceDue: "$40.00",
          dueDate: "25 सितंबर 2026",
          breakdown: [
            { item: "वरिष्ठ हृदय रोग विशेषज्ञ परामर्श (डॉ. मेहता)", cost: "$85.00" },
            { item: "ईसीजी जांच (Resting 12-Lead ECG)", cost: "$45.00" },
            { item: "रक्त जांच व लिपिड प्रोफाइल टेस्ट", cost: "$60.00" },
            { item: "अस्पताल प्रशासनिक शुल्क", cost: "$10.00" },
            { item: "वरिष्ठ नागरिक स्वास्थ्य छूट (15%)", cost: "-$30.00" },
            { item: "स्वास्थ्य बीमा द्वारा स्वीकृत हिस्सा", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "25 सितंबर से पहले $40 का बकाया भुगतान करें",
            tip: "आप अस्पताल के कैश काउंटर, कार्ड या ऑनलाइन पोर्टल से भुगतान कर सकते हैं।",
          },
          {
            priority: "for_records",
            action: "बीमा दावे की रसीद सुरक्षित रखें",
            tip: "रसीद को अपनी मेडिकल फाइल में संभाल कर रखें।",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay (सह-भुगतान)", plainMeaning: "बीमा के अलावा वह छोटी राशि जो मरीज को खुद देनी होती है" },
          { term: "Itemized Charges", plainMeaning: "प्रत्येक जांच व डॉक्टर फीस का अलग-अलग पारदर्शी विवरण" },
        ],
        safeAdvice: "भुगतान के बाद अस्पताल की मुहर लगी रसीद अवश्य प्राप्त करें।",
        disclaimer: "यह बिल विवरण आपके संदर्भ के लिए है। किसी भी अंतर के लिए अस्पताल बिलिंग विभाग से संपर्क करें।",
      };
    }

    if (lang === "spanish") {
      return {
        documentTitle: "Factura Hospitalaria y Consulta Cardiológica",
        documentType: "medical_bill",
        documentTypeLabel: "Factura Médica",
        simpleSummary: "Esta es la factura del hospital Apollo. Del total de $200.00, tras aplicar el descuento para personas mayores y el seguro, solo queda un saldo de $40.00 por pagar.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "Factura Hospital Apollo INV-2026-98124",
        keyDates: [
          { label: "Fecha de Emisión", date: "12 de Septiembre de 2026", isUrgent: false },
          { label: "Vencimiento de Pago", date: "25 de Septiembre de 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (Seguro + Descuento)",
          balanceDue: "$40.00",
          dueDate: "25 de Septiembre de 2026",
          breakdown: [
            { item: "Consulta con Especialista (Dr. Mehta)", cost: "$85.00" },
            { item: "Electrocardiograma (ECG)", cost: "$45.00" },
            { item: "Perfil Lipídico y Análisis de Sangre", cost: "$60.00" },
            { item: "Gestión Hospitalaria", cost: "$10.00" },
            { item: "Descuento Adulto Mayor (15%)", cost: "-$30.00" },
            { item: "Cobertura de Seguro Médico", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "Pagar el saldo pendiente de $40.00 antes del 25 de Septiembre",
            tip: "Puede abonarlo cómodamente en ventanilla o por internet.",
          },
          {
            priority: "for_records",
            action: "Guardar el recibo para el archivo familiar",
            tip: "Consérvelo en su carpeta de documentos de salud.",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pago", plainMeaning: "La pequeña porción que paga el paciente después del seguro" },
        ],
        safeAdvice: "Solicite siempre comprobante oficial tras efectuar el pago.",
        disclaimer: "Documento meramente explicativo. Cualquier duda consulte con administración del hospital.",
      };
    }

    if (lang === "tamil") {
      return {
        documentTitle: "மருத்துவமனை மற்றும் பரிசோதனை கட்டண ரசீது",
        documentType: "medical_bill",
        documentTypeLabel: "மருத்துவ பில் (Medical Bill)",
        simpleSummary: "இது அப்பல்லோ மருத்துவமனை கட்டண ரசீது. மொத்த கட்டணம் $200.00-ல், காப்பீடு மற்றும் முதியோர் சலுகை போக நீங்கள் செலுத்த வேண்டிய மீதி $40.00 மட்டுமே.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "அப்பல்லோ மருத்துவமனை பில் INV-2026-98124",
        keyDates: [
          { label: "பில் தேதி", date: "12 செப்டம்பர் 2026", isUrgent: false },
          { label: "கட்டணம் செலுத்த கடைசி நாள்", date: "25 செப்டம்பர் 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (காப்பீடு + தள்ளுபடி)",
          balanceDue: "$40.00",
          dueDate: "25 செப்டம்பர் 2026",
          breakdown: [
            { item: "மருத்துவர் ஆலோசனை கட்டணம்", cost: "$85.00" },
            { item: "ஈசிஜி பரிசோதனை (ECG)", cost: "$45.00" },
            { item: "இரத்த பரிசோதனை கட்டணம்", cost: "$60.00" },
            { item: "நிர்வாக கட்டணம்", cost: "$10.00" },
            { item: "முதியோர் தள்ளுபடி (15%)", cost: "-$30.00" },
            { item: "மருத்துவ காப்பீடு செலுத்தியது", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "செப்டம்பர் 25-க்குள் மீதித் தொகை $40.00 செலுத்தவும்",
            tip: "நேரடியாகவோ அல்லது ஆன்லைன் மூலமாகவோ செலுத்தலாம்.",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay", plainMeaning: "காப்பீடு போக நோயாளி செலுத்த வேண்டிய தொகை" },
        ],
        safeAdvice: "கட்டணம் செலுத்திய பிறகு அதிகாரப்பூர்வ ரசீதைப் பெற்றுக் கொள்ளுங்கள்.",
        disclaimer: "இது விளக்கத்திற்காக மட்டுமே. சந்தேகங்களுக்கு மருத்துவமனை பில்லிங் பிரிவை அணுகவும்.",
      };
    }

    if (lang === "bengali") {
      return {
        documentTitle: "হাসপাতাল ও ডাক্তার চেকআপের বিল",
        documentType: "medical_bill",
        documentTypeLabel: "মেডিকেল বিল",
        simpleSummary: "এটি অ্যাপোলো হাসপাতালের বিল। মোট $২০০ এর মধ্যে প্রবীণ নাগরিক ছাড় ও স্বাস্থ্য বীমা বাদ দিয়ে বাকি দিতে হবে মাত্র $৪০।",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "অ্যাপোলো হাসপাতাল বিল INV-2026-98124",
        keyDates: [
          { label: "বিলের তারিখ", date: "১২ সেপ্টেম্বর ২০২৬", isUrgent: false },
          { label: "জমা দেওয়ার শেষ তারিখ", date: "২৫ সেপ্টেম্বর ২০২৬", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (বীমা ও ছাড়)",
          balanceDue: "$40.00",
          dueDate: "২৫ সেপ্টেম্বর ২০২৬",
          breakdown: [
            { item: "স্পেশালিস্ট ডাক্তার ফি", cost: "$85.00" },
            { item: "ইসিজি পরীক্ষা (ECG)", cost: "$45.00" },
            { item: "লিপিড প্রোফাইল রক্ত পরীক্ষা", cost: "$60.00" },
            { item: "হাসপাতাল চার্জ", cost: "$10.00" },
            { item: "প্রবীণ নাগরিক ছাড় (১৫%)", cost: "-$30.00" },
            { item: "স্বাস্থ্য বীমা অনুমোদন", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "২৫ সেপ্টেম্বরের মধ্যে বাকি $৪০ মিটিয়ে দিন",
            tip: "হাসপাতাল কাউন্টারে বা অনলাইনে দিতে পারেন।",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay", plainMeaning: "বীমা বাদে রোগীর নিজস্ব খরচের অংশ" },
        ],
        safeAdvice: "টাকা জমা দেওয়ার পর পাকা রসিদ নিজের ফাইলে রাখুন।",
        disclaimer: "এটি তথ্যমূলক বিবরণী। কোনো অমিল থাকলে হাসপাতালের বিলিং শাখায় কথা বলুন।",
      };
    }

    if (lang === "telugu") {
      return {
        documentTitle: "హాస్పిటల్ & టెస్టుల మెడికల్ బిల్లు",
        documentType: "medical_bill",
        documentTypeLabel: "హాస్పిటల్ బిల్లు",
        simpleSummary: "ఇది అపోలో హాస్పిటల్ బిల్లు. మొత్తం $200.00 లో సీనియర్ సిటిజన్ డిస్కౌంట్ మరియు ఇన్సూరెన్స్ పోను మీరు చెల్లించాల్సింది కేవలం $40.00 మాత్రమే.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "అపోలో హాస్పిటల్ బిల్లు",
        keyDates: [
          { label: "బిల్లు తేదీ", date: "12 సెప్టెంబర్ 2026", isUrgent: false },
          { label: "చివరి గడువు", date: "25 సెప్టెంబర్ 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (ఇన్సూరెన్స్ & తగ్గింపు)",
          balanceDue: "$40.00",
          dueDate: "25 సెప్టెంబర్ 2026",
          breakdown: [
            { item: "డాక్టర్ కన్సల్టేషన్ ఫీజు", cost: "$85.00" },
            { item: "ఈసీజీ పరీక్ష (ECG)", cost: "$45.00" },
            { item: "రక్త పరీక్షల ఫీజు", cost: "$60.00" },
            { item: "అడ్మినిస్ట్రేషన్ ఛార్జీలు", cost: "$10.00" },
            { item: "సీనియర్ సిటిజన్ తగ్గింపు (15%)", cost: "-$30.00" },
            { item: "ఇన్సూరెన్స్ చెల్లించిన మొత్తం", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "సెప్టెంబర్ 25 లోపు మిగిలిన $40.00 చెల్లించండి",
            tip: "కౌంటర్ వద్ద లేదా ఆన్‌లైన్ ద్వారా చెల్లించవచ్చు.",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay", plainMeaning: "ఇన్సూరెన్స్ పోను రోగి స్వయంగా చెల్లించాల్సిన మొత్తం" },
        ],
        safeAdvice: "చెల్లింపు చేసిన తర్వాత అసలు రసీదును భద్రపరచండి.",
        disclaimer: "ఈ సమాచారం మీ అవగాహన కొరకు మాత్రమే.",
      };
    }

    if (lang === "marathi") {
      return {
        documentTitle: "रुग्णालय व तपासणी बिल (Hospital Medical Bill)",
        documentType: "medical_bill",
        documentTypeLabel: "वैद्यकीय बिल",
        simpleSummary: "हे अपोलो रुग्णालयाचे बिल आहे. एकूण $200.00 पैकी ज्येष्ठ नागरिक सवलत आणि विम्याच्या रकमेनंतर फक्त $40.00 बाकी भरायचे आहेत.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "अपोलो हॉस्पिटल बिल",
        keyDates: [
          { label: "बिलाची तारीख", date: "12 सप्टेंबर 2026", isUrgent: false },
          { label: "बिल भरण्याची अंतिम मुदत", date: "25 सप्टेंबर 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (विमा + सवलत)",
          balanceDue: "$40.00",
          dueDate: "25 सप्टेंबर 2026",
          breakdown: [
            { item: "तज्ज्ञ डॉक्टर फी", cost: "$85.00" },
            { item: "ईसीजी चाचणी (ECG)", cost: "$45.00" },
            { item: "रक्त तपासणी व लिपिड प्रोफाईल", cost: "$60.00" },
            { item: "प्रशासकीय खर्च", cost: "$10.00" },
            { item: "ज्येष्ठ नागरिक सवलत (15%)", cost: "-$30.00" },
            { item: "आरोग्य विमा मंजूर रक्कम", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "25 सप्टेंबरपूर्वी शिल्लक $40.00 भरा",
            tip: "तुम्ही रोख, कार्ड किंवा ऑनलाईन भरू शकता.",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay", plainMeaning: "विम्याव्यतिरिक्त रुग्णाने स्वतः भरायची रक्कम" },
        ],
        safeAdvice: "बिल भरल्यानंतर अधिकृत पावती जपून ठेवा.",
        disclaimer: "हे विवरण तुमच्या माहितीसाठी आहे.",
      };
    }

    if (lang === "gujarati") {
      return {
        documentTitle: "હોસ્પિટલ અને તપાસનું મેડિકલ બિલ",
        documentType: "medical_bill",
        documentTypeLabel: "હોસ્પિટલ બિલ",
        simpleSummary: "આ એપોલો હોસ્પિટલનું બિલ છે. કુલ $200.00 માંથી સીનિયર સિટીઝન ડિસ્કાઉન્ટ અને વીમા પછી ફક્ત $40.00 ચૂકવવાના બાકી છે.",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 260) : "એપોલો હોસ્પિટલ બિલ",
        keyDates: [
          { label: "બિલ તારીખ", date: "12 સપ્ટેમ્બર 2026", isUrgent: false },
          { label: "ચૂકવણીની છેલ્લી તારીખ", date: "25 સપ્ટેમ્બર 2026", isUrgent: true },
        ],
        medicines: [],
        testsAndResults: [],
        billingDetails: {
          totalAmount: "$200.00",
          amountPaid: "$160.00 (વીમો + ડિસ્કાઉન્ટ)",
          balanceDue: "$40.00",
          dueDate: "25 સપ્ટેમ્બર 2026",
          breakdown: [
            { item: "સ્પેશિયાલિસ્ટ ડૉક્ટર ફી", cost: "$85.00" },
            { item: "ઇસીજી તપાસ (ECG)", cost: "$45.00" },
            { item: "લિપિડ પ્રોફાઇલ લોહી તપાસ", cost: "$60.00" },
            { item: "હોસ્પિટલ વહીવટી ચાર્જ", cost: "$10.00" },
            { item: "વરિષ્ઠ નાગરિક રાહત (15%)", cost: "-$30.00" },
            { item: "સ્વાસ્થ્ય વીમા દ્વારા ચૂકવણી", cost: "-$130.00" },
          ],
        },
        appointmentDetails: null,
        actionItems: [
          {
            priority: "must_do",
            action: "25 સપ્ટેમ્બર પહેલા બાકી $40.00 ચૂકવી દેવા",
            tip: "હોસ્પિટલ કાઉન્ટર પર કે ઓનલાઇન ભરી શકાય છે.",
          },
        ],
        medicalTermsExplained: [
          { term: "Co-Pay", plainMeaning: "વીમા ઉપરાંત દર્દીએ ચૂકવવાની થતી નાની રકમ" },
        ],
        safeAdvice: "ચૂકવણી પછી કાયમી રસીદ મેળવીને ફાઇલમાં રાખવી.",
        disclaimer: "આ માત્ર સમજૂતી માટે છે. કોઈ પ્રશ્ન હોય તો હોસ્પિટલમાં સંપર્ક કરવો.",
      };
    }

    // Default English Bill
    return {
      documentTitle: "Hospital Consultation & Diagnostic Medical Bill",
      documentType: "medical_bill",
      documentTypeLabel: "Medical Bill",
      simpleSummary: "This is an official itemized medical bill from Apollo Memorial Hospital. After insurance coverage and senior discounts, your net balance due is $40.00.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Apollo Hospital Invoice INV-2026-98124",
      keyDates: [
        { label: "Invoice Date", date: "12 September 2026", isUrgent: false },
        { label: "Payment Due Date", date: "25 September 2026", isUrgent: true },
      ],
      medicines: [],
      testsAndResults: [],
      billingDetails: {
        totalAmount: "$200.00",
        amountPaid: "$160.00 (Insurance + Discount)",
        balanceDue: "$40.00",
        dueDate: "25 September 2026",
        breakdown: [
          { item: "Senior Specialist Consultation Fee (Dr. Mehta)", cost: "$85.00" },
          { item: "Digital Resting 12-Lead ECG", cost: "$45.00" },
          { item: "Complete Lipid Profile & Blood Biochemistry", cost: "$60.00" },
          { item: "Hospital Administration & Sanitation Charge", cost: "$10.00" },
          { item: "Senior Citizen Health Discount (15%)", cost: "-$30.00" },
          { item: "Primary Health Insurance Approved Share", cost: "-$130.00" },
        ],
      },
      appointmentDetails: null,
      actionItems: [
        {
          priority: "must_do",
          action: "Pay balance due of $40.00 before 25 September 2026",
          tip: "You can pay easily at the hospital front desk or online via debit card.",
        },
      ],
      medicalTermsExplained: [
        { term: "Co-Pay", plainMeaning: "The fixed amount you pay out of pocket for a medical service after insurance" },
      ],
      safeAdvice: "Always keep the payment confirmation receipt stamped by the hospital in your records.",
      disclaimer: "Please verify any insurance dispute directly with Apollo Hospital billing desk.",
    };
  }

  // ==========================================
  // 3. LAB / TEST REPORT
  // ==========================================
  if (isLabReport) {
    const isLangHindi = lang === "hindi";
    const isLangSpanish = lang === "spanish";
    const isLangTamil = lang === "tamil";
    const isLangBengali = lang === "bengali";
    const isLangTelugu = lang === "telugu";
    const isLangMarathi = lang === "marathi";
    const isLangGujarati = lang === "gujarati";

    return {
      documentTitle: isLangHindi
        ? "रक्त व लिपिड प्रोफाइल जांच रिपोर्ट (Blood & Lipid Lab Report)"
        : isLangSpanish
        ? "Informe de Análisis Clínicos y Perfil Lipídico"
        : isLangTamil
        ? "இரத்த பரிசோதனை மற்றும் லிப்பிட் அறிக்கை"
        : isLangBengali
        ? "রক্ত ও লিপিড প্রোফাইল ল্যাব রিপোর্ট"
        : isLangTelugu
        ? "రక్త పరీక్ష & లిపిడ్ ప్రొఫైల్ ల్యాబ్ రిపోర్ట్"
        : isLangMarathi
        ? "रक्त व लिपिड प्रोफाईल लॅब अहवाल"
        : isLangGujarati
        ? "લોહી અને લિપિડ પ્રોફાઇલ લેબ રિપોર્ટ"
        : "Comprehensive Blood & Lipid Profile Lab Report",
      documentType: "lab_report",
      documentTypeLabel: isLangHindi
        ? "लैब जांच रिपोर्ट"
        : isLangSpanish
        ? "Informe de Laboratorio"
        : isLangTamil
        ? "ஆய்வக அறிக்கை"
        : isLangBengali
        ? "ল্যাব টেস্ট রিপোর্ট"
        : isLangTelugu
        ? "ల్యాబ్ పరీక్ష రిపోర్ట్"
        : isLangMarathi
        ? "लॅब तपासणी अहवाल"
        : isLangGujarati
        ? "લેબ તપાસ રિપોર્ટ"
        : "Lab/Test Report",
      simpleSummary: isLangHindi
        ? "यह आपकी रक्त जांच रिपोर्ट है। आपकी किडनी ठीक काम कर रही है (सामान्य)। पिछले 3 महीने की शुगर (HbA1c 6.8%) नियंत्रण में है, बस खाली पेट की शुगर थोड़ी सी बढ़ी हुई है।"
        : isLangSpanish
        ? "Este es su informe de análisis clínicos. La función renal es normal. La glucosa trimestral (HbA1c 6.8%) está bajo buen control, y solo la glucosa en ayunas se encuentra ligeramente elevada."
        : isLangTamil
        ? "இது உங்கள் இரத்த பரிசோதனை அறிக்கை. சிறுநீரகம் நன்றாக இயங்குகிறது. 3 மாத சராசரி சர்க்கரை (HbA1c 6.8%) கட்டுப்பாட்டில் உள்ளது."
        : isLangBengali
        ? "এটি আপনার রক্তের রিপোর্ট। কিডনির কার্যক্ষমতা স্বাভাবিক আছে। ৩ মাসের গড় সুগার (HbA1c 6.8%) নিয়ন্ত্রণে রয়েছে।"
        : isLangTelugu
        ? "ఇది మీ రక్త పరీక్షల రిపోర్ట్. కిడ్నీ పనితీరు బాగుంది. 3 నెలల సగటు షుగర్ (HbA1c 6.8%) అదుపులోనే ఉంది."
        : isLangMarathi
        ? "हा तुमचा रक्त तपासणी अहवाल आहे. किडनीचे कार्य उत्तम आहे. ३ महिन्यांची सरासरी साखर (HbA1c 6.8%) नियंत्रणात आहे."
        : isLangGujarati
        ? "આ તમારો બ્લડ ટેસ્ટ રિપોર્ટ છે. કિડનીનું કાર્ય સામાન્ય છે. ૩ મહિનાની સરેરાશ સુગર (HbA1c 6.8%) કંટ્રોલમાં છે."
        : "This is your diagnostic blood report. Kidney function is healthy and normal. Your 3-month blood sugar (HbA1c 6.8%) is under reasonable control with only mild morning elevation.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Metropolis Diagnostic Laboratories Report",
      keyDates: [
        {
          label: isLangHindi ? "नमूना संग्रहण तारीख" : isLangSpanish ? "Toma de Muestra" : "Specimen Collected",
          date: "10 September 2026",
          isUrgent: false,
        },
      ],
      medicines: [],
      testsAndResults: [
        {
          testName: "Fasting Blood Sugar (खाली पेट शुगर)",
          resultValue: "128 mg/dL",
          normalRange: "70 - 99 mg/dL",
          plainMeaning: isLangHindi
            ? "खाली पेट की शुगर सामान्य सीमा से थोड़ी ऊपर है। नियमित दवा और वॉक जरूरी है।"
            : isLangSpanish
            ? "Ligeramente por encima del rango normal. Mantenga su medicación y caminatas."
            : "Mildly above ideal fasting baseline. Keep taking your morning pill.",
          status: "borderline",
        },
        {
          testName: "HbA1c (3 Month Average Sugar)",
          resultValue: "6.8%",
          normalRange: "< 5.7% (Good Control: 6.5 - 7.0%)",
          plainMeaning: isLangHindi
            ? "वरिष्ठ नागरिकों के लिए 6.8% एक सुरक्षित और नियंत्रित स्तर माना जाता है।"
            : isLangSpanish
            ? "Buen control general de glucosa en los últimos 90 días."
            : "Satisfactory and stable blood sugar control over the past 90 days.",
          status: "normal",
        },
        {
          testName: "Serum Creatinine (किडनी कार्य)",
          resultValue: "1.05 mg/dL",
          normalRange: "0.70 - 1.30 mg/dL",
          plainMeaning: isLangHindi
            ? "आपकी दोनों किडनियां बहुत स्वस्थ हैं और रक्त को अच्छे से छान रही हैं।"
            : isLangSpanish
            ? "Excelente función renal, los riñones filtran adecuadamente."
            : "Healthy kidney function; waste is filtered smoothly from blood.",
          status: "normal",
        },
      ],
      billingDetails: null,
      appointmentDetails: null,
      actionItems: [
        {
          priority: "must_do",
          action: isLangHindi
            ? "डॉ. मेहता को अपनी अगली मुलाकात में यह रिपोर्ट दिखाएं"
            : isLangSpanish
            ? "Mostrar este informe al médico en la próxima visita"
            : "Share this report with your physician during your next follow-up",
          tip: isLangHindi
            ? "इस रिपोर्ट की एक कॉपी अपने मेडिकल फोल्डर में रखें।"
            : "Keep a physical copy in your medical bag.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "HbA1c",
          plainMeaning: isLangHindi
            ? "पिछले 3 महीनों की औसत शुगर की जांच"
            : isLangSpanish
            ? "Promedio de glucosa en sangre de los últimos 3 meses"
            : "Average blood sugar test covering the past 90 days",
        },
      ],
      safeAdvice: isLangHindi
        ? "पर्याप्त पानी पिएं ताकि शरीर में तरलता बनी रहे और किडनियां स्वस्थ रहें।"
        : isLangSpanish
        ? "Beba suficiente agua para mantener los riñones bien hidratados."
        : "Stay comfortably hydrated with clean water throughout the day.",
      disclaimer: isLangHindi
        ? "लैब रिपोर्ट का अंतिम विश्लेषण हमेशा अपने चिकित्सक से करवाएं।"
        : "Always discuss lab test results directly with your healthcare provider.",
    };
  }

  // ==========================================
  // 4. PHARMACY BILL
  // ==========================================
  if (isPharmacyBill) {
    const isLangHindi = lang === "hindi";
    const isLangSpanish = lang === "spanish";
    return {
      documentTitle: isLangHindi
        ? "वेलनेस फार्मेसी दवा बिल (Pharmacy Cash Memo)"
        : isLangSpanish
        ? "Factura Mensual de Farmacia y Medicamentos"
        : "Wellness Pharmacy Monthly Prescription Bill",
      documentType: "pharmacy_bill",
      documentTypeLabel: isLangHindi ? "केमिस्ट दवा बिल" : isLangSpanish ? "Factura de Farmacia" : "Pharmacy Bill",
      simpleSummary: isLangHindi
        ? "यह मेडिकल स्टोर का बिल है। इसमें आपकी 1 महीने की ब्लड प्रेशर और शुगर की दवाएं हैं। कुल $32.98 का पूरा भुगतान हो चुका है।"
        : isLangSpanish
        ? "Factura de farmacia correspondiente al suministro mensual de medicamentos. Pagada en su totalidad ($32.98)."
        : "This is a pharmacy receipt showing your 30-day supply of blood pressure and sugar medicines. The bill is paid in full ($32.98) with zero balance due.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Wellness Care Pharmacy Bill PH-55420",
      keyDates: [
        { label: "Purchase Date", date: "15 September 2026", isUrgent: false },
        { label: "Next Refill", date: "15 October 2026", isUrgent: false },
      ],
      medicines: [
        {
          name: "Glycomet SR 500mg (Metformin)",
          dosage: "10 tabs x 6 strips",
          timing: "Morning & Night with food",
          instructions: "Check expiry (08/2028). Take with meals.",
          quantity: "60 tablets",
        },
        {
          name: "Stamlo 5mg (Amlodipine)",
          dosage: "10 tabs x 3 strips",
          timing: "Morning after breakfast",
          instructions: "Check expiry (11/2027). Daily BP maintenance.",
          quantity: "30 tablets",
        },
      ],
      testsAndResults: [],
      billingDetails: {
        totalAmount: "$32.98",
        amountPaid: "$32.98",
        balanceDue: "$0.00 (PAID)",
        breakdown: [
          { item: "Glycomet SR 500mg (60 Tabs)", cost: "$14.40" },
          { item: "Stamlo 5mg (30 Tabs)", cost: "$8.50" },
          { item: "Calcirol 60K Softgels", cost: "$12.00" },
          { item: "Senior Privilege Discount (10%)", cost: "-$3.49" },
          { item: "Taxes", cost: "$1.57" },
        ],
      },
      appointmentDetails: null,
      actionItems: [
        {
          priority: "for_records",
          action: isLangHindi ? "बिल की पर्ची को दवाइयों के साथ रखें" : "Keep the pharmacy receipt with medicine packs",
          tip: "Check expiry date before opening each strip.",
        },
      ],
      medicalTermsExplained: [],
      safeAdvice: "Keep medicine strips away from kitchen stove heat or direct bathroom moisture.",
      disclaimer: "Always check medicine names and dosage strengths printed on the strips before taking.",
    };
  }

  // ==========================================
  // 5. APPOINTMENT SLIP
  // ==========================================
  if (isAppointment) {
    const isLangHindi = lang === "hindi";
    const isLangSpanish = lang === "spanish";
    return {
      documentTitle: isLangHindi
        ? "नेत्र जांच व मोतियाबिंद क्लिनिक अपॉइंटमेंट पर्ची"
        : isLangSpanish
        ? "Comprobante de Cita Oftalmológica (Cataratas)"
        : "Eye Care Clinic Cataract Follow-up Appointment Slip",
      documentType: "appointment",
      documentTypeLabel: isLangHindi ? "अपॉइंटमेंट पर्ची" : isLangSpanish ? "Cita Médica" : "Appointment Document",
      simpleSummary: isLangHindi
        ? "यह आंखों के अस्पताल में मोतियाबिंद जांच की अपॉइंटमेंट पर्ची है। 24 सितंबर को सुबह 10:15 बजे पहुंचना है। आंखों में पुतली फैलाने की दवा डाली जाएगी, इसलिए साथ में परिवार के किसी सदस्य को अवश्य ले जाएं।"
        : isLangSpanish
        ? "Cita oftalmológica para revisión de cataratas el jueves 24 de Septiembre a las 10:15 AM. Se aplicarán gotas dilatadoras, por lo que debe ir acompañado."
        : "This is an appointment slip for an eye checkup with Dr. Radhika Sen on Thursday, 24 September. Eye dilation drops will be given, so a family member should accompany you.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Divine Eye Institute Appointment Slip EYE-9021",
      keyDates: [
        { label: "Appointment Date", date: "Thursday, 24 September 2026", isUrgent: true },
        { label: "Reporting Time", date: "10:15 AM", isUrgent: true },
      ],
      medicines: [],
      testsAndResults: [],
      billingDetails: null,
      appointmentDetails: {
        doctorOrClinic: "Dr. Radhika Sen (Divine Eye Institute)",
        dateTime: "Thursday, 24 September 2026 at 10:15 AM",
        location: "Suite 302, 3rd Floor, Divine Eye Hospital, Ring Road",
        preparationInstructions: [
          isLangHindi ? "अपने पढ़ने और दूर के चश्मे साथ लेकर आएं" : "Bring existing reading and distance eyeglasses",
          isLangHindi ? "आंखों में दवा डलने के बाद 3-4 घंटे धुंधला दिखेगा, इसलिए गाड़ी न चलाएं और साथ में किसी को लाएं" : "Vision will be blurry after dilation drops; do not drive and have an attendant accompany you",
          isLangHindi ? "धूप से बचाव के लिए काला चश्मा (सनग्लासेस) लाएं" : "Bring dark sunglasses to wear after pupil dilation",
        ],
      },
      actionItems: [
        {
          priority: "must_do",
          action: isLangHindi ? "24 सितंबर सुबह 10:15 बजे क्लिनिक पहुंचें" : "Arrive at eye clinic by 10:15 AM on Thursday",
          tip: "Take your morning BP medication as usual before going.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "Pupillary Dilation",
          plainMeaning: isLangHindi
            ? "आंख की पुतली को बड़ा करने की ड्रॉप्स ताकि डॉक्टर पर्दे (रेटिना) की पूरी जांच कर सकें"
            : "Drops placed in eyes to widen pupils so doctor can inspect retina clearly",
        },
      ],
      safeAdvice: isLangHindi
        ? "आंखों की जांच के बाद तेज धूप से बचें और काला चश्मा पहनें।"
        : "Wear sunglasses after dilation drops to protect your eyes from bright light.",
      disclaimer: "Carry your past eye test records and doctor prescriptions.",
    };
  }

  // ==========================================
  // 6. DEFAULT / UTILITY BILL
  // ==========================================
  const isLangHindi = lang === "hindi";
  const isLangSpanish = lang === "spanish";
  return {
    documentTitle: isLangHindi ? "मासिक घरेलू बिजली का बिल" : isLangSpanish ? "Factura Mensual de Electricidad" : "Monthly Electricity Utility Bill",
    documentType: "utility_bill",
    documentTypeLabel: isLangHindi ? "बिजली बिल" : isLangSpanish ? "Factura de Luz" : "Utility Bill",
    simpleSummary: isLangHindi
      ? "यह आपका मासिक बिजली बिल है। 20 सितंबर से पहले कुल $42.50 का भुगतान करना है ताकि विलंब शुल्क न लगे।"
      : isLangSpanish
      ? "Esta es su factura mensual de luz. El monto a pagar es de $42.50 con vencimiento el 20 de Septiembre."
      : "This is your monthly residential electricity bill. The total amount due is $42.50, due on 20 September 2026.",
    confidenceLevel: "high",
    extractedTextPreview: text ? text.slice(0, 260) : "Metro Power Corp Electricity Bill Account 8921-409",
    keyDates: [
      { label: "Bill Date", date: "15 September 2026", isUrgent: false },
      { label: "Due Date", date: "20 September 2026", isUrgent: true },
    ],
    medicines: [],
    testsAndResults: [],
    billingDetails: {
      totalAmount: "$42.50",
      amountPaid: "$0.00",
      balanceDue: "$42.50",
      dueDate: "20 September 2026",
      breakdown: [
        { item: "Electricity Consumption (184 kWh)", cost: "$38.20" },
        { item: "Taxes & Regulatory Charges", cost: "$4.30" },
      ],
    },
    appointmentDetails: null,
    actionItems: [
      {
        priority: "must_do",
        action: isLangHindi ? "20 सितंबर से पहले $42.50 का भुगतान करें" : "Pay $42.50 before 20 September",
        tip: "You can pay safely online, via your bank app, or at your local post office.",
      },
    ],
    medicalTermsExplained: [],
    safeAdvice: "Always verify your consumer account number matches your paper bill before paying.",
    disclaimer: "Keep the transaction receipt number for your household records.",
  };
};
