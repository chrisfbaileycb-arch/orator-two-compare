import { MindMapEdge, MindMapNode } from '../lib/types';

export class MindMapGraphRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number = 0;
  private time: number = 0;
  private nodes: MindMapNode[] = [];
  private edges: MindMapEdge[] = [];
  private selectedNode: MindMapNode | null = null;
  private draggedNode: MindMapNode | null = null;
  private onSelectCallback?: (node: MindMapNode | null) => void;

  constructor(canvas: HTMLCanvasElement, onSelect?: (node: MindMapNode | null) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onSelectCallback = onSelect;
    this.initDefaultGraph();

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.handleResize);
    canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.handleResize();
  }

  private handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 800) * dpr;
    this.canvas.height = (rect.height || 540) * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private initDefaultGraph() {
    const cx = 400;
    const cy = 270;

    this.nodes = [
      {
        id: 'node-director',
        label: 'Forge Director',
        role: 'Autonomous Cognitive Orchestrator',
        category: 'core',
        status: 'active',
        x: cx,
        y: cy,
        radius: 38,
        description: 'Primary coordinator. Manages task delegation, agent routing, and skill dispatch.',
        details: {
          'Engine': 'L3 Autonomous DAG',
          'Concurrency': '8 Worker Streams',
          'Verification': 'Strict SHA-256'
        }
      },
      {
        id: 'node-orator',
        label: 'Orb of the Orator',
        role: 'Acoustic Voice & Speech Bus',
        category: 'agent',
        status: 'active',
        x: cx - 190,
        y: cy - 110,
        radius: 30,
        description: 'Verbal communication conduit. Streams acoustic feedback, speech synthesis, and operator commands.',
        details: {
          'Conduit': 'Web Speech API + Web Audio',
          'Harmonics': 'FFT Waveform Tracking',
          'Latency': '<15ms'
        }
      },
      {
        id: 'node-inquest',
        label: 'Inquest Diagnostic',
        role: 'Architectural Discovery Engine',
        category: 'protocol',
        status: 'active',
        x: cx - 190,
        y: cy + 110,
        radius: 28,
        description: 'Evaluates architectural intent, risk posture, and compliance readiness before synthesis.',
        details: {
          'Stage Status': 'Evaluated',
          'Integrity Score': '96%',
          'Covenants': 'Enforced'
        }
      },
      {
        id: 'node-mcp-fs',
        label: 'MCP Filesystem',
        role: 'Sandboxed I/O Sentinel',
        category: 'tool',
        status: 'active',
        x: cx + 190,
        y: cy - 110,
        radius: 28,
        description: 'Provides sandboxed, immutable read/write operations for system deliverables and OpenAPI schemas.',
        details: {
          'Transport': 'Stdio Process Pipe',
          'Tools': '3 Registered',
          'Security Sandbox': 'Active'
        }
      },
      {
        id: 'node-mcp-oracle',
        label: 'PgVector Oracle',
        role: 'Semantic Long-term RAG',
        category: 'database',
        status: 'active',
        x: cx + 190,
        y: cy + 110,
        radius: 28,
        description: 'PostgreSQL episodic vector embeddings store for institutional memory and cosine recall.',
        details: {
          'Transport': 'SSE Streaming',
          'Embeddings': '1536-dim IVFFlat',
          'Recall Latency': '22ms'
        }
      },
      {
        id: 'node-verification',
        label: 'Verification Gate',
        role: 'Cryptographic Sentry',
        category: 'security',
        status: 'active',
        x: cx,
        y: cy + 175,
        radius: 26,
        description: 'Enforces the Charter covenant, validates SHA-256 deliverable checksums, and locks production gates.',
        details: {
          'Check Algorithm': 'SHA-256 Checksum',
          'Charter State': 'Sealed',
          'Audit Log': 'Immutable'
        }
      }
    ];

    this.edges = [
      { id: 'e1', source: 'node-director', target: 'node-orator', type: 'control', animated: true },
      { id: 'e2', source: 'node-director', target: 'node-inquest', type: 'data', animated: true },
      { id: 'e3', source: 'node-director', target: 'node-mcp-fs', type: 'rpc', animated: true },
      { id: 'e4', source: 'node-director', target: 'node-mcp-oracle', type: 'rpc', animated: true },
      { id: 'e5', source: 'node-director', target: 'node-verification', type: 'telemetry', animated: true },
      { id: 'e6', source: 'node-orator', target: 'node-inquest', type: 'data' },
      { id: 'e7', source: 'node-mcp-fs', target: 'node-verification', type: 'telemetry' }
    ];
  }

  private handleMouseDown(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      const dx = mx - n.x;
      const dy = my - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 6) {
        this.selectedNode = n;
        this.draggedNode = n;
        if (this.onSelectCallback) {
          this.onSelectCallback(n);
        }
        return;
      }
    }

    this.selectedNode = null;
    if (this.onSelectCallback) {
      this.onSelectCallback(null);
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.draggedNode) return;
    const rect = this.canvas.getBoundingClientRect();
    this.draggedNode.x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
    this.draggedNode.y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top));
  }

  private handleMouseUp() {
    this.draggedNode = null;
  }

  public start() {
    if (!this.animId) {
      this.loop();
    }
  }

  public stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = 0;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  private loop() {
    this.time += 0.02;
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 800;
    const h = rect.height || 540;

    ctx.clearRect(0, 0, w, h);

    // Subtle canvas background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Edges
    for (const edge of this.edges) {
      const src = this.nodes.find(n => n.id === edge.source);
      const tgt = this.nodes.find(n => n.id === edge.target);
      if (!src || !tgt) continue;

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      if (edge.type === 'control') {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // Amber
      } else if (edge.type === 'rpc') {
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)'; // Cyan
      } else if (edge.type === 'telemetry') {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'; // Purple
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      }
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated energy packet traveling down edge
      if (edge.animated) {
        const t = (this.time * 0.6 + edge.id.charCodeAt(1) * 0.3) % 1;
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = edge.type === 'rpc' ? '#38bdf8' : '#fbbf24';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw Nodes
    for (const node of this.nodes) {
      const isSelected = this.selectedNode?.id === node.id;
      const pulse = Math.sin(this.time * 2 + node.radius) * 2;

      // Outer Selection Ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Base Node Fill
      const grad = ctx.createRadialGradient(
        node.x - node.radius * 0.3,
        node.y - node.radius * 0.3,
        2,
        node.x,
        node.y,
        node.radius
      );

      if (node.category === 'core') {
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(0.4, '#d97706');
        grad.addColorStop(1, '#451a03');
      } else if (node.category === 'tool' || node.category === 'database') {
        grad.addColorStop(0, '#e0f2fe');
        grad.addColorStop(0.4, '#0284c7');
        grad.addColorStop(1, '#082f49');
      } else if (node.category === 'security') {
        grad.addColorStop(0, '#f3e8ff');
        grad.addColorStop(0.4, '#9333ea');
        grad.addColorStop(1, '#3b0764');
      } else {
        grad.addColorStop(0, '#f4f4f5');
        grad.addColorStop(0.4, '#52525b');
        grad.addColorStop(1, '#18181b');
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = node.category === 'core' ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = isSelected ? 18 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#fbbf24' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node Label
      ctx.fillStyle = '#f4f4f5';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y + node.radius + 14);

      // Status indicator pip
      ctx.beginPath();
      ctx.arc(node.x + node.radius * 0.7, node.y - node.radius * 0.7, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e'; // green active
      ctx.fill();
    }

    this.animId = requestAnimationFrame(this.loop);
  }
}
