
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
    menuBtn?.classList.toggle('open', next);
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
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (e.isIntersecting){
        gsap.to(e.target, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  $$('.reveal', container).forEach(el => {
    gsap.set(el, { y: 50, opacity: 0 });
    io.observe(el);
  });
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
  initLiquidGlass();
}

preloader();
document.addEventListener('DOMContentLoaded', () => {
  splashIntro();
  initPage(document);

  barba.init({
    transitions: [{
      name: 'default-transition',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          y: 50,
          duration: 0.5
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          y: 50,
          duration: 0.5
        });
      }
    }]
  });

  barba.hooks.after(() => {
    initPage(document);
  });

  function initLiquidGlass() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        varying vec2 vUv;

        // 2D Random
        float random (in vec2 st) {
            return fract(sin(dot(st.xy,
                                 vec2(12.9898,78.233)))
                        * 43758.5453123);
        }

        // 2D Noise based on Morgan McGuire @morgan3d
        // https://www.shadertoy.com/view/4dS3Wd
        float noise (in vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          float time = uTime * 0.1;
          float distortion = noise(uv * 10.0 + time) * 0.1;
          uv.x += distortion;
          uv.y += distortion;
          gl_FragColor = texture2D(uTexture, uv);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animate() {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  }
});
