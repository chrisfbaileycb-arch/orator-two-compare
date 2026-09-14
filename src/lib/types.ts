export type AppView = 
  | 'landing' 
  | 'inquest' 
  | 'director' 
  | 'deliverables' 
  | 'audit';

export type ModalType = 
  | null 
  | 'charter' 
  | 'booking' 
  | 'mcp_bench' 
  | 'verification' 
  | 'voice_conduit';

export interface InquestQuestion {
  id: string;
  stage: 'intent' | 'architecture' | 'governance' | 'mcp_tools' | 'synthesis';
  question: string;
  subtitle: string;
  category: string;
  options: {
    id: string;
    label: string;
    description: string;
    impact: string;
    recommended?: boolean;
  }[];
}

export interface InquestState {
  currentStageIndex: number;
  answers: Record<string, string>;
  isCompleted: boolean;
  score: {
    architecturalRigor: number;
    governanceReadiness: number;
    mcpCapability: number;
    securityIndex: number;
  };
  recommendations: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  role: string;
  category: 'core' | 'agent' | 'tool' | 'protocol' | 'database' | 'security';
  status: 'active' | 'standby' | 'processing';
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  description: string;
  details?: Record<string, string>;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'rpc' | 'control' | 'telemetry';
  label?: string;
  animated?: boolean;
}

export interface McpTool {
  name: string;
  server: string;
  description: string;
  inputSchema: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  latencyMs: number;
  successRate: number;
  lastCall?: string;
}

export interface McpServer {
  id: string;
  name: string;
  version: string;
  transport: 'stdio' | 'sse' | 'websocket';
  status: 'connected' | 'idle' | 'warning';
  toolsCount: number;
  tools: McpTool[];
}

export interface Skill {
  id: string;
  title: string;
  tier: 'L1 Foundation' | 'L2 Operational' | 'L3 Autonomous';
  category: 'Orchestration' | 'Security & Audit' | 'Protocol & MCP' | 'Synthesis';
  description: string;
  tags: string[];
  active: boolean;
  capabilities: string[];
}

export interface DeliverableFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
  badge?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  category: 'SECURITY' | 'GOVERNANCE' | 'MCP_DISPATCH' | 'SESSION';
  severity: 'INFO' | 'WARN' | 'PASS' | 'CRITICAL';
  message: string;
  details: string;
  fingerprint: string;
}

export interface TelemetryState {
  activeNodes: number;
  mcpLatencyMs: number;
  tokenThroughput: number;
  verificationScore: number;
  quantumSyncRate: number;
  uptimeSeconds: number;
}
