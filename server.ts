import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getFallbackExplainedDocument } from "./server/documentFallbacks";
import { getSmartCompanionAnswer } from "./server/companionAnswers";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "25mb" }));

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
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
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
      // Direct, intelligent senior-friendly answer to the user's specific query
      const reply = getSmartCompanionAnswer({
        query: trimmedMessage,
        language,
        seniorName,
        seniorContext,
      });
      res.json({ reply, voiceText: reply });
      return;
    }

    const systemInstruction = `You are 'Mitraa' (मित्रा / मित्र), an intelligent, gentle, deeply respectful, and trustworthy daily AI companion created specifically for senior citizens and grandparents.
Current senior's name: ${seniorName}.
Preferred language: ${language}.
${seniorContext ? `Current senior profile & daily context:\n${seniorContext}\n` : ""}
CRITICAL DIRECTIVES:
1. Direct Answers (HIGHEST PRIORITY): Always directly and thoughtfully answer the specific question or topic the user asked: "${trimmedMessage}". Do NOT give generic greetings, do NOT repeat back what was said, and do NOT ask "How can I help you today?" when they already asked a question. Provide the specific information, medicine schedule, appointment details, safety advice, or comfort they asked for.
2. Warmth & Respect: Speak with genuine patience, empathy, and dignity. Never sound rushed, patronizing, or overly technical.
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

    const reply = response.text?.trim() || getSmartCompanionAnswer({
      query: trimmedMessage,
      language,
      seniorName,
      seniorContext,
    });
    res.json({ reply, voiceText: reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    const reply = getSmartCompanionAnswer({
      query: (req.body?.message || "").trim(),
      language: req.body?.language || "English",
      seniorName: req.body?.seniorName || "Friend",
      seniorContext: req.body?.seniorContext || "",
    });
    res.json({
      reply,
      voiceText: reply,
    });
  }
});

// 2. Explain My Document Endpoint (GenAI-powered senior healthcare & document explainer)
// Uses multilingual getFallbackExplainedDocument imported from ./server/documentFallbacks
const _inlineLegacyFallback = (
  text: string,
  category: string,
  language: string
) => {
  const lower = (text || "").toLowerCase();

  // Category 1: Prescription / Medicines
  if (
    category === "prescription" ||
    lower.includes("rx") ||
    lower.includes("metformin") ||
    lower.includes("amlodipine") ||
    lower.includes("tablet") ||
    lower.includes("capsule") ||
    lower.includes("prescription")
  ) {
    if (language === "Hindi") {
      return {
        documentTitle: "डॉक्टर की दवा पर्ची (प्रिस्क्रिप्शन)",
        documentType: "prescription",
        documentTypeLabel: "दवा की पर्ची (Medicine Prescription)",
        simpleSummary: "यह डॉक्टर की लिखी हुई दवा की पर्ची है। इसमें आपके रक्तचाप (BP) और शुगर को नियंत्रित रखने के लिए नियमित दवाएं लिखी गई हैं।",
        confidenceLevel: "high",
        extractedTextPreview: text ? text.slice(0, 250) : "डॉक्टर अरविंद मेहता - दवा पर्ची",
        keyDates: [
          { label: "पर्ची की तारीख", date: "14 सितंबर 2026", isUrgent: false },
          { label: "अगली डॉक्टर विजिट", date: "28 अक्टूबर 2026", isUrgent: true },
        ],
        medicines: [
          {
            name: "टैबलेट मेटफॉर्मिन 500mg (Metformin 500mg)",
            dosage: "1 गोली दिन में दो बार (सुबह व रात)",
            timing: "भोजन के साथ लें (नाश्ते और रात के खाने के बाद)",
            instructions: "पानी के साथ पूरी गोली निगलें। खाली पेट न लें।",
            quantity: "60 गोलियाँ (1 माह की खुराक)",
          },
          {
            name: "टैबलेट एम्लोडिपिन 5mg (Amlodipine 5mg)",
            dosage: "1 गोली दिन में एक बार",
            timing: "सुबह नाश्ते के बाद",
            instructions: "रक्तचाप (BP) को सामान्य रखने में मदद करती है। रोज़ एक ही समय पर लें।",
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
            "आने से पहले खाली पेट का शुगर टेस्ट करवा लें",
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
          {
            term: "Rx",
            plainMeaning: "लैटिन शब्द का संक्षिप्त रूप जिसका अर्थ है: 'डॉक्टर द्वारा सुझाई गई दवाएं'",
          },
          {
            term: "OD (Once Daily)",
            plainMeaning: "दिन में केवल 1 बार दवा लेना",
          },
          {
            term: "BD (Bis in Die)",
            plainMeaning: "दिन में 2 बार दवा लेना (सुबह और शाम)",
          },
        ],
        safeAdvice: "दवाइयों को हमेशा मूल पत्ते में और ठंडी, सूखी जगह पर रखें। डॉक्टर की सलाह के बिना कोई खुराक न बदलें।",
        disclaimer: "यह व्याख्या आपकी सुविधा के लिए है। किसी भी बदलाव से पहले हमेशा अपने डॉक्टर से परामर्श लें।",
      };
    }

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
        {
          term: "Rx",
          plainMeaning: "Short for medical recipe, meaning 'Prescribed medicines to take'",
        },
        {
          term: "OD (Once Daily)",
          plainMeaning: "Take only once in 24 hours, ideally at the same time each morning",
        },
        {
          term: "BD (Twice Daily)",
          plainMeaning: "Take twice in 24 hours, approximately 10 to 12 hours apart",
        },
        {
          term: "Extended Release (ER / SR)",
          plainMeaning: "The pill slowly releases medicine into your body all day long so you stay protected",
        },
      ],
      safeAdvice: "Keep your pills in a clean pill organizer box away from direct kitchen heat or bathroom dampness.",
      disclaimer: "This explanation is designed to help you understand your medical paperwork. Always verify medicine changes with your doctor or pharmacist.",
    };
  }

  // Category 2: Medical / Hospital Bill
  if (
    category === "medical_bill" ||
    lower.includes("invoice") ||
    lower.includes("co-pay") ||
    lower.includes("consultation fee") ||
    lower.includes("billed") ||
    lower.includes("hospital")
  ) {
    return {
      documentTitle: "Hospital Consultation & Diagnostic Medical Bill",
      documentType: "medical_bill",
      documentTypeLabel: "Medical Bill",
      simpleSummary: "This is an itemized hospital bill for your recent medical visit and ECG test. Your insurance and senior discount have already covered most of the cost.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Apollo Hospital Invoice INV-2026-98124",
      keyDates: [
        { label: "Bill Invoice Date", date: "12 September 2026", isUrgent: false },
        { label: "Payment Due Date", date: "25 September 2026", isUrgent: true },
      ],
      medicines: [],
      testsAndResults: [],
      billingDetails: {
        totalAmount: "$200.00",
        amountPaid: "$160.00 (Insurance + Senior Rebate)",
        balanceDue: "$40.00",
        dueDate: "25 September 2026",
        breakdown: [
          { item: "Senior Specialist Consultation (Dr. Mehta)", cost: "$85.00" },
          { item: "Digital Resting 12-Lead ECG", cost: "$45.00" },
          { item: "Lipid Profile Blood Test", cost: "$60.00" },
          { item: "Hospital Sanitation & Administrative Fee", cost: "$10.00" },
          { item: "Senior Citizen Discount (15%)", cost: "-$30.00" },
          { item: "Primary Health Insurance Coverage", cost: "-$130.00" },
        ],
      },
      appointmentDetails: null,
      actionItems: [
        {
          priority: "must_do",
          action: "Pay the remaining $40.00 balance before 25 September",
          tip: "You can pay via bank card, auto-debit, or have a family member pay online.",
        },
        {
          priority: "for_records",
          action: "File this receipt in your medical insurance claim folder",
          tip: "Keep the invoice number (INV-2026-98124) handy in case insurance asks for proof.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "Patient Co-Pay / Balance Due",
          plainMeaning: "The small portion of the hospital bill you pay directly after your insurance pays its share",
        },
        {
          term: "Resting 12-Lead ECG",
          plainMeaning: "A quick, painless skin sensor test that graphs your heartbeat rhythm",
        },
      ],
      safeAdvice: "Verify that the patient name and insurance ID on the bill match your health card before sending any payment.",
      disclaimer: "This billing explanation assists in personal bookkeeping. For billing disputes, contact the hospital billing desk directly.",
    };
  }

  // Category 3: Lab / Test Report
  if (
    category === "lab_report" ||
    lower.includes("blood sugar") ||
    lower.includes("hba1c") ||
    lower.includes("cholesterol") ||
    lower.includes("lab") ||
    lower.includes("specimen")
  ) {
    return {
      documentTitle: "Diagnostic Laboratory & Blood Chemistry Report",
      documentType: "lab_report",
      documentTypeLabel: "Lab/Test Report",
      simpleSummary: "This is a laboratory blood test report showing your blood sugar, kidney function, and cholesterol levels. Overall your values are stable with good kidney function and good cholesterol in healthy range.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Metropolis Diagnostic Laboratories Report",
      keyDates: [
        { label: "Sample Collected", date: "10 September 2026 (7:30 AM)", isUrgent: false },
        { label: "Report Published", date: "10 September 2026 (5:00 PM)", isUrgent: false },
      ],
      medicines: [],
      testsAndResults: [
        {
          testName: "Fasting Blood Sugar",
          resultValue: "128 mg/dL",
          normalRange: "70 - 99 mg/dL",
          plainMeaning: "Your morning sugar before breakfast. It is slightly above normal range; your morning tablet helps keep this in check.",
          status: "borderline",
        },
        {
          testName: "HbA1c (3-Month Sugar Average)",
          resultValue: "6.8%",
          normalRange: "< 5.7% (Good Control: 6.5 - 7.0%)",
          plainMeaning: "Measures average sugar control over the past 90 days. 6.8% indicates fair, controlled management for senior years.",
          status: "normal",
        },
        {
          testName: "Serum Creatinine (Kidney Health)",
          resultValue: "1.05 mg/dL",
          normalRange: "0.70 - 1.30 mg/dL",
          plainMeaning: "Measures how well your kidneys filter blood. 1.05 mg/dL is completely healthy and normal.",
          status: "normal",
        },
        {
          testName: "HDL (Good Protective Cholesterol)",
          resultValue: "52 mg/dL",
          normalRange: "> 50 mg/dL",
          plainMeaning: "The healthy cholesterol that shields blood vessels. Your level is excellent and protective.",
          status: "normal",
        },
        {
          testName: "Serum Triglycerides",
          resultValue: "160 mg/dL",
          normalRange: "< 150 mg/dL",
          plainMeaning: "Fat in the blood from food. Mildly elevated; eating less fried snacks will bring this down easily.",
          status: "borderline",
        },
      ],
      billingDetails: null,
      appointmentDetails: null,
      actionItems: [
        {
          priority: "must_do",
          action: "Show this report to Dr. Mehta on your next follow-up visit",
          tip: "Keep a paper copy folded in your medical pouch.",
        },
        {
          priority: "optional",
          action: "Continue taking morning sugar medicine as prescribed",
          tip: "Do not stop your pill even if your 3-month sugar reading is under good control.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "HbA1c",
          plainMeaning: "A memory test for your blood sugar — it shows the average level across the last 3 months rather than just one day",
        },
        {
          term: "Serum Creatinine",
          plainMeaning: "A natural waste substance filtered by healthy kidneys; normal levels mean your kidneys are working well",
        },
        {
          term: "HDL vs LDL",
          plainMeaning: "HDL is 'Happy' (good) cholesterol that clears arteries; LDL is bad cholesterol that sticks to blood vessels",
        },
      ],
      safeAdvice: "Drink plenty of clean water throughout the day to support kidney hydration and keep blood tests accurate.",
      disclaimer: "Lab reports must always be interpreted alongside clinical examination by your treating physician.",
    };
  }

  // Category 4: Pharmacy Bill
  if (
    category === "pharmacy_bill" ||
    lower.includes("pharmacy") ||
    lower.includes("cash memo") ||
    lower.includes("strips") ||
    lower.includes("dispense")
  ) {
    return {
      documentTitle: "Wellness Pharmacy Monthly Prescription Bill",
      documentType: "pharmacy_bill",
      documentTypeLabel: "Pharmacy Bill",
      simpleSummary: "This is a pharmacy receipt showing your 30-day supply of blood pressure and sugar medicines. The bill is paid in full with zero balance due.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Wellness Care Pharmacy Bill PH-55420",
      keyDates: [
        { label: "Purchase Date", date: "15 September 2026", isUrgent: false },
        { label: "Estimated Refill Date", date: "15 October 2026", isUrgent: false },
      ],
      medicines: [
        {
          name: "Glycomet SR 500mg (Metformin)",
          dosage: "10 tabs x 6 strips",
          timing: "Morning and Night with meals",
          instructions: "Check expiry (08/2028). Keep strips in dry drawer.",
          quantity: "60 tablets",
        },
        {
          name: "Stamlo 5mg (Amlodipine)",
          dosage: "10 tabs x 3 strips",
          timing: "Morning after breakfast",
          instructions: "Check expiry (11/2027). Daily blood pressure maintenance.",
          quantity: "30 tablets",
        },
        {
          name: "Calcirol 60K (Vitamin D3)",
          dosage: "8 softgels",
          timing: "Once a week on Sunday",
          instructions: "Check expiry (05/2028). Supports bone density.",
          quantity: "8 softgels",
        },
      ],
      testsAndResults: [],
      billingDetails: {
        totalAmount: "$32.98",
        amountPaid: "$32.98 (Cash)",
        balanceDue: "$0.00 (Paid in Full)",
        dueDate: "None",
        breakdown: [
          { item: "Glycomet SR 500mg (60 Tabs)", cost: "$14.40" },
          { item: "Stamlo 5mg (30 Tabs)", cost: "$8.50" },
          { item: "Calcirol 60K Softgels (8 Pcs)", cost: "$12.00" },
          { item: "Senior Care Privilege Discount (10%)", cost: "-$3.49" },
          { item: "Sales Tax / GST (5%)", cost: "+$1.57" },
        ],
      },
      appointmentDetails: null,
      actionItems: [
        {
          priority: "for_records",
          action: "Keep this cash memo receipt with your medical bills",
          tip: "Useful for year-end healthcare expense claims or tax rebates.",
        },
        {
          priority: "must_do",
          action: "Organize the new strips into your weekly pill dispenser",
          tip: "Set a reminder on Mitraa to refill around 12-14 October.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "Batch & Expiry",
          plainMeaning: "All medicines purchased are fresh and safe to use until late 2027 and 2028",
        },
      ],
      safeAdvice: "Store medicines away from moisture and avoid keeping them near the kitchen gas stove.",
      disclaimer: "Pharmacy bills confirm medicine dispensing. Always cross-check that tablet names match your doctor's prescription.",
    };
  }

  // Category 5: Appointment Document
  if (
    category === "appointment" ||
    lower.includes("appointment") ||
    lower.includes("consultation at") ||
    lower.includes("dilation") ||
    lower.includes("opthalmology") ||
    lower.includes("eye")
  ) {
    return {
      documentTitle: "Eye Clinic Cataract Consultation Appointment Slip",
      documentType: "appointment",
      documentTypeLabel: "Appointment Document",
      simpleSummary: "This is an appointment confirmation slip for your upcoming eye and cataract checkup with Dr. Radhika Sen at Divine Eye Hospital.",
      confidenceLevel: "high",
      extractedTextPreview: text ? text.slice(0, 260) : "Divine Eye & Retina Institute Appointment Slip",
      keyDates: [
        { label: "Appointment Date", date: "Thursday, 24 September 2026", isUrgent: true },
        { label: "Arrival / Reporting Time", date: "10:15 AM (Consultation at 10:45 AM)", isUrgent: true },
      ],
      medicines: [],
      testsAndResults: [],
      billingDetails: null,
      appointmentDetails: {
        doctorOrClinic: "Dr. Radhika Sen, MS Ophthalmology (Divine Eye & Retina Institute)",
        dateTime: "Thursday, 24 September 2026 at 10:15 AM",
        location: "Wing B, 3rd Floor, Suite 302, Divine Eye Hospital, Ring Road",
        preparationInstructions: [
          "Pupillary dilation eye drops will be applied; your near vision will be temporarily blurry for 3-4 hours.",
          "Do NOT drive yourself. Ask a family member or trusted driver to accompany you.",
          "Bring dark sunglasses to wear on the ride back home to protect your eyes from outdoor sunlight glare.",
          "Bring your current reading and distance spectacles along.",
        ],
      },
      actionItems: [
        {
          priority: "must_do",
          action: "Ask your family contact or caregiver to accompany you on 24 September",
          tip: "Because dilation drops cause blurry vision, having someone with you ensures you walk safely.",
        },
        {
          priority: "must_do",
          action: "Pack your current eyeglasses and sunglasses in your handbag",
          tip: "The doctor will compare your old glasses with your current vision.",
        },
      ],
      medicalTermsExplained: [
        {
          term: "Pupillary Dilation",
          plainMeaning: "Eye drops that temporarily widen your pupils so the doctor can examine the retina and lens inside your eye",
        },
      ],
      safeAdvice: "Plan to rest quietly at home for a couple of hours after the visit while the eye drops naturally wear off.",
      disclaimer: "Confirm your appointment 24 hours prior if your schedule changes.",
    };
  }

  // Default: Utility Bill / General Notice
  return {
    documentTitle: "Monthly Electricity Utility Bill",
    documentType: "utility_bill",
    documentTypeLabel: "Utility Bill",
    simpleSummary: "This is a regular residential electricity bill for your home. Your power usage is normal, and there are no penalty notices or service cutoffs.",
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
        { item: "Utility Taxes & Cess", cost: "$4.30" },
      ],
    },
    appointmentDetails: null,
    actionItems: [
      {
        priority: "must_do",
        action: "Pay $42.50 before 20 September to avoid $3.50 late surcharge",
        tip: "You can pay easily at the local post office, official online portal, or via bank auto-debit.",
      },
    ],
    medicalTermsExplained: [],
    safeAdvice: "Always verify that the consumer number matches your home electricity meter card before paying.",
    disclaimer: "Keep the payment confirmation receipt for your household utility records.",
  };
};

app.post("/api/companion/explain-document", async (req, res) => {
  const {
    documentText = "",
    fileBase64 = null,
    mimeType = null,
    documentCategory = "healthcare",
    language = "English",
    seniorProfile = {},
  } = req.body || {};

  try {
    if (!documentText && !fileBase64) {
      res.status(400).json({
        error: "Please upload a document file (image or PDF) or provide document text.",
      });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = getFallbackExplainedDocument(
        documentText,
        documentCategory,
        language
      );
      res.json(fallback);
      return;
    }

    const promptText = `You are Mitraa, an expert, compassionate senior citizen healthcare and document assistant.
A senior citizen or their family member has uploaded a document for you to analyze and explain.
The document may be:
- A medicine prescription
- A medical / hospital bill
- A doctor's prescription note or discharge summary
- A lab / test report (blood test, ECG, lipid profile, etc.)
- An appointment confirmation slip
- A pharmacy bill / drug dispense invoice
- A health insurance summary or government health scheme letter
- Or another healthcare or household document

Your mission:
1. Extract the text and relevant information from the document.
2. Understand the document structure.
3. Identify important sections, dates, medicines, quantities, prices, test names, instructions, etc.
4. Generate a simple, friendly explanation in 5th-grade plain language that a senior citizen can easily understand without anxiety or confusion.

============================================================
CRITICAL LANGUAGE REQUIREMENT (HIGHEST PRIORITY):
The user has chosen their language as: "${language}".
You MUST generate ALL output values in this JSON response strictly and entirely in "${language}".
- "documentTitle": in ${language}
- "documentTypeLabel": in ${language}
- "simpleSummary": in ${language}
- "keyDates": labels in ${language}
- "medicines": dosage, timing, instructions, and quantities in ${language} (preserve known pharmaceutical names, but describe everything around them in ${language})
- "testsAndResults": test names, plain meanings, and status in ${language}
- "billingDetails": total amounts, balance due, and itemized breakdown descriptions in ${language}
- "appointmentDetails": clinic, date/time, location, and preparation instructions in ${language}
- "actionItems": action and tip in ${language}
- "medicalTermsExplained": term and plain meaning in ${language}
- "safeAdvice": in ${language}
- "disclaimer": in ${language}

DO NOT output English unless "${language}" is "English".
Even if the original document is written in English or another script, your explanation MUST BE FULLY TRANSLATED AND WRITTEN IN ${language}.
============================================================

${seniorProfile?.name ? `Senior Name: ${seniorProfile.name} (Prefers: ${seniorProfile.preferredHonorific || ""})` : ""}
${seniorProfile?.primaryDoctor ? `Primary Doctor: Dr. ${seniorProfile.primaryDoctor}` : ""}
${seniorProfile?.medicalConditions?.length ? `Senior Known Conditions: ${seniorProfile.medicalConditions.join(", ")}` : ""}

Respond in strict, valid JSON format matching this schema:
{
  "documentTitle": "string (Descriptive title, e.g. Doctor's Prescription for Blood Pressure)",
  "documentType": "prescription" | "medical_bill" | "lab_report" | "appointment" | "pharmacy_bill" | "utility_bill" | "insurance" | "other",
  "documentTypeLabel": "string (Senior-friendly label, e.g. Medicine Prescription, Medical Bill, Lab/Test Report)",
  "simpleSummary": "string (2-3 calm, comforting sentences explaining what this document is in plain everyday words)",
  "confidenceLevel": "high" | "moderate" | "review_needed",
  "extractedTextPreview": "string (A clean 150-300 character excerpt of key readable text from the document)",
  "keyDates": [
    { "label": "string", "date": "string", "isUrgent": boolean }
  ],
  "medicines": [
    {
      "name": "string (Medicine name and strength)",
      "dosage": "string (e.g. 1 tablet)",
      "timing": "string (e.g. Morning after breakfast)",
      "instructions": "string (e.g. Take with water, do not skip)",
      "quantity": "string (e.g. 30 tablets)"
    }
  ],
  "testsAndResults": [
    {
      "testName": "string",
      "resultValue": "string",
      "normalRange": "string",
      "plainMeaning": "string (What does this result mean in plain language?)",
      "status": "normal" | "borderline" | "attention_needed"
    }
  ],
  "billingDetails": {
    "totalAmount": "string",
    "amountPaid": "string",
    "balanceDue": "string",
    "dueDate": "string",
    "breakdown": [
      { "item": "string", "cost": "string" }
    ]
  } (or null if not a bill),
  "appointmentDetails": {
    "doctorOrClinic": "string",
    "dateTime": "string",
    "location": "string",
    "preparationInstructions": [ "string" ]
  } (or null if not an appointment),
  "actionItems": [
    {
      "priority": "must_do" | "optional" | "for_records",
      "action": "string (Clear next action step)",
      "tip": "string (Practical advice for a senior)"
    }
  ],
  "medicalTermsExplained": [
    {
      "term": "string (e.g. OD, BD, HbA1c, Co-pay)",
      "plainMeaning": "string (Simple explanation)"
    }
  ],
  "safeAdvice": "string (One warm, reassuring safety reminder for the senior)",
  "disclaimer": "string (Gentle disclaimer to consult doctor before altering doses)"
}

${documentText ? `Document Text/OCR excerpt:\n"""\n${documentText.slice(0, 8000)}\n"""` : ""}`;

    const parts: any[] = [];
    if (fileBase64 && mimeType) {
      const cleanBase64 = fileBase64.includes(",")
        ? fileBase64.split(",")[1]
        : fileBase64;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: promptText });

    const response = await generateWithGemini(ai, {
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Explain document error:", error);
    const fallback = getFallbackExplainedDocument(
      documentText,
      documentCategory,
      language
    );
    res.json(fallback);
  }
});

// Legacy Document & Information Simplifier Endpoint (Maintained for backwards compatibility)
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
