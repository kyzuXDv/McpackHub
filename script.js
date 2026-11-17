/* =========================================================
   LOGIKA HALAMAN — JANGAN EDIT KECUALI MAU UBAH FITUR
   Data pack ada di newup.js
   ========================================================= */

/* ============ IKON ============ */
const ICONS = {
  texture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  addon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6M9 5l3 3 3-3"/><circle cx="12" cy="15" r="6"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
  skin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/></svg>`,
  world: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  shader: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  empty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`
};

/* ============ STATE ============ */
const state = { category: 'all', query: '', downloading: new Set() };

/* ============ ELEMEN ============ */
const grid        = document.getElementById('grid');
const chipsBox    = document.getElementById('chips');
const searchInput = document.getElementById('searchInput');
const clearBtn    = document.getElementById('clearSearch');
const resultText  = document.getElementById('resultText');
const toastWrap   = document.getElementById('toastWrap');

/* ============ RENDER ============ */
function getFiltered() {
  return FILES
    .filter(f => {
      const matchCat = state.category === 'all' || f.type === state.category;
      const q = state.query.toLowerCase().trim();
      const matchQuery = !q ||
        f.name.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.ext.toLowerCase().includes(q);
      return matchCat && matchQuery;
    })
    .sort((a, b) => b.id - a.id);   // id terbesar (terbaru) di atas
}

function render() {
  const list = getFiltered();

  if (state.query || state.category !== 'all') {
    resultText.textContent = `Menampilkan ${list.length} dari ${FILES.length} pack`;
  } else {
    resultText.textContent = 'Menampilkan semua pack';
  }

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty">
        ${ICONS.empty}
        <h3>Pack tidak ditemukan</h3>
        <p>Coba kata kunci lain atau ganti kategori.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((f, i) => `
  <article class="card" data-id="${f.id}" style="animation-delay:${i * 45}ms">
    
    <!-- Bagian Gambar (Banner) -->
    <div class="card-img-wrap">
      ${f.image 
        ? `<img src="${f.image}" class="card-img" alt="${f.name}" loading="lazy">` 
        : `<div class="card-img-placeholder" data-type="${f.type}">${f.name.charAt(0).toUpperCase()}</div>`
      }
      <span class="file-ext">${f.ext}</span>
    </div>

    <!-- Teks & Tombol -->
    <h3 class="file-name">${f.name}</h3>
    <p class="file-desc">${f.desc}</p>
    <div class="file-meta">
      <span>${f.size}</span>
      <span class="sep"></span>
      <span>${f.version}</span>
    </div>
    <button class="btn-dl" data-id="${f.id}">
      <span class="fill"></span>
      ${ICONS.download}
      <span class="label">Download</span>
    </button>
  </article>
`).join('');
}

/* ============ FILTER CHIP ============ */
chipsBox.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  chipsBox.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  state.category = chip.dataset.cat;
  render();
});

/* ============ SEARCH ============ */
let searchTimer;
searchInput.addEventListener('input', e => {
  state.query = e.target.value;
  clearBtn.classList.toggle('show', state.query.length > 0);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(render, 140);
});
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  state.query = '';
  clearBtn.classList.remove('show');
  searchInput.focus();
  render();
});

/* ============ GLOW KARTU ============ */
grid.addEventListener('mousemove', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
});

/* ============ DOWNLOAD ============ */
grid.addEventListener('click', e => {
  const btn = e.target.closest('.btn-dl');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (state.downloading.has(id) || btn.classList.contains('done')) return;
  startDownload(id, btn);
});

function startDownload(id, btn) {
  const file = FILES.find(f => f.id === id);
  if (!file) return;

  state.downloading.add(id);
  btn.classList.add('loading');

  const fill  = btn.querySelector('.fill');
  const label = btn.querySelector('.label');

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 9 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      finish();
    }
    fill.style.width = progress + '%';
    label.textContent = `Mengunduh ${Math.floor(progress)}%`;
  }, 130);

  function finish() {
    state.downloading.delete(id);

    btn.classList.remove('loading');
    btn.classList.add('done');
    fill.style.width = '0%';
    btn.innerHTML = `
      <span class="fill"></span>
      ${ICONS.check}
      <span class="label">Selesai</span>`;

    if (file.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name + '.' + file.ext.toLowerCase();
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    showToast(`"${file.name}" berhasil diunduh`);

    setTimeout(() => {
      btn.classList.remove('done');
      btn.innerHTML = `
        <span class="fill"></span>
        ${ICONS.download}
        <span class="label">Download</span>`;
    }, 2500);
  }
}

/* ============ TOAST ============ */
function showToast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${ICONS.check}<span>${msg}</span>`;
  toastWrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

/* ============ STATISTIK ============ */
function updateStats() {
  const totalSize = FILES.reduce((a, f) => a + f.sizeMB, 0);
  animateNumber('statFiles', FILES.length);
  document.getElementById('statSize').textContent =
    totalSize >= 1024
      ? (totalSize / 1024).toFixed(1) + ' GB'
      : Math.round(totalSize) + ' MB';
}

function animateNumber(elId, target) {
  const el = document.getElementById(elId);
  const start = Number(el.textContent.replace(/\D/g, '')) || 0;
  const dur = 700;
  const t0 = performance.now();
  function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(start + (target - start) * eased).toLocaleString('id-ID');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============ TEMA ============ */
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const ICON_SUN  = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`;
const ICON_MOON = `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>`;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.innerHTML = theme === 'dark' ? ICON_SUN : ICON_MOON;
  localStorage.setItem('mcp-theme', theme);
}
themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('mcp-theme') || 'dark');

/* ============ INIT ============ */
render();
updateStats();