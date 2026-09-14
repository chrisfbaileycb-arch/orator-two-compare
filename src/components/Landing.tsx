import React from 'react';
import { 
  Compass, 
  Activity, 
  Radio, 
  FileCode, 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';
import { AppView, ModalType, TelemetryState } from '../lib/types';
import { OrbOfTheOrator } from './OrbOfTheOrator';

interface LandingProps {
  onNavigate: (view: AppView) => void;
  onOpenModal: (modal: ModalType) => void;
  telemetry: TelemetryState;
  charterSigned: boolean;
  inquestCompleted: boolean;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigate,
  onOpenModal,
  telemetry,
  charterSigned,
  inquestCompleted
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Orator */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-cyber">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COGNITIVE ORCHESTRATION &amp; MULTI-AGENT SYNTHESIS</span>
            </div>

            <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-100 uppercase leading-[1.1]">
              The Sovereign <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                AI Forge
              </span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Architect, verify, and orchestrate production-grade autonomous agent clusters. 
              Featuring the living acoustic <strong className="text-amber-400 font-medium">Orb of the Orator</strong>, 
              verifiable <strong className="text-cyan-400 font-medium">Model Context Protocol (MCP)</strong> tooling, 
              an interactive <strong className="text-neutral-100 font-medium">Inquest Diagnostic Engine</strong>, and cryptographic verification gates.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-start-inquest-btn"
                onClick={() => onNavigate('inquest')}
                className="px-6 py-3 rounded-lg font-cyber font-bold text-sm tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 group"
              >
                <span>{inquestCompleted ? 'RESUME INQUEST' : 'ENGAGE INQUEST'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-open-director-btn"
                onClick={() => onNavigate('director')}
                className="px-5 py-3 rounded-lg font-cyber font-semibold text-sm tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-750 hover:border-amber-500/50 transition-all flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>FORGE DIRECTOR</span>
              </button>

              <button
                id="hero-open-deliverables-btn"
                onClick={() => onNavigate('deliverables')}
                className="px-5 py-3 rounded-lg font-cyber font-semibold text-sm tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-750 hover:border-cyan-500/50 transition-all flex items-center gap-2"
              >
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>DELIVERABLES HUB</span>
              </button>
            </div>

            {/* Quick Readiness Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-850">
              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">CHARTER COVENANT</span>
                <span className={`text-xs font-mono-cyber font-bold flex items-center gap-1 mt-0.5 ${charterSigned ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {charterSigned ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  {charterSigned ? 'SEALED' : 'AWAITING SIGN'}
                </span>
              </div>

              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">MCP PROTOCOL</span>
                <span className="text-xs font-mono-cyber font-bold text-cyan-400 mt-0.5 block">
                  3 SERVERS (7 TOOLS)
                </span>
              </div>

              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">QUANTUM SYNC</span>
                <span className="text-xs font-mono-cyber font-bold text-emerald-400 mt-0.5 block">
                  {telemetry.quantumSyncRate}% NOMINAL
                </span>
              </div>

              <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">VERIFICATION GATE</span>
                <span className="text-xs font-mono-cyber font-bold text-amber-400 mt-0.5 block">
                  SHA-256 ARMED
                </span>
              </div>
            </div>
          </div>

          {/* Right Orb of the Orator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md">
              <OrbOfTheOrator 
                onTriggerInquest={() => onNavigate('inquest')}
                onOpenVoiceConduit={() => onOpenModal('voice_conduit')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-cyber text-xl font-bold tracking-wider text-neutral-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              OPERATIONAL COMMAND DECKS
            </h2>
            <p className="text-xs text-neutral-400 font-mono-cyber mt-0.5">
              Select an interface module to orchestrate, diagnose, or benchmark
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Inquest */}
          <div 
            onClick={() => onNavigate('inquest')}
            className="group p-5 bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-cyber font-bold text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                Inquest Diagnostic
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Stage-based questionnaire determining multi-agent autonomy, vector memory tiers, governance thresholds, and risk scoring.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-cyber text-amber-400">
              <span>{inquestCompleted ? 'Review Scores' : 'Start Discovery'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Forge Director */}
          <div 
            onClick={() => onNavigate('director')}
            className="group p-5 bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-cyber font-bold text-base text-neutral-100 group-hover:text-cyan-300 transition-colors">
                Forge Director Canvas
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dynamic force-directed Mind Map visualizing active cognitive nodes, Orator acoustic channels, and live MCP tool connections.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-cyber text-cyan-400">
              <span>Open Canvas Graph</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Deliverables Hub */}
          <div 
            onClick={() => onNavigate('deliverables')}
            className="group p-5 bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="font-cyber font-bold text-base text-neutral-100 group-hover:text-purple-300 transition-colors">
                Deliverables &amp; ZIP
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Export verified SPEC.md, openapi.json, schema.sql, docker-compose.yml, and Dockerfile bundled into an instant zip download.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-cyber text-purple-400">
              <span>Inspect &amp; Export</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: MCP Protocol Bench */}
          <div 
            onClick={() => onOpenModal('mcp_bench')}
            className="group p-5 bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-cyber font-bold text-base text-neutral-100 group-hover:text-emerald-300 transition-colors">
                MCP Tool Bench
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Benchmark Model Context Protocol tools, measure JSON-RPC roundtrip latency, test sandboxed I/O, and inspect error boundaries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-cyber text-emerald-400">
              <span>Execute Tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Verification & Security Pillar Section */}
      <section className="p-6 bg-neutral-950/80 border border-neutral-800 rounded-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono-cyber">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHIC SENTINEL // ZERO HALLUCINATION POLICY</span>
            </div>
            <h3 className="font-cyber text-xl font-bold text-neutral-100">
              Deterministic Verification &amp; Ethical Charter Covenant
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              Every deliverable synthesized in The AI Forge is sealed with an SHA-256 fingerprint and validated against our tri-gate security sentinels. Ensure your cluster is operating within signed constitutional boundaries before initiating live agent dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
            <button
              onClick={() => onOpenModal('charter')}
              className="px-4 py-2.5 rounded-lg text-xs font-cyber font-bold tracking-wider bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 transition-colors flex items-center justify-center gap-2"
            >
              <span>{charterSigned ? 'VIEW SEALED CHARTER' : 'SIGN CHARTER COVENANT'}</span>
            </button>
            <button
              onClick={() => onOpenModal('verification')}
              className="px-4 py-2.5 rounded-lg text-xs font-cyber font-bold tracking-wider bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>INSPECT VERIFICATION GATE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
