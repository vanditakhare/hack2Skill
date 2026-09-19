import {
  SeniorProfile,
  ScheduleItem,
  Medicine,
  DoctorAppointment,
  VitalLog,
  TrustedContact,
  BillItem,
  DigitalTaskGuide,
} from "../types";

export const initialSeniorProfile: SeniorProfile = {
  name: "Ram Sharma",
  preferredHonorific: "Ramji",
  age: 72,
  bloodGroup: "O+",
  allergies: ["Penicillin", "Sulfa drugs"],
  medicalConditions: ["Mild Hypertension", "Type 2 Diabetes (Managed)"],
  primaryDoctor: "Dr. Arvind Mehta (Cardiologist)",
  doctorPhone: "+1 (555) 234-5678",
  address: "Flat 402, Shanti Vihar, Oakridge Avenue",
  emergencyContact: {
    name: "Priya Sharma (Daughter)",
    relation: "Daughter",
    phone: "+1 (555) 987-6543",
  },
  language: "English",
  textSize: "large",
  highContrast: false,
  voiceSpeed: 0.88,
  soundAlerts: true,
};

export const presetSeniorProfiles: SeniorProfile[] = [
  initialSeniorProfile,
  {
    name: "Asha Patel",
    preferredHonorific: "Ashaji",
    age: 69,
    bloodGroup: "B+",
    allergies: ["Aspirin"],
    medicalConditions: ["Mild Arthritis", "Thyroid (Managed)"],
    primaryDoctor: "Dr. Sunita Rao (Physician)",
    doctorPhone: "+1 (555) 345-6789",
    address: "B-12, Greenfield Apartments, Sector 15",
    emergencyContact: {
      name: "Rahul Patel (Son)",
      relation: "Son",
      phone: "+1 (555) 876-5432",
    },
    language: "Hindi",
    textSize: "large",
    highContrast: false,
    voiceSpeed: 0.85,
    soundAlerts: true,
  },
  {
    name: "Devendra Verma",
    preferredHonorific: "Dadaji",
    age: 76,
    bloodGroup: "AB+",
    allergies: ["None known"],
    medicalConditions: ["High Cholesterol", "Mild Knee Pain"],
    primaryDoctor: "Dr. Rajesh Kapoor",
    doctorPhone: "+1 (555) 456-7890",
    address: "House 54, Anand Niketan",
    emergencyContact: {
      name: "Amit Verma (Son)",
      relation: "Son",
      phone: "+1 (555) 765-4321",
    },
    language: "Hindi",
    textSize: "extra-large",
    highContrast: false,
    voiceSpeed: 0.85,
    soundAlerts: true,
  },
  {
    name: "Robert Miller",
    preferredHonorific: "Grandpa Bob",
    age: 74,
    bloodGroup: "A+",
    allergies: ["Sulfa"],
    medicalConditions: ["Glaucoma (Eye drops daily)", "Hypertension"],
    primaryDoctor: "Dr. Sarah Jenkins",
    doctorPhone: "+1 (555) 567-8901",
    address: "742 Evergreen Terrace, Springfield",
    emergencyContact: {
      name: "Lisa Miller (Daughter)",
      relation: "Daughter",
      phone: "+1 (555) 654-3210",
    },
    language: "English",
    textSize: "large",
    highContrast: false,
    voiceSpeed: 0.9,
    soundAlerts: true,
  },
];

export const initialSchedule: ScheduleItem[] = [
  {
    id: "s1",
    time: "07:30 AM",
    title: "Morning Garden Walk & Gentle Stretches",
    category: "health",
    completed: true,
    notes: "20 minutes in mild sunlight for Vitamin D",
  },
  {
    id: "s2",
    time: "08:30 AM",
    title: "Breakfast & Morning Blood Pressure Medicine",
    category: "medicine",
    completed: true,
    notes: "Warm oatmeal and Amlodipine 5mg",
  },
  {
    id: "s3",
    time: "11:00 AM",
    title: "Video Call with Granddaughter Ananya",
    category: "family",
    completed: false,
    notes: "She wanted to show her school science painting!",
  },
  {
    id: "s4",
    time: "01:30 PM",
    title: "Nutritious Lunch & Post-Meal Rest",
    category: "health",
    completed: false,
    notes: "Light khichdi/soup and 30 min quiet nap",
  },
  {
    id: "s5",
    time: "04:30 PM",
    title: "Electricity Bill Due Date Reminder",
    category: "bill",
    completed: false,
    notes: "Amount $42.50 due tomorrow - Mitraa will guide payment",
  },
  {
    id: "s6",
    time: "06:00 PM",
    title: "Evening Tea & Balcony Relaxation",
    category: "leisure",
    completed: false,
    notes: "Gentle devotional music and herbal tea",
  },
  {
    id: "s7",
    time: "08:30 PM",
    title: "Dinner & Evening Diabetes Tablet",
    category: "medicine",
    completed: false,
    notes: "Metformin 500mg with water",
  },
];

export const initialMedicines: Medicine[] = [
  {
    id: "m1",
    name: "Amlodipine",
    dosage: "5 mg - 1 Tablet",
    timeSlot: "Morning",
    timeLabel: "08:30 AM (After Breakfast)",
    instructions: "For healthy blood pressure. Take with a glass of water.",
    takenToday: true,
    remainingPills: 18,
    doctorNotes: "Keep monitoring morning BP readings weekly.",
  },
  {
    id: "m2",
    name: "Vitamin D3 & Calcium",
    dosage: "1 Capsule",
    timeSlot: "Morning",
    timeLabel: "09:00 AM (With Breakfast)",
    instructions: "For strong bones and joint comfort.",
    takenToday: true,
    remainingPills: 24,
  },
  {
    id: "m3",
    name: "Tear-Drops Eye Lubricant",
    dosage: "1 Drop in each eye",
    timeSlot: "Afternoon",
    timeLabel: "02:00 PM (After Rest)",
    instructions: "Relieves eye dryness from reading.",
    takenToday: false,
    remainingPills: 1,
    doctorNotes: "Bottle open date: 1st of month.",
  },
  {
    id: "m4",
    name: "Metformin ER",
    dosage: "500 mg - 1 Tablet",
    timeSlot: "Night",
    timeLabel: "08:45 PM (With Dinner)",
    instructions: "Keeps blood sugar steady through the night.",
    takenToday: false,
    remainingPills: 12,
    doctorNotes: "Do not take on an empty stomach.",
  },
];

export const initialAppointments: DoctorAppointment[] = [
  {
    id: "a1",
    doctorName: "Dr. Arvind Mehta",
    specialty: "Senior Cardiologist",
    date: "Tuesday, Oct 3, 2026",
    time: "10:30 AM",
    location: "City Heart Clinic, Room 204",
    questionsToAsk: [
      "Are my morning blood pressure numbers (around 124/82) stable?",
      "Can I continue my 25-minute evening walks?",
      "Do I need any blood tests before my next visit?",
    ],
  },
  {
    id: "a2",
    doctorName: "Dr. Sunita Rao",
    specialty: "Ophthalmologist (Eye Care)",
    date: "Friday, Oct 14, 2026",
    time: "03:00 PM",
    location: "Vision Care Center, 2nd Floor",
    questionsToAsk: [
      "Is my reading prescription still adequate?",
      "How often should I use the lubricating eye drops?",
    ],
  },
];

export const initialVitals: VitalLog[] = [
  {
    id: "v1",
    date: "Today",
    time: "08:00 AM",
    systolicBP: 122,
    diastolicBP: 80,
    bloodSugar: 108,
    mealContext: "Fasting",
    notes: "Felt well-rested, morning walk done",
  },
  {
    id: "v2",
    date: "Yesterday",
    time: "08:15 AM",
    systolicBP: 126,
    diastolicBP: 82,
    bloodSugar: 112,
    mealContext: "Fasting",
    notes: "Normal reading",
  },
  {
    id: "v3",
    date: "2 days ago",
    time: "08:30 AM",
    systolicBP: 128,
    diastolicBP: 84,
    bloodSugar: 138,
    mealContext: "Post Meal",
    notes: "After breakfast",
  },
];

export const initialTrustedContacts: TrustedContact[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    relation: "Daughter (Primary Caregiver)",
    phone: "+1 (555) 987-6543",
    avatarColor: "bg-emerald-600",
    isEmergencyContact: true,
  },
  {
    id: "c2",
    name: "Arjun Sharma",
    relation: "Son (Lives in Chicago)",
    phone: "+1 (555) 456-7890",
    avatarColor: "bg-blue-600",
    isEmergencyContact: true,
  },
  {
    id: "c3",
    name: "Mr. Satish Verma",
    relation: "Trusted Neighbor (Flat 401)",
    phone: "+1 (555) 321-7654",
    avatarColor: "bg-amber-600",
    isEmergencyContact: false,
  },
  {
    id: "c4",
    name: "City Emergency Helpline",
    relation: "Ambulance / Police / Fire",
    phone: "911 / 112",
    avatarColor: "bg-rose-600",
    isEmergencyContact: true,
  },
];

export const initialBills: BillItem[] = [
  {
    id: "b1",
    title: "City Power & Electricity",
    provider: "Metro Electric Board",
    amount: "$42.50",
    dueDate: "Tomorrow (Sep 20)",
    status: "due_soon",
    accountNumber: "ACC-8921-409",
    category: "electricity",
  },
  {
    id: "b2",
    title: "Home Broadband & Landline",
    provider: "Telecom Connect",
    amount: "$29.00",
    dueDate: "Sep 28, 2026",
    status: "pending",
    accountNumber: "TEL-4309-881",
    category: "phone",
  },
  {
    id: "b3",
    title: "Municipal Water Board",
    provider: "City Water Utility",
    amount: "$18.20",
    dueDate: "Paid on Sep 05",
    status: "paid",
    accountNumber: "WTR-0091-231",
    category: "water",
  },
];

export const sampleDocuments = [
  {
    id: "doc-prescription",
    title: "Doctor's Medicine Prescription (Hypertension & Diabetes)",
    tag: "Medicine Prescription",
    category: "prescription",
    preview: `CITY HEALTH CARE CLINIC
Dr. Arvind Mehta, MD (Internal Medicine), Reg No: MED-88412
Date: 14 September 2026
Patient: Senior Patient, Age: 71, BP: 138/86 mmHg, Fasting Blood Sugar: 128 mg/dL

Rx (Prescription):
1. Tab Metformin 500mg (Extended Release)
   - Dosage: 1 tablet twice daily (BD) - with breakfast and dinner
   - Duration: 30 days. Quantity: 60 tablets
   - Note: Do not skip meals; drink adequate water

2. Tab Amlodipine 5mg
   - Dosage: 1 tablet once daily (OD) - morning after breakfast
   - Duration: 30 days. Quantity: 30 tablets
   - Note: Monitor BP weekly

3. Cap Vitamin D3 60,000 IU
   - Dosage: 1 capsule once weekly (every Sunday after lunch)
   - Duration: 8 weeks. Quantity: 8 capsules

Advice & Instructions:
- Maintain daily sodium intake below 2 grams
- 20 minutes gentle walking daily
- Next follow-up visit: 28 October 2026 with recent fasting sugar report`,
  },
  {
    id: "doc-medical-bill",
    title: "Hospital Consultation & Diagnostic Medical Bill",
    tag: "Medical Bill",
    category: "medical_bill",
    preview: `APOLLO MEMORIAL HOSPITAL & DAY CARE
Invoice No: INV-2026-98124 | Date: 12 September 2026
Patient: Senior Patient | Patient ID: PT-7709 | Dept: Cardiology

ITEMIZED CHARGES:
1. Senior Specialist Consultation Fee (Dr. Mehta) - $85.00
2. Digital Resting 12-Lead ECG - $45.00
3. Complete Lipid Profile & Blood Biochemistry - $60.00
4. Hospital Administrative & Sanitation Charge - $10.00
-------------------------------------------------------
Total Billed Amount: $200.00
Senior Citizen Health Discount (15%): -$30.00
Primary Health Insurance Approved Share: -$130.00
-------------------------------------------------------
Patient Co-Pay / Balance Amount Due: $40.00
Payment Status: Pending
Due Date: 25 September 2026
Payment Mode Accepted: Cash, Credit/Debit Card, UPI, Auto-Debit.`,
  },
  {
    id: "doc-lab-report",
    title: "Comprehensive Blood & Lipid Profile Lab Report",
    tag: "Lab/Test Report",
    category: "lab_report",
    preview: `METROPOLIS DIAGNOSTIC LABORATORIES
Specimen Collected: 10 Sep 2026 07:30 AM | Reported: 10 Sep 2026 05:00 PM
Patient Name: Senior Patient (71 Y / Male) | Ref By: Dr. Arvind Mehta

BIOCHEMISTRY & METABOLIC PANEL:
• Fasting Blood Sugar: 128 mg/dL (Normal Range: 70 - 99 mg/dL) [Borderline Elevated]
• HbA1c (Glycated Hemoglobin): 6.8% (Normal: < 5.7%, Fair Control: 6.5 - 7.0%) [Controlled]
• Serum Creatinine: 1.05 mg/dL (Normal: 0.70 - 1.30 mg/dL) [Normal Kidney Function]

LIPID PROFILE:
• Total Cholesterol: 182 mg/dL (Desirable: < 200 mg/dL) [Normal]
• HDL (Good Cholesterol): 52 mg/dL (Protective: > 50 mg/dL) [Optimal]
• LDL (Bad Cholesterol): 98 mg/dL (Optimal: < 100 mg/dL) [Optimal]
• Serum Triglycerides: 160 mg/dL (Normal: < 150 mg/dL) [Mildly Elevated]

Clinical Note: Fasting blood sugar mildly above baseline; HbA1c suggests fair control. Share with treating physician during scheduled follow-up.`,
  },
  {
    id: "doc-pharmacy-bill",
    title: "Wellness Pharmacy Monthly Prescription Bill",
    tag: "Pharmacy Bill",
    category: "pharmacy_bill",
    preview: `WELLNESS CARE PHARMACY & DRUGSTORE
Store #42, Main Market Road | GSTIN / Tax ID: 27AABCT1234F1Z5
Bill / Cash Memo No: PH-55420 | Date: 15 Sep 2026 | Time: 11:24 AM
Doctor: Dr. A. Mehta | Customer: Senior Patient

MEDICINE DISPENSED:
1. Glycomet SR 500mg (Metformin) - 6 Strips x 10 Tabs (60 Tabs)
   Batch: GM-2604 | Expiry: 08/2028 | Price: $14.40
2. Stamlo 5mg (Amlodipine) - 3 Strips x 10 Tabs (30 Tabs)
   Batch: ST-9912 | Expiry: 11/2027 | Price: $8.50
3. Calcirol 60K (Vitamin D3) - 8 Softgels
   Batch: CR-1102 | Expiry: 05/2028 | Price: $12.00
-------------------------------------------------------
Subtotal: $34.90
Senior Care Privilege Rebate (10%): -$3.49
Tax (GST 5%): $1.57
TOTAL AMOUNT CHARGED: $32.98
Amount Paid (Cash): $32.98 | Balance Due: $0.00 (PAID IN FULL)
Pharmacist Note: Take Glycomet with food to avoid stomach upset. Keep out of direct sunlight.`,
  },
  {
    id: "doc-appointment",
    title: "Eye Care Clinic Cataract Follow-up Appointment Slip",
    tag: "Appointment Document",
    category: "appointment",
    preview: `DIVINE EYE & RETINA INSTITUTE
Appointment Confirmation Slip | Booking Ref: EYE-9021
Patient: Senior Patient | Age: 71

APPOINTMENT DETAILS:
• Consulting Specialist: Dr. Radhika Sen, MS Ophthalmology (Cataract & Glaucoma)
• Date: Thursday, 24 September 2026
• Reporting Time: 10:15 AM (Consultation at 10:45 AM)
• Location: Wing B, 3rd Floor, Suite 302, Divine Eye Hospital, Ring Road

PATIENT INSTRUCTIONS BEFORE VISIT:
1. Please bring your existing reading and distance glasses.
2. Pupillary dilation eye drops will be administered; your vision may be blurry for 3-4 hours. Please do not drive; have a family member or attendant accompany you.
3. Bring sunglasses to protect against glare after dilation.
4. If taking glaucoma drops, administer your morning drops as usual.`,
  },
  {
    id: "doc-utility-bill",
    title: "Monthly Electricity Utility Bill",
    tag: "Utility Bill",
    category: "utility_bill",
    preview: "Metro Power Corp - Residential Bill. Account: 8921-409. Billing Period: 15 Aug - 14 Sep. Total Units Consumed: 184 kWh. Current Charges: $38.20. Taxes & Cess: $4.30. Total Amount Due: $42.50. Due Date: 20 September. Late payment surcharge of $3.50 will apply after due date. Pay online safely at official portal or designated post offices.",
  },
];

export const sampleScams = [
  {
    id: "scam1",
    type: "Urgent Electricity Disconnect Threat",
    channel: "SMS",
    sender: "BZ-URGELEC",
    text: "URGENT NOTICE: Dear consumer, your electricity power will be DISCONNECTED tonight at 9:30 PM from the power station because your previous bill was not updated. Immediately call our electricity officer Mr. Sharma at 9876543210 to avoid cutoff.",
    isScam: true,
  },
  {
    id: "scam2",
    type: "Fake Bank KYC Account Block Alert",
    channel: "SMS",
    sender: "VM-HDFCBK",
    text: "Dear Customer, your Bank Account has been SUSPENDED due to pending KYC verification. Please click here http://bit.ly/bank-kyc-verify-urgent to update your PAN and Aadhaar within 2 hours or account will be permanently terminated.",
    isScam: true,
  },
  {
    id: "scam3",
    type: "WhatsApp Relative Impersonation",
    channel: "WhatsApp",
    sender: "+1 (555) 019-2834 (Unknown Number)",
    text: "Hi Grandpa, this is Arjun. My phone fell in water and got ruined so I'm texting from my friend's number. I'm stuck at the clinic and need $250 urgently for prescription. Can you please transfer via this link right away? Don't tell mom yet, I'll pay you back tonight!",
    isScam: true,
  },
  {
    id: "scam4",
    type: "Legitimate Bank Transaction Alert",
    channel: "SMS",
    sender: "HDFCBK",
    text: "Dear Customer, your account ending 4092 has been credited with $450.00 on 18-Sep-2026 by NEFT PENSION. Available balance is $3,210.00. Never share your OTP or PIN with anyone.",
    isScam: false,
  },
];

export const prebuiltTaskGuides: Record<string, DigitalTaskGuide> = {
  "pay-bill": {
    taskTitle: "Paying Your Electricity Bill Online Safely",
    estimatedTime: "5 minutes",
    prerequisites: [
      "Your paper electricity bill with 10-digit Consumer ID",
      "Reading glasses and a quiet, well-lit room",
      "Your bank card or payment app",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Find Your Consumer ID on the Paper Bill",
        instruction: "Look at the very top right of your paper electricity bill. You will see a number labeled 'Consumer Number' or 'Account ID' (usually 8 to 12 digits).",
        tip: "Write this number down on a scrap paper with a bold pen so it's easy to read.",
        safetyCheck: "Ensure you are using the official electricity board website (starts with https://).",
      },
      {
        stepNumber: 2,
        title: "Open the Official Utility Portal",
        instruction: "On your phone or computer, open your trusted electricity board website or your banking app's 'Bills' section.",
        tip: "Never click on random links sent in SMS messages.",
        safetyCheck: "Look for the green lock symbol 🔒 next to the web address.",
      },
      {
        stepNumber: 3,
        title: "Verify the Bill Amount and Name",
        instruction: "Once you type the Consumer ID, the screen will display your name and the bill amount ($42.50). Verify that your name is spelled correctly.",
        tip: "If the amount looks completely different from your paper bill, pause and consult your family.",
        safetyCheck: "Never pay an unknown amount.",
      },
      {
        stepNumber: 4,
        title: "Choose Payment and Enter OTP Carefully",
        instruction: "Select Net Banking or Debit Card. Your bank will send a 6-digit OTP code to your phone. Type this number ONLY in the bank's own window.",
        tip: "Keep the phone close to you so you can hear the SMS ring.",
        safetyCheck: "GOLDEN RULE: Never read this OTP out loud over a phone call to anyone!",
      },
      {
        stepNumber: 5,
        title: "Save or Screenshot the Success Receipt",
        instruction: "When the screen says 'Payment Successful', take a screenshot or write down the 12-digit Transaction ID on your paper bill.",
        tip: "Mitraa automatically marks this bill as paid for your peace of mind!",
        safetyCheck: "You are all done! Close the browser tab comfortably.",
      },
    ],
  },
  "whatsapp-call": {
    taskTitle: "Making a WhatsApp Video Call to Family",
    estimatedTime: "3 minutes",
    prerequisites: [
      "Your smartphone connected to home Wi-Fi",
      "A quiet, comfortable chair with light facing your face",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Open the Green WhatsApp Icon",
        instruction: "Find the round green icon with a white telephone handset on your phone screen and tap it once gently.",
        tip: "A gentle tap is all you need—no need to press hard!",
        safetyCheck: "Ensure you are in a quiet room with good lighting.",
      },
      {
        stepNumber: 2,
        title: "Find Your Family Member's Name",
        instruction: "Tap on the search magnifying glass icon at the top and type 'Priya' or scroll down your chats until you see their photo.",
        tip: "You can also ask Mitraa to dial directly using the trusted contacts list.",
        safetyCheck: "Double-check the contact name before ringing.",
      },
      {
        stepNumber: 3,
        title: "Tap the Video Camera Icon",
        instruction: "At the very top right corner of the chat screen, look for the small Video Camera icon next to the telephone icon. Tap it once.",
        tip: "Hold the phone at eye level so your grandchild can see your warm smile!",
        safetyCheck: "You can switch off video anytime by tapping the red camera icon.",
      },
      {
        stepNumber: 4,
        title: "Enjoy Your Conversation and End Gently",
        instruction: "When you hear the gentle ringing, wait for them to pick up. When you are finished, tap the red telephone button to hang up.",
        tip: "Smile and speak clearly at your normal comfortable volume.",
        safetyCheck: "If the call disconnects, don't worry! They will call you right back.",
      },
    ],
  },
  "life-certificate": {
    taskTitle: "Submitting Digital Life Certificate (Jeevan Pramaan)",
    estimatedTime: "8 minutes",
    prerequisites: [
      "Your Pension Payment Order (PPO) number",
      "Your Aadhaar or National ID number",
      "Good lighting on your face for the camera scan",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Keep Your Documents Ready",
        instruction: "Place your pension book or slip on the table so your PPO number and bank account number are in plain sight.",
        tip: "Have a family member sit nearby if you prefer company during the camera scan.",
        safetyCheck: "Official Jeevan Pramaan app never asks for your bank password or money.",
      },
      {
        stepNumber: 2,
        title: "Open the Jeevan Pramaan / FaceRD App",
        instruction: "Open the official government Jeevan Pramaan app on your phone. Tap 'Operator Authentication' and enter your mobile number.",
        tip: "Enter the OTP received on your mobile.",
        safetyCheck: "Only download apps published by the National Informatics Centre (NIC).",
      },
      {
        stepNumber: 3,
        title: "Face the Camera in Bright Daylight",
        instruction: "Look directly into the front camera. The app will ask you to blink your eyes gently once to confirm you are alive and present.",
        tip: "Sit near a window or well-lit lamp so there are no heavy shadows on your face.",
        safetyCheck: "Do not wear dark sunglasses or face masks during the photo.",
      },
      {
        stepNumber: 4,
        title: "Receive Pramaan ID Confirmation",
        instruction: "Once the camera says 'Scan Successful', a Pramaan ID will appear on the screen and an SMS confirmation will arrive.",
        tip: "Write down the Pramaan ID in your pension diary for the year.",
        safetyCheck: "Your pension continues smoothly without needing to visit the bank branch!",
      },
    ],
  },
  "book-appointment": {
    taskTitle: "Booking a Doctor or Clinic Appointment with Ease",
    estimatedTime: "5 minutes",
    prerequisites: [
      "Name of your doctor or hospital clinic",
      "List of your current medications and symptoms",
      "Pen and paper to write down your appointment time & token number",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Choose Between Phone Call or Online Portal",
        instruction: "Decide whether you want to call the clinic reception directly or use their booking website. Calling is often the simplest and friendliest choice for seniors.",
        tip: "You can use Mitraa's prepared clinic call script to speak confidently.",
        safetyCheck: "Never share credit card PINs or passwords while booking an appointment.",
      },
      {
        stepNumber: 2,
        title: "State Your Doctor's Name & Preferred Time",
        instruction: "Say: 'Hello, I would like to book a consultation with Dr. Arvind Mehta. A morning slot between 10:00 AM and 11:30 AM suits me best.'",
        tip: "Morning slots are usually less delayed than late afternoon slots.",
        safetyCheck: "Ask if someone can accompany you if pupil dilation or blood tests are planned.",
      },
      {
        stepNumber: 3,
        title: "Note Down the Date, Room Number, & Token",
        instruction: "Listen carefully to the receptionist. Write down the confirmed Date, Time, Room Number, and Doctor's name in your notepad.",
        tip: "Ask the receptionist to repeat the token number once more to be sure.",
        safetyCheck: "Ask if you should come on an empty stomach (fasting) for any routine blood work.",
      },
      {
        stepNumber: 4,
        title: "Save in Mitraa & Prepare Your Questions",
        instruction: "Add this visit to your Mitraa Health Organizer so you receive gentle reminders and have your 3 doctor questions ready on visit day.",
        tip: "Mitraa can notify your family caregiver (Priya) so they know your schedule.",
        safetyCheck: "You are all set! Have a glass of water and rest easy.",
      },
    ],
  },
};

export const seniorBankingJargon = [
  {
    term: "OTP (One-Time Password)",
    meaning: "A temporary 4 or 6 digit secret code sent only to your personal mobile phone to verify that it is really you making a payment.",
    goldenRule: "NEVER share this code with anyone over phone or SMS. Bank managers will never ask for it.",
  },
  {
    term: "CVV (Card Verification Value)",
    meaning: "The 3 small digits printed on the BACK of your debit or credit card on the white signature strip.",
    goldenRule: "Keep this number private. Do not let strangers take photos of your card.",
  },
  {
    term: "Auto-Debit / NACH",
    meaning: "An instruction you gave your bank to automatically pay a regular monthly bill (like electricity or insurance) directly from your account.",
    goldenRule: "Check your bank passbook once a month to ensure the amount matches your actual bill.",
  },
  {
    term: "Phishing",
    meaning: "A trick where scammers send fake messages pretending to be your bank, asking you to click a link to steal your password.",
    goldenRule: "If a message says 'Account blocked', do not click. Call the number printed on your physical bank card instead.",
  },
  {
    term: "NEFT / UPI / IMPS",
    meaning: "Safe electronic methods created by banks to transfer money directly from one bank account to another in seconds.",
    goldenRule: "Always double-check the receiver's name before tapping 'Confirm'.",
  },
];
