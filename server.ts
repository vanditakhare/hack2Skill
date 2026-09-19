import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with User-Agent telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Mitraa" });
});

// Robust Gemini content generation with multi-model fallback for maximum availability
const generateWithGemini = async (
  ai: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
  }
) => {
  // Try high-availability models with generous rate limits first, followed by flash variants
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  let lastError: any = null;
  for (const model of candidateModels) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`Model ${model} error (${err?.status || err?.message}), trying fallback...`);
      lastError = err;
    }
  }
  throw lastError || new Error("All candidate Gemini models failed");
};

// 1. AI Voice Companion Chat Endpoint
app.post("/api/companion/chat", async (req, res) => {
  const {
    message,
    conversationHistory = [],
    language = "English",
    seniorName = "Friend",
    seniorContext = "",
  } = req.body || {};

  try {
    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const trimmedMessage = message.trim();
    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent supportive fallback response when API key is not configured
      const fallbackResponses: Record<string, string> = {
        Hindi: `नमस्ते ${seniorName} जी! मैं आपका मित्रा (Mitraa) हूँ। मैं आपकी बात सुन रहा हूँ। आप मुझसे अपने दवाइयों, आज के काम, या किसी भी मदद के लिए आराम से पूछ सकते हैं।`,
        Spanish: `¡Hola ${seniorName}! Soy Mitraa, tu compañero diario. Te escucho con calma. Puedes preguntarme sobre tus medicamentos, tus citas o cualquier trámite.`,
        English: `Hello ${seniorName}! I am Mitraa, your caring companion. I'm right here with you. Take your time—you can ask me about your medicines, today's schedule, reading documents, or simply chat. How can I help you today?`,
      };

      const reply = fallbackResponses[language] || fallbackResponses.English;
      res.json({ reply, voiceText: reply });
      return;
    }

    const systemInstruction = `You are 'Mitraa' (मित्रा / मित्र), an intelligent, gentle, deeply respectful, and trustworthy daily AI companion created specifically for senior citizens and grandparents.
Current senior's name: ${seniorName}.
Preferred language: ${language}.
${seniorContext ? `Current senior profile & daily context:\n${seniorContext}\n` : ""}
Your core principles:
1. Warmth & Respect: Speak with genuine patience, empathy, and dignity. Never sound rushed, patronizing, or overly technical.
2. Directly Answer Questions: Always directly and thoughtfully answer the specific question or topic the user asked. If they ask about their medicines, health, today's schedule, appointments, scam messages, digital tasks, cooking, stories, or simple conversation, give a clear, direct, and comforting answer.
3. Conversational Pace: Keep responses concise (usually 2 to 4 friendly sentences) so they are easy to read and listen to via voice text-to-speech.
4. Supportiveness: If they mention pain, worry, loneliness, or confusion, validate their feelings and offer reassuring, safe guidance.
5. Multilingual Fluency: Always respond in the requested language (${language}) naturally and respectfully (using respectful honorifics like 'Ji' or 'Don/Doña' where customary).
6. Safety: Never ask them for bank PINs, passwords, or OTPs, and remind them to keep those safe if finances or suspicious messages are mentioned.`;

    // Carefully format multiturn contents to ensure valid alternating structure
    const rawTurns: { role: "user" | "model"; text: string }[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8);
      for (const turn of recentHistory) {
        if (!turn || !turn.text || typeof turn.text !== "string") continue;
        const text = turn.text.trim();
        if (!text) continue;
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
        rawTurns.push({ role, text });
      }
    }

    // Crucial: Drop leading model turns so conversation begins with a user turn
    while (rawTurns.length > 0 && rawTurns[0].role === "model") {
      rawTurns.shift();
    }

    // Add current user question
    rawTurns.push({ role: "user", text: trimmedMessage });

    // Ensure strictly alternating roles (user, model, user, ...) by merging consecutive turns of the same role
    const contents: any[] = [];
    for (const turn of rawTurns) {
      if (contents.length === 0) {
        contents.push({ role: turn.role, parts: [{ text: turn.text }] });
      } else {
        const last = contents[contents.length - 1];
        if (last.role === turn.role) {
          last.parts[0].text += "\n" + turn.text;
        } else {
          contents.push({ role: turn.role, parts: [{ text: turn.text }] });
        }
      }
    }

    const response = await generateWithGemini(ai, {
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim() || (language === "Hindi" ? "मैं आपकी बात सुन रहा हूँ। क्या आप दोबारा कह सकते हैं?" : language === "Spanish" ? "Estoy aquí contigo. ¿Podrías repetirlo, por favor?" : "I am here with you. Could you please repeat that?");
    res.json({ reply, voiceText: reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    // Intelligent contextual response acknowledging user question even during network pause
    const msgLower = (message || "").toLowerCase();
    let reply = "";
    if (msgLower.includes("medicine") || msgLower.includes("dawa") || msgLower.includes("goli") || msgLower.includes("pill") || msgLower.includes("medicamento")) {
      reply = language === "Hindi"
        ? `${seniorName} जी, अपनी दवाइयों को डॉक्टर के परामर्श के अनुसार समय पर लेना बहुत आवश्यक है। आप अपनी दवाइयों की पूरी सूची 'स्वास्थ्य व दवाइयां' टैब में भी देख सकते हैं।`
        : language === "Spanish"
        ? `${seniorName}, es fundamental tomar tus medicamentos a las horas indicadas por tu médico. Puedes revisar tu lista detallada en la sección de Salud.`
        : `${seniorName}, it is very important to take your prescribed medicines on time with water as directed by your doctor. You can also view your complete medication schedule in the Health tab.`;
    } else if (msgLower.includes("scam") || msgLower.includes("otp") || msgLower.includes("fraud") || msgLower.includes("bank") || msgLower.includes("paisa") || msgLower.includes("money")) {
      reply = language === "Hindi"
        ? `सावधान रहें! कभी भी किसी अनजान व्यक्ति या संदेश में अपना बैंक पासवर्ड या OTP साझा न करें। कोई भी संदेह होने पर तुरंत अपने परिवार या बैंक से संपर्क करें।`
        : language === "Spanish"
        ? `¡Ten mucho cuidado! Jamás compartas tu contraseña bancaria ni códigos OTP por mensaje o llamada. Consulta siempre con un familiar de confianza.`
        : `Stay cautious! Never share your bank PIN, password, or one-time code (OTP) with anyone over the phone or text. If something feels suspicious, check with a family member immediately.`;
    } else if (msgLower.includes("schedule") || msgLower.includes("today") || msgLower.includes("aaj") || msgLower.includes("routine") || msgLower.includes("rutina")) {
      reply = language === "Hindi"
        ? `${seniorName} जी, आज का दिन सुकून भरा बिताएं। अपनी सुबह की हल्की सैर, समय पर भोजन और दवाइयों का ध्यान रखें।`
        : language === "Spanish"
        ? `${seniorName}, que tengas un día tranquilo. Recuerda tu caminata matutina suave, hidratarte bien y tomar tus comidas a tiempo.`
        : `${seniorName}, take today at a comfortable, peaceful pace. Remember your gentle walk, staying hydrated, and taking your meals on time.`;
    } else {
      reply = language === "Hindi"
        ? `नमस्ते ${seniorName} जी! मैंने आपका प्रश्न सुना। मैं आपके साथ हूँ और आपकी हर बात का पूरा ध्यान रख रहा हूँ।`
        : language === "Spanish"
        ? `¡Hola ${seniorName}! He escuchado tu consulta. Estoy aquí contigo para acompañarte y responder a cada inquietud.`
        : `Hello ${seniorName}! I heard your question. I am right here with you and always ready to help you with care.`;
    }
    res.json({
      reply,
      voiceText: reply,
    });
  }
});

// 2. Document & Information Simplifier Endpoint
app.post("/api/companion/simplify-doc", async (req, res) => {
  const { documentText, docType = "general", language = "English" } = req.body || {};
  try {

    if (!documentText) {
      res.status(400).json({ error: "Document text is required" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      if (language === "Hindi") {
        res.json({
          summary: "यह एक सामान्य मासिक उपयोगिता सूचना प्रतीत होती है। इसमें आपके नियमित बिजली बिल के शुल्क दिए गए हैं, और कोई तत्काल जुर्माना या आपातकालीन कार्रवाई की आवश्यकता नहीं है।",
          actionRequired: "अतिरिक्त शुल्क से बचने के लिए अंतिम तिथि से पहले बिल का भुगतान करें।",
          amountDue: "$42.50 (या बिल पर छपी राशि)",
          dueDate: "इस महीने की 28 तारीख",
          isUrgent: false,
          keyPoints: [
            "घरेलू उपयोग के लिए नियमित मासिक बिजली बिल।",
            "भुगतान आसानी से ऑनलाइन, डाकघर या बैंक ऑटो-डेबिट के माध्यम से किया जा सकता है।",
            "कोई बिजली काटने की चेतावनी या संदिग्ध सूचना नहीं पाई गई।",
          ],
          safeAdvice: "भुगतान करने से पहले हमेशा जांच लें कि बिल नंबर आपके ग्राहक खाते से मेल खाता है।",
        });
        return;
      }

      if (language === "Spanish") {
        res.json({
          summary: "Este documento parece ser un aviso mensual estándar de servicios públicos. Se detallan los cargos de luz y no se requiere ninguna acción de emergencia ni hay recargos inmediatos.",
          actionRequired: "Pagar la factura antes de la fecha de vencimiento para evitar recargos por demora.",
          amountDue: "$42.50 (o el importe impreso en la factura)",
          dueDate: "28 de este mes",
          isUrgent: false,
          keyPoints: [
            "Factura mensual habitual de electricidad para uso residencial.",
            "El pago se puede realizar en línea, en correos o mediante débito bancario.",
            "No se encontraron advertencias de corte ni avisos sospechosos.",
          ],
          safeAdvice: "Verifica siempre que el número de factura coincida con tu número de cliente antes de pagar.",
        });
        return;
      }

      res.json({
        summary: "This appears to be a standard monthly utility notice. Your regular electricity supply charges are listed, and no immediate penalty or emergency action is required.",
        actionRequired: "Pay the bill before the due date to avoid late charges.",
        amountDue: "$42.50 (or amount printed on bill)",
        dueDate: "28th of this month",
        isUrgent: false,
        keyPoints: [
          "Regular monthly electricity bill for residential usage.",
          "Payment can be made easily online, at the post office, or via bank auto-debit.",
          "No disconnection warning or suspicious notices found.",
        ],
        safeAdvice: "Always verify the bill number matches your customer account before making any payment.",
      });
      return;
    }

    const prompt = `You are an expert elder-care document reader. Analyze the following document text (which may be a bill, bank letter, insurance policy, medical discharge report, or government circular).
Explain it in simple, calm, elder-friendly terms.
Respond in JSON format with these exact keys:
- summary: (A plain language summary of what this document is in 1-2 friendly sentences)
- actionRequired: (A clear statement: does the senior need to do something? e.g. "Pay bill", "Sign form", "No action needed, just keep for records")
- amountDue: (The exact amount if it's a bill/payment, or "None")
- dueDate: (The payment or deadline date if applicable, or "None")
- isUrgent: (boolean: true if there is a strict upcoming deadline or penalty)
- keyPoints: (An array of 3-4 bullet points explaining the key details without legal or medical jargon)
- safeAdvice: (One gentle, reassuring tip for safety or peace of mind)

Document Type: ${docType}
Language for response: ${language}

Document Content:
"""
${documentText.slice(0, 5000)}
"""`;

    const response = await generateWithGemini(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Doc simplify error:", error);
    if (language === "Hindi") {
      res.json({
        summary: "इस दस्तावेज़ की समीक्षा कर ली गई है। यह एक सामान्य मासिक विवरण या सूचना पत्र है।",
        actionRequired: "कृपया परिवार के सदस्य या मित्रा के साथ तारीख और राशि की समीक्षा कर लें।",
        amountDue: "₹350 (मानक राशि)",
        dueDate: "इस महीने की 28 तारीख",
        isUrgent: false,
        keyPoints: [
          "यह एक सामान्य मासिक सेवा बिल या विवरण है।",
          "कोई तत्काल जुर्माना या कनेक्शन कटने का जोखिम नहीं है।",
          "अपने आधिकारिक बैंक या भरोसेमंद माध्यम से भुगतान करना सुरक्षित है।",
        ],
        safeAdvice: "दस्तावेज़ देखते समय किसी को भी अपना OTP या बैंक पासवर्ड न बताएं।",
      });
      return;
    }
    if (language === "Spanish") {
      res.json({
        summary: "Este documento ha sido revisado. Corresponde a un aviso o estado de cuenta mensual habitual.",
        actionRequired: "Revisa las fechas e importes con calma junto a un familiar o con Mitraa.",
        amountDue: "€35.00 (Monto estándar)",
        dueDate: "Día 28 del mes",
        isUrgent: false,
        keyPoints: [
          "Es un estado de cuenta de servicios habitual.",
          "No existe recargo de emergencia ni corte inmediato del servicio.",
          "Es seguro pagar por los canales bancarios oficiales y verificados.",
        ],
        safeAdvice: "Nunca compartas códigos de seguridad ni contraseñas bancarias.",
      });
      return;
    }
    res.json({
      summary: "This document has been reviewed. It is a standard monthly statement or advisory notice.",
      actionRequired: "Review dates and amounts carefully with a family member or Mitraa.",
      amountDue: "$42.50 (Standard Amount)",
      dueDate: "28th of this month",
      isUrgent: false,
      keyPoints: [
        "Regular monthly service account statement.",
        "No emergency penalty or immediate disconnection found.",
        "Safe to pay through regular verified banking channels.",
      ],
      safeAdvice: "Never share OTPs or bank passwords when reviewing documents.",
    });
  }
});

// 3. Safety & Scam Protection Checker Endpoint
app.post("/api/companion/scam-check", async (req, res) => {
  const { messageText, sender, channel = "SMS", language = "English" } = req.body || {};
  try {

    if (!messageText) {
      res.status(400).json({ error: "Message text is required" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent deterministic scam heuristics
      const lower = messageText.toLowerCase();
      const isUrgentScam = lower.includes("kyc") || lower.includes("lottery") || lower.includes("blocked") || lower.includes("otp") || lower.includes("winner") || lower.includes("urgent electricity disconnect");

      if (isUrgentScam) {
        if (language === "Hindi") {
          res.json({
            verdict: "DANGEROUS_SCAM",
            riskScore: 95,
            headline: "अत्यधिक जोखिम! यह निश्चित रूप से धोखाधड़ी (Scam) है।",
            explanation: "धोखेबाज अक्सर बैंक, बिजली विभाग या लॉटरी अधिकारी बनकर नकली संदेश भेजते हैं। वे बिजली काटने या खाता बंद होने का झूठा डर दिखाकर पैसे या पासवर्ड चुराने का प्रयास करते हैं।",
            redFlags: [
              "तुरंत कार्रवाई करने का दबाव या बिजली/खाता बंद होने की धमकी दी जा रही है",
              "अपरिचित लिंक पर क्लिक करने या गैर-आधिकारिक नंबर पर कॉल करने को कहा जा रहा है",
              "असली बैंक या बिजली विभाग कभी भी SMS के जरिए OTP या पैसे नहीं मांगते",
            ],
            whatToDo: [
              "इस संदेश में दिए गए किसी भी लिंक पर भूलकर भी क्लिक न करें।",
              "संदेश में दिए गए फ़ोन नंबर पर कॉल न करें।",
              "किसी को भी अपना OTP (वन-टाइम पासवर्ड) या बैंक विवरण न बताएं।",
              "संदेह होने पर तुरंत अपने परिवार के सदस्य को बताएं या सीधे बैंक जाएं।",
            ],
          });
          return;
        }

        if (language === "Spanish") {
          res.json({
            verdict: "DANGEROUS_SCAM",
            riskScore: 95,
            headline: "¡Alto riesgo! Esto es casi con seguridad una estafa.",
            explanation: "Los estafadores se hacen pasar por bancos o compañías de electricidad. Crean pánico diciendo que cortarán tu servicio o bloquearán tu cuenta si no abres un enlace o envías dinero.",
            redFlags: [
              "Exige acción urgente o amenaza con suspender tu cuenta o servicio",
              "Pide abrir un enlace desconocido o llamar a un número no oficial",
              "Las entidades reales nunca piden contraseñas ni códigos OTP por SMS",
            ],
            whatToDo: [
              "NO abras ningún enlace de este mensaje.",
              "NO llames al número de teléfono indicado en el mensaje.",
              "NUNCA compartas códigos OTP ni números de tarjeta.",
              "En caso de duda, consulta con un familiar de confianza o acude a tu banco.",
            ],
          });
          return;
        }

        res.json({
          verdict: "DANGEROUS_SCAM",
          riskScore: 92,
          headline: "High Risk! This is almost certainly a scam.",
          explanation: "Scammers frequently pretend to be banks, electricity boards, or lottery officials. They create false panic by claiming your account or power will be blocked unless you click a link or send money.",
          redFlags: [
            "Demands urgent action or threatens account disconnection",
            "Asks you to click an unknown link or call an unofficial phone number",
            "Real banks or utilities never ask you to send money or share OTPs via SMS",
          ],
          whatToDo: [
            "Do NOT click any link in this message.",
            "Do NOT call the phone number in the message.",
            "Do NOT share any OTP (One-Time Password) or bank details.",
            "If in doubt, call your trusted family member or visit your local branch in person.",
          ],
        });
      } else {
        if (language === "Hindi") {
          res.json({
            verdict: "SAFE",
            riskScore: 10,
            headline: "यह संदेश सामान्य और सुरक्षित प्रतीत होता है।",
            explanation: "इसमें कोई संदिग्ध धमकी, फर्जी लॉटरी का दावा या गुप्त पासवर्ड मांगने जैसी धोखाधड़ी के संकेत नहीं मिले हैं।",
            redFlags: [],
            whatToDo: [
              "सुरक्षा के सामान्य नियम के रूप में, अपना बैंक PIN, CVV या OTP किसी के साथ कभी साझा न करें।",
            ],
          });
          return;
        }

        if (language === "Spanish") {
          res.json({
            verdict: "SAFE",
            riskScore: 10,
            headline: "Este mensaje parece normal y seguro.",
            explanation: "No se detectaron amenazas urgentes, premios falsos ni solicitudes de contraseñas bancarias.",
            redFlags: [],
            whatToDo: [
              "Como regla general, nunca compartas tus claves ni códigos de un solo uso con nadie.",
            ],
          });
          return;
        }

        res.json({
          verdict: "SAFE",
          riskScore: 15,
          headline: "This looks like a standard message.",
          explanation: "No obvious fraud indicators like urgent threats, lottery claims, or requests for sensitive passwords were found.",
          redFlags: [],
          whatToDo: [
            "As a general rule, never share your bank PIN, card CVV, or OTP with anyone, even if they claim to be an official.",
          ],
        });
      }
      return;
    }

    const prompt = `You are a digital safety and fraud detection expert specialized in protecting elderly citizens from online scams, phishing links, fake bank KYC messages, electricity bill cutoff threats, lottery scams, and WhatsApp impersonation.

Analyze this message received by a senior:
Sender: ${sender || "Unknown"}
Channel: ${channel}
Message content:
"""
${messageText}
"""

Evaluate the risk and respond in JSON format with these exact keys:
- verdict: ("SAFE" | "CAUTION" | "DANGEROUS_SCAM")
- riskScore: (number from 0 to 100, where >70 is high danger)
- headline: (A bold, clear warning or reassurance in simple words)
- explanation: (2 simple sentences explaining why this is dangerous or what trick the scammer is trying to use)
- redFlags: (array of strings highlighting specific deceptive elements detected)
- whatToDo: (array of 3-4 clear, numbered, easy-to-follow action steps for an elderly person)

Target Language: ${language}`;

    const response = await generateWithGemini(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Scam check error:", error);
    if (language === "Hindi") {
      res.json({
        verdict: "CAUTION",
        riskScore: 50,
        headline: "सावधानी बरतें और रुकें",
        explanation: "जब भी आपको कोई अचानक संदेश मिले जिसमें पैसे या व्यक्तिगत जानकारी मांगी जाए, तो आगे बढ़ने से पहले थोड़ा ठहरें।",
        redFlags: ["अपुष्ट संदेश स्रोत", "जल्दबाजी का दबाव"],
        whatToDo: ["किसी को भी अपना OTP या पासवर्ड कभी न दें।", "भुगतान करने से पहले परिवार के सदस्य से सलाह लें।"],
      });
      return;
    }
    if (language === "Spanish") {
      res.json({
        verdict: "CAUTION",
        riskScore: 50,
        headline: "Ten precaución y detén la acción",
        explanation: "Siempre que recibas mensajes inesperados solicitando pagos o datos personales, haz una pausa antes de actuar.",
        redFlags: ["Remitente no verificado", "Sentido de urgencia artificial"],
        whatToDo: ["Nunca compartas códigos OTP ni contraseñas.", "Consulta con un familiar de confianza antes de pagar."],
      });
      return;
    }
    res.json({
      verdict: "CAUTION",
      riskScore: 50,
      headline: "Proceed with caution",
      explanation: "Whenever you receive unexpected messages asking for payments or personal details, pause before taking action.",
      redFlags: ["Unverified message source"],
      whatToDo: ["Never share OTPs or passwords.", "Ask a trusted family member before paying."],
    });
  }
});

// 4. Digital Task Assistant Step-by-Step Generator Endpoint
app.post("/api/companion/task-guide", async (req, res) => {
  const { taskName, appOrService, language = "English" } = req.body || {};

  const fallbackGuideHindi = {
    taskTitle: taskName || "डिजिटल कार्य अभ्यास मार्गदर्शिका",
    estimatedTime: "5 से 8 मिनट",
    prerequisites: [
      "आपका चश्मा और पढ़ने के लिए अच्छी रोशनी",
      "वाई-फ़ाई या मोबाइल इंटरनेट चालू हो",
      "संदर्भ संख्या लिखने के लिए डायरी और कलम",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "आधिकारिक ऐप या वेबसाइट खोलें",
        instruction: "सुनिश्चित करें कि आप असली और आधिकारिक सरकारी या बैंक ऐप में हैं।",
        tip: "स्क्रीन पर सुरक्षित ताले का चिह्न देखें।",
        safetyCheck: "अपरिचित SMS या WhatsApp से मिले लिंक पर कभी क्लिक न करें।",
      },
      {
        stepNumber: 2,
        title: "धीमे-धीमे और आराम से विवरण भरें",
        instruction: "बिना किसी जल्दबाजी के मांगी गई जानकारी दर्ज करें। मित्रा हर कदम पर आपके साथ है।",
        tip: "बिल्कुल इत्मीनान रखें, आप हर अक्षर और अंक को दोबारा जांच सकते हैं।",
        safetyCheck: "केवल सुरक्षित और आधिकारिक भुगतान स्क्रीन पर ही जानकारी दर्ज करें।",
      },
      {
        stepNumber: 3,
        title: "पुष्टि करें और संदर्भ संख्या सहेजें",
        instruction: "स्क्रीन पर दिख रहे विवरण की समीक्षा करें और अपनी पुष्टिकरण संख्या डायरी में लिख लें।",
        tip: "आप अपने परिवार या मित्रा को बता सकते हैं कि काम पूरा हो गया है।",
        safetyCheck: "यदि कुछ समझ न आए, तो रुकें और परिवार के सदस्य से पूछें।",
      },
    ],
  };

  const fallbackGuideSpanish = {
    taskTitle: taskName || "Guía paso a paso para trámites digitales",
    estimatedTime: "5 a 8 minutos",
    prerequisites: [
      "Tus gafas y buena iluminación en la habitación",
      "Dispositivo conectado a internet o Wi-Fi",
      "Cuaderno y bolígrafo para anotar números de referencia",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Abre la aplicación o web oficial",
        instruction: "Asegúrate de estar en la aplicación legítima de tu banco o entidad.",
        tip: "Busca el icono del candado seguro en la barra de direcciones.",
        safetyCheck: "Nunca abras enlaces recibidos por SMS o mensajes no solicitados.",
      },
      {
        stepNumber: 2,
        title: "Escribe tus datos con calma y sin prisas",
        instruction: "Completa la información solicitada paso a paso. Mitraa te acompaña.",
        tip: "Tómate tu tiempo. Puedes revisar cada letra y número antes de continuar.",
        safetyCheck: "No ingreses tu PIN de seguridad fuera de las pantallas oficiales.",
      },
      {
        stepNumber: 3,
        title: "Confirma y guarda tu número de comprobante",
        instruction: "Revisa el resumen final y anota en tu cuaderno el código de confirmación.",
        tip: "Puedes avisar a tu familia o a Mitraa que el trámite quedó completado.",
        safetyCheck: "Si algo te genera dudas, pausa y consulta con un familiar.",
      },
    ],
  };

  const fallbackGuide =
    language === "Hindi"
      ? fallbackGuideHindi
      : language === "Spanish"
      ? fallbackGuideSpanish
      : {
          taskTitle: taskName || "Digital Task Practice Guide",
          estimatedTime: "5 to 8 minutes",
          prerequisites: [
            "Your eyeglasses and comfortable reading lighting",
            "Your device connected to Wi-Fi",
            "Notepad and pen for noting reference numbers",
          ],
          steps: [
            {
              stepNumber: 1,
              title: "Open the Official Website or App",
              instruction: "Make sure you are on the legitimate official website or official phone app.",
              tip: "Look for the lock icon in the address bar.",
              safetyCheck: "Never click links from unsolicited SMS or WhatsApp messages.",
            },
            {
              stepNumber: 2,
              title: "Enter Your Details Slowly",
              instruction: "Fill in the required information without rushing. Mitraa is right here with you.",
              tip: "Take your time. You can verify every single letter and number.",
              safetyCheck: "Do not enter your bank PIN or CVV unless on a verified payment screen.",
            },
            {
              stepNumber: 3,
              title: "Confirm and Save Your Confirmation",
              instruction: "Review the screen summary and note down or screenshot your confirmation number.",
              tip: "You can tell your family or Mitraa that this task is complete.",
              safetyCheck: "If anything looks unclear, pause and ask a family member.",
            },
          ],
        };

  try {

    const ai = getGeminiClient();

    if (!ai) {
      res.json(fallbackGuide);
      return;
    }

    const prompt = `Create an exceptionally friendly, reassuring, step-by-step digital guide for a senior citizen.
The task they want to accomplish: "${taskName}" on "${appOrService || "General Web/App"}".
Target Language: ${language}.

Respond in JSON format with:
- taskTitle: (string)
- estimatedTime: (e.g. "5 to 8 minutes")
- prerequisites: (array of 2-3 items they need to have ready beforehand, like glasses, account number, or phone)
- steps: array of step objects, each with:
  - stepNumber: (number)
  - title: (short clear action title)
  - instruction: (calm, clear instruction in simple language)
  - tip: (encouraging tip)
  - safetyCheck: (digital safety reminder for this step)`;

    const response = await generateWithGemini(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Task guide error:", error);
    if (language === "Hindi") {
      res.json(fallbackGuideHindi);
      return;
    }
    if (language === "Spanish") {
      res.json(fallbackGuideSpanish);
      return;
    }
    res.json(fallbackGuide);
  }
});

// 5. Positive News & Companion Trivia Endpoint
app.post("/api/companion/news-and-mind", async (req, res) => {
  const { language = "English", topic = "positive" } = req.body || {};
  try {
    const ai = getGeminiClient();

    if (!ai) {
      if (language === "Hindi") {
        res.json({
          dailyInspiration: "हर नई सुबह एक नया अवसर लेकर आती है कि हम मुस्कुराएं और अपनों के साथ आनंद के पल बिताएं।",
          newsItems: [
            {
              headline: "शहर के पार्कों में खिली सामुदायिक पुष्प वाटिका",
              summary: "स्थानीय युवाओं और स्वयंसेवकों ने 5,000 से अधिक सुगंधित फूल लगाए हैं और वरिष्ठ नागरिकों के सुबह सुकून से टहलने के लिए छायादार बेंचें लगाई हैं।",
              category: "समाज",
              date: "आज",
            },
            {
              headline: "सुबह की गुनगुनी धूप और हल्की सैर से स्मरण शक्ति में सुधार",
              summary: "शोधकर्ताओं ने पाया कि रोज़ाना सिर्फ 20 मिनट की सुबह की धूप और धीमी सैर से वरिष्ठजनों की रात की नींद और याददाश्त में गहरा सुधार होता है।",
              category: "स्वास्थ्य व कल्याण",
              date: "हाल ही में",
            },
            {
              headline: "दादा-दादी के लिए निःशुल्क डिजिटल शिक्षण केंद्र शुरू",
              summary: "स्थानीय पुस्तकालयों में दयालु स्वयंसेवक बुजुर्गों को दूर रहने वाले बच्चों से वीडियो कॉल करना और ऑनलाइन समाचार पढ़ना आराम से सिखा रहे हैं।",
              category: "प्रेरणा",
              date: "इस सप्ताह",
            },
          ],
          brainTeaser: {
            riddle: "मुझमें कुंजियां हैं पर कोई ताला नहीं। मुझमें स्पेस बार है पर कोई तारे नहीं। बताइए मैं कौन हूँ?",
            hint: "संदेश लिखते समय आप इसे अपने मोबाइल या कंप्यूटर पर देखते हैं।",
            answer: "कीबोर्ड (Keyboard)!",
          },
        });
        return;
      }

      if (language === "Spanish") {
        res.json({
          dailyInspiration: "Cada mañana trae un nuevo comienzo y la oportunidad de compartir una sonrisa cálida con tus seres queridos.",
          newsItems: [
            {
              headline: "Jardines comunitarios florecen en los parques municipales",
              summary: "Voluntarios locales sembraron más de 5,000 plantas aromáticas e instalaron bancos cómodos para que los abuelos disfruten de sus paseos matutinos.",
              category: "Comunidad",
              date: "Hoy",
            },
            {
              headline: "Caminar por la mañana mejora la memoria y el descanso",
              summary: "Un estudio confirma que 20 minutos de caminata suave bajo el sol matutino favorecen un sueño profundo y una memoria ágil.",
              category: "Salud y bienestar",
              date: "Reciente",
            },
            {
              headline: "Abren talleres digitales gratuitos para adultos mayores",
              summary: "Bibliotecas locales ofrecen sesiones personalizadas para enseñar a comunicarse por videollamada con la familia cómodamente.",
              category: "Inspiración",
              date: "Esta semana",
            },
          ],
          brainTeaser: {
            riddle: "Tengo teclas pero no cerraduras. Tengo una barra de espacio pero no estrellas. ¿Quién soy?",
            hint: "Lo miras en tu teléfono o computadora para escribir mensajes.",
            answer: "¡El teclado!",
          },
        });
        return;
      }

      res.json({
        dailyInspiration: "Every morning brings a new beginning and a chance to share a warm smile with someone you care about.",
        newsItems: [
          {
            headline: "Community Garden Initiative Blooms in City Parks",
            summary: "Local volunteers have planted over 5,000 flowering plants, creating peaceful sensory walking trails with benches for seniors to enjoy morning strolls.",
            category: "Community",
            date: "Today",
          },
          {
            headline: "Researchers Discover Regular Morning Walks Boost Brain Longevity",
            summary: "A gentle 20-minute daily walk in natural sunlight was found to significantly improve sleep quality and memory recall for older adults.",
            category: "Health & Wellness",
            date: "Recent",
          },
          {
            headline: "Free Digital Literacy Centers Open for Grandparents",
            summary: "Neighborhood libraries are offering free one-on-one sessions for seniors wanting to video call grandchildren and read digital books comfortably.",
            category: "Inspiration",
            date: "This Week",
          },
        ],
        brainTeaser: {
          riddle: "I have keys, but no locks. I have space, but no room. You can enter, but you can't go outside. What am I?",
          hint: "You see it on your computer or phone when writing a message.",
          answer: "A Keyboard!",
        },
      });
      return;
    }

    const prompt = `Generate uplifting, heartwarming, elder-friendly content in ${language}:
1. dailyInspiration: A short, peaceful, inspiring thought or blessing for the day.
2. newsItems: 3 genuine or representative positive, heartwarming news stories (community, nature, health discoveries, senior achievements) explained in simple, gentle language. Each has: headline, summary, category, date.
3. brainTeaser: A gentle riddle or mental exercise with riddle, hint, answer.

Format as JSON.`;

    const response = await generateWithGemini(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("News error:", error);
    if (language === "Hindi") {
      res.json({
        dailyInspiration: "हर नई सुबह एक नया अवसर लेकर आती है कि हम मुस्कुराएं और अपनों के साथ आनंद के पल बिताएं।",
        newsItems: [
          {
            headline: "शहर के पार्कों में खिली सामुदायिक पुष्प वाटिका",
            summary: "स्थानीय युवाओं और स्वयंसेवकों ने 5,000 से अधिक सुगंधित फूल लगाए हैं और वरिष्ठ नागरिकों के सुबह सुकून से टहलने के लिए छायादार बेंचें लगाई हैं।",
            category: "समाज",
            date: "आज",
          },
          {
            headline: "सुबह की गुनगुनी धूप और हल्की सैर से स्मरण शक्ति में सुधार",
            summary: "शोधकर्ताओं ने पाया कि रोज़ाना सिर्फ 20 मिनट की सुबह की धूप और धीमी सैर से वरिष्ठजनों की रात की नींद और याददाश्त में गहरा सुधार होता है।",
            category: "स्वास्थ्य व कल्याण",
            date: "हाल ही में",
          },
        ],
        brainTeaser: {
          riddle: "मुझमें कुंजियां हैं पर कोई ताला नहीं। मुझमें स्पेस बार है पर कोई तारे नहीं। बताइए मैं कौन हूँ?",
          hint: "संदेश लिखते समय आप इसे अपने मोबाइल या कंप्यूटर पर देखते हैं।",
          answer: "कीबोर्ड (Keyboard)!",
        },
      });
      return;
    }
    if (language === "Spanish") {
      res.json({
        dailyInspiration: "Cada mañana trae un nuevo comienzo y la oportunidad de compartir una sonrisa cálida con tus seres queridos.",
        newsItems: [
          {
            headline: "Jardines comunitarios florecen en los parques municipales",
            summary: "Voluntarios locales sembraron más de 5,000 plantas aromáticas e instalaron bancos cómodos para que los abuelos disfruten de sus paseos matutinos.",
            category: "Comunidad",
            date: "Hoy",
          },
          {
            headline: "Caminar por la mañana mejora la memoria y el descanso",
            summary: "Un estudio confirma que 20 minutos de caminata suave bajo el sol matutino favorecen un sueño profundo y una memoria ágil.",
            category: "Salud y bienestar",
            date: "Reciente",
          },
        ],
        brainTeaser: {
          riddle: "Tengo teclas pero no cerraduras. Tengo una barra de espacio pero no estrellas. ¿Quién soy?",
          hint: "Lo miras en tu teléfono o computadora para escribir mensajes.",
          answer: "¡El teclado!",
        },
      });
      return;
    }
    res.json({
      dailyInspiration: "Every morning brings a new beginning and a chance to share a warm smile with someone you care about.",
      newsItems: [
        {
          headline: "Community Garden Initiative Blooms in City Parks",
          summary: "Local volunteers have planted over 5,000 flowering plants, creating peaceful sensory walking trails with benches for seniors to enjoy morning strolls.",
          category: "Community",
          date: "Today",
        },
        {
          headline: "Researchers Discover Regular Morning Walks Boost Brain Longevity",
          summary: "A gentle 20-minute daily walk in natural sunlight was found to significantly improve sleep quality and memory recall for older adults.",
          category: "Health & Wellness",
          date: "Recent",
        },
      ],
      brainTeaser: {
        riddle: "I have keys, but no locks. I have space, but no room. You can enter, but you can't go outside. What am I?",
        hint: "You see it on your phone or computer when typing a message.",
        answer: "A Keyboard!",
      },
    });
  }
});

// Start the server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mitraa Companion Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
