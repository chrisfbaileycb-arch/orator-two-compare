export class PlasmaRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number = 0;
  private time: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    this.handleResize();
  }

  private handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private handleMouseMove(e: MouseEvent) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
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
  }

  private loop() {
    this.time += 0.008;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    // Dark cyber backdrop clear
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, width, height);

    // Subtle plasma glow nodes
    const focalPoints = [
      {
        x: width * 0.2 + Math.sin(this.time * 0.7) * 120,
        y: height * 0.3 + Math.cos(this.time * 0.5) * 80,
        radius: width * 0.45,
        color: 'rgba(217, 119, 6, 0.04)' // Amber glow
      },
      {
        x: width * 0.8 + Math.cos(this.time * 0.6) * 150,
        y: height * 0.7 + Math.sin(this.time * 0.8) * 100,
        radius: width * 0.5,
        color: 'rgba(14, 165, 233, 0.035)' // Cyan glow
      },
      {
        x: width * 0.5 + Math.sin(this.time * 0.9) * 80,
        y: height * 0.5 + Math.cos(this.time * 1.1) * 60,
        radius: width * 0.35,
        color: 'rgba(168, 85, 247, 0.03)' // Purple glow
      },
      {
        x: this.mouseX,
        y: this.mouseY,
        radius: 260,
        color: 'rgba(245, 158, 11, 0.03)' // Subtle cursor follower
      }
    ];

    for (const pt of focalPoints) {
      const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius);
      grad.addColorStop(0, pt.color);
      grad.addColorStop(1, 'rgba(8, 8, 12, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // High-tech subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSize = 64;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    this.animId = requestAnimationFrame(this.loop);
  }
}
