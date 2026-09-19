import React, { useState } from "react";
import {
  HeartPulse,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Volume2,
  Sparkles,
  FileSpreadsheet,
  Activity,
  User,
  MapPin,
  Check,
  RotateCcw,
} from "lucide-react";
import { Medicine, DoctorAppointment, VitalLog, SeniorProfile } from "../types";
import { speechHelper } from "../utils/speech";

interface HealthOrganizerProps {
  medicines: Medicine[];
  onToggleMedicine: (id: string) => void;
  appointments: DoctorAppointment[];
  vitals: VitalLog[];
  onAddVital: (vital: Omit<VitalLog, "id">) => void;
  profile: SeniorProfile;
}

export const HealthOrganizer: React.FC<HealthOrganizerProps> = ({
  medicines,
  onToggleMedicine,
  appointments,
  vitals,
  onAddVital,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<"pills" | "appointments" | "vitals">("pills");
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [sugar, setSugar] = useState<number>(110);
  const [mealContext, setMealContext] = useState<"Fasting" | "Post Meal">("Fasting");
  const [vitalNotes, setVitalNotes] = useState<string>("");
  const [showVitalSuccess, setShowVitalSuccess] = useState<boolean>(false);

  const pendingMedicines = medicines.filter((m) => !m.takenToday);

  const handleLogVital = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVital({
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      bloodSugar: Number(sugar),
      mealContext,
      notes: vitalNotes.trim() || undefined,
    });
    setVitalNotes("");
    setShowVitalSuccess(true);
    setTimeout(() => setShowVitalSuccess(false), 3000);
  };

  const readPillSchedule = () => {
    if (pendingMedicines.length === 0) {
      speechHelper.speak("You have taken all your scheduled medicines for today. Wonderful work!", {
        rate: profile.voiceSpeed,
        language: profile.language,
      });
      return;
    }
    const pillNames = pendingMedicines.map((m) => `${m.name} for ${m.timeSlot}`).join(", ");
    speechHelper.speak(
      `You have ${pendingMedicines.length} medicines remaining today: ${pillNames}. Please remember to take them on time.`,
      { rate: profile.voiceSpeed, language: profile.language }
    );
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: "Optimal / Normal", color: "text-emerald-700 bg-emerald-100" };
    if (sys <= 129 && dia < 80) return { label: "Elevated", color: "text-amber-700 bg-amber-100" };
    if (sys <= 139 || dia <= 89) return { label: "Stage 1", color: "text-amber-800 bg-amber-200" };
    return { label: "High / Consult Doctor", color: "text-rose-700 bg-rose-100" };
  };

  return (
    <div id="health-organizer-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Senior Health & Medicine Organizer
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-medium">
                Keep track of daily medications, doctor appointments, and blood pressure records in one clear place.
              </p>
            </div>
          </div>

          <button
            onClick={readPillSchedule}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-sm border border-emerald-300 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>Read Pill Reminders</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-stone-100 pb-1">
          <button
            onClick={() => setActiveTab("pills")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "pills"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            💊 Today's Pill Box ({medicines.filter((m) => m.takenToday).length}/{medicines.length})
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "appointments"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            👨‍⚕️ Doctor Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("vitals")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer min-h-[44px] ${
              activeTab === "vitals"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            📊 BP & Sugar Vitals
          </button>
        </div>
      </div>

      {/* Tab 1: Today's Pill Box */}
      {activeTab === "pills" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className={`p-5 rounded-3xl border-2 transition shadow-xs flex flex-col justify-between ${
                  med.takenToday
                    ? "bg-emerald-50/70 border-emerald-300"
                    : "bg-white border-stone-200 hover:border-amber-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                      {med.timeSlot} • {med.timeLabel}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                        med.takenToday
                          ? "bg-emerald-200 text-emerald-900 border-emerald-400"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {med.takenToday ? "✓ Taken" : "Pending"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-emerald-700" />
                    {med.name}
                  </h3>
                  <div className="text-sm font-bold text-emerald-800 mt-0.5">{med.dosage}</div>
                  <p className="text-stone-600 text-sm mt-2 font-medium leading-relaxed">
                    {med.instructions}
                  </p>
                  {med.doctorNotes && (
                    <p className="text-xs text-stone-500 mt-1 italic">
                      Note from doctor: {med.doctorNotes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">
                    Remaining: {med.remainingPills} pills
                  </span>

                  <button
                    onClick={() => onToggleMedicine(med.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-sm transition active:scale-95 cursor-pointer shadow-xs min-h-[44px] ${
                      med.takenToday
                        ? "bg-stone-200 hover:bg-stone-300 text-stone-800"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {med.takenToday ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Undo / Mark Not Taken</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mark as Taken</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Appointments & Questions */}
      {activeTab === "appointments" && (
        <div className="space-y-4 animate-fadeIn">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {apt.specialty}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{apt.doctorName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-600 font-semibold">
                    <span className="flex items-center gap-1.5 text-stone-900">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      {apt.date} at {apt.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      {apt.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    speechHelper.speak(
                      `Appointment with ${apt.doctorName} on ${apt.date}. Questions to ask include: ${apt.questionsToAsk.join(". ")}`,
                      { rate: profile.voiceSpeed, language: profile.language }
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer min-h-[40px]"
                >
                  <Volume2 className="w-4 h-4 text-stone-700" />
                  <span>Read Questions</span>
                </button>
              </div>

              {/* Questions to Ask Doctor Checklist */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" /> Questions Prepared for This Visit:
                </h4>
                <ul className="space-y-1.5">
                  {apt.questionsToAsk.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-medium text-stone-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: BP & Blood Sugar Log */}
      {activeTab === "vitals" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Fast Logger Form */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h3 className="text-xl font-extrabold text-stone-900 mb-1 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-700" />
              Log Blood Pressure or Blood Sugar
            </h3>
            <p className="text-xs text-stone-500 font-medium mb-4">
              Enter your morning reading from your home monitor
            </p>

            <form onSubmit={handleLogVital} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Systolic BP (Top Number)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    min={70}
                    max={220}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">Standard: around 120</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Diastolic BP (Bottom Number)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    min={40}
                    max={140}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">Standard: around 80</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    min={50}
                    max={400}
                    className="w-full p-3 rounded-xl border border-stone-300 font-bold text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400">Fasting: 80 - 120</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Reading Timing
                  </label>
                  <select
                    value={mealContext}
                    onChange={(e) => setMealContext(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Fasting">Fasting (Before Breakfast)</option>
                    <option value="Post Meal">Post Meal (2 hrs after food)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Notes (How did you feel?)
                  </label>
                  <input
                    type="text"
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder="e.g. Felt energetic, light morning walk done"
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {showVitalSuccess ? (
                  <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5" /> Reading saved successfully!
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md transition active:scale-95 cursor-pointer min-h-[48px]"
                >
                  Save Vitals Reading
                </button>
              </div>
            </form>
          </div>

          {/* Past Vitals History */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
            <h4 className="font-black text-lg text-stone-900 mb-3">Recent Health Readings</h4>
            <div className="space-y-3">
              {vitals.map((v) => {
                const status = getBPStatus(v.systolicBP, v.diastolicBP);
                return (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-500 block">
                        {v.date} at {v.time}
                      </span>
                      <div className="font-extrabold text-lg text-stone-900 mt-0.5">
                        BP: {v.systolicBP}/{v.diastolicBP} mmHg{" "}
                        {v.bloodSugar && (
                          <span className="text-sm font-semibold text-stone-700 ml-2">
                            • Sugar: {v.bloodSugar} mg/dL ({v.mealContext})
                          </span>
                        )}
                      </div>
                      {v.notes && (
                        <p className="text-xs text-stone-600 mt-1 font-medium">{v.notes}</p>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
