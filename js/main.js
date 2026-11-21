// Tema claro por padrão; a escolha persiste quando o armazenamento é permitido.
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(dark));
  const label = dark ? 'Tema claro' : 'Tema escuro';
  themeToggle.setAttribute('aria-label', `Ativar ${label.toLowerCase()}`);
  themeToggle.querySelector('span').textContent = label;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#111315' : '#ffffff';
}
applyTheme(document.documentElement.dataset.theme === 'dark');
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  applyTheme(dark);
  try { localStorage.setItem('stockfix-portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});

// Demonstração local: recebimento, embalagem e venda, sem serviços externos.
const TOTAL_UNITS = 500;
const UNITS_PER_PACK = 20;
const MAX_PACKS = TOTAL_UNITS / UNITS_PER_PACK;
const slider = document.getElementById('packs');
const grid = document.getElementById('pack-grid');
const receiveButton = document.getElementById('receive-box');
const makeButton = document.getElementById('make-packs');
const sellButton = document.getElementById('sell-packs');
const resetButton = document.getElementById('reset-demo');
const demoState = { received: 0, sold: 0, packedOnce: false };
const slots = Array.from({ length: MAX_PACKS }, (_, i) => {
  const slot = document.createElement('span');
  slot.style.setProperty('--i', i);
  slot.textContent = UNITS_PER_PACK;
  grid.appendChild(slot);
  return slot;
});

function updateDemo(message) {
  const available = demoState.received - demoState.sold;
  const maxPacks = Math.floor(available / UNITS_PER_PACK);
  slider.max = maxPacks;
  const packs = Math.max(0, Math.min(maxPacks, Number(slider.value)));
  slider.value = packs;
  const packed = packs * UNITS_PER_PACK;
  const loose = available - packed;
  document.getElementById('count').value = packs;
  for (const [id, value] of Object.entries({ received: demoState.received, sold: demoState.sold, loose, packed, available })) {
    document.getElementById(id).textContent = value;
  }
  document.getElementById('balance').textContent =
    `Recebidas ${demoState.received} = em estoque ${available} + vendidas ${demoState.sold}.`;
  document.getElementById('summary').textContent = message ||
    `${packs} pacotinhos de 20 + ${loose} unidades soltas. Disponível para vender: ${available} unidades.`;
  slots.forEach((slot, i) => slot.classList.toggle('on', i < packs));
  document.getElementById('bar-packed').style.width = `${packed / TOTAL_UNITS * 100}%`;
  slider.disabled = demoState.received === 0;
  receiveButton.disabled = demoState.received > 0;
  makeButton.disabled = demoState.received === 0 || demoState.packedOnce || demoState.sold > 0;
  sellButton.disabled = packs < 5 || demoState.sold > 0;
  receiveButton.classList.toggle('complete', demoState.received > 0);
  makeButton.classList.toggle('complete', demoState.packedOnce);
  sellButton.classList.toggle('complete', demoState.sold > 0);
  resetButton.hidden = demoState.received === 0;
}
receiveButton.addEventListener('click', () => {
  if (demoState.received) return;
  demoState.received = TOTAL_UNITS;
  slider.value = 0;
  updateDemo('Caixa recebida: 500 unidades em estoque. Agora, monte os pacotinhos.');
});
makeButton.addEventListener('click', () => {
  if (!demoState.received || demoState.packedOnce || demoState.sold) return;
  demoState.packedOnce = true;
  slider.value = 10;
  updateDemo('10 pacotinhos montados: 200 unidades embaladas e 300 soltas. O total continua 500.');
});
sellButton.addEventListener('click', () => {
  if (Number(slider.value) < 5 || demoState.sold) return;
  demoState.sold = 5 * UNITS_PER_PACK;
  slider.value = Number(slider.value) - 5;
  updateDemo('Venda registrada no exemplo: 5 pacotinhos saíram (100 unidades). Restam 400 unidades em estoque.');
});
slider.addEventListener('input', () => {
  if (Number(slider.value) > 0) demoState.packedOnce = true;
  updateDemo();
});
resetButton.addEventListener('click', () => {
  demoState.received = 0;
  demoState.sold = 0;
  demoState.packedOnce = false;
  slider.value = 0;
  updateDemo('Comece recebendo uma caixa de 500 unidades.');
  receiveButton.focus();
});
document.getElementById('demo-actions').hidden = false;
updateDemo('Comece recebendo uma caixa de 500 unidades.');

// Reconstrução por partículas: o próprio conteúdo é revelado por pontos que
// crescem e se unem, enquanto a poeira converge para as mesmas posições.
function createParticleCells(width, height, limit = 96) {
  const size = Math.max(24, Math.sqrt(width * height / limit));
  const cols = Math.max(1, Math.ceil(width / size));
  const rows = Math.max(1, Math.ceil(height / size));
  const cw = width / cols;
  const ch = height / rows;
  return Array.from({ length: cols * rows }, (_, i) => {
    const seed = ((i * 73 + 19) % 101) / 101;
    return {
      x: (i % cols + .5) * cw, y: (Math.floor(i / cols) + .5) * ch,
      radius: Math.hypot(cw, ch) / 2 + 1,
      delay: ((i % cols) % 2 + 2 * (Math.floor(i / cols) % 2)) * .1,
      dx: Math.sin(i * 12.7) * 150,
      dy: 45 + Math.cos(i * 5.3) * 120,
      size: 1.4 + seed * 2.4
    };
  });
}

function particleProgress(progress, delay) {
  return Math.max(0, Math.min(1, (progress - delay) / .62));
}

// Gradientes estáveis: evita decodificar uma nova imagem SVG a cada quadro.
function particleMask(width, height, cells) {
  const cw = cells[0].x * 2;
  const ch = cells[0].y * 2;
  const layers = Array.from({ length: 4 }, (_, i) => {
    const x = cw * (i % 2 + .5);
    const y = ch * (Math.floor(i / 2) + .5);
    return `radial-gradient(circle at ${x}px ${y}px, #000 var(--particle-r${i}, 0px), transparent calc(var(--particle-r${i}, 0px) + .5px))`;
  });
  return { image: layers.join(', '), size: `${cw * 2}px ${ch * 2}px` };
}

function setupEntrance() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  if (motion.matches || !('IntersectionObserver' in window) ||
      !CSS.supports('mask-image', 'linear-gradient(black, black)')) {
    root.classList.remove('intro-pending');
    return;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { root.classList.remove('intro-pending'); return; }
  canvas.className = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const targets = Array.from(document.querySelectorAll(
    '.hero .kicker, .hero h1, .hero .lead, .app-preview, .section-head, ' +
    '.flow > li, .feature, .demo-text, .demo-visual, .tech, .timeline > li, .closing-content'
  ));
  const active = new Map();
  let frame = 0;
  let stopped = false;
  let previousPaint = -Infinity;
  let scale;
  let viewportWidth = window.innerWidth;

  function show(element) {
    element.classList.remove('particle-wait');
    element.style.removeProperty('mask-image');
    element.style.removeProperty('-webkit-mask-image');
    element.style.removeProperty('mask-size');
    element.style.removeProperty('-webkit-mask-size');
    for (let i = 0; i < 4; i++) element.style.removeProperty(`--particle-r${i}`);
    active.delete(element);
  }
  function resize() {
    scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    // A barra de endereço móvel altera só a altura: não reinicia a revelação.
    if (window.innerWidth !== viewportWidth) active.forEach((_, element) => show(element));
    viewportWidth = window.innerWidth;
  }
  function draw(now) {
    frame = 0;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const paintMask = now - previousPaint >= 40;
    if (paintMask) previousPaint = now;
    try {
      active.forEach((animation, element) => {
        const progress = Math.min(1, (now - animation.start) / 1800);
        const rect = element.getBoundingClientRect();
        if (progress >= 1 || rect.bottom < 0 || rect.top > window.innerHeight) {
          show(element);
          return;
        }
        if (paintMask) {
          for (let i = 0; i < 4; i++) {
            const p = particleProgress(progress, i * .1);
            const radius = animation.cells[0].radius * (1 - Math.pow(1 - p, 3));
            element.style.setProperty(`--particle-r${i}`, `${radius.toFixed(2)}px`);
          }
        }
        ctx.fillStyle = animation.color;
        animation.cells.forEach(cell => {
          const p = particleProgress(progress, cell.delay);
          if (p <= 0 || p >= 1) return;
          const travel = Math.pow(1 - p, 2);
          ctx.globalAlpha = Math.sin(p * Math.PI) * .8;
          const x = rect.left + cell.x + cell.dx * travel;
          const y = rect.top + cell.y + cell.dy * travel;
          ctx.fillRect(x, y, cell.size * (1 - p * .6), cell.size * (1 - p * .6));
        });
      });
    } catch {
      // Se o desenho falhar, o conteúdo continua acessível.
      stop();
      return;
    }
    ctx.globalAlpha = 1;
    if (active.size && !stopped) frame = requestAnimationFrame(draw);
  }
  function begin(element) {
    if (stopped || !element.classList.contains('particle-wait')) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    observer.unobserve(element);
    // Limita o custo quando várias partes entram na tela juntas.
    if (active.size >= 6) { show(element); return; }
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    const cells = createParticleCells(width, height, window.innerWidth < 760 ? 64 : 96);
    const mask = particleMask(width, height, cells);
    element.style.maskImage = mask.image;
    element.style.webkitMaskImage = mask.image;
    element.style.maskSize = mask.size;
    element.style.webkitMaskSize = mask.size;
    element.classList.remove('particle-wait');
    active.set(element, {
      start: performance.now(), width, height, cells,
      color: getComputedStyle(root).getPropertyValue('--primary').trim() || '#0f6e56'
    });
    if (!frame) frame = requestAnimationFrame(draw);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) begin(entry.target); });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
  function onFocus(event) {
    targets.forEach(element => {
      if (element.contains(event.target)) { show(element); observer.unobserve(element); }
    });
  }
  function stop() {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    targets.forEach(show);
    canvas.remove();
    window.removeEventListener('resize', resize);
    document.removeEventListener('focusin', onFocus);
  }
  resize();
  targets.forEach(element => {
    const rect = element.getBoundingClientRect();
    // No celular, não esconde o conteúdo que já apareceu no primeiro desenho.
    if (mobile && rect.top < window.innerHeight && rect.bottom > 0) return;
    element.classList.add('particle-wait');
    observer.observe(element);
  });
  root.classList.remove('intro-pending');
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('focusin', onFocus);
  motion.addEventListener('change', event => { if (event.matches) stop(); });
}

setupEntrance();
