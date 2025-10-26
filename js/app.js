
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function setYear(){ const y=document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); }

function overlayNav(){
  const menuBtn = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('closeNav');
  const overlay = document.getElementById('overlayNav');
  const toggle = (open) => {
    const next = (typeof open === 'boolean') ? open : !overlay.classList.contains('open');
    overlay.classList.toggle('open', next);
    document.body.classList.toggle('nav-open', next);
    menuBtn?.setAttribute('aria-expanded', String(next));
    overlay?.setAttribute('aria-hidden', String(!next));
  };
  menuBtn?.addEventListener('click', () => toggle(true));
  closeBtn?.addEventListener('click', () => toggle(false));
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) toggle(false); });
}

function heroSlideshow(){
  const slides = $$('.slide'); if (!slides.length) return;
  let idx = 0;
  setInterval(() => { slides[idx].classList.remove('active'); idx=(idx+1)%slides.length; slides[idx].classList.add('active'); }, 8200);
}

function ioReveals(container=document){
  const io = new IntersectionObserver((entries)=>{ entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } }); }, { threshold: 0.2 });
  $$('.reveal', container).forEach(el => io.observe(el));
}

function wordsManifest(rootEl){
  const targets = [rootEl.querySelector('.headline'), rootEl.querySelector('.lead')].filter(Boolean);
  targets.forEach(el => {
    if (el.dataset.manifested) return;
    el.dataset.manifested="1";
    const parts = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    parts.forEach((w)=>{
      const span = document.createElement('span');
      span.className='word';
      span.textContent = w;
      el.appendChild(span);
    });
    const words = $$('.word', el);
    words.forEach((w,i)=> setTimeout(()=> w.classList.add('in'), 220 + i*110));
  });
}

function headlineStagger(container=document){
  $$('.headline', container).forEach(h => wordsManifest(h.parentElement || container));
}

function tiltify(){
  const max = 8;
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * max;
      const ry = (0.5 - px) * max;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

function filtersProjects(){
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  const btns = $$('.filter-btn', grid.closest('main') || document);
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.project-card', grid).forEach(card => {
      const cat = card.getAttribute('data-cat');
      card.style.display = (f==='all'|| f===cat) ? '' : 'none';
    });
  }));
}

function preloader(){
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => { if (pre) setTimeout(() => pre.classList.add('hidden'), 250); });
}

function splashIntro(){
  const splash = document.getElementById('splash');
  const text = document.getElementById('splashText');
  if (!splash || !text) return;
  const chars = Array.from("Studio Prangana"); // ensure visible space
  text.textContent = '';
  chars.forEach((c,i)=>{
    const span = document.createElement('span');
    span.className = 'char';
    if (c === ' ') { span.classList.add('space'); span.textContent = '\u00A0'; }
    else { span.textContent = c; }
    text.appendChild(span);
    setTimeout(()=> span.classList.add('in'), 90*i + 200);
  });
  setTimeout(()=> splash.classList.add('hidden'), 2600);
  setTimeout(()=> splash.remove(), 3400);
}

function glassCursor(){
  const fx = document.getElementById('glassFX');
  if (!fx) return;
  let idleTimer;
  const onMove = (e) => {
    document.documentElement.style.setProperty('--mx', e.clientX+'px');
    document.documentElement.style.setProperty('--my', e.clientY+'px');
    document.body.classList.remove('mouse-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(()=>document.body.classList.add('mouse-idle'), 1200);
  };
  window.addEventListener('pointermove', onMove);
}

function initPage(container=document){
  setYear();
  overlayNav();
  heroSlideshow();
  ioReveals(container);
  headlineStagger(container);
  tiltify();
  filtersProjects();
  glassCursor();
}

preloader();
document.addEventListener('DOMContentLoaded', () => {
  splashIntro();
  initPage(document);
});
