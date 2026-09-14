import { TelemetryState } from './types';

let startTime = Date.now();

export const getInitialTelemetry = (): TelemetryState => ({
  activeNodes: 14,
  mcpLatencyMs: 24,
  tokenThroughput: 1420,
  verificationScore: 98.6,
  quantumSyncRate: 99.4,
  uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
});

export const updateTelemetryJitter = (current: TelemetryState): TelemetryState => {
  const latencyJitter = Math.floor(Math.random() * 7) - 3;
  const tokenJitter = Math.floor(Math.random() * 80) - 40;
  const syncJitter = (Math.random() * 0.4 - 0.2);

  return {
    ...current,
    mcpLatencyMs: Math.max(14, Math.min(68, current.mcpLatencyMs + latencyJitter)),
    tokenThroughput: Math.max(800, Math.min(2400, current.tokenThroughput + tokenJitter)),
    quantumSyncRate: +(Math.max(96.0, Math.min(99.9, current.quantumSyncRate + syncJitter))).toFixed(1),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
  };
};
