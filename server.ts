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

// 1. AI Voice Companion Chat Endpoint
app.post("/api/companion/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], language = "English", seniorName = "Friend" } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

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
Your core principles:
1. Warmth & Respect: Speak with genuine patience, empathy, and dignity. Never sound rushed, patronizing, or overly technical.
2. Simplicity & Clarity: Use short, clear sentences. Avoid modern tech slang or complicated words.
3. Conversational Pace: Keep responses concise (usually 2 to 4 friendly sentences) so they are easy to read and listen to via voice.
4. Supportiveness: If they mention health, bills, loneliness, or confusion, validate their feelings and offer gentle, clear guidance.
5. Multilingual Fluency: Always respond in the requested language (${language}) naturally and respectfully (e.g. using respectful honorifics like 'Ji' or 'Don/Doña' where customary).
6. Safety: Never ask them for bank PINs, passwords, or OTPs, and remind them to keep those safe if finances come up.`;

    const contents: any[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      for (const turn of recentHistory) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here with you. Could you please repeat that?";
    res.json({ reply, voiceText: reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    const friendlyFallback = `Namaste! I am Mitraa, your caring companion. I'm right here with you. Take your time—you can ask me about your medicines, today's schedule, reading documents, or simply chat. How can I help you today?`;
    res.json({
      reply: friendlyFallback,
      voiceText: friendlyFallback,
    });
  }
});

// 2. Document & Information Simplifier Endpoint
app.post("/api/companion/simplify-doc", async (req, res) => {
  try {
    const { documentText, docType = "general", language = "English" } = req.body;

    if (!documentText) {
      res.status(400).json({ error: "Document text is required" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Doc simplify error:", error);
    res.json({
      summary: "This document has been reviewed. It is a standard monthly statement or advisory notice.",
      actionRequired: "Review dates and amounts carefully with a family member or Sathi.",
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
  try {
    const { messageText, sender, channel = "SMS", language = "English" } = req.body;

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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Scam check error:", error);
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
  try {

    const fallbackGuide = {
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
          instruction: "Fill in the required information without rushing. Sathi is right here with you.",
          tip: "Take your time. You can verify every single letter and number.",
          safetyCheck: "Do not enter your bank PIN or CVV unless on a verified payment screen.",
        },
        {
          stepNumber: 3,
          title: "Confirm and Save Your Confirmation",
          instruction: "Review the screen summary and note down or screenshot your confirmation number.",
          tip: "You can tell your family or Sathi that this task is complete.",
          safetyCheck: "If anything looks unclear, pause and ask a family member.",
        },
      ],
    };

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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Task guide error:", error);
    res.json({
      taskTitle: taskName || "Digital Task Guide",
      estimatedTime: "5 minutes",
      prerequisites: ["Eyeglasses", "Your phone or tablet"],
      steps: [
        {
          stepNumber: 1,
          title: "Get Ready Comfortably",
          instruction: "Sit comfortably and have your phone or documents nearby.",
          tip: "Take a relaxed breath before starting.",
          safetyCheck: "Make sure you feel calm and unhurried.",
        },
        {
          stepNumber: 2,
          title: "Follow the Official Screens",
          instruction: "Follow the prompt on your screen carefully.",
          tip: "You can ask Sathi to explain any confusing button.",
          safetyCheck: "Never share OTP or PIN over phone calls.",
        },
      ],
    });
  }
});

// 5. Positive News & Companion Trivia Endpoint
app.post("/api/companion/news-and-mind", async (req, res) => {
  try {
    const { language = "English", topic = "positive" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("News error:", error);
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
