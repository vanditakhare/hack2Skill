// Senior-friendly smart answer generator for Mitraa Voice Companion
// Provides direct, compassionate, and accurate answers in all 8 supported languages

interface SmartAnswerParams {
  query: string;
  language: string;
  seniorName: string;
  seniorContext?: string;
}

export const getSmartCompanionAnswer = ({
  query,
  language,
  seniorName,
  seniorContext = "",
}: SmartAnswerParams): string => {
  const q = (query || "").toLowerCase().trim();
  const lang = (language || "English").toLowerCase();

  // Determine language code
  const isHindi = lang.includes("hindi");
  const isSpanish = lang.includes("spanish");
  const isTamil = lang.includes("tamil");
  const isBengali = lang.includes("bengali");
  const isTelugu = lang.includes("telugu");
  const isMarathi = lang.includes("marathi");
  const isGujarati = lang.includes("gujarati");

  // Topic 1: Medicines & Pill Schedule
  if (
    q.includes("medicine") ||
    q.includes("dawa") ||
    q.includes("goli") ||
    q.includes("pill") ||
    q.includes("dose") ||
    q.includes("tablet") ||
    q.includes("capsule") ||
    q.includes("metformin") ||
    q.includes("amlodipine") ||
    q.includes("vitamin") ||
    q.includes("medicamento") ||
    q.includes("marunthu") ||
    q.includes("osudh") ||
    q.includes("mandulu") ||
    q.includes("aushadh")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आपकी दैनिक दवाइयों का विवरण इस प्रकार है: सुबह नाश्ते के बाद रक्तचाप के लिए एम्लोडिपिन (5mg) और विटामिन D3 कैप्सूल; तथा रात के भोजन के साथ शुगर नियंत्रण के लिए मेटफॉर्मिन (500mg) ली जाती है। दवाइयों को हमेशा एक गिलास ताज़ा पानी के साथ लें। आप स्वास्थ्य टैब में पूरी दवा सूची देख सकते हैं।`;
    }
    if (isSpanish) {
      return `${seniorName}, tu horario diario de medicamentos es: Amlodipino 5mg y Vitamina D3 por la mañana con el desayuno para la presión; y Metformina 500mg por la noche con la cena para la glucosa. Tómalos siempre con un vaso de agua. Puedes ver la lista completa en la pestaña de Salud.`;
    }
    if (isTamil) {
      return `${seniorName}, உங்கள் மருந்து விவரம்: காலை உணவுக்குப் பின் இரத்த அழுத்தத்திற்கான ஆம்லோடிபைன் (5mg) மற்றும் வைட்டமின் D3; இரவு உணவோடு சர்க்கரைக்கான மெட்ஃபார்மின் (500mg). எப்போதும் தண்ணீருடன் மருந்தை உட்கொள்ளுங்கள்.`;
    }
    if (isBengali) {
      return `${seniorName}, আপনার ওষুধের তালিকা: সকালে প্রাতরাশের পর প্রেসারের অ্যামলোডিপাইন (5mg) এবং ভিটামিন D3; আর রাতে খাবারের সাথে সুগারের মেটফর্মিন (500mg)। নিয়মিত পর্যাপ্ত জল দিয়ে ওষুধ খাবেন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, మీ మందుల వివరాలు: ఉదయం అల్పాహారం తర్వాత బీపీ కోసం ఆమ్లోడిపైన్ (5mg), విటమిన్ D3; రాత్రి భోజనంతో పాటు షుగర్ కోసం మెట్‌ఫార్మిన్ (500mg) వేసుకోవాలి. నీటితో మాత్రలు తీసుకోండి.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, आपल्या औषधांचे वेळापत्रक: सकाळी नाश्त्यानंतर रक्तदाबासाठी अ‍ॅम्लोडिपिन (5mg) व व्हिटॅमिन D3; रात्री जेवणासोबत साखरेच्या नियंत्रणासाठी मेटफॉर्मिन (500mg) घ्यायचे आहे. नेहमी पाण्यासोबत औषध घ्या.`;
    }
    if (isGujarati) {
      return `${seniorName}, તમારી દવાઓનું સમયપત્રક: સવારે નાસ્તા પછી બીપી માટે એમ્લોડિપિન (5mg) અને વિટામિન D3; રાત્રે જમવાની સાથે ડાયાબિટીસ માટે મેટફોર્મિન (500mg). નિયમિત પાણી સાથે દવા લેશો.`;
    }
    return `Hello ${seniorName}! According to your health profile, your regular maintenance medicines are: Morning after breakfast: Amlodipine 5mg (for blood pressure) and Vitamin D3; Night with dinner: Metformin ER 500mg (for blood sugar). Always swallow pills with a full glass of water. You can review and mark each dose in your Health & Medicines tab.`;
  }

  // Topic 2: Today's Schedule & Routine
  if (
    q.includes("schedule") ||
    q.includes("routine") ||
    q.includes("today") ||
    q.includes("aaj") ||
    q.includes("din") ||
    q.includes("plan") ||
    q.includes("samay") ||
    q.includes("rutina") ||
    q.includes("neram") ||
    q.includes("dinpanji") ||
    q.includes("roju")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आज का दिन सुकून भरा बिताएं। आज की दिनचर्या: सुबह की हल्की सैर और नाश्ता, समय पर दोपहर का हल्का विश्राम, शाम 5 बजे पोते-पोतियों या परिवार से बातचीत, और रात को सही समय पर दवा व नींद। किसी भी काम में जल्दबाजी न करें।`;
    }
    if (isSpanish) {
      return `${seniorName}, hoy es un gran día para cuidarte. Tu rutina de hoy: caminata matutina suave, hidratación y desayuno a tiempo, descanso reparador por la tarde y llamadas tranquilas con la familia al atardecer.`;
    }
    if (isTamil) {
      return `${seniorName}, இன்றைய நல்வழி அட்டவணை: காலை நடைப்பயிற்சி மற்றும் காலை உணவு, மதிய ஓய்வு, மாலையில் குடும்பத்தினருடன் இனிமையான உரையாடல், மற்றும் இரவு நேர சரியான தூக்கம். அமைதியாக இருங்கள்.`;
    }
    if (isBengali) {
      return `${seniorName}, আজকের দিনের পরিকল্পনা: সকালে স্নিগ্ধ হাঁটা ও স্বাস্থ্যকর প্রাতরাশ, দুপুরে একটু বিশ্রাম, বিকেলে পরিবারের সাথে কথা বলা এবং রাতে সময়মতো ওষুধ ও শান্তির ঘুম।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, ఈ రోజు ప్రశాంతమైన షెడ్యూల్: ఉదయం నడక మరియు టిఫిన్, మధ్యాహ్నం కాసేపు విశ్రాంతి, సాయంత్రం కుటుంబంతో ఆహ్లాదకరమైన మాటలు, రాత్రి సమయానికి మందులు వేసుకోవడం.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, आजचे आपले वेळापत्रक: सकाळची हलकी चालणे आणि नाश्ता, दुपारी विश्रांती, संध्याकाळी आप्तस्वकीयांशी गप्पा आणि रात्री वेळेवर औषध व शांत झोप.`;
    }
    if (isGujarati) {
      return `${seniorName}, આજની દિનચર્યા: સવારે તાજી હવામાં થોડું ચાલવું અને નાસ્તો, બપોરે આરામ, સાંજે પરિવાર સાથે વાતચીત અને રાત્રે સમયસર દવા અને શાંત ઊંઘ.`;
    }
    return `Hello ${seniorName}! Here is a gentle reminder for today: start with your refreshing morning walk and breakfast, take an afternoon rest, enjoy a phone call with your family around tea-time, and take your evening medicines comfortably with dinner.`;
  }

  // Topic 3: Doctor Visits & Appointments
  if (
    q.includes("doctor") ||
    q.includes("appointment") ||
    q.includes("clinic") ||
    q.includes("hospital") ||
    q.includes("mehta") ||
    q.includes("checkup") ||
    q.includes("cita") ||
    q.includes("maruthuvar") ||
    q.includes("daktar")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आपके प्राथमिक चिकित्सक डॉ. अरविंद मेहता हैं (सिटी हेल्थ केयर क्लिनिक, कमरा नं 204)। आगामी फॉलो-अप विजिट के लिए सुबह की खाली पेट शुगर की जांच पर्ची साथ रखनी है। यदि आपको क्लिनिक का फोन नंबर चाहिए, तो आपातकालीन व डॉक्टर कार्ड में उपलब्ध है।`;
    }
    if (isSpanish) {
      return `${seniorName}, tu médico principal es el Dr. Arvind Mehta (Clínica City Health Care, Sala 204). Recuerda llevar tus registros recientes de glucosa y presión para tu próxima consulta médica.`;
    }
    if (isTamil) {
      return `${seniorName}, உங்கள் குடும்ப மருத்துவர் டாக்டர் அரவிந்த் மேத்தா ஆவார். உங்கள் அடுத்த சந்திப்பின் போது சமீபத்திய இரத்த பரிசோதனை முடிவுகளை உடன் எடுத்துச் செல்லுங்கள்.`;
    }
    if (isBengali) {
      return `${seniorName}, আপনার প্রধান ডাক্তারবাবু হলেন ডঃ অরবিন্দ মেহতা। পরবর্তী পরিদর্শনের সময় সাম্প্রতিক সুগার টেস্ট রিপোর্ট ও বিপি ডায়েরি সাথে রাখবেন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, మీ వైద్యుడు డాక్టర్ అరవింద్ మెహతా. తదుపరి చెకప్ కోసం మీ బ్లడ్ షుగర్ మరియు బీపీ రికార్డులను వెంట తీసుకెళ్లండి.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, आपले प्राथमिक डॉक्टर डॉ. अरविंद मेहता आहेत. पुढच्या तपासणीच्या वेळी रक्तातील साखरेचा अहवाल आणि बीपीची नोंद सोबत ठेवा.`;
    }
    if (isGujarati) {
      return `${seniorName}, તમારા ડૉક્ટર અરવિંદ મહેતા છે. આગામી મુલાકાત વખતે તાજેતરનો શુગર રિપોર્ટ અને બીપી ડાયરી સાથે રાખશો.`;
    }
    return `Your primary physician is Dr. Arvind Mehta at City Health Care Clinic. When you visit for your follow-up checkup, make sure to bring your recent fasting blood sugar report and your weekly blood pressure readings log.`;
  }

  // Topic 4: Scam Protection, Suspicious Calls, OTP & Banking Safety
  if (
    q.includes("scam") ||
    q.includes("otp") ||
    q.includes("fraud") ||
    q.includes("bank") ||
    q.includes("pin") ||
    q.includes("password") ||
    q.includes("paisa") ||
    q.includes("money") ||
    q.includes("call") ||
    q.includes("message") ||
    q.includes("fraude") ||
    q.includes("mosam")
  ) {
    if (isHindi) {
      return `सावधान रहें ${seniorName} जी! किसी भी फोन कॉल या एसएमएस पर अपना बैंक पासवर्ड, पिन या OTP कभी साझा न करें। बैंक अधिकारी या सरकारी कर्मचारी कभी फोन पर OTP नहीं मांगते। यदि बिजली कटने या खाते के बंद होने का डराने वाला मैसेज आए, तो तुरंत अपने परिवार को बताएं और लिंक पर क्लिक न करें।`;
    }
    if (isSpanish) {
      return `¡Mucho cuidado, ${seniorName}! Jamás compartas códigos OTP, contraseñas ni números de tarjeta por llamada o mensaje. Los bancos nunca los piden por teléfono. Si recibes un mensaje sospechoso sobre cortes de luz o cuentas bloqueadas, consulta a tu familia antes de hacer nada.`;
    }
    if (isTamil) {
      return `${seniorName}, மிகவும் எச்சரிக்கையாக இருங்கள்! வங்கி கடவுச்சொல் அல்லது OTP எண்ணை யாருக்கும் தொலைபேசியிலோ செய்தியிலோ தெரிவிக்காதீர்கள். சந்தேகத்திற்குரிய அழைப்புகள் வந்தால் குடும்பத்தினரிடம் ஆலோசனை பெறுங்கள்.`;
    }
    if (isBengali) {
      return `${seniorName}, খুব সতর্ক থাকুন! ফোনে বা মেসেজে কাউকে কখনও ব্যাংক ওটিপি (OTP) বা পিন বলবেন না। কোনো সন্দেহজনক মেসেজ পেলে পরিবারের কারো সাহায্য নিন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, జాగ్రత్తగా ఉండండి! ఎవరికీ ఫోన్‌లో మీ బ్యాంక్ OTP లేదా పాస్‌వర్డ్ చెప్పకండి. ఏదైనా అనుమానాస్పద సందేశం వస్తే వెంటనే కుటుంబ సభ్యులను సంప్రదించండి.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, अत्यंत सावध राहा! फोनवर किंवा मेसेजमध्ये कोणालाही आपला बँक ओटीपी (OTP) किंवा पिन सांगू नका. संशयास्पद फोन आल्यास आधी कुटुंबीयांना सांगा.`;
    }
    if (isGujarati) {
      return `${seniorName}, ખૂબ સાવચેત રહેશો! કોઈને પણ ફોન પર તમારો બેંક OTP કે પાસવર્ડ આપશો નહીં. શંકાસ્પદ મેસેજ આવે તો પહેલા પરિવારની સલાહ લેશો.`;
    }
    return `Golden Rule for your security, ${seniorName}: NEVER share your OTP, bank PIN, or passwords with anyone over the phone or text messages. Real bank managers and government officials never ask for OTPs. If you receive a scary message threatening electricity disconnection or account blocking, do not click links—ask a family member to verify it.`;
  }

  // Topic 5: Blood Pressure, Sugar & Vitals
  if (
    q.includes("pressure") ||
    q.includes("bp") ||
    q.includes("sugar") ||
    q.includes("diabetes") ||
    q.includes("vital") ||
    q.includes("heart") ||
    q.includes("dil") ||
    q.includes("swasthya") ||
    q.includes("salud")
  ) {
    if (isHindi) {
      return `${seniorName} जी, वरिष्ठ नागरिकों के लिए सामान्य रक्तचाप (BP) लगभग 120/80 से 130/85 के आसपास अच्छा माना जाता है, और सुबह खाली पेट शुगर 90-110 mg/dL संतुलित मानी जाती है। नमक कम खाएं, रोज ताज़ा पानी पिएं और यदि सिर चकराए या घबराहट हो तो आराम से बैठ जाएं।`;
    }
    if (isSpanish) {
      return `${seniorName}, para personas mayores, una presión arterial de alrededor de 120/80 a 130/85 se considera saludable, y la glucosa en ayunas entre 90 y 110 mg/dL. Mantén una dieta baja en sal, hidrátate bien y si sientes mareos, descansa sentado tranquilamente.`;
    }
    if (isTamil) {
      return `${seniorName}, இரத்த அழுத்தம் 120/80 முதல் 130/85 வரையிலும், வெறும் வயிற்று சர்க்கரை 90-110 வரையிலும் இருப்பது ஆரோக்கியமானது. உப்பை குறைத்து, நீர் அதிகம் பருகுங்கள்.`;
    }
    if (isBengali) {
      return `${seniorName}, রক্তচাপ প্রায় ১২০/৮০ থেকে ১৩০/৮৫ এর মধ্যে এবং খালি পেটে সুগার ৯০-১১০ এর মধ্যে থাকা ভালো। খাবারে লবণ কম খাবেন এবং প্রচুর জল পান করবেন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, రక్తపోటు (BP) 120/80 నుండి 130/85 వరకు, షుగర్ 90-110 వరకు సాధారణంగా పరిగణిస్తారు. ఉప్పు తగ్గించి, సమయానికి నీరు తాగండి.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, सामान्य रक्तदाब १२०/८० ते १३०/८५ दरम्यान आणि उपाशीपोटी साखर ९०-११० च्या आसपास असणे उत्तम मानले जाते. आहारात मीठ कमी ठेवा आणि भरपूर पाणी प्या.`;
    }
    if (isGujarati) {
      return `${seniorName}, સામાન્ય બ્લડ પ્રેશર ૧૨૦/૮૦ થી ૧૩૦/૮૫ વચ્ચે અને ભૂખ્યા પેટે શુગર ૯૦-૧૧૦ આસપાસ સારી ગણાય છે. મીઠું ઓછું રાખશો અને પાણી પૂરતું પીશો.`;
    }
    return `For healthy seniors, ${seniorName}, a blood pressure reading around 120/80 to 130/85 mmHg is generally considered well-controlled, and fasting blood sugar between 90 and 110 mg/dL is desirable. Keep your dietary salt low, stay well-hydrated, and if you ever feel dizzy, sit down calmly and take slow deep breaths.`;
  }

  // Topic 6: Calm Breath, Relaxation & Anxiety Relief
  if (
    q.includes("breath") ||
    q.includes("calm") ||
    q.includes("relax") ||
    q.includes("stress") ||
    q.includes("worry") ||
    q.includes("anxious") ||
    q.includes("shant") ||
    q.includes("sans") ||
    q.includes("respirar") ||
    q.includes("swasam")
  ) {
    if (isHindi) {
      return `${seniorName} जी, मन को शांत करने के लिए आप हमारे 'शांत श्वास' (Calm Breath) अनुभाग का उपयोग कर सकते हैं। इसमें 4 सेकंड श्वास अंदर, 4 सेकंड रोकना, और 4 सेकंड बाहर छोड़ना होता है। साथ में आप हल्की बारिश या सागर की सुखद आवाज़ भी सुन सकते हैं।`;
    }
    if (isSpanish) {
      return `${seniorName}, para relajar tu mente puedes abrir la sección 'Respiración Calma'. Sigue el ritmo suave de 4 segundos de inhalación, pausa y exhalación, acompañado con relajantes sonidos de lluvia u olas del mar.`;
    }
    if (isTamil) {
      return `${seniorName}, மனதை அமைதிப்படுத்த 'அமைதியான மூச்சு' பயிற்சியை செய்யுங்கள். 4 வினாடிகள் மூச்சை உள்ளிழுத்து, நிறுத்தி, மெதுவாக வெளிவிடுங்கள். மெல்லிய மழை அல்லது கடல் அலை ஒலிகளை கேட்கலாம்.`;
    }
    if (isBengali) {
      return `${seniorName}, মন শান্ত করতে 'শান্ত শ্বাস' সেকশনে যান। ৪ সেকেন্ড শ্বাস নেওয়া, ধরে রাখা ও ছাড়া। সাথে হালকা বৃষ্টির মিষ্টি শব্দও শুনতে পারেন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, ప్రశాంతత కోసం 'ప్రశాంత శ్వాస' వ్యాయామం చేయండి. 4 సెకన్లు శ్వాస పీల్చి, ఆపి, వదలండి. వర్షం లేదా సముద్రపు ఆహ్లాదకరమైన శబ్దాలు కూడా వినవచ్చు.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, मन शांत करण्यासाठी 'शांत श्वास' सराव सुरू करा. ४ सेकंद श्वास घेणे, रोखणे आणि सोडणे. सोबत हलक्या पावसाचा आवाज ऐकून प्रसन्न वाटेल.`;
    }
    if (isGujarati) {
      return `${seniorName}, મનની શાંતિ માટે 'શાંત શ્વાસ' વિભાગમાં જાઓ. ૪ સેકન્ડ શ્વાસ અંદર લેવો અને બહાર કાઢવો. વરસાદ કે દરિયાના મોજાંનો શાંત અવાજ પણ સાંભળી શકો છો.`;
    }
    return `Take a comfortable breath, ${seniorName}. You can open our 'Calm Breath' tool anytime. It gently guides you through a 4-second inhale, 4-second hold, and 4-second exhale cycle, with optional soothing sounds like gentle rain or ocean waves to relax your heart and mind.`;
  }

  // Topic 7: Explain My Document & Paperwork
  if (
    q.includes("document") ||
    q.includes("prescription") ||
    q.includes("paper") ||
    q.includes("bill") ||
    q.includes("receipt") ||
    q.includes("parcha") ||
    q.includes("kagaz") ||
    q.includes("dastavez") ||
    q.includes("receta") ||
    q.includes("aavanam")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आप 'दस्तावेज़ समझें' (Explain My Document) विकल्प का उपयोग करके किसी भी दवा पर्ची, मेडिकल बिल या लैब रिपोर्ट की फोटो खींच सकते हैं या अपलोड कर सकते हैं। मैं उसे सरल भाषा में समझाकर दवाइयों के नाम, सही समय और जरूरी तारीखें बता दूंगी।`;
    }
    if (isSpanish) {
      return `${seniorName}, en la opción 'Explicar Documento' puedes subir una foto o PDF de tus recetas médicas, facturas o análisis. Te explicaré todo en lenguaje claro y sencillo con los pasos que debes seguir.`;
    }
    if (isTamil) {
      return `${seniorName}, 'ஆவணத்தை விளக்குங்கள்' பகுதியில் உங்கள் மருத்துவ சீட்டு அல்லது பில்லை புகைப்படம் எடுத்து பதிவேற்றலாம். நான் அதை எளிய தமிழில் விளக்கி கூறுவேன்.`;
    }
    if (isBengali) {
      return `${seniorName}, 'নথি বুঝিয়ে দিন' অপশনে গিয়ে যেকোনো প্রেসক্রিপশন বা বিলের ছবি তুলতে বা আপলোড করতে পারেন। আমি সহজ ভাষায় তার সব অর্থ ও জরুরি নির্দেশ বুঝিয়ে দেব।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, 'డాక్యుమెంట్ వివరణ' ద్వారా మీ మందుల చీటీ లేదా బిల్లు ఫోటో అప్‌లోడ్ చేయండి. నేను సులభమైన మాటల్లో అన్ని వివరాలు వివరిస్తాను.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, 'कागदपत्र समजावून सांगा' पर्यायात जाऊन आपण औषधांची चिठ्ठी किंवा बिल अपलोड करू शकता. मी सोप्या भाषेत त्याचे सर्व तपशील समजावून सांगेन.`;
    }
    if (isGujarati) {
      return `${seniorName}, 'દસ્તાવેજ સમજાવો' ફીચરમાં જઈને તમારા પ્રિસ્ક્રિપ્શન કે મેડિકલ બિલનો ફોટો પાડી શકો છો. હું સરળ શબ્દોમાં દવા અને સમય સમજાવી આપીશ.`;
    }
    return `In our 'Explain My Document' section, ${seniorName}, you can take a photo or upload any medical prescription, hospital bill, or lab report. Mitraa uses GenAI to read the document and explain all medicines, timings, charges, and next steps in clear, senior-friendly words.`;
  }

  // Topic 8: Digital Tasks (WhatsApp, Electricity Bill, Jeevan Pramaan)
  if (
    q.includes("whatsapp") ||
    q.includes("video call") ||
    q.includes("electricity") ||
    q.includes("bijli") ||
    q.includes("jeevan pramaan") ||
    q.includes("pension") ||
    q.includes("certificate") ||
    q.includes("tareeqa")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आप हमारे 'डिजिटल कार्य सहायता' टैब में सरल कदम-दर-कदम गाइड देख सकते हैं: जैसे व्हाट्सएप पर परिवार को वीडियो कॉल करना, घर बैठे बिजली का बिल भरना, या जीवन प्रमाण पत्र (Life Certificate) के लिए चेहरा स्कैन करना।`;
    }
    if (isSpanish) {
      return `${seniorName}, en la sección de 'Guía Digital' tienes instrucciones sencillas paso a paso para hacer videollamadas de WhatsApp con tu familia, pagar tus servicios en línea con seguridad y más.`;
    }
    if (isTamil) {
      return `${seniorName}, 'டிஜிட்டல் பணிகள்' பகுதியில் வாட்ஸ்அப் வீடியோ அழைப்பு, மின்சார பில் செலுத்துதல் போன்றவற்றை எளிதாக செய்ய படிப்படியான வழிகாட்டல்கள் உள்ளன.`;
    }
    if (isBengali) {
      return `${seniorName}, আমাদের 'ডিজিটাল কাজ' ট্যাবে আপনি ধাপে ধাপে নির্দেশিকা পাবেন: হোয়াটসঅ্যাপে ভিডিও কল করা, বিদ্যুৎ বিল দেওয়া বা পেনশন লাইফ সার্টিফিকেট জমা দেওয়া।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, 'డిజిటల్ గైడ్' విభాగంలో వాట్సాప్ వీడియో కాల్ చేయడం, కరెంట్ బిల్లు కట్టడం వంటి పనులకు సులభమైన సూచనలు ఉన్నాయి.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, 'डिजिटल मदत' विभागात व्हॉट्सअ‍ॅप व्हिडिओ कॉल, वीज बिल भरणे याविषयी सोप्या पायऱ्या दिलेल्या आहेत.`;
    }
    if (isGujarati) {
      return `${seniorName}, 'ડિજિટલ મદદ' ટેબમાં વોટ્સએપ વિડીયો કોલ કરવો, વીજળી બિલ ભરવું જેવી સરળ માર્ગદર્શિકા ઉપલબ્ધ છે.`;
    }
    return `You can explore our 'Digital Tasks Guide' for easy, step-by-step pictorial guides on making WhatsApp video calls to your grandchildren, paying your electricity bill safely online, or submitting your Digital Life Certificate (Jeevan Pramaan).`;
  }

  // Topic 9: Emergency & Family Contact
  if (
    q.includes("emergency") ||
    q.includes("daughter") ||
    q.includes("son") ||
    q.includes("priya") ||
    q.includes("family") ||
    q.includes("madad") ||
    q.includes("help") ||
    q.includes("kudumbam")
  ) {
    if (isHindi) {
      return `${seniorName} जी, आपकी आपातकालीन संपर्क प्रिया (सुपुत्री) हैं। आप स्क्रीन के ऊपरी हिस्से में बने लाल 'मदद / आपातकाल' बटन को दबाकर सीधे उन्हें या डॉक्टर को कॉल कर सकते हैं। आप कभी भी अकेले नहीं हैं।`;
    }
    if (isSpanish) {
      return `${seniorName}, tu contacto de emergencia principal es tu hija Priya. Puedes presionar el botón rojo de emergencia arriba en la pantalla para llamarla directamente o solicitar asistencia médica.`;
    }
    if (isTamil) {
      return `${seniorName}, உங்கள் அவசர தொடர்பு பிரியா (மகள்) ஆவார். திரையின் மேல் உள்ள சிவப்பு அவசர பொத்தானை அழுத்தி உடனடியாக அவர்களை அழைக்கலாம்.`;
    }
    if (isBengali) {
      return `${seniorName}, আপনার জরুরি কন্টাক্ট হলো প্রিয়া (কন্যা)। স্ক্রিনের উপরে থাকা লাল এমার্জেন্সি বোতামে চাপ দিয়ে সরাসরি ফোন করতে পারেন।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, మీ అత్యవసర సంప్రదింపు వ్యక్తి ప్రియ (కుమార్తె). స్క్రీన్ పైభాగంలో ఉన్న ఎరుపు ఎమర్జెన్సీ బటన్ ద్వారా వెంటనే కాల్ చేయవచ్చు.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, आपले आपत्कालीन संपर्क प्रिया (मुलगी) आहेत. स्क्रीनवरील लाल मदत बटण दाबून आपण थेट त्यांना कॉल करू शकता.`;
    }
    if (isGujarati) {
      return `${seniorName}, તમારા ઈમરજન્સી કોન્ટેક્ટ પ્રિયા (પુત્રી) છે. સ્ક્રીન પર લાલ ઈમરજન્સી બટન દબાવીને સીધો ફોન કરી શકો છો.`;
    }
    return `Your primary emergency contact is Priya (Daughter). You can tap the bold red SOS Emergency button at the top of the screen anytime to speed-dial her, call your doctor, or ring emergency medical services immediately.`;
  }

  // Topic 10: Stories, Moral Tales & Cheerful Companionship
  if (
    q.includes("story") ||
    q.includes("kahani") ||
    q.includes("kissa") ||
    q.includes("tale") ||
    q.includes("joke") ||
    q.includes("haso") ||
    q.includes("chutkula") ||
    q.includes("cuento") ||
    q.includes("kadhai") ||
    q.includes("golpo") ||
    q.includes("katha")
  ) {
    if (isHindi) {
      return `${seniorName} जी, एक प्रेरणादायक छोटी कहानी: एक बार एक बुज़ुर्ग माली रोज़ सुबह मुस्कुराते हुए आम के पौधे लगा रहे थे। किसी ने पूछा—'आप तो इनके फल शायद नहीं खा पाएंगे, फिर इतनी मेहनत क्यों?' माली दादा मुस्कुराए और बोले—'बेटा, आज मैं जिन आमों का स्वाद ले रहा हूँ, वो पेड़ मेरे पूर्वजों ने लगाए थे। मैं ये पेड़ अपनी अगली पीढ़ी के लिए लगा रहा हूँ।' निःस्वार्थ कर्म ही सच्चा आनंद है।`;
    }
    if (isSpanish) {
      return `${seniorName}, aquí tienes una hermosa reflexión: Un anciano plantaba árboles frutales. Un joven le preguntó: '¿Por qué plantas si no vivirás para comer sus frutos?' El anciano sonrió: 'Hijo, comí frutas de árboles que otros plantaron. Hoy planto para que los que vengan después disfruten de su sombra y su dulzura.' La bondad siempre trasciende el tiempo.`;
    }
    if (isTamil) {
      return `${seniorName}, ஒரு சிறிய கதை: ஒரு முதியவர் பல மரக்கன்றுகளை நட்டுக்கொண்டிருந்தார். 'இதன் பழங்களை நீங்கள் ருசிக்க மாட்டீர்களே' என்று ஒருவர் கேட்டார். முதியவர் புன்னகையுடன் கூறினார்: 'நான் சாப்பிட்ட பழங்களை என் முன்னோர்கள் நட்டார்கள்; நான் நடும் மரங்கள் அடுத்த தலைமுறைக்கு நிழலும் பழமும் தரும்.' நன்மை எப்போதும் நிலைக்கும்.`;
    }
    if (isBengali) {
      return `${seniorName}, একটি মিষ্টি গল্প: এক বৃদ্ধ মালি সকালে ফলের গাছ লাগাচ্ছিলেন। এক পথিক বলল, 'আপনি কি এর ফল খেতে পারবেন?' বৃদ্ধ হেসে বললেন, 'আমি যে ফল খাচ্ছি তা আমার পূর্বপুরুষদের লাগানো। আর আমি যা লাগাচ্ছি তা আমার সন্তানদের মিষ্টি ফল দেবে।' নিঃস্বার্থ ভালোবাসাই আসল সুখ।`;
    }
    if (isTelugu) {
      return `${seniorName} గారు, ఒక చక్కని కథ: ఒక వృద్ధుడు చెట్లు నాటుతుండగా, ఒక యువకుడు 'మీరు వీటి పండ్లను తినలేరు కదా' అన్నాడు. వృద్ధుడు నవ్వుతూ 'నేను తిన్న పండ్లు నా పూర్వీకులు నాటినవి, నేను నాటేవి రేపటి తరం కోసం' అన్నాడు. నిస్వార్థ ప్రేమ ఎప్పటికీ నిలుస్తుంది.`;
    }
    if (isMarathi) {
      return `${seniorName} जी, एक सुंदर गोष्ट: एका आजोबांनी अनेक फळझाडे लावली. एकाने विचारले, 'तुम्ही याचे फळ कसे खाणार?' आजोबा हसून म्हणाले, 'मी खाल्लेली फळे माझ्या पूर्वजांनी लावलेली होती, आणि मी पुढच्या पिढीसाठी ही झाडे लावत आहे.' परोपकार हाच खरा आनंद आहे.`;
    }
    if (isGujarati) {
      return `${seniorName}, એક સુંદર વાર્તા: એક દાદાજી ફળોનાં વૃક્ષ વાવતા હતા. કોઈકે પૂછ્યું, 'તમે આનાં ફળ ક્યાંથી ખાશો?' દાદાએ હસીને કહ્યું, 'હું જે ફળ ખાઉં છું તે મારા પૂર્વજોએ વાવેલાં હતાં, હું આવનારી પેઢી માટે વાવું છું.' નિઃસ્વાર્થ કર્મ જ સાચો આનંદ છે.`;
    }
    return `Here is a warm, heartening tale for you, ${seniorName}: An elderly gardener was happily planting mango saplings in his backyard. A passerby asked, 'Grandfather, you may not live long enough to taste their fruit, why work so hard?' The gardener warmly smiled and replied, 'My dear child, all my life I have enjoyed sweet mangoes from trees planted by my grandparents. Today I plant so that future children may sit under this shade and taste the sweetness.' Giving with love is the greatest joy of life.`;
  }

  // Topic 11: General Greetings, "How are you?", "Who are you?"
  if (
    q.includes("who are you") ||
    q.includes("kaun ho") ||
    q.includes("aap kaun") ||
    q.includes("mitraa") ||
    q.includes("hello") ||
    q.includes("namaste") ||
    q.includes("morning") ||
    q.includes("evening") ||
    q.includes("how are you") ||
    q.includes("kaise ho") ||
    q.includes("kem cho") ||
    q.includes("vanakkam") ||
    q.includes("kemon acho")
  ) {
    if (isHindi) {
      return `नमस्ते ${seniorName} जी! मैं मित्रा (Mitraa) हूँ—आपकी अपनी आदरणीय और संवेदनशील साथी। मैं बिल्कुल अच्छी हूँ और आपकी सेवा के लिए सदा तत्पर हूँ। आप मुझसे अपनी दवाइयों, आज के काम, किसी दस्तावेज़ को समझने या बस सुख-दुख साझा करने के लिए कभी भी बात कर सकते हैं।`;
    }
    if (isSpanish) {
      return `¡Hola ${seniorName}! Soy Mitraa, tu compañero de confianza y guardián diario. Me encuentro muy bien y feliz de estar contigo. Puedes preguntarme sobre tus medicamentos, tus citas, tus documentos o simplemente conversar conmigo cuando gustes.`;
    }
    if (isTamil) {
      return `வணக்கம் ${seniorName}! நான் மித்ரா, உங்கள் அன்பான அன்றாட தோழன். நான் நலமாக இருக்கிறேன். மருந்துகள், வேலைகள் அல்லது உரையாடலுக்கு நான் எப்போதும் உங்களுடன் இருக்கிறேன்.`;
    }
    if (isBengali) {
      return `নমস্কার ${seniorName}! আমি মিত্রা, আপনার প্রতিদিনের বিশ্বস্ত সঙ্গী। আমি খুব ভালো আছি। ওষুধ, কাজ, নথি বোঝা বা গল্প করার জন্য আমি সবসময় আপনার পাশে আছি।`;
    }
    if (isTelugu) {
      return `నమస్కారం ${seniorName} గారు! నేను మిత్రా, మీ నమ్మకమైన రోజువారీ స్నేహితుడిని. నేను బాగున్నాను. మీ మందులు, పనులు లేదా సరదాగా మాట్లాడటానికి నేను సిద్ధంగా ఉన్నాను.`;
    }
    if (isMarathi) {
      return `नमस्कार ${seniorName} जी! मी मित्रा आहे, आपला हक्काचा आणि काळजी घेणारा साथीदार. मी मजेत आहे. औषधे, कामे किंवा गप्पा मारण्यासाठी मी नेहमी आपल्या सोबत आहे.`;
    }
    if (isGujarati) {
      return `નમસ્તે ${seniorName}! હું મિત્રા છું, તમારી દૈનિક સાથી. હું મજામાં છું. તમારી દવા, કામ કે માત્ર વાતો કરવા માટે હું હંમેશાં તમારી સાથે છું.`;
    }
    return `Warm greetings, ${seniorName}! I am Mitraa, your respectful and caring daily AI companion. I am doing very well, thank you! I am here to answer your questions about medicines, check your schedule, explain medical documents and bills in simple words, or simply share a pleasant conversation with you.`;
  }

  // Fallback: Directly acknowledge and provide helpful senior guidance on their query
  if (isHindi) {
    return `${seniorName} जी, मैंने आपका प्रश्न—"${query}" ध्यान से सुना। मैं आपकी हर बात समझती हूँ। यदि यह आपकी सेहत या दवाइयों से जुड़ा है, तो कृपया समय पर खुराक लें और डॉक्टर की सलाह का पालन करें। किसी भी अन्य काम में मैं आपकी पूरी मदद के लिए यहाँ मौजूद हूँ।`;
  }
  if (isSpanish) {
    return `${seniorName}, he escuchado con atención tu consulta: "${query}". Cuentas con todo mi apoyo. Si se trata de tu salud o medicamentos, recuerda seguir las indicaciones de tu médico. Estoy aquí para acompañarte y resolver cualquier duda.`;
  }
  if (isTamil) {
    return `${seniorName}, உங்கள் கேள்வியை நான் கவனித்தேன்: "${query}". உடல்நலம் மற்றும் மருந்துகளில் கவனமாக இருங்கள். உங்களுக்கு உதவ நான் எப்போதும் உடன் இருக்கிறேன்.`;
  }
  if (isBengali) {
    return `${seniorName}, আপনার প্রশ্নটি আমি যত্ন নিয়ে শুনলাম: "${query}"। আপনার স্বাস্থ্য ও ওষুধের খেয়াল রাখবেন। আমি সবসময় আপনার সেবায় আছি।`;
  }
  if (isTelugu) {
    return `${seniorName} గారు, మీ ప్రశ్నను నేను విన్నాను: "${query}". ఆరోగ్యం పట్ల శ్రద్ధ వహించండి. మీకు సహాయం చేయడానికి నేను ఎల్లప్పుడూ సిద్ధంగా ఉన్నాను.`;
  }
  if (isMarathi) {
    return `${seniorName} जी, मी आपला प्रश्न काळजीपूर्वक ऐकला: "${query}". तब्येतीची व औषधांची काळजी घ्या. मदतीसाठी मी सदैव आपल्या सोबत आहे.`;
  }
  if (isGujarati) {
    return `${seniorName}, મેં તમારો પ્રશ્ન ધ્યાનથી સાંભળ્યો: "${query}". સ્વાસ્થ્યનું ધ્યાન રાખશો. તમારી મદદ માટે હું હંમેશાં સાથે છું.`;
  }
  return `Thank you for asking, ${seniorName}. Regarding your question about "${query}": I am right here with you to assist. If this relates to your health or daily schedule, please remember to take things comfortably, keep hydrated, and check your Health tab for exact details. I am always happy to answer more questions for you.`;
};
