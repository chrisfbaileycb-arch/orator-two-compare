import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Send, 
  Layers, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Sliders, 
  Info, 
  RefreshCw 
} from 'lucide-react';
import { MindMapGraphRenderer } from '../canvas/MindMapCanvas';
import { MindMapNode, Skill } from '../lib/types';
import { SYSTEM_SKILLS } from '../lib/skills';
import { voiceConduit } from '../lib/voice';

interface ForgeDirectorProps {
  onOpenMcpBench?: () => void;
  onOpenDeliverables?: () => void;
}

export const ForgeDirector: React.FC<ForgeDirectorProps> = ({
  onOpenMcpBench,
  onOpenDeliverables
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<MindMapGraphRenderer | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [skills, setSkills] = useState<Skill[]>(SYSTEM_SKILLS);
  const [activeTab, setActiveTab] = useState<'canvas' | 'skills' | 'dispatcher'>('canvas');
  const [directiveInput, setDirectiveInput] = useState<string>('');
  const [dispatchLogs, setDispatchLogs] = useState<{ time: string; msg: string }[]>([
    { time: '11:34:02', msg: 'DAG orchestrator booted. 6 nodes wired in active topology.' },
    { time: '11:35:18', msg: 'MCP Filesystem sentinel mounted via stdio.' },
    { time: '11:36:00', msg: 'Orator voice bus synchronized with Web Audio frequency analyzer.' }
  ]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new MindMapGraphRenderer(canvasRef.current, (node) => {
      setSelectedNode(node);
      if (node) {
        voiceConduit.speak(`Inspecting ${node.label}. Role: ${node.role}.`);
      }
    });
    rendererRef.current = renderer;
    renderer.start();

    return () => {
      renderer.destroy();
    };
  }, []);

  const handleToggleSkill = (skillId: string) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, active: !s.active } : s));
  };

  const handleDispatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directiveInput.trim()) return;

    setIsDispatching(true);
    const text = directiveInput.trim();
    setDirectiveInput('');

    const newLog = {
      time: new Date().toLocaleTimeString(),
      msg: `Directive dispatched to DAG: "${text}"`
    };
    setDispatchLogs(prev => [newLog, ...prev]);

    voiceConduit.speak(`Dispatching strategic directive to Forge Director.`);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchLogs(prev => [
        {
          time: new Date().toLocaleTimeString(),
          msg: `Synthesis verified. Cognitive nodes processed directive under current Charter rules.`
        },
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Director Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-cyber text-amber-400 mb-1">
            <Radio className="w-4 h-4" />
            <span>FORGE DIRECTOR // AUTONOMOUS CHOREOGRAPHY</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-neutral-100">
            Cognitive Multi-Agent Graph
          </h2>
          <p className="text-xs text-neutral-400 font-mono-cyber mt-1">
            Interactive kinetic mind map // Drag nodes, inspect telemetry, and dispatch architectural goals
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded text-xs font-cyber tracking-wider transition-colors ${
              activeTab === 'canvas'
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            TOPOLOGY CANVAS
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded text-xs font-cyber tracking-wider transition-colors ${
              activeTab === 'skills'
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            SKILLS REGISTRY ({skills.filter(s => s.active).length}/{skills.length})
          </button>
        </div>
      </div>

      {activeTab === 'canvas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Canvas Graph View */}
          <div className="lg:col-span-8 bg-neutral-950/80 border border-neutral-800 rounded-2xl overflow-hidden relative shadow-xl min-h-[500px] flex flex-col">
            <div className="absolute top-3 left-4 z-10 flex items-center gap-2 text-[10px] font-mono-cyber text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DRAG NODES TO REORGANIZE // CLICK TO INSPECT</span>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-[520px] block cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Right Sidebar: Selected Node Inspector & Quick Dispatch */}
          <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
            {/* Node Inspector Card */}
            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <h4 className="font-cyber font-bold text-sm tracking-wider text-neutral-100">
                    NODE TELEMETRY
                  </h4>
                </div>
                {selectedNode && (
                  <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {selectedNode.status.toUpperCase()}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-cyber text-base font-bold text-neutral-100">
                      {selectedNode.label}
                    </h3>
                    <p className="text-xs text-amber-400 font-mono-cyber">
                      {selectedNode.role}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {selectedNode.description}
                  </p>

                  {selectedNode.details && (
                    <div className="space-y-1.5 pt-2 border-t border-neutral-800 text-xs font-mono-cyber">
                      {Object.entries(selectedNode.details).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-neutral-400">
                          <span>{k}:</span>
                          <span className="text-neutral-200 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Info className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs font-mono-cyber text-neutral-400">
                    Click any node on the graph to inspect its telemetry, runtime engine, and transport protocol.
                  </p>
                </div>
              )}
            </div>

            {/* Directive Dispatcher Box */}
            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
              <h4 className="font-cyber font-bold text-sm tracking-wider text-neutral-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                AUTONOMOUS DIRECTIVE DISPATCH
              </h4>

              <form onSubmit={handleDispatch} className="space-y-2">
                <textarea
                  value={directiveInput}
                  onChange={(e) => setDirectiveInput(e.target.value)}
                  placeholder="e.g., Synthesize zero-trust filesystem sandbox with SHA-256 verification and SSE transport..."
                  rows={3}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-cyber text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />

                <button
                  type="submit"
                  disabled={isDispatching || !directiveInput.trim()}
                  className="w-full py-2 rounded-lg text-xs font-cyber font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>DISPATCHING DIRECTIVE...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>DISPATCH TO AGENT DAG</span>
                    </>
                  )}
                </button>
              </form>

              {/* Recent Dispatch Feed */}
              <div className="pt-2 border-t border-neutral-800 space-y-1.5 max-h-36 overflow-y-auto">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">DISPATCH LOGS</span>
                {dispatchLogs.map((log, lIdx) => (
                  <div key={lIdx} className="text-[11px] font-mono-cyber text-neutral-400 leading-tight">
                    <span className="text-neutral-500">[{log.time}]</span> {log.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Skills Registry Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`p-5 rounded-xl border transition-all ${
                skill.active
                  ? 'bg-neutral-900/80 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-950/40 border-neutral-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                    {skill.tier}
                  </span>
                  <h3 className="font-cyber font-bold text-base text-neutral-100 mt-2">
                    {skill.title}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono-cyber">
                    {skill.category}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleSkill(skill.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-cyber font-bold tracking-wider border transition-colors ${
                    skill.active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {skill.active ? 'ACTIVE' : 'STANDBY'}
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-light mb-4">
                {skill.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-neutral-800">
                <span className="text-[10px] font-mono-cyber text-neutral-500 block">CAPABILITIES</span>
                {skill.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="text-xs font-mono-cyber text-neutral-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
