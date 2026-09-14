/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HudChrome } from './components/HudChrome';
import { PlasmaBackdrop } from './components/PlasmaBackdrop';
import { Landing } from './components/Landing';
import { Inquest } from './components/Inquest';
import { ForgeDirector } from './components/ForgeDirector';
import { Deliverables } from './components/Deliverables';
import { Modal } from './components/Modal';
import { CharterModal } from './components/CharterModal';
import { BookingModal } from './components/BookingModal';
import { VerificationGate } from './components/VerificationGate';
import { McpBenchModal } from './components/McpBenchModal';
import { VoiceConduit } from './components/VoiceConduit';
import { 
  AppView, 
  ModalType, 
  InquestState, 
  TelemetryState 
} from './lib/types';
import { 
  loadInquestState, 
  isCharterSigned, 
  getSessionId 
} from './lib/session';
import { 
  getInitialTelemetry, 
  updateTelemetryJitter 
} from './lib/telemetry';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [inquestState, setInquestState] = useState<InquestState | null>(() => loadInquestState());
  const [charterSigned, setCharterSigned] = useState<boolean>(() => isCharterSigned());
  const [telemetry, setTelemetry] = useState<TelemetryState>(() => getInitialTelemetry());
  const [sessionId] = useState<string>(() => getSessionId());

  // Periodically jitter telemetry metrics for realistic cybernetic HUD feel
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => updateTelemetryJitter(prev));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleInquestComplete = (state: InquestState) => {
    setInquestState(state);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Plasma Canvas & Scanlines */}
      <PlasmaBackdrop />

      {/* Top HUD Chrome */}
      <HudChrome
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenModal={setCurrentModal}
        telemetry={telemetry}
        charterSigned={charterSigned}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentView === 'landing' && (
          <Landing
            onNavigate={setCurrentView}
            onOpenModal={setCurrentModal}
            telemetry={telemetry}
            charterSigned={charterSigned}
            inquestCompleted={!!inquestState?.isCompleted}
          />
        )}

        {currentView === 'inquest' && (
          <Inquest
            initialState={inquestState}
            onComplete={handleInquestComplete}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'director' && (
          <ForgeDirector
            onOpenMcpBench={() => setCurrentModal('mcp_bench')}
            onOpenDeliverables={() => setCurrentView('deliverables')}
          />
        )}

        {currentView === 'deliverables' && (
          <Deliverables
            inquestState={inquestState}
          />
        )}
      </main>

      {/* System Status Footer */}
      <footer className="border-t border-neutral-850 bg-neutral-950/80 backdrop-blur-md py-4 px-6 text-[11px] font-mono-cyber text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold">THE AI FORGE v2.4</span>
            <span>•</span>
            <span>SESSION: <span className="text-neutral-300 font-semibold">{sessionId}</span></span>
            <span>•</span>
            <span className="text-emerald-400">ENCLAVE SECURE</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentModal('charter')}
              className="hover:text-neutral-300 transition-colors"
            >
              COVENANT
            </button>
            <button 
              onClick={() => setCurrentModal('verification')}
              className="hover:text-neutral-300 transition-colors"
            >
              VERIFICATION GATE
            </button>
            <button 
              onClick={() => setCurrentModal('mcp_bench')}
              className="hover:text-neutral-300 transition-colors"
            >
              MCP BENCH
            </button>
            <span>&copy; {new Date().getFullYear()} SOVEREIGN AI FORGE</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Charter Covenant Modal */}
      <Modal
        isOpen={currentModal === 'charter'}
        onClose={() => setCurrentModal(null)}
        title="AI CHARTER &amp; ETHICAL COVENANT"
        subtitle="Constitutional bounds for autonomous agent clusters"
        maxWidth="max-w-2xl"
      >
        <CharterModal
          onSignedChange={setCharterSigned}
          onClose={() => setCurrentModal(null)}
        />
      </Modal>

      {/* 2. Deployment Dispatch Booking Modal */}
      <Modal
        isOpen={currentModal === 'booking'}
        onClose={() => setCurrentModal(null)}
        title="DISPATCH SESSION SCHEDULING"
        subtitle="Book cluster provisioning and multi-agent deployment"
        maxWidth="max-w-xl"
      >
        <BookingModal
          onClose={() => setCurrentModal(null)}
        />
      </Modal>

      {/* 3. Verification Gate Security Modal */}
      <Modal
        isOpen={currentModal === 'verification'}
        onClose={() => setCurrentModal(null)}
        title="TRI-GATE VERIFICATION SENTINEL"
        subtitle="Cryptographic proof, SHA-256 deliverable checksum, and memory isolation"
        maxWidth="max-w-2xl"
      >
        <VerificationGate
          onClose={() => setCurrentModal(null)}
        />
      </Modal>

      {/* 4. MCP Protocol Benchmark Modal */}
      <Modal
        isOpen={currentModal === 'mcp_bench'}
        onClose={() => setCurrentModal(null)}
        title="MODEL CONTEXT PROTOCOL (MCP) BENCH"
        subtitle="Benchmark sandboxed stdio/SSE tools and measure roundtrip latency"
        maxWidth="max-w-3xl"
      >
        <McpBenchModal />
      </Modal>

      {/* 5. Voice Conduit Modal */}
      <Modal
        isOpen={currentModal === 'voice_conduit'}
        onClose={() => setCurrentModal(null)}
        title="ORATOR ACOUSTIC CONDUIT"
        subtitle="Web speech synthesis and live operator voice stream"
        maxWidth="max-w-xl"
      >
        <VoiceConduit
          onClose={() => setCurrentModal(null)}
        />
      </Modal>
    </div>
  );
}
