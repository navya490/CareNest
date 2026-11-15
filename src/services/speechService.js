// Audio & Speech Synthesis Service for CareNest

class SpeechAudioService {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    if (this.speechSynth) {
      this.speechSynth.onvoiceschanged = () => {
        this.voices = this.speechSynth.getVoices();
      };
    }
  }

  // Initialize Web Audio Context on first user gesture
  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Delightful harmonic chime when marking medication as taken
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Play a calming 3-note ascending chord (E5, G#5, B5)
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0, now + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.6);
      });
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
    }
  }

  // Gentle alert chime for notifications or missed dose alerts
  playAlertChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [587.33, 440.00]; // D5 then A4
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.15);

        gain.gain.setValueAtTime(0, now + index * 0.15);
        gain.gain.linearRampToValueAtTime(0.12, now + index * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.5);
      });
    } catch (e) {
      console.warn('Alert audio playback failed:', e);
    }
  }

  // Speak text out loud in a warm, patient voice
  speak(text, onEnd) {
    if (!this.speechSynth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Slightly slower for elderly comprehension
    utterance.pitch = 1.05; // Friendly and clear

    if (this.voices.length === 0) {
      this.voices = this.speechSynth.getVoices();
    }

    // Prefer clear English voices
    const preferredVoice = this.voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen'))
    ) || this.voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.speechSynth.speak(utterance);
  }

  stopSpeaking() {
    if (this.speechSynth && this.speechSynth.speaking) {
      this.speechSynth.cancel();
    }
  }

  isSpeaking() {
    return this.speechSynth ? this.speechSynth.speaking : false;
  }
}

export const soundService = new SpeechAudioService();
