import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Mic, Sparkles, Radio, MessageSquareText } from 'lucide-react';
import { OrbRenderer } from '../canvas/orb';
import { voiceConduit } from '../lib/voice';

interface OrbOfTheOratorProps {
  onTriggerInquest?: () => void;
  onOpenVoiceConduit?: () => void;
}

export const OrbOfTheOrator: React.FC<OrbOfTheOratorProps> = ({
  onTriggerInquest,
  onOpenVoiceConduit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<OrbRenderer | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [oratorMessage, setOratorMessage] = useState<string>(
    "I am the Orator. The acoustic conscience and sovereign voice of the Forge. Ready for cognitive discovery."
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new OrbRenderer(canvasRef.current);
    rendererRef.current = renderer;
    renderer.start();

    voiceConduit.setListeners({
      onStateChange: (state) => {
        setIsSpeaking(state === 'speaking');
        setIsListening(state === 'listening');
        if (rendererRef.current) {
          rendererRef.current.updateOptions({
            isSpeaking: state === 'speaking',
            isListening: state === 'listening'
          });
        }
      },
      onTranscript: (text) => {
        setOratorMessage(`Transcribed: "${text}"`);
      }
    });

    return () => {
      renderer.destroy();
    };
  }, []);

  const handleSpeakSample = (phrase: string) => {
    setOratorMessage(phrase);
    voiceConduit.speak(phrase);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-neutral-950/70 border border-neutral-800 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Subtle top indicator */}
      <div className="absolute top-3 left-4 flex items-center gap-2 text-[11px] font-mono-cyber text-neutral-400">
        <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : isListening ? 'bg-cyan-400 animate-pulse' : 'bg-amber-600'}`} />
        <span>ACOUSTIC ORATOR // {isSpeaking ? 'TRANSMITTING' : isListening ? 'LISTENING' : 'RESONATING'}</span>
      </div>

      {/* Canvas Orb Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center cursor-pointer group"
        onClick={() => handleSpeakSample("Resonance acknowledged. The Forge systems stand verified and aligned.")}
      >
        <canvas
          id="orb-canvas"
          ref={canvasRef}
          className="w-full h-full block"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono-cyber px-2 py-1 bg-black/70 border border-amber-500/40 text-amber-300 rounded">
            CLICK TO RESONATE
          </span>
        </div>
      </div>

      {/* Spoken message text display box */}
      <div className="w-full max-w-lg mt-2 p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-xl relative">
        <div className="flex items-start gap-2.5">
          <MessageSquareText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-neutral-200 font-mono-cyber leading-relaxed">
            "{oratorMessage}"
          </p>
        </div>
      </div>

      {/* Quick speech triggers */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
        <button
          onClick={() => handleSpeakSample("Synthesizing system posture: Zero unverified code escapes permitted under current covenant.")}
          className="px-3 py-1.5 rounded text-xs font-mono-cyber bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-750 transition-colors flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-500" />
          <span>System Posture</span>
        </button>

        <button
          onClick={() => handleSpeakSample("Verification Gate online. All four cryptographic checks passing at ninety-eight percent confidence.")}
          className="px-3 py-1.5 rounded text-xs font-mono-cyber bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border border-neutral-750 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Gate Telemetry</span>
        </button>

        {onOpenVoiceConduit && (
          <button
            onClick={onOpenVoiceConduit}
            className="px-3 py-1.5 rounded text-xs font-mono-cyber bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Engage Voice Mic</span>
          </button>
        )}
      </div>
    </div>
  );
};
