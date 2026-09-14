-- SEED DATA FOR THE AI FORGE
INSERT INTO forge_sessions (session_code, charter_signed, charter_signature, architectural_score, governance_score, mcp_score, security_score)
VALUES ('FRG-ALPHA-01', TRUE, 'SIG-CRYPT-77A912', 96, 98, 92, 100)
ON CONFLICT (session_code) DO NOTHING;

INSERT INTO mcp_audit_records (server_id, tool_name, arguments_sanitized, execution_latency_ms, sha256_fingerprint, status)
VALUES 
  ('filesystem-sentinel-mcp', 'compute_artifact_checksum', '{"paths": ["SPEC.md", "schema.sql"]}'::jsonb, 12, '8f434346648f6b96df89dda901c5176b', 'SUCCESS'),
  ('pg-vector-oracle-mcp', 'inspect_db_schema', '{"targetSchema": "public"}'::jsonb, 24, 'ca978112ca1bbdcafac231b39a23dc4d', 'SUCCESS');
