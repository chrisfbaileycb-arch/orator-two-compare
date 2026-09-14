import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  FileCode, 
  Compass, 
  Scroll, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Radio, 
  Mic, 
  Activity 
} from 'lucide-react';
import { AppView, ModalType, TelemetryState } from '../lib/types';
import { voiceConduit } from '../lib/voice';

interface HudChromeProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenModal: (modal: ModalType) => void;
  telemetry: TelemetryState;
  charterSigned: boolean;
}

export const HudChrome: React.FC<HudChromeProps> = ({
  currentView,
  onNavigate,
  onOpenModal,
  telemetry,
  charterSigned
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(voiceConduit.getIsMuted());

  useEffect(() => {
    const checkMute = () => setIsMuted(voiceConduit.getIsMuted());
    const interval = setInterval(checkMute, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMute = () => {
    const muted = voiceConduit.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      voiceConduit.speak("Acoustic conduit online.");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      {/* Top telemetry ticker strip */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-neutral-900/60 border-b border-neutral-850 text-[11px] font-mono-cyber text-neutral-400">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            CLUSTER STATUS: NOMINAL
          </div>
          <div>MCP LATENCY: <span className="text-neutral-200">{telemetry.mcpLatencyMs}ms</span></div>
          <div>SYNC RATE: <span className="text-emerald-400">{telemetry.quantumSyncRate}%</span></div>
          <div>THROUGHPUT: <span className="text-cyan-400">{telemetry.tokenThroughput} t/s</span></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">COVENANT:</span>
            {charterSigned ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> SEALED
              </span>
            ) : (
              <button 
                onClick={() => onOpenModal('charter')}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                UNSEALED (SIGN)
              </button>
            )}
          </div>
          <div className="text-neutral-500">
            UPTIME: <span className="text-neutral-300">{telemetry.uptimeSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 hud-chamfer shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold tracking-widest text-neutral-100 text-base sm:text-lg">
                THE AI FORGE
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono-cyber font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono-cyber text-neutral-400 tracking-wider">
              ORATOR &amp; DIRECTOR
            </p>
          </div>
        </div>

        {/* Primary View Nav Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-landing-btn"
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-cyber font-medium tracking-wider transition-all flex items-center gap-1.5 ${
              currentView === 'landing'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">NEXUS</span>
          </button>

          <button
            id="nav-inquest-btn"
            onClick={() => onNavigate('inquest')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-cyber font-medium tracking-wider transition-all flex items-center gap-1.5 ${
              currentView === 'inquest'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>INQUEST</span>
          </button>

          <button
            id="nav-director-btn"
            onClick={() => onNavigate('director')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-cyber font-medium tracking-wider transition-all flex items-center gap-1.5 ${
              currentView === 'director'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>DIRECTOR</span>
          </button>

          <button
            id="nav-deliverables-btn"
            onClick={() => onNavigate('deliverables')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-cyber font-medium tracking-wider transition-all flex items-center gap-1.5 ${
              currentView === 'deliverables'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">DELIVERABLES</span>
          </button>
        </nav>

        {/* Action controls (MCP, Voice, Gate, Booking) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* MCP Bench button */}
          <button
            id="open-mcp-btn"
            onClick={() => onOpenModal('mcp_bench')}
            title="Open MCP Protocol Bench"
            className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 border border-neutral-750 transition-colors"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Verification Gate */}
          <button
            id="open-verification-btn"
            onClick={() => onOpenModal('verification')}
            title="Verification Gate & Security Checks"
            className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border border-neutral-750 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Voice Conduit Mic */}
          <button
            id="open-voice-conduit-btn"
            onClick={() => onOpenModal('voice_conduit')}
            title="Open Voice Conduit"
            className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-750 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Mute Audio Toggle */}
          <button
            id="toggle-mute-btn"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Acoustic Voice Conduit' : 'Mute Voice Conduit'}
            className={`p-2 rounded border transition-colors ${
              isMuted 
                ? 'bg-red-950/30 text-red-400 border-red-800/60 hover:bg-red-900/40' 
                : 'bg-neutral-900 text-amber-400 border-neutral-750 hover:bg-neutral-800'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Charter Covenant */}
          <button
            id="open-charter-btn"
            onClick={() => onOpenModal('charter')}
            title="AI Charter & Covenant"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cyber font-semibold tracking-wider bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-700 transition-colors"
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>CHARTER</span>
          </button>

          {/* Dispatch Booking */}
          <button
            id="open-booking-btn"
            onClick={() => onOpenModal('booking')}
            className="px-3 py-1.5 rounded text-xs font-cyber font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DISPATCH</span>
          </button>
        </div>
      </div>
    </header>
  );
};
