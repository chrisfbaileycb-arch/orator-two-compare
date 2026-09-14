import { AuditRecord } from './types';

const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-9912',
    timestamp: 'Just now',
    category: 'SESSION',
    severity: 'INFO',
    message: 'Forge Director initialization sequence engaged.',
    details: 'Canvas subsystems online. WebGL/2D plasma canvas and Orator audio bus hooked.',
    fingerprint: 'e3b0c44298fc1c149afbf4c8996fb924'
  },
  {
    id: 'AUD-9913',
    timestamp: '1 min ago',
    category: 'GOVERNANCE',
    severity: 'PASS',
    message: 'Charter Covenant validation baseline established.',
    details: 'Architectural safety constraints: Zero unauthenticated external write permissions.',
    fingerprint: '8f434346648f6b96df89dda901c5176b'
  },
  {
    id: 'AUD-9914',
    timestamp: '3 mins ago',
    category: 'MCP_DISPATCH',
    severity: 'PASS',
    message: 'MCP Protocol Server Handshake verified.',
    details: '3 servers connected (filesystem-sentinel, pg-vector-oracle, quantum-telemetry). 7 tools registered.',
    fingerprint: '3b0c44298fc1c149afbf4c8996fb9242'
  },
  {
    id: 'AUD-9915',
    timestamp: '6 mins ago',
    category: 'SECURITY',
    severity: 'PASS',
    message: 'Zero-trust sandbox boundaries verified.',
    details: 'Stdio sandboxing enforced. No unescaped subprocess shells allowed.',
    fingerprint: 'ca978112ca1bbdcafac231b39a23dc4d'
  }
];

export const getAuditLogs = (): AuditRecord[] => {
  return [...INITIAL_AUDIT_LOGS];
};

export const createAuditLog = (
  category: AuditRecord['category'],
  severity: AuditRecord['severity'],
  message: string,
  details: string
): AuditRecord => {
  const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return {
    id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString(),
    category,
    severity,
    message,
    details,
    fingerprint: hash
  };
};
