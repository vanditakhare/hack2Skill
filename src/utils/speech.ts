// Web Speech API wrapper for senior-friendly voice interaction

class SpeechHelper {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(
    text: string,
    options?: {
      rate?: number; // 0.8 to 1.0 for senior comfort
      pitch?: number;
      language?: string;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn("Speech synthesis not supported in this browser");
      options?.onEnd?.();
      return;
    }

    // Stop previous utterance
    this.stop();

    // Clean text of markdown asterisks or code formatting for clear natural speech
    const cleanText = text
      .replace(/[*_#`~]/g, "")
      .replace(/https?:\/\/\S+/g, "a website link")
      .trim();

    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 0.88; // Slightly gentle, senior-friendly pace
    utterance.pitch = options?.pitch || 1.0;

    // Pick appropriate voice for language if available
    const voices = this.synth.getVoices();
    if (options?.language) {
      const langPrefix = options.language.toLowerCase().slice(0, 2);
      const matchedVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      this.currentUtterance = null;
      options?.onError?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechHelper = new SpeechHelper();

// Gentle Meditative Chime Synthesizer for Senior Calmness & Breathing
export const playCalmChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Meditative harmonious chord: 370Hz (F#4), 440Hz (A4), 554Hz (C#5), 740Hz (F#5)
    const freqs = [370, 440, 554.37, 740];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + 3.5);
    });
  } catch (e) {
    console.warn("Could not play soothing chime", e);
  }
};

// Speech Recognition helper
export const createSpeechRecognizer = (
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void,
  language = "en-US"
) => {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported in this browser");
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        onResult(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (err) {
    console.warn("Failed to create SpeechRecognition", err);
    return null;
  }
};
