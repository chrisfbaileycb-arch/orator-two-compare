import { DeliverableFile, InquestState } from './types';

export const generateDeliverables = (inquestState?: InquestState | null): DeliverableFile[] => {
  const archScore = inquestState?.score?.architecturalRigor || 92;
  const govScore = inquestState?.score?.governanceReadiness || 95;
  const mcpScore = inquestState?.score?.mcpCapability || 90;
  const secScore = inquestState?.score?.securityIndex || 98;

  return [
    {
      filename: 'SPEC.md',
      path: '/SPEC.md',
      language: 'markdown',
      badge: 'ARCH SPEC',
      description: 'Comprehensive Architectural Blueprint & Cognitive Multi-Agent Topology Specification',
      content: `# THE AI FORGE: ARCHITECTURAL & GOVERNANCE SPECIFICATION
**Version:** 2.4.0-COGNITIVE  
**Classification:** VERIFIED ENTERPRISE BLUEPRINT  
**Verification Index:** Rigor: ${archScore}% | Governance: ${govScore}% | MCP: ${mcpScore}% | Security: ${secScore}%  

---

## 1. Executive Summary
The AI Forge: Orator & Director is an industrial-grade cognitive orchestration ecosystem designed to run secure, multi-agent systems with explicit ethical covenants, verifiable MCP (Model Context Protocol) tool execution, dynamic vector memory, and real-time acoustic feedback loops.

## 2. System Topology & Core Components
\`\`\`
                     +---------------------------+
                     |    ORB OF THE ORATOR      |
                     |  (Acoustic / Speech Bus)  |
                     +-------------+-------------+
                                   |
                     +-------------v-------------+
                     |      FORGE DIRECTOR       |
                     | (DAG Orchestrator / Canvas)|
                     +-------------+-------------+
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
+--------v-------+       +---------v-------+       +---------v-------+
|  MCP RUNTIME   |       |  VECTOR ORACLE  |       | VERIFICATION    |
| (Stdio / SSE)  |       | (PgVector RAG)  |       | GATE (SHA-256)  |
+----------------+       +-----------------+       +-----------------+
\`\`\`

### 2.1 The Orb of the Orator
- **Acoustic Harmonics:** Frequency analysis via Web Audio API, feeding dynamic wave deformation into the Canvas 2D/WebGL rendering pipeline.
- **Voice Conduit:** Speech recognition and speech synthesis operating on bidirectional audio tokens with conversational interrupt handling.

### 2.2 The Forge Director
- **Mind Map Canvas:** Reactive force-directed node graph mapping active agents, connected MCP servers, and data schemas.
- **Autonomous Dispatch:** L3 Skill Execution with contextual budget enforcement.

### 2.3 Model Context Protocol (MCP) Mesh
- **Transport Modes:** Stdio child process pipes for air-gapped filesystem access; Server-Sent Events (SSE) for scalable database lookups.
- **Fail-Safe Sandbox:** Parameter bounds checking, query execution limits, and strict schema validation.

## 3. Governance Covenant & Charter Gate
1. **Zero Secret Leakage:** No synthetic keys or conversational tokens persisted beyond ephemeral worker memory.
2. **Deterministic Cryptographic Verification:** All generated code, schemas, and specs are tagged with immutable SHA-256 hashes.
3. **Executive Oversight:** Mandatory signature confirmation before production deployment gates unlock.
`
    },
    {
      filename: 'openapi.json',
      path: '/openapi.json',
      language: 'json',
      badge: 'API CONTRACT',
      description: 'OpenAPI 3.1.0 Contract for Forge Director, MCP Proxy, and Voice Stream',
      content: JSON.stringify({
        openapi: "3.1.0",
        info: {
          title: "The AI Forge Orchestration API",
          version: "2.4.0",
          description: "High-performance interface for multi-agent choreography, MCP tool invocation, and streaming voice conduit."
        },
        servers: [
          { url: "https://forge-director.internal/api/v1", description: "Internal Production Cluster" },
          { url: "http://localhost:3000/api", description: "Local Development Node" }
        ],
        paths: {
          "/director/dispatch": {
            post: {
              summary: "Dispatch goal to Forge Director",
              operationId: "dispatchGoal",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        directive: { type: "string" },
                        requiredSkills: { type: "array", items: { type: "string" } },
                        timeoutMs: { type: "integer", default: 5000 }
                      },
                      required: ["directive"]
                    }
                  }
                }
              },
              responses: {
                "200": {
                  description: "Goal successfully ingested and routed to DAG execution engine",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          taskId: { type: "string" },
                          status: { type: "string", enum: ["queued", "executing", "verified"] },
                          assignedNodes: { type: "array", items: { type: "string" } }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "/mcp/execute": {
            post: {
              summary: "Execute sandboxed tool on connected MCP server",
              operationId: "executeMcpTool",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        server: { type: "string" },
                        tool: { type: "string" },
                        arguments: { type: "object" }
                      },
                      required: ["server", "tool", "arguments"]
                    }
                  }
                }
              },
              responses: {
                "200": {
                  description: "Tool execution result with cryptographic integrity signature"
                }
              }
            }
          },
          "/voice/conduit/stream": {
            get: {
              summary: "Establish WebSocket / SSE audio token stream with the Orator",
              responses: {
                "101": { description: "Switching Protocols to WebVoice Bus" }
              }
            }
          }
        }
      }, null, 2)
    },
    {
      filename: 'schema.sql',
      path: '/schema.sql',
      language: 'sql',
      badge: 'DATABASE DDL',
      description: 'PostgreSQL & pgvector relational schema for cognitive sessions and vector embeddings',
      content: `-- THE AI FORGE SCHEMA & VECTOR MEMORY DDL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Inquest Diagnostic Sessions
CREATE TABLE IF NOT EXISTS forge_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(32) UNIQUE NOT NULL,
    charter_signed BOOLEAN DEFAULT FALSE,
    charter_signature VARCHAR(128),
    charter_signed_at TIMESTAMP WITH TIME ZONE,
    architectural_score INT DEFAULT 0,
    governance_score INT DEFAULT 0,
    mcp_score INT DEFAULT 0,
    security_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Episodic Cognitive Vectors
CREATE TABLE IF NOT EXISTS cognitive_memory_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES forge_sessions(id) ON DELETE CASCADE,
    node_key VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MCP Tool Invocations & Verification Audit Trail
CREATE TABLE IF NOT EXISTS mcp_audit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES forge_sessions(id) ON DELETE SET NULL,
    server_id VARCHAR(64) NOT NULL,
    tool_name VARCHAR(64) NOT NULL,
    arguments_sanitized JSONB NOT NULL,
    execution_latency_ms INT NOT NULL,
    sha256_fingerprint VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cog_mem_embedding ON cognitive_memory_nodes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_audit_sha ON mcp_audit_records(sha256_fingerprint);
`
    },
    {
      filename: 'seed.sql',
      path: '/seed.sql',
      language: 'sql',
      badge: 'SEED DATA',
      description: 'Seed records for default Forge covenants, MCP catalog, and baseline memory vectors',
      content: `-- SEED DATA FOR THE AI FORGE
INSERT INTO forge_sessions (session_code, charter_signed, charter_signature, architectural_score, governance_score, mcp_score, security_score)
VALUES ('FRG-ALPHA-01', TRUE, 'SIG-CRYPT-77A912', 96, 98, 92, 100)
ON CONFLICT (session_code) DO NOTHING;

INSERT INTO mcp_audit_records (server_id, tool_name, arguments_sanitized, execution_latency_ms, sha256_fingerprint, status)
VALUES 
  ('filesystem-sentinel-mcp', 'compute_artifact_checksum', '{"paths": ["SPEC.md", "schema.sql"]}'::jsonb, 12, '8f434346648f6b96df89dda901c5176b', 'SUCCESS'),
  ('pg-vector-oracle-mcp', 'inspect_db_schema', '{"targetSchema": "public"}'::jsonb, 24, 'ca978112ca1bbdcafac231b39a23dc4d', 'SUCCESS');
`
    },
    {
      filename: 'docker-compose.yml',
      path: '/docker-compose.yml',
      language: 'yaml',
      badge: 'ORCHESTRATION',
      description: 'Docker Compose cluster specification with Forge Director, Postgres pgvector, and MCP Sentinel',
      content: `version: '3.9'

services:
  forge-director:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: forge-director-core
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://forge_admin:forge_secret_phrase@forge-db:5432/forge_nexus
      - MCP_TRANSPORT_DEFAULT=stdio
    depends_on:
      forge-db:
        condition: service_healthy
    networks:
      - forge-internal-net
    restart: unless-stopped

  forge-db:
    image: pgvector/pgvector:pg16
    container_name: forge-pgvector-oracle
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: forge_admin
      POSTGRES_PASSWORD: forge_secret_phrase
      POSTGRES_DB: forge_nexus
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U forge_admin -d forge_nexus"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - forge-internal-net

networks:
  forge-internal-net:
    driver: bridge

volumes:
  pgdata:
`
    },
    {
      filename: 'Dockerfile',
      path: '/Dockerfile',
      language: 'dockerfile',
      badge: 'CONTAINER',
      description: 'Multi-stage hardened production container for The AI Forge runtime',
      content: `# Multi-stage hardened production container
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
USER node

CMD ["node", "dist/server.cjs"]
`
    },
    {
      filename: 'ENV_SETUP.md',
      path: '/docs/ENV_SETUP.md',
      language: 'markdown',
      badge: 'OPERATIONS',
      description: 'Environment provisioning, MCP credentials, and zero-trust onboarding runbook',
      content: `# THE AI FORGE: RUNTIME ENVIRONMENT & ONBOARDING

## 1. Prerequisites
- Node.js >= 20.x
- Docker Engine >= 24.x
- Modern Chromium / WebKit browser with Web Audio API & Web Speech support

## 2. Environment Variables
Create your \`.env\` file based on \`.env.example\`:

\`\`\`bash
# Core AI Secret
GEMINI_API_KEY="AIzaSy..."

# Cloud Host / Web Hook endpoint
APP_URL="https://your-domain.run.app"

# Database Configuration (Docker Compose standard)
DATABASE_URL="postgres://forge_admin:forge_secret_phrase@localhost:5432/forge_nexus"
\`\`\`

## 3. Launching the Local Forge Cluster
\`\`\`bash
# 1. Boot dependencies & database
docker compose up -d

# 2. Run developer preview
npm run dev

# 3. Access Forge Director
open http://localhost:3000
\`\`\`
`
    },
    {
      filename: 'CHARTER.md',
      path: '/CHARTER.md',
      language: 'markdown',
      badge: 'GOVERNANCE',
      description: 'The Ethical Covenant & Operational Charter for Autonomous Forge Operators',
      content: `# THE AI FORGE COVENANT & CHARTER

We, the architects and human operators of the Forge, affirm the following foundational covenants:

### I. Deterministic Verifiability
No synthetic agent shall deliver unverified or hallucinatory executable code. Every artifact produced must undergo static analysis, schema compliance checking, and SHA-256 fingerprint verification.

### II. Explicit Human Authorization
High-impact system state mutations, credential provisions, and production container builds require explicit operator validation via the Verification Gate.

### III. Zero Taint & Ephemeral Sandboxing
Contextual prompts and operator confidential tokens shall never bleed across tenant borders. Volatile scratchpad memory shall be scrubbed upon session termination.

### IV. Acoustic Transparency
The Orb of the Orator serves as the vocal conscience of the system, speaking truthful diagnostic status without obfuscation.
`
    }
  ];
};
