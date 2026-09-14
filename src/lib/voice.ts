export interface VoiceConduitOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (err: any) => void;
  onStateChange?: (state: 'idle' | 'listening' | 'speaking' | 'disabled') => void;
}

class VoiceManager {
  private isMuted: boolean = false;
  private isListening: boolean = false;
  private recognition: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: VoiceConduitOptions = {};

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (this.listeners.onTranscript) {
            if (finalTranscript) {
              this.listeners.onTranscript(finalTranscript, true);
            } else if (interimTranscript) {
              this.listeners.onTranscript(interimTranscript, false);
            }
          }
        };

        this.recognition.onerror = (e: any) => {
          console.warn('Speech recognition event:', e.error);
          if (this.listeners.onError) {
            this.listeners.onError(e);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.listeners.onStateChange) {
            this.listeners.onStateChange('idle');
          }
        };
      } catch (e) {
        console.warn('Speech recognition initialization bypassed:', e);
      }
    }
  }

  public setListeners(listeners: VoiceConduitOptions) {
    this.listeners = listeners;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
      this.stopListening();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public speak(text: string, onEnd?: () => void): void {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95; // Slightly deeper, authoritative cybernetic cadence

      // Pick an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.listeners.onStateChange) {
          this.listeners.onStateChange(this.isListening ? 'listening' : 'idle');
        }
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      if (this.listeners.onStateChange) {
        this.listeners.onStateChange('speaking');
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public startListening(): boolean {
    if (this.isMuted || !this.recognition) return false;
    try {
      this.recognition.start();
      this.isListening = true;
      if (this.listeners.onStateChange) {
        this.listeners.onStateChange('listening');
      }
      return true;
    } catch (e) {
      console.warn('Speech recognition start error:', e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      if (this.listeners.onStateChange) {
        this.listeners.onStateChange('idle');
      }
    }
  }

  public isRecognitionSupported(): boolean {
    return !!this.recognition;
  }
}

export const voiceConduit = new VoiceManager();
