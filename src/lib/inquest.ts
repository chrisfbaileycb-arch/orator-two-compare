import { InquestQuestion, InquestState } from './types';

export const INQUEST_QUESTIONS: InquestQuestion[] = [
  {
    id: 'inq-intent-1',
    stage: 'intent',
    category: 'Strategic Intent & Scope',
    question: 'What is the primary operational posture of your AI Forge deployment?',
    subtitle: 'Determine agent autonomy level, executive intervention boundaries, and system goals.',
    options: [
      {
        id: 'opt-autonomous-copilot',
        label: 'Autonomous Enterprise Co-Pilot',
        description: 'Multi-agent network executing scheduled synthesis, code refactoring, and automated testing with human oversight.',
        impact: '+30% Velocity, High MCP Tool Coupling',
        recommended: true
      },
      {
        id: 'opt-bounded-consultant',
        label: 'Strictly Bounded Advisory Engine',
        description: 'Read-only diagnostic assistant delivering verified architectural blueprints without active runtime mutations.',
        impact: 'Max Security, Minimal Surface Area'
      },
      {
        id: 'opt-kinetic-operator',
        label: 'Real-time Kinetic System Operator',
        description: 'High-frequency event-driven orchestrator managing infrastructure, databases, and continuous delivery gates.',
        impact: 'Ultra Low Latency, Full Tool Permissions'
      }
    ]
  },
  {
    id: 'inq-arch-2',
    stage: 'architecture',
    category: 'Cognitive Topology & Memory',
    question: 'How should memory persistence and state synchronization be configured?',
    subtitle: 'Define context window boundaries, episodic vector recall, and transactional isolation.',
    options: [
      {
        id: 'opt-hierarchical-hybrid',
        label: 'Hierarchical Hybrid (Volatile Scratchpad + PgVector)',
        description: 'Short-term scratchpad with strict session disposal paired with durable PostgreSQL pgvector embeddings for institutional knowledge.',
        impact: 'Balanced Latency, Enterprise Retention',
        recommended: true
      },
      {
        id: 'opt-zero-retention',
        label: 'Ephemeral Zero-Retention Ephemerality',
        description: 'No state stored beyond current session tokens. Zero persistent vector storage for highest compliance requirements.',
        impact: 'GDPR/HIPAA Pristine, No Long-term Memory'
      },
      {
        id: 'opt-distributed-graph',
        label: 'Distributed Graph-RAG Lattice',
        description: 'Full knowledge-graph topology connecting entity relationships, temporal snapshots, and multi-tenant sandboxes.',
        impact: 'Maximum Reasoning Depth, High Compute'
      }
    ]
  },
  {
    id: 'inq-governance-3',
    stage: 'governance',
    category: 'Safety, Covenants & Verification Gates',
    question: 'What verification threshold is required before deliverables and code are sealed?',
    subtitle: 'Configure automated cryptographic checks, unit test pass rates, and human signing protocol.',
    options: [
      {
        id: 'opt-tri-gate-sentry',
        label: 'Tri-Gate Cryptographic Sentinel',
        description: 'Requires SHA-256 deliverable checksum, 100% security static analysis pass, and an explicit Charter Covenant signature.',
        impact: 'Zero Hallucinated Code, Audit Ready',
        recommended: true
      },
      {
        id: 'opt-continuous-telemetry',
        label: 'Telemetry-Weighted Quality Gate',
        description: 'Continuous scoring of response confidence, token drift analysis, and automated fuzzing regression tests.',
        impact: 'Fast Iteration, Statistical Assurance'
      },
      {
        id: 'opt-manual-consortium',
        label: 'Executive Peer Consortium Sign-off',
        description: 'Two-party authorization required before any MCP tool schema or system architecture blueprint can be committed.',
        impact: 'Highest Human In-the-Loop Control'
      }
    ]
  },
  {
    id: 'inq-mcp-4',
    stage: 'mcp_tools',
    category: 'Model Context Protocol (MCP) Integration',
    question: 'Which MCP transport protocols and tool boundaries will be provisioned?',
    subtitle: 'Select connectivity mechanisms for tools, file watchers, database adapters, and external APIs.',
    options: [
      {
        id: 'opt-stdio-sse-mesh',
        label: 'Dual Mesh (Stdio for Local + SSE for Cloud Services)',
        description: 'Fast local process pipes for filesystem operations and secure Server-Sent Events (SSE) for remote vector search and telemetry.',
        impact: 'Industry Best Practice, High Throughput',
        recommended: true
      },
      {
        id: 'opt-pure-stdio',
        label: 'Air-Gapped Pure Stdio Local Isolation',
        description: 'All MCP servers run as sandboxed local subprocesses without outbound socket permissions.',
        impact: 'Immune to Network Exploits'
      },
      {
        id: 'opt-websocket-streaming',
        label: 'Bi-directional WebSocket Multiplexing',
        description: 'Low-latency full duplex streaming channel suitable for high-frequency trading or real-time robotics.',
        impact: 'Sub-10ms Tool Execution'
      }
    ]
  }
];

export const computeInquestResults = (answers: Record<string, string>): InquestState['score'] => {
  let arch = 75;
  let gov = 80;
  let mcp = 70;
  let sec = 85;

  if (answers['inq-intent-1'] === 'opt-autonomous-copilot') {
    arch += 15;
    mcp += 20;
  } else if (answers['inq-intent-1'] === 'opt-bounded-consultant') {
    gov += 15;
    sec += 12;
  } else if (answers['inq-intent-1'] === 'opt-kinetic-operator') {
    mcp += 25;
    arch += 10;
  }

  if (answers['inq-arch-2'] === 'opt-hierarchical-hybrid') {
    arch += 10;
    sec += 8;
  } else if (answers['inq-arch-2'] === 'opt-zero-retention') {
    sec += 15;
    gov += 10;
  } else if (answers['inq-arch-2'] === 'opt-distributed-graph') {
    arch += 20;
    mcp += 10;
  }

  if (answers['inq-governance-3'] === 'opt-tri-gate-sentry') {
    gov += 15;
    sec += 10;
  }

  if (answers['inq-mcp-4'] === 'opt-stdio-sse-mesh') {
    mcp += 15;
    arch += 8;
  }

  return {
    architecturalRigor: Math.min(100, arch),
    governanceReadiness: Math.min(100, gov),
    mcpCapability: Math.min(100, mcp),
    securityIndex: Math.min(100, sec)
  };
};

export const getInquestRecommendations = (answers: Record<string, string>): string[] => {
  const recs = [
    'Deploy the Tri-Gate Cryptographic Sentinel on all artifact build pipelines to guarantee zero unverified code leaks.',
    'Configure the Filesystem Sentinel MCP tool with strict directory chroot to eliminate traversal vectors.',
    'Enable hierarchical memory management: Keep reasoning scratchpads in-memory and flush upon turn completion.',
    'Bind the Orator Acoustic Engine to provide real-time verbal diagnostics and status callouts for operators.'
  ];

  if (answers['inq-mcp-4'] === 'opt-stdio-sse-mesh') {
    recs.push('Maintain separate worker pools for stdio subprocesses vs SSE remote connections to prevent backpressure head-of-line blocking.');
  }

  return recs;
};
