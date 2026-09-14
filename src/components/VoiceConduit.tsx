import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { voiceConduit } from '../lib/voice';

interface VoiceConduitProps {
  onClose?: () => void;
}

export const VoiceConduit: React.FC<VoiceConduitProps> = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(voiceConduit.isRecognitionSupported());

    voiceConduit.setListeners({
      onTranscript: (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          processVoiceCommand(text);
        }
      },
      onStateChange: (state) => {
        setIsListening(state === 'listening');
        setIsSpeaking(state === 'speaking');
      },
      onError: (err) => {
        console.warn('Voice conduit error:', err);
      }
    });

    return () => {
      voiceConduit.stopListening();
    };
  }, []);

  const toggleMic = () => {
    if (isListening) {
      voiceConduit.stopListening();
    } else {
      setTranscript('');
      const started = voiceConduit.startListening();
      if (!started) {
        setLastResponse("Microphone permission required or browser speech recognition unavailable.");
      }
    }
  };

  const processVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    let reply = "Directive acknowledged by the Forge Director.";

    if (lower.includes('status') || lower.includes('health')) {
      reply = "Cluster status is nominal. All MCP sentinel servers report active ping below 30 milliseconds.";
    } else if (lower.includes('charter') || lower.includes('covenant')) {
      reply = "The Charter Covenant mandates zero unverified code leaks and strict sandboxed execution.";
    } else if (lower.includes('inquest') || lower.includes('diagnostic')) {
      reply = "Inquest diagnostic ready. Four stages of architectural and governance questions available.";
    } else if (lower.includes('mcp') || lower.includes('tool')) {
      reply = "Three MCP servers registered: filesystem-sentinel, pg-vector-oracle, and quantum-telemetry.";
    } else {
      reply = `Understood: "${cmd}". The Orator has recorded this intention into cognitive scratchpad memory.`;
    }

    setLastResponse(reply);
    voiceConduit.speak(reply);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
            <h4 className="font-cyber font-bold text-sm tracking-wide text-neutral-200">
              CONDUIT STATE: {isListening ? 'LISTENING (SPEAK NOW)' : isSpeaking ? 'TRANSMITTING SPEECH' : 'STANDBY'}
            </h4>
          </div>

          <button
            id="voice-toggle-mic-btn"
            onClick={toggleMic}
            className={`px-4 py-2 rounded-lg font-cyber text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-lg shadow-red-500/20'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-red-400" />
                <span>HALT LISTENING</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-400" />
                <span>ENGAGE MICROPHONE</span>
              </>
            )}
          </button>
        </div>

        {/* Audio Visualizer Waves */}
        <div className="flex items-end justify-center gap-1.5 h-16 my-4 bg-neutral-900/80 rounded-lg p-2 overflow-hidden">
          {[...Array(24)].map((_, i) => {
            const h = (isListening || isSpeaking)
              ? Math.max(15, Math.floor(Math.sin((i + Date.now() * 0.005)) * 40 + 50))
              : 8;
            return (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-75 ${
                  isSpeaking
                    ? 'bg-amber-400'
                    : isListening
                    ? 'bg-cyan-400'
                    : 'bg-neutral-700'
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        {!isSupported && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-300 font-mono-cyber">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Web Speech Recognition API is not supported in this browser engine. Text speech synthesis is fully active.</span>
          </div>
        )}
      </div>

      {/* Transcript Box */}
      <div className="space-y-2">
        <label className="text-xs font-mono-cyber text-neutral-400 flex items-center justify-between">
          <span>OPERATOR VOICE INPUT</span>
          {transcript && <span className="text-cyan-400 text-[10px]">LIVE STREAMING</span>}
        </label>
        <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg min-h-[70px] text-xs font-mono-cyber text-neutral-200">
          {transcript ? (
            <p className="text-cyan-300 font-semibold">"{transcript}"</p>
          ) : (
            <p className="text-neutral-500 italic">Click 'Engage Microphone' above and speak, or use test queries below...</p>
          )}
        </div>
      </div>

      {/* Orator Acoustic Response */}
      {lastResponse && (
        <div className="space-y-2">
          <label className="text-xs font-mono-cyber text-amber-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>ORATOR RESPONSE</span>
          </label>
          <div className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs font-mono-cyber text-amber-200 leading-relaxed">
            "{lastResponse}"
          </div>
        </div>
      )}

      {/* Test Query Dispatchers */}
      <div className="space-y-2">
        <label className="text-xs font-mono-cyber text-neutral-400">
          SIMULATE ORATOR VERBAL PROMPTS
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Check Cluster Status', cmd: 'What is the cluster status and latency?' },
            { label: 'Verify Charter Safety', cmd: 'What does the AI Charter covenant mandate?' },
            { label: 'Query MCP Servers', cmd: 'Which MCP servers are connected?' },
            { label: 'Start Inquest Diagnostic', cmd: 'Begin architectural inquest discovery' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(item.cmd);
                processVoiceCommand(item.cmd);
              }}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 rounded text-left text-xs font-mono-cyber text-neutral-300 hover:text-amber-300 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500/60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
