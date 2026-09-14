export interface OrbOptions {
  isSpeaking: boolean;
  isListening: boolean;
  accentColor?: string;
  intensity?: number;
}

export class OrbRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number = 0;
  private time: number = 0;
  private options: OrbOptions = {
    isSpeaking: false,
    isListening: false,
    accentColor: '#f59e0b',
    intensity: 1.0,
  };
  private particles: {
    x: number;
    y: number;
    angle: number;
    speed: number;
    dist: number;
    size: number;
    alpha: number;
    hue: number;
  }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initParticles();
    this.handleResize = this.handleResize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  private handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 320) * dpr;
    this.canvas.height = (rect.height || 320) * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public updateOptions(opts: Partial<OrbOptions>) {
    this.options = { ...this.options, ...opts };
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < 48; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.8,
        dist: 40 + Math.random() * 80,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.7,
        hue: Math.random() > 0.3 ? 38 : 190 // Amber vs Cyan
      });
    }
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
  }

  private loop() {
    this.time += 0.03;
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 320;
    const h = rect.height || 320;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const isSpeaking = this.options.isSpeaking;
    const isListening = this.options.isListening;
    const basePulse = Math.sin(this.time * 2) * 4;
    const voicePulse = isSpeaking ? Math.sin(this.time * 8) * 14 : isListening ? Math.sin(this.time * 5) * 8 : 0;
    const coreRadius = 46 + basePulse + voicePulse;

    // 1. Ambient Background Corona Glow
    const bgGrad = ctx.createRadialGradient(cx, cy, coreRadius * 0.2, cx, cy, coreRadius * 2.2);
    if (isSpeaking) {
      bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
      bgGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (isListening) {
      bgGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      bgGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.2)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      bgGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.08)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Orbital Gyroscopic Rings
    const ringCount = 3;
    for (let r = 0; r < ringCount; r++) {
      ctx.save();
      ctx.translate(cx, cy);
      const ringRadius = coreRadius + 22 + r * 18;
      const rotationSpeed = (r % 2 === 0 ? 1 : -1) * (0.015 + r * 0.005);
      ctx.rotate(this.time * rotationSpeed + (r * Math.PI) / 3);

      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius, ringRadius * (0.35 + r * 0.2), 0, 0, Math.PI * 2);
      ctx.strokeStyle = isSpeaking 
        ? `rgba(251, 191, 36, ${0.45 - r * 0.1})` 
        : isListening 
        ? `rgba(56, 189, 248, ${0.45 - r * 0.1})` 
        : `rgba(217, 119, 6, ${0.25 - r * 0.05})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12 + r * 6]);
      ctx.stroke();

      // Gyro marker pips
      const pipAngle = this.time * 0.8 + r * 2;
      const pipX = Math.cos(pipAngle) * ringRadius;
      const pipY = Math.sin(pipAngle) * (ringRadius * (0.35 + r * 0.2));
      ctx.beginPath();
      ctx.arc(pipX, pipY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isSpeaking ? '#fef08a' : isListening ? '#a5f3fc' : '#fde68a';
      ctx.fill();

      ctx.restore();
    }

    // 3. Floating Spark Particles
    for (const p of this.particles) {
      p.dist += p.speed * (isSpeaking ? 2 : 1);
      if (p.dist > 120) {
        p.dist = coreRadius * 0.6;
        p.alpha = 0.8;
      }
      p.angle += 0.01;
      const px = cx + Math.cos(p.angle) * p.dist;
      const py = cy + Math.sin(p.angle) * p.dist;

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue === 38 
        ? `rgba(251, 191, 36, ${p.alpha * 0.6})` 
        : `rgba(56, 189, 248, ${p.alpha * 0.6})`;
      ctx.fill();
    }

    // 4. Inner Plasma Core
    const coreGrad = ctx.createRadialGradient(cx - 10, cy - 12, 4, cx, cy, coreRadius);
    if (isSpeaking) {
      coreGrad.addColorStop(0, '#fffbeb');
      coreGrad.addColorStop(0.3, '#f59e0b');
      coreGrad.addColorStop(0.8, '#b45309');
      coreGrad.addColorStop(1, '#78350f');
    } else if (isListening) {
      coreGrad.addColorStop(0, '#f0fdf4');
      coreGrad.addColorStop(0.3, '#06b6d4');
      coreGrad.addColorStop(0.8, '#0369a1');
      coreGrad.addColorStop(1, '#082f49');
    } else {
      coreGrad.addColorStop(0, '#fef3c7');
      coreGrad.addColorStop(0.4, '#d97706');
      coreGrad.addColorStop(0.8, '#92400e');
      coreGrad.addColorStop(1, '#451a03');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = isSpeaking ? '#f59e0b' : isListening ? '#06b6d4' : '#d97706';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Orator Center Sigil & Waveform Ticks
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    const spokeCount = 8;
    for (let s = 0; s < spokeCount; s++) {
      const angle = (s * Math.PI * 2) / spokeCount + this.time * 0.4;
      const spokeInner = coreRadius * 0.45;
      const spokeOuter = coreRadius * 0.85 + (isSpeaking ? Math.sin(this.time * 6 + s) * 5 : 0);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * spokeInner, cy + Math.sin(angle) * spokeInner);
      ctx.lineTo(cx + Math.cos(angle) * spokeOuter, cy + Math.sin(angle) * spokeOuter);
      ctx.stroke();
    }

    this.animId = requestAnimationFrame(this.loop);
  }
}
