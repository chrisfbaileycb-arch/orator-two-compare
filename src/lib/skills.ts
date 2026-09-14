import { Skill } from './types';

export const SYSTEM_SKILLS: Skill[] = [
  {
    id: 'skill-orator',
    title: 'Voice & Semantic Orator',
    tier: 'L2 Operational',
    category: 'Synthesis',
    description: 'Bridges high-fidelity acoustic streaming with speech synthesis, acoustic harmonics, and dynamic token stream pacing.',
    tags: ['Acoustics', 'Streaming', 'TTS', 'Synthesis'],
    active: true,
    capabilities: [
      'Real-time Web Speech Conduit',
      'Harmonic Frequency Visualizer Sync',
      'Dynamic Pitch & Rate Modulation',
      'Tone and Sentiment Pacing'
    ]
  },
  {
    id: 'skill-mcp-conductor',
    title: 'MCP Protocol Orchestrator',
    tier: 'L3 Autonomous',
    category: 'Protocol & MCP',
    description: 'Dynamic schema discovery, tool dispatch validation, stdio/SSE multiplexing, and fail-safe tool recovery pipelines.',
    tags: ['MCP', 'RPC', 'Stdio', 'Tool Calling'],
    active: true,
    capabilities: [
      'Model Context Protocol v1.0 Compliance',
      'JSON-RPC 2.0 Bi-directional Pipeline',
      'Tool Execution Sandbox Guardrails',
      'Multi-Server Aggregation'
    ]
  },
  {
    id: 'skill-arch-forge',
    title: 'Cognitive Architecture Synthesizer',
    tier: 'L3 Autonomous',
    category: 'Orchestration',
    description: 'Translates unstructured strategic directives and user requirements into verifiable multi-agent topology blueprints.',
    tags: ['Architecture', 'Multi-Agent', 'Blueprints', 'Topology'],
    active: true,
    capabilities: [
      'Autonomous Directed Acyclic Graph (DAG) generation',
      'Memory & Context Budget Calculation',
      'Latency & Token Optimization',
      'OpenAPI 3.1 & Schema Generation'
    ]
  },
  {
    id: 'skill-verification-sentry',
    title: 'Verification & Charter Sentry',
    tier: 'L1 Foundation',
    category: 'Security & Audit',
    description: 'Enforces architectural covenants, privacy sandboxes, model ethics boundaries, and cryptographic verification logs.',
    tags: ['Governance', 'Safety', 'Audit', 'Covenants'],
    active: true,
    capabilities: [
      'Immutable SHA-256 Audit Trail',
      'Charter Covenant Compliance Gate',
      'Prompt Boundary Taint Checking',
      'Zero-Trust Memory Disposal'
    ]
  },
  {
    id: 'skill-vector-mind',
    title: 'Vector Topology Mapper',
    tier: 'L2 Operational',
    category: 'Orchestration',
    description: 'Maintains live spatial graphs of cognitive actors, tools, and databases with force-directed physics.',
    tags: ['Canvas', 'Graph', 'Kinetic', 'Spatial'],
    active: true,
    capabilities: [
      'Real-time Canvas Render Loop',
      'Force-directed Node Physics',
      'Interactive Telemetry Probing',
      'Dynamic Cluster Partitioning'
    ]
  }
];
