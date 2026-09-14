# THE AI FORGE: RUNTIME ENVIRONMENT & ONBOARDING

## 1. Prerequisites
- Node.js >= 20.x
- Docker Engine >= 24.x
- Modern Chromium / WebKit browser with Web Audio API & Web Speech support

## 2. Environment Variables
Create your `.env` file based on `.env.example`:

```bash
# Core AI Secret
GEMINI_API_KEY="AIzaSy..."

# Cloud Host / Web Hook endpoint
APP_URL="https://your-domain.run.app"

# Database Configuration (Docker Compose standard)
DATABASE_URL="postgres://forge_admin:forge_secret_phrase@localhost:5432/forge_nexus"
```

## 3. Launching the Local Forge Cluster
```bash
# 1. Boot dependencies & database
docker compose up -d

# 2. Run developer preview
npm run dev

# 3. Access Forge Director
open http://localhost:3000
```
