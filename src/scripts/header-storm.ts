type Drop = { x: number; y: number; depth: number; hail: boolean };
type Point = { x: number; y: number };

export function initHeaderStorm(header: HTMLElement) {
  const surface = header.querySelector<HTMLElement>('[data-storm-surface]');
  const canvas = header.querySelector<HTMLCanvasElement>('[data-storm-canvas]');
  const tools = header.querySelector<HTMLElement>('[data-storm-tools]');
  const pause = header.querySelector<HTMLButtonElement>('[data-storm-pause]');
  const strikeButton = header.querySelector<HTMLButtonElement>('[data-lightning]');
  const ctx = canvas?.getContext('2d');
  if (!surface || !canvas || !ctx || !tools || !pause || !strikeButton) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, visible = true, width = 0, height = 0;
  let wind = 22, targetWind = 22, raf = 0, last = 0, elapsed = 0;
  let nextStrike = 1.6, strikeAt = -10, lastStrike = -10, strikeX = .7;
  let branches: Point[][] = [], drops: Drop[] = [];

  function resize() {
    if (!surface || !canvas || !ctx) return;
    const bounds = surface.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drops = Array.from({ length: Math.min(150, Math.max(48, Math.floor(width / 9))) }, () => ({ x: Math.random() * width, y: Math.random() * height, depth: .25 + Math.random() * .75, hail: Math.random() > .91 }));
  }

  function pathBetween(start: Point, end: Point, deviation: number, steps = 16): Point[] {
    return Array.from({ length: steps + 1 }, (_, index) => {
      const t = index / steps;
      return { x: start.x + (end.x - start.x) * t + (index && index < steps ? (Math.random() - .5) * deviation : 0), y: start.y + (end.y - start.y) * t };
    });
  }

  function lightning(x = .56 + Math.random() * .3) {
    // One brief pulse at most every 2.5 seconds, including repeated taps.
    if (paused || elapsed - lastStrike < 2.5) return;
    lastStrike = elapsed; strikeAt = elapsed; strikeX = x;
    const start = { x: width * x, y: height * .08 };
    const end = { x: width * (x - .07 + Math.random() * .12), y: height * (.54 + Math.random() * .1) };
    const main = pathBetween(start, end, width * .035, 23);
    branches = [main];
    for (const index of [6, 11, 15]) {
      const origin = main[index];
      branches.push(pathBetween(origin, { x: origin.x + (Math.random() > .5 ? 1 : -1) * width * .075, y: origin.y + height * .14 }, width * .017, 8));
    }
    nextStrike = elapsed + 6 + Math.random() * 7;
  }

  function draw(now: number) {
    raf = 0;
    if (!ctx || !canvas || paused || !visible || document.hidden) return;
    if (now - last < 32) { raf = requestAnimationFrame(draw); return; }
    const dt = Math.min((now - last) / 1000, .05); last = now; elapsed += dt;
    ctx.clearRect(0, 0, width, height);
    wind += (targetWind - wind) * .07;
    if (elapsed >= nextStrike) lightning();

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
    if (age < .65) {
      const pulse = Math.pow(Math.max(0, 1 - age / .65), 3);
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const light = ctx.createRadialGradient(width * strikeX, height * .2, 0, width * strikeX, height * .2, width * .38);
      light.addColorStop(0, `rgba(182,215,255,${pulse * .35})`); light.addColorStop(1, 'rgba(130,185,255,0)');
      ctx.fillStyle = light; ctx.fillRect(0, 0, width, height);
      branches.forEach((branch, index) => {
        ctx.beginPath(); branch.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.globalAlpha = pulse * (index ? .55 : .95);
        ctx.strokeStyle = '#68a8ed'; ctx.lineWidth = index ? 2 : 4; ctx.shadowColor = '#93caff'; ctx.shadowBlur = 18; ctx.stroke();
        ctx.shadowBlur = 0; ctx.strokeStyle = '#f5faff'; ctx.lineWidth = index ? .65 : 1.3; ctx.stroke();
      });
      ctx.restore();
    }
    raf = requestAnimationFrame(draw);
  }

  function syncMotion() {
    header.dataset.motionPaused = String(paused || !visible || document.hidden);
    pause!.textContent = paused ? 'Play motion' : 'Pause motion';
    strikeButton!.disabled = paused;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (!paused && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(draw); }
    else ctx!.clearRect(0, 0, width, height);
  }

  surface.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = surface.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    targetWind = 22 + x * 110;
    header.style.setProperty('--header-x', `${-x * 12}px`);
    header.style.setProperty('--header-y', `${-y * 5}px`);
  });
  surface.addEventListener('pointerleave', () => { targetWind = 22; header.style.setProperty('--header-x', '0px'); header.style.setProperty('--header-y', '0px'); });
  surface.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a,button')) return;
    const rect = surface.getBoundingClientRect();
    lightning(Math.max(.12, Math.min(.88, (event.clientX - rect.left) / rect.width)));
  });
  strikeButton.addEventListener('click', () => lightning());
  pause.addEventListener('click', () => { paused = !paused; syncMotion(); });
  motion.addEventListener('change', () => { paused = motion.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncMotion(); }).observe(header);
  new ResizeObserver(resize).observe(surface);
  tools.hidden = false; resize(); syncMotion();
}
