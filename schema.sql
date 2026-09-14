-- THE AI FORGE SCHEMA & VECTOR MEMORY DDL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

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
