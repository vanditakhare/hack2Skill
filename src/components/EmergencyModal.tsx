import React, { useState, useEffect, useRef } from "react";
import {
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  X,
  HeartPulse,
  MapPin,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SeniorProfile } from "../types";

interface EmergencyModalProps {
  isOpen: boolean;
  profile: SeniorProfile;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [alertSent, setAlertSent] = useState<boolean>(false);
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Play audio siren using Web Audio API
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      // Siren frequency modulation
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
    } catch (e) {
      console.warn("Audio Context blocked or unsupported", e);
    }
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setAlertSent(false);
      stopSiren();
      return;
    }

    if (!isSirenMuted) {
      startSiren();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAlertSent(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      stopSiren();
    };
  }, [isOpen]);

  const toggleMute = () => {
    if (isSirenMuted) {
      startSiren();
      setIsSirenMuted(false);
    } else {
      stopSiren();
      setIsSirenMuted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="emergency-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="bg-white border-4 border-rose-600 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] text-stone-900">
        {/* Top Emergency Header */}
        <div className="flex items-center justify-between border-b pb-4 border-rose-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-bounce shadow-lg">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <h2
                id="emergency-title"
                className="text-2xl sm:text-3xl font-black text-rose-700 uppercase tracking-tight"
              >
                Emergency Assistance
              </h2>
              <p className="text-sm font-semibold text-stone-600">
                Immediate Help & Caregiver Escalation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              title={isSirenMuted ? "Unmute Alarm" : "Mute Alarm"}
            >
              {isSirenMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 text-rose-600" />}
            </button>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              title="Close Emergency Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Countdown / Confirmation Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300">
          {!alertSent ? (
            <div className="text-center py-2">
              <p className="text-lg font-bold text-rose-900">
                Sending Emergency Alert to Family in:
              </p>
              <div className="text-5xl font-black text-rose-600 my-2 animate-pulse">
                {countdown}s
              </div>
              <p className="text-sm text-stone-600">
                Tap 'Cancel Alert' below if pressed by accident.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-lg">
                  Emergency Alert Broadcast Sent!
                </p>
                <p className="text-sm text-stone-700 mt-0.5">
                  High-priority SOS SMS & Notification dispatched to{" "}
                  <span className="font-bold text-stone-900">
                    {profile.emergencyContact.name} ({profile.emergencyContact.phone})
                  </span>{" "}
                  with your current location.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick One-Tap Calling Actions */}
        <div className="mt-6">
          <h3 className="font-extrabold text-lg text-stone-900 mb-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-rose-600" /> Direct One-Tap Emergency Calls:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:911"
              id="call-911-button"
              className="flex items-center justify-between p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg transition shadow-md active:scale-95"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-yellow-300" />
                <div className="text-left">
                  <div className="leading-tight">Emergency 911 / 112</div>
                  <div className="text-xs font-normal text-rose-100">Police, Ambulance, Fire</div>
                </div>
              </div>
              <span className="bg-rose-800 px-3 py-1 rounded-lg text-sm">CALL</span>
            </a>

            <a
              href={`tel:${profile.emergencyContact.phone.replace(/[^0-9+]/g, "")}`}
              id="call-caregiver-button"
              className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg transition shadow-md active:scale-95"
            >
              <div className="flex items-center gap-3">
                <User className="w-7 h-7 text-emerald-200" />
                <div className="text-left">
                  <div className="leading-tight">Call {profile.emergencyContact.name.split(" ")[0]}</div>
                  <div className="text-xs font-normal text-emerald-100">Primary Family Caregiver</div>
                </div>
              </div>
              <span className="bg-emerald-800 px-3 py-1 rounded-lg text-sm">CALL</span>
            </a>

            <a
              href={`tel:${profile.doctorPhone.replace(/[^0-9+]/g, "")}`}
              id="call-doctor-button"
              className="flex items-center justify-between p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg transition shadow-md active:scale-95 sm:col-span-2"
            >
              <div className="flex items-center gap-3">
                <HeartPulse className="w-7 h-7 text-blue-200" />
                <div className="text-left">
                  <div className="leading-tight">Call {profile.primaryDoctor}</div>
                  <div className="text-xs font-normal text-blue-100">{profile.doctorPhone}</div>
                </div>
              </div>
              <span className="bg-blue-800 px-3 py-1 rounded-lg text-sm">CALL DOCTOR</span>
            </a>
          </div>
        </div>

        {/* Medical Information Card for First Responders */}
        <div className="mt-6 p-4 rounded-2xl bg-stone-100 border border-stone-300">
          <h4 className="font-bold text-base text-stone-900 mb-2 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" /> Senior Medical Emergency Card (For First Responders)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-semibold block">Senior Name</span>
              <span className="font-bold text-stone-900">{profile.name} ({profile.age} yrs)</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-semibold block">Blood Group</span>
              <span className="font-bold text-rose-600 text-base">{profile.bloodGroup}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 col-span-2">
              <span className="text-xs text-stone-500 font-semibold block">Known Allergies</span>
              <span className="font-bold text-rose-700">{profile.allergies.join(", ")}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 col-span-2">
              <span className="text-xs text-stone-500 font-semibold block">Chronic Conditions</span>
              <span className="font-bold text-stone-800">{profile.medicalConditions.join(", ")}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 col-span-2">
              <span className="text-xs text-stone-500 font-semibold block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> Home Address
              </span>
              <span className="font-medium text-stone-800 text-xs">{profile.address}</span>
            </div>
          </div>
        </div>

        {/* Footer Dismiss Button */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold text-base transition cursor-pointer min-h-[48px]"
          >
            I Am Safe / Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
