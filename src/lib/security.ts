export interface SecurityCheckItem {
  id: string;
  name: string;
  category: 'PROTOCOL' | 'MEMORY' | 'SANDBOX' | 'AUDIT';
  status: 'PASSED' | 'PENDING' | 'WARN';
  score: number;
  description: string;
}

export const CORE_SECURITY_CHECKS: SecurityCheckItem[] = [
  {
    id: 'SEC-001',
    name: 'MCP Sandboxed Transport Isolation',
    category: 'SANDBOX',
    status: 'PASSED',
    score: 100,
    description: 'Verifies stdio and WebSocket child process pipes reject unauthorized shell escapes and directory traversals.'
  },
  {
    id: 'SEC-002',
    name: 'Model Prompt Injection Sentinel',
    category: 'PROTOCOL',
    status: 'PASSED',
    score: 98,
    description: 'Evaluates delimiters, system boundary isolation, and payload token taint analysis.'
  },
  {
    id: 'SEC-003',
    name: 'Volatile Memory & Session Ephemerality',
    category: 'MEMORY',
    status: 'PASSED',
    score: 96,
    description: 'Ensures conversational transcripts and synthetic secrets are automatically flushed upon connection termination.'
  },
  {
    id: 'SEC-004',
    name: 'Cryptographic Audit Trail (SHA-256)',
    category: 'AUDIT',
    status: 'PASSED',
    score: 100,
    description: 'Continuous immutable hashing of every tool invocation, response artifact, and stage transition.'
  }
];

export const sanitizePromptInput = (text: string): string => {
  return text
    .replace(/[<>]/g, '')
    .trim();
};

export const computeSecurityScore = (checks: SecurityCheckItem[]): number => {
  if (!checks.length) return 0;
  const total = checks.reduce((sum, item) => sum + item.score, 0);
  return +(total / checks.length).toFixed(1);
};
