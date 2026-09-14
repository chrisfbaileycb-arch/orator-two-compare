import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, Clock, Cpu, Server, AlertCircle } from 'lucide-react';
import { INITIAL_MCP_SERVERS, runMcpToolBenchmark, BenchmarkResult } from '../lib/mcp';
import { McpServer, McpTool } from '../lib/types';
import { voiceConduit } from '../lib/voice';

export const McpBenchModal: React.FC = () => {
  const [servers] = useState<McpServer[]>(INITIAL_MCP_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>(servers[0]?.id || '');
  const [executingTool, setExecutingTool] = useState<string | null>(null);
  const [benchmarkResults, setBenchmarkResults] = useState<Record<string, BenchmarkResult>>({});

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];

  const handleRunTool = async (tool: McpTool) => {
    setExecutingTool(tool.name);
    voiceConduit.speak(`Executing MCP tool ${tool.name} on ${tool.server}.`);

    try {
      const result = await runMcpToolBenchmark(tool);
      setBenchmarkResults(prev => ({ ...prev, [tool.name]: result }));
    } catch (e) {
      console.error('MCP execution error:', e);
    } finally {
      setExecutingTool(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Status */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-cyber font-bold text-sm text-neutral-100">
                MODEL CONTEXT PROTOCOL (MCP v1.0)
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                JSON-RPC 2.0
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono-cyber mt-0.5">
              3 Connected Servers // 7 Verifiable Sandboxed Tools
            </p>
          </div>
        </div>

        <div className="text-right font-mono-cyber text-xs">
          <span className="text-neutral-500">AGGREGATE LATENCY:</span>
          <span className="text-cyan-400 font-bold ml-1.5">24ms</span>
        </div>
      </div>

      {/* Server Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800">
        {servers.map((s) => {
          const isActive = s.id === activeServerId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveServerId(s.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono-cyber whitespace-nowrap transition-colors flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{s.name}</span>
              <span className="text-[10px] text-neutral-500">({s.transport})</span>
            </button>
          );
        })}
      </div>

      {/* Server Tools List */}
      <div className="space-y-4">
        {activeServer?.tools.map((tool) => {
          const isRunning = executingTool === tool.name;
          const result = benchmarkResults[tool.name];

          return (
            <div
              key={tool.name}
              className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <h5 className="font-mono-cyber font-bold text-sm text-neutral-200">
                      {tool.name}
                    </h5>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono-cyber font-bold uppercase ${
                      tool.riskLevel === 'low' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : tool.riskLevel === 'medium' 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {tool.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRunTool(tool)}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-cyber font-bold tracking-wider bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse text-amber-400' : 'text-neutral-400'}`} />
                  <span>{isRunning ? 'EXECUTING...' : 'RUN BENCH'}</span>
                </button>
              </div>

              {/* Execution Result Panel if available */}
              {result && (
                <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg space-y-1.5 font-mono-cyber text-xs">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 200 OK (ROUNDTRIP {result.roundtripMs}ms)
                    </span>
                    <span>Tokens: {result.tokensConsumed}</span>
                  </div>
                  <pre className="text-neutral-300 text-[11px] overflow-x-auto p-2 bg-neutral-950 rounded border border-neutral-850">
                    <code>{result.output}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
