type Drop = { x: number; y: number; depth: number; hail: boolean };
export function initHeaderStorm(header: HTMLElement) {
  const surface = header.querySelector<HTMLElement>('[data-storm-surface]');
  const canvas = header.querySelector<HTMLCanvasElement>('[data-storm-canvas]');
  const tools = header.querySelector<HTMLElement>('[data-storm-tools]');
  const pause = header.querySelector<HTMLButtonElement>('[data-storm-pause]');
  const ctx = canvas?.getContext('2d');
  if (!surface || !canvas || !ctx || !tools || !pause) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, visible = true, width = 0, height = 0;
  let wind = 22, targetWind = 22, raf = 0, last = 0, elapsed = 0;
  let nextStrike = 8 + Math.random() * 10, strikeAt = -10;
  let drops: Drop[] = [];

  function resize() {
    if (!surface || !canvas || !ctx) return;
    const bounds = surface.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drops = Array.from({ length: Math.min(150, Math.max(48, Math.floor(width / 9))) }, () => ({ x: Math.random() * width, y: Math.random() * height, depth: .25 + Math.random() * .75, hail: Math.random() > .91 }));
  }

  function illuminate() {
    if (paused) return;
    strikeAt = elapsed;
    nextStrike = elapsed + 9 + Math.random() * 15;
  }

  function draw(now: number) {
    raf = 0;
    if (!ctx || !canvas || paused || !visible || document.hidden) return;
    if (now - last < 32) { raf = requestAnimationFrame(draw); return; }
    const dt = Math.min((now - last) / 1000, .05); last = now; elapsed += dt;
    ctx.clearRect(0, 0, width, height);
    wind += (targetWind - wind) * .07;
    if (elapsed >= nextStrike) illuminate();

    // Fine rain at several depths keeps the mountain photograph readable.
    for (const drop of drops) {
      const speed = 190 + drop.depth * 320;
      drop.y += speed * dt; drop.x += wind * dt * drop.depth;
      if (drop.y > height + 16) { drop.y = -16; drop.x = Math.random() * width; }
      if (drop.x < -20) drop.x = width + 10;
      if (drop.x > width + 20) drop.x = -10;
      ctx.globalAlpha = .06 + drop.depth * .21;
      if (drop.hail) {
        ctx.fillStyle = '#e8f4ff'; ctx.beginPath(); ctx.ellipse(drop.x, drop.y, .7 + drop.depth, 1 + drop.depth, .25, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = '#c0d8ee'; ctx.lineWidth = .45 + drop.depth * .35;
        ctx.beginPath(); ctx.moveTo(drop.x, drop.y); ctx.lineTo(drop.x - wind * .025 * drop.depth, drop.y - 5 - drop.depth * 11); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    const age = elapsed - strikeAt;
    const pulse = age >= 0 && age < .42 ? Math.sin((age / .42) * Math.PI) * .34 : 0;
    header.style.setProperty('--storm-light', pulse.toFixed(3));
    raf = requestAnimationFrame(draw);
  }

  function syncMotion() {
    header.dataset.motionPaused = String(paused || !visible || document.hidden);
    pause!.textContent = paused ? 'Play motion' : 'Pause motion';
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (!paused && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(draw); }
    else { ctx!.clearRect(0, 0, width, height); header.style.setProperty('--storm-light', '0'); }
  }

  surface.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = surface.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    targetWind = 22 + x * 110;
  });
  surface.addEventListener('pointerleave', () => { targetWind = 22; });
  pause.addEventListener('click', () => { paused = !paused; syncMotion(); });
  motion.addEventListener('change', () => { paused = motion.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncMotion(); }).observe(header);
  new ResizeObserver(resize).observe(surface);
  tools.hidden = false; resize(); syncMotion();
}
