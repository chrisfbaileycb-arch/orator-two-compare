import { McpServer, McpTool } from './types';

export const INITIAL_MCP_SERVERS: McpServer[] = [
  {
    id: 'srv-filesystem',
    name: 'filesystem-sentinel-mcp',
    version: '1.2.0',
    transport: 'stdio',
    status: 'connected',
    toolsCount: 3,
    tools: [
      {
        name: 'read_secure_artifact',
        server: 'filesystem-sentinel-mcp',
        description: 'Safely reads generated architecture specifications and verified blueprints from sandboxed store.',
        inputSchema: { path: 'string', encoding: 'utf-8' },
        riskLevel: 'low',
        latencyMs: 14,
        successRate: 99.8
      },
      {
        name: 'write_sandboxed_blueprint',
        server: 'filesystem-sentinel-mcp',
        description: 'Writes system architecture blueprints, schemas, and specs into designated deployment outputs.',
        inputSchema: { filename: 'string', content: 'string', verifySha: 'boolean' },
        riskLevel: 'medium',
        latencyMs: 22,
        successRate: 99.2
      },
      {
        name: 'compute_artifact_checksum',
        server: 'filesystem-sentinel-mcp',
        description: 'Calculates SHA-256 hash across deliverables for verification gate compliance check.',
        inputSchema: { paths: 'string[]' },
        riskLevel: 'low',
        latencyMs: 8,
        successRate: 100
      }
    ]
  },
  {
    id: 'srv-db-oracle',
    name: 'pg-vector-oracle-mcp',
    version: '2.0.4',
    transport: 'sse',
    status: 'connected',
    toolsCount: 2,
    tools: [
      {
        name: 'query_vector_embeddings',
        server: 'pg-vector-oracle-mcp',
        description: 'Executes cosine similarity lookups over cognitive episodic memory vectors.',
        inputSchema: { queryVector: 'number[]', topK: 'number', threshold: 'number' },
        riskLevel: 'medium',
        latencyMs: 38,
        successRate: 98.6
      },
      {
        name: 'inspect_db_schema',
        server: 'pg-vector-oracle-mcp',
        description: 'Extracts relational tables, foreign key graphs, and migration versions.',
        inputSchema: { targetSchema: 'string' },
        riskLevel: 'low',
        latencyMs: 19,
        successRate: 99.9
      }
    ]
  },
  {
    id: 'srv-telemetry',
    name: 'quantum-telemetry-mcp',
    version: '0.9.8',
    transport: 'stdio',
    status: 'connected',
    toolsCount: 2,
    tools: [
      {
        name: 'poll_system_entropy',
        server: 'quantum-telemetry-mcp',
        description: 'Samples high-entropy system metrics, worker pool load, and quantum sync rate.',
        inputSchema: { windowSeconds: 'number' },
        riskLevel: 'low',
        latencyMs: 6,
        successRate: 100
      },
      {
        name: 'audit_memory_leakage',
        server: 'quantum-telemetry-mcp',
        description: 'Scans runtime heap references for uncleared sensitive context fragments.',
        inputSchema: { depth: 'shallow | deep' },
        riskLevel: 'high',
        latencyMs: 44,
        successRate: 97.4
      }
    ]
  }
];

export interface BenchmarkResult {
  toolName: string;
  server: string;
  roundtripMs: number;
  tokensConsumed: number;
  status: 'SUCCESS' | 'RATE_LIMITED' | 'REJECTED';
  output: string;
  timestamp: string;
}

export const runMcpToolBenchmark = async (tool: McpTool): Promise<BenchmarkResult> => {
  // Simulate realistic network roundtrip
  const artificialDelay = Math.floor(Math.random() * 40) + tool.latencyMs;
  await new Promise((r) => setTimeout(r, artificialDelay));

  const sampleOutputs: Record<string, string> = {
    read_secure_artifact: '{"status": 200, "bytes": 4820, "sha256": "8f4a7c1b...valid"}',
    write_sandboxed_blueprint: '{"status": 201, "written": true, "path": "/dist/arch-spec.md"}',
    compute_artifact_checksum: '{"hashes": {"openapi.json": "3f90a21...", "schema.sql": "a91b2c4..."}}',
    query_vector_embeddings: '{"matches": 8, "topSimilarity": 0.942, "latencyMs": 36}',
    inspect_db_schema: '{"tables": ["sessions", "inquests", "artifacts", "covenants"], "indexes": 9}',
    poll_system_entropy: '{"entropyPool": 4096, "sync": 99.4, "status": "NOMINAL"}',
    audit_memory_leakage: '{"scannedMB": 128, "taintedAllocations": 0, "status": "SECURE"}'
  };

  return {
    toolName: tool.name,
    server: tool.server,
    roundtripMs: artificialDelay,
    tokensConsumed: Math.floor(Math.random() * 120) + 40,
    status: 'SUCCESS',
    output: sampleOutputs[tool.name] || '{"status": "ok", "ack": true}',
    timestamp: new Date().toLocaleTimeString()
  };
};
