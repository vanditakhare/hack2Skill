export type Language =
  | "English"
  | "Hindi"
  | "Spanish"
  | "Tamil"
  | "Bengali"
  | "Telugu"
  | "Marathi"
  | "Gujarati";

export type TextSize = "normal" | "large" | "extra-large";

export type ModuleTab =
  | "companion"
  | "daily"
  | "document"
  | "tasks"
  | "scam"
  | "health"
  | "family"
  | "finance"
  | "personal";

export type ActiveModule =
  | "voice-companion"
  | "daily-life"
  | "document-simplifier"
  | "digital-tasks"
  | "scam-protection"
  | "health-organizer"
  | "family-connection"
  | "emergency"
  | "finance-bills"
  | "companion-leisure";

export interface SeniorProfile {
  name: string;
  preferredHonorific: string; // e.g. "Ramji", "Grandpa", "Dadaji", "Mr. Sharma"
  age: number;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  primaryDoctor: string;
  doctorPhone: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  language: Language;
  textSize: TextSize;
  highContrast: boolean;
  voiceSpeed: number; // 0.8 to 1.0
  soundAlerts: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  voiceAudioAvailable?: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: "medicine" | "health" | "family" | "leisure" | "bill";
  completed: boolean;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timeSlot: "Morning" | "Afternoon" | "Evening" | "Night";
  timeLabel: string;
  instructions: string; // e.g. "Take after breakfast with warm water"
  takenToday: boolean;
  remainingPills: number;
  doctorNotes?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  questionsToAsk: string[];
}

export interface VitalLog {
  id: string;
  date: string;
  time: string;
  systolicBP: number;
  diastolicBP: number;
  bloodSugar?: number; // mg/dL
  mealContext?: "Fasting" | "Post Meal";
  notes?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarColor: string;
  isEmergencyContact: boolean;
}

export interface BillItem {
  id: string;
  title: string;
  provider: string;
  amount: string;
  dueDate: string;
  status: "paid" | "pending" | "due_soon";
  accountNumber: string;
  category: "electricity" | "water" | "phone" | "gas" | "cable";
}

export interface SimplifiedDocResult {
  summary: string;
  actionRequired: string;
  amountDue: string;
  dueDate: string;
  isUrgent: boolean;
  keyPoints: string[];
  safeAdvice: string;
}

export interface ExplainedDocumentResult {
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
  };
  appointmentDetails?: {
    doctorOrClinic: string;
    dateTime: string;
    location: string;
    preparationInstructions: string[];
  };
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

export interface ScamCheckResult {
  verdict: "SAFE" | "CAUTION" | "DANGEROUS_SCAM";
  riskScore: number;
  headline: string;
  explanation: string;
  redFlags: string[];
  whatToDo: string[];
}

export interface DigitalTaskGuide {
  taskTitle: string;
  estimatedTime: string;
  prerequisites: string[];
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    tip: string;
    safetyCheck: string;
  }[];
}
