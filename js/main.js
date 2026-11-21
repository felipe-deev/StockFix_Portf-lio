// StockFix · Portfólio — simulação de pacotinhos
// Uma caixa com 500 unidades; cada pacotinho leva 20.

const TOTAL_UNITS = 500;
const UNITS_PER_PACK = 20;
const MAX_PACKS = TOTAL_UNITS / UNITS_PER_PACK; // 25

const slider = document.getElementById('packs');
const countOut = document.getElementById('count');
const looseEl = document.getElementById('loose');
const packedEl = document.getElementById('packed');
const summaryEl = document.getElementById('summary');
const grid = document.getElementById('pack-grid');
const bar = document.getElementById('bar-packed');

// Monta os 25 espaços de pacotinho uma única vez
const slots = Array.from({ length: MAX_PACKS }, () => {
  const slot = document.createElement('span');
  slot.textContent = UNITS_PER_PACK;
  grid.appendChild(slot);
  return slot;
});

function update() {
  const packs = Number(slider.value);
  const packed = packs * UNITS_PER_PACK;
  const loose = TOTAL_UNITS - packed;

  countOut.value = packs;
  looseEl.textContent = loose;
  packedEl.textContent = packed;
  summaryEl.textContent =
    `${packs} pacotinhos de ${UNITS_PER_PACK} unidades + ${loose} unidades soltas = ${TOTAL_UNITS} unidades.`;

  slots.forEach((slot, i) => slot.classList.toggle('on', i < packs));
  bar.style.width = `${(packed / TOTAL_UNITS) * 100}%`;
}

slider.addEventListener('input', update);
update();
