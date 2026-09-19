/**
 * Soothing Sounds Audio Engine for Mitraa Calm Breath
 * Uses Web Audio API to synthesize gentle, high-fidelity relaxation sounds
 * 100% offline, zero network dependencies, completely user-controlled.
 */

export type SoothingSoundId = "none" | "rain" | "ocean" | "forest" | "birds" | "meditation";

export interface SoothingSoundOption {
  id: SoothingSoundId;
  name: string;
  icon: string;
  description: string;
}

export const SOOTHING_SOUND_OPTIONS: SoothingSoundOption[] = [
  {
    id: "none",
    name: "Sound Off",
    icon: "🔇",
    description: "Quiet, silent breathing",
  },
  {
    id: "rain",
    name: "Gentle Rain",
    icon: "🌧️",
    description: "Soft rain tapping on leaves",
  },
  {
    id: "ocean",
    name: "Calm Ocean Waves",
    icon: "🌊",
    description: "Slow, rolling peaceful surf",
  },
  {
    id: "forest",
    name: "Forest & Nature",
    icon: "🌲",
    description: "Gentle breeze through pine trees",
  },
  {
    id: "birds",
    name: "Soft Birds",
    icon: "🐦",
    description: "Peaceful morning garden chirps",
  },
  {
    id: "meditation",
    name: "Gentle Meditation",
    icon: "🎵",
    description: "Harmonious warm singing bowl & Om drone",
  },
];

export const getLocalizedSoundText = (soundId: SoothingSoundId, language: string) => {
  const lang = (language || "English").toLowerCase();
  
  if (lang.includes("hindi")) {
    switch (soundId) {
      case "rain": return { name: "शांत हल्की बारिश", desc: "पत्तों पर गिरती धीमी फुहारें" };
      case "ocean": return { name: "शांत सागर की लहरें", desc: "समुद्र की धीमी और सुकूनभरी लहरें" };
      case "forest": return { name: "वन और प्रकृति", desc: "वृक्षों में सरसराती ठंडी मंद बयार" };
      case "birds": return { name: "चहचहाती चिड़िया", desc: "सुबह के बगीचे में पक्षियों का मीठा कलरव" };
      case "meditation": return { name: "ध्यान व ॐ धुन", desc: "मन को एकाग्र करने वाली सौम्य ॐ तरंगें" };
      case "none": default: return { name: "ध्वनि बंद", desc: "शांत व मौन श्वास" };
    }
  }

  if (lang.includes("spanish")) {
    switch (soundId) {
      case "rain": return { name: "Lluvia suave", desc: "Gotas suaves sobre las hojas" };
      case "ocean": return { name: "Olas serenas", desc: "El suave vaivén del mar" };
      case "forest": return { name: "Bosque y naturaleza", desc: "Brisa fresca entre los árboles" };
      case "birds": return { name: "Aves suaves", desc: "Canto apacible de aves mañaneras" };
      case "meditation": return { name: "Música meditativa", desc: "Tonos armónicos y relajantes" };
      case "none": default: return { name: "Sin sonido", desc: "Respiración en silencio" };
    }
  }

  if (lang.includes("tamil")) {
    switch (soundId) {
      case "rain": return { name: "மெல்லிய மழை", desc: "இலைகளில் விழும் மென்மையான தூறல்" };
      case "ocean": return { name: "அமைதியான அலைகள்", desc: "கடலின் மெதுவான அலை ஓசை" };
      case "forest": return { name: "காடு மற்றும் இயற்கை", desc: "மரங்களின் இடையே வீசும் தென்றல்" };
      case "birds": return { name: "பறவைகளின் ஓசை", desc: "காலை நேரத்து இனிமையான பறவை ஒலி" };
      case "meditation": return { name: "தியான இசை", desc: "மனதை அமைதிப்படுத்தும் ஓம் நாதம்" };
      case "none": default: return { name: "ஒலி வேண்டாம்", desc: "அமைதியான மூச்சு" };
    }
  }

  if (lang.includes("bengali")) {
    switch (soundId) {
      case "rain": return { name: "শান্ত বৃষ্টি", desc: "পাতায় ঝরে পড়া মিষ্টি বৃষ্টির শব্দ" };
      case "ocean": return { name: "শান্ত সমুদ্রের ঢেউ", desc: "সমুদ্রের ধীর ও শান্ত ঢেউ" };
      case "forest": return { name: "অরণ্য ও প্রকৃতি", desc: "গাছের ভেতর দিয়ে মৃদু বাতাস" };
      case "birds": return { name: "পাখির কলকাকলি", desc: "সকালের শান্ত পাখির মিষ্টি ডাক" };
      case "meditation": return { name: "ধ্যান সঙ্গীত", desc: "শান্তিময় ওম ও মেডিটেশন সুর" };
      case "none": default: return { name: "শব্দ বন্ধ", desc: "নীরব শান্ত শ্বাস" };
    }
  }

  if (lang.includes("telugu")) {
    switch (soundId) {
      case "rain": return { name: "చిరుజల్లులు", desc: "ఆకులపై పడే మృదువైన వాన చినుకులు" };
      case "ocean": return { name: "సముద్రపు అలలు", desc: "నెమ్మదిగా కదిలే ప్రశాంత అలల ధ్వని" };
      case "forest": return { name: "అడవి & ప్రకృతి", desc: "చెట్ల మధ్య వీచే చల్లని పిల్లగాలి" };
      case "birds": return { name: "పక్షుల కిలకిలలు", desc: "ఉదయపు ఆహ్లాదకరమైన పక్షుల స్వరం" };
      case "meditation": return { name: "ధ్యాన సంగీతం", desc: "ప్రశాంతమైన ఓం నాద తరంగాలు" };
      case "none": default: return { name: "శబ్దం వద్దు", desc: "ప్రశాంత నిశ్శబ్ద శ్వాస" };
    }
  }

  if (lang.includes("marathi")) {
    switch (soundId) {
      case "rain": return { name: "मंद पाऊस", desc: "पानांवर टपटपणारा हलका पाऊस" };
      case "ocean": return { name: "शांत लाटा", desc: "समुद्राच्या संथ आणि शांत लाटा" };
      case "forest": return { name: "जंगल व निसर्ग", desc: "झाडांमधून वाहणारी मंद झुळूक" };
      case "birds": return { name: "पक्ष्यांचे गुंजन", desc: "सकाळच्या पक्ष्यांचे मंजूळ गाणे" };
      case "meditation": return { name: "ध्यान संगीत", desc: "मन शांत करणारी ॐ ची धून" };
      case "none": default: return { name: "आवाज बंद", desc: "शांत व मौन श्वास" };
    }
  }

  if (lang.includes("gujarati")) {
    switch (soundId) {
      case "rain": return { name: "ધીમો વરસાદ", desc: "પાંદડાં પર પડતાં વરસાદનાં ફોરાં" };
      case "ocean": return { name: "શાંત મોજાં", desc: "દરિયાનાં ધીમા અને શાંત મોજાં" };
      case "forest": return { name: "જંગલ અને પ્રકૃતિ", desc: "વૃક્ષો વચ્ચે વહેતો મંદ પવન" };
      case "birds": return { name: "પંખીઓનો કલરવ", desc: "સવારના પક્ષીઓનો મીઠો અવાજ" };
      case "meditation": return { name: "ધ્યાન સંગીત", desc: "મનને શાંત કરતો ॐ ધ્વનિ" };
      case "none": default: return { name: "અવાજ બંધ", desc: "શાંત અને મૌન શ્વાસ" };
    }
  }

  // English fallback
  switch (soundId) {
    case "rain": return { name: "Gentle Rain", desc: "Soft rain tapping on leaves" };
    case "ocean": return { name: "Calm Ocean Waves", desc: "Slow, rolling peaceful surf" };
    case "forest": return { name: "Forest & Nature", desc: "Gentle breeze through pine trees" };
    case "birds": return { name: "Soft Birds", desc: "Peaceful morning garden chirps" };
    case "meditation": return { name: "Gentle Meditation", desc: "Harmonious warm singing bowl & Om drone" };
    case "none": default: return { name: "Sound Off", desc: "Quiet, silent breathing" };
  }
};

export const getCalmSectionLabels = (language: string) => {
  const lang = (language || "English").toLowerCase();

  if (lang.includes("hindi")) {
    return {
      title: "शांत श्वास व ध्यान",
      subtitle: "सुखद व गहरी सांस लें, मन को शांति और ताजगी दें",
      soothingSoundsTitle: "सुखद व शांत ध्वनियां (Soothing Sounds)",
      soothingSoundsDesc: "अपनी पसंद की धीमी प्राकृतिक ध्वनि चुनें (वैकल्पिक)",
      volumeLabel: "ध्वनि स्तर (Volume)",
      nowPlaying: "बज रहा है:",
      btnStopSound: "ध्वनि बंद करें",
      btnRepeatCycle: "दोबारा श्वास लें",
      btnPause: "रोकें",
      btnResume: "जारी रखें",
      cycleCount: "चक्र",
      softPreset: "धीमा",
      mediumPreset: "मध्यम",
      richPreset: "स्पष्ट",
      tip: "💡 सांस लेते समय पेट को धीरे से फूलने दें और छोड़ते समय आराम महसूस करें।",
    };
  }

  if (lang.includes("spanish")) {
    return {
      title: "Respiración Serena",
      subtitle: "Inhala paz y exhala tensiones a tu propio ritmo",
      soothingSoundsTitle: "Sonidos Relajantes (Soothing Sounds)",
      soothingSoundsDesc: "Elige un sonido natural de fondo para relajarte (opcional)",
      volumeLabel: "Volumen",
      nowPlaying: "Sonando:",
      btnStopSound: "Detener sonido",
      btnRepeatCycle: "Repetir ciclo",
      btnPause: "Pausar",
      btnResume: "Reanudar",
      cycleCount: "Ciclo",
      softPreset: "Suave",
      mediumPreset: "Medio",
      richPreset: "Claro",
      tip: "💡 Inhala profundamente por la nariz y exhala despacio sintiendo tranquilidad.",
    };
  }

  return {
    title: "Calm Breath & Relaxation",
    subtitle: "Inhale peace, hold gently, and exhale all tension at your comfortable pace",
    soothingSoundsTitle: "Soothing Sounds (Relaxing Sounds)",
    soothingSoundsDesc: "Optional gentle background sounds to make your breathing more peaceful",
    volumeLabel: "Sound Volume",
    nowPlaying: "Now playing:",
    btnStopSound: "Mute Sound",
    btnRepeatCycle: "Next Cycle",
    btnPause: "Pause",
    btnResume: "Resume",
    cycleCount: "Cycle",
    softPreset: "Soft (30%)",
    mediumPreset: "Comfort (60%)",
    richPreset: "Clear (90%)",
    tip: "💡 Tip: Let your shoulders drop comfortably and breathe naturally without straining.",
  };
};

class SoothingSoundsEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSound: SoothingSoundId = "none";
  private activeNodes: { stop?: () => void; intervalId?: any }[] = [];
  private volume: number = 0.6; // 0 to 1

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): SoothingSoundId {
    return this.currentSound;
  }

  public stop() {
    this.activeNodes.forEach((item) => {
      if (item.intervalId) clearInterval(item.intervalId);
      if (item.stop) {
        try {
          item.stop();
        } catch (e) {}
      }
    });
    this.activeNodes = [];
    this.currentSound = "none";
  }

  public play(sound: SoothingSoundId) {
    this.stop();
    if (sound === "none") return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    this.currentSound = sound;

    switch (sound) {
      case "rain":
        this.startRain(ctx, this.masterGain);
        break;
      case "ocean":
        this.startOcean(ctx, this.masterGain);
        break;
      case "forest":
        this.startForest(ctx, this.masterGain);
        break;
      case "birds":
        this.startBirds(ctx, this.masterGain);
        break;
      case "meditation":
        this.startMeditation(ctx, this.masterGain);
        break;
    }
  }

  /**
   * Helper: Generate a seamless looping pink/brown noise buffer
   */
  private createNoiseBuffer(ctx: AudioContext, seconds = 3, type: "pink" | "brown" = "pink"): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "brown") {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else {
        // Pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  /**
   * 1. 🌧️ Gentle Rain
   * Soft pink noise through a resonant lowpass filter + random gentle droplet clicks
   */
  private startRain(ctx: AudioContext, output: AudioNode) {
    const noiseBuffer = this.createNoiseBuffer(ctx, 3, "pink");
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(850, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();

    // Occasional tiny soft droplet sounds
    const dropInterval = setInterval(() => {
      if (this.currentSound !== "rain") return;
      try {
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        const dropFilter = ctx.createBiquadFilter();

        const dropFreq = 1400 + Math.random() * 1200;
        dropOsc.type = "sine";
        dropOsc.frequency.setValueAtTime(dropFreq, ctx.currentTime);
        dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.7, ctx.currentTime + 0.08);

        dropFilter.type = "bandpass";
        dropFilter.frequency.setValueAtTime(dropFreq, ctx.currentTime);
        dropFilter.Q.setValueAtTime(4, ctx.currentTime);

        dropGain.gain.setValueAtTime(0, ctx.currentTime);
        dropGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

        dropOsc.connect(dropFilter);
        dropFilter.connect(dropGain);
        dropGain.connect(output);

        dropOsc.start();
        dropOsc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }, 180);

    this.activeNodes.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      },
      intervalId: dropInterval,
    });
  }

  /**
   * 2. 🌊 Calm Ocean Waves
   * Brown noise shaped by periodic wave swell LFO on volume and cutoff filter
   */
  private startOcean(ctx: AudioContext, output: AudioNode) {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4, "brown");
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();

    // Ocean swell cycle: 8 seconds (4s rising wave, 4s receding)
    let wavePhase = 0;
    const swellInterval = setInterval(() => {
      if (this.currentSound !== "ocean") return;
      try {
        wavePhase += 0.25;
        // Sinusoidal wave envelope
        const swell = (Math.sin(wavePhase * (Math.PI / 4)) + 1) / 2; // 0 to 1
        const targetGain = 0.08 + swell * 0.32;
        const targetFreq = 180 + swell * 480;

        gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.6);
        filter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.8);
      } catch (e) {}
    }, 500);

    this.activeNodes.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      },
      intervalId: swellInterval,
    });
  }

  /**
   * 3. 🌲 Forest & Nature
   * Soft wind through trees with gentle organic leaves rustle
   */
  private startForest(ctx: AudioContext, output: AudioNode) {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4, "pink");
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();

    // Gentle slow organic breeze sway
    let breezeStep = 0;
    const breezeInterval = setInterval(() => {
      if (this.currentSound !== "forest") return;
      try {
        breezeStep += 0.2;
        const breeze = Math.sin(breezeStep) * 0.5 + 0.5;
        gain.gain.setTargetAtTime(0.12 + breeze * 0.16, ctx.currentTime, 1.2);
        filter.frequency.setTargetAtTime(320 + breeze * 240, ctx.currentTime, 1.5);
      } catch (e) {}
    }, 800);

    this.activeNodes.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      },
      intervalId: breezeInterval,
    });
  }

  /**
   * 4. 🐦 Soft Birds
   * Gentle forest background with occasional delicate, sweet birds chirping
   */
  private startBirds(ctx: AudioContext, output: AudioNode) {
    // 1. Light background forest bed
    const noiseBuffer = this.createNoiseBuffer(ctx, 3, "pink");
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();

    // 2. Play a gentle, sweet bird chirp phrase
    const playChirpPhrase = () => {
      if (this.currentSound !== "birds") return;
      try {
        const chirpsCount = 2 + Math.floor(Math.random() * 2);
        const baseFreq = 2200 + Math.random() * 800;

        for (let i = 0; i < chirpsCount; i++) {
          const chirpTime = ctx.currentTime + i * 0.14;
          const osc = ctx.createOscillator();
          const chirpGain = ctx.createGain();

          osc.type = "sine";
          // Sweet gentle chirp frequency inflection
          osc.frequency.setValueAtTime(baseFreq, chirpTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, chirpTime + 0.04);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, chirpTime + 0.09);

          chirpGain.gain.setValueAtTime(0, chirpTime);
          chirpGain.gain.linearRampToValueAtTime(0.045, chirpTime + 0.02);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.1);

          osc.connect(chirpGain);
          chirpGain.connect(output);

          osc.start(chirpTime);
          osc.stop(chirpTime + 0.12);
        }
      } catch (e) {}
    };

    // Play first chirp soon, then randomly every 2.5 - 4.5 seconds
    playChirpPhrase();
    const birdInterval = setInterval(() => {
      if (Math.random() > 0.25) {
        playChirpPhrase();
      }
    }, 2800);

    this.activeNodes.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      },
      intervalId: birdInterval,
    });
  }

  /**
   * 5. 🎵 Gentle Meditation / Ambient Sound
   * Deep harmonious resonant Om drone chords and warm singing bowl harmonics
   */
  private startMeditation(ctx: AudioContext, output: AudioNode) {
    // Sacred Om meditative chord frequencies:
    // 136.1Hz (Om fundamental), 272.2Hz (octave), 408.3Hz (fifth), 544.4Hz
    const freqs = [136.1, 272.2, 408.3, 544.4];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Slight detune for warm, rich chorus effect
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.3 : 0), ctx.currentTime);

      const amp = 0.14 / (idx + 1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(amp, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(output);
      osc.start();

      oscs.push(osc);
      gains.push(gain);
    });

    // Gentle pulsing singing-bowl shimmer
    let phase = 0;
    const pulseInterval = setInterval(() => {
      if (this.currentSound !== "meditation") return;
      try {
        phase += 0.2;
        const shimmer = Math.sin(phase) * 0.03;
        if (gains[0]) {
          gains[0].gain.setTargetAtTime(0.12 + shimmer, ctx.currentTime, 0.4);
        }
      } catch (e) {}
    }, 500);

    this.activeNodes.push({
      stop: () => {
        oscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
      },
      intervalId: pulseInterval,
    });
  }
}

export const soothingSoundsEngine = new SoothingSoundsEngine();
