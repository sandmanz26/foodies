// The 3D glass. Everything is built in code (no model downloads): lathe-turned glassware,
// a liquid that fills by raising a clipping plane, ice and garnishes that drop in.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Color, Vector2, Vector3, Plane,
  LatheGeometry, CircleGeometry, CylinderGeometry, SphereGeometry, TubeGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, ShaderMaterial,
  DirectionalLight, HemisphereLight, CanvasTexture, CatmullRomCurve3, PMREMGenerator,
  BufferAttribute, DoubleSide, AdditiveBlending, SRGBColorSpace, NoToneMapping,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';

const WALL = 0.035;

/* ---------- glassware: radius as a function of height ---------- */
const GLASSWARE = {
  highball: { h: 2.6, base: 0.16, profile: [[0, 0.5], [2.6, 0.54]] },
  collins: { h: 2.85, base: 0.16, profile: [[0, 0.43], [2.85, 0.46]] },
  rocks: { h: 1.55, base: 0.24, profile: [[0, 0.66], [1.55, 0.78]] },
  tumbler: { h: 1.6, base: 0.14, profile: [[0, 0.5], [0.3, 0.72], [0.9, 0.82], [1.6, 0.74]] },
  coupe: { h: 2.0, base: 1.24, stem: true, profile: [[1.2, 0.07], [1.32, 0.5], [1.55, 0.8], [2.0, 0.96]] },
};

function radiusAt(profile, y) {
  if (y <= profile[0][0]) return profile[0][1];
  for (let i = 1; i < profile.length; i++) {
    const [y1, r1] = profile[i];
    const [y0, r0] = profile[i - 1];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0);
      const s = t * t * (3 - 2 * t); // ease between control points so curved glasses read as curved
      return r0 + (r1 - r0) * (profile.length > 2 ? s : t);
    }
  }
  return profile[profile.length - 1][1];
}

function glassGeometry(g) {
  const pts = [];
  const y0 = g.profile[0][0];
  if (g.stem) {
    // foot and stem
    [[0, 0], [0.56, 0], [0.56, 0.04], [0.16, 0.1], [0.055, 0.22], [0.05, y0 - 0.08]].forEach(([r, y]) => pts.push(new Vector2(r, y)));
  } else {
    pts.push(new Vector2(0, 0));
  }
  const N = 26;
  for (let i = 0; i <= N; i++) {
    const y = y0 + ((g.h - y0) * i) / N;
    pts.push(new Vector2(radiusAt(g.profile, y), y));
  }
  for (let i = N; i >= 0; i--) {
    const y = g.base + ((g.h - g.base) * i) / N;
    pts.push(new Vector2(Math.max(0.001, radiusAt(g.profile, y) - WALL), y));
  }
  pts.push(new Vector2(0, g.base));
  return new LatheGeometry(pts, 56);
}

/* ---------- drinks ---------- */
const DRINKS = {
  senja: {
    fill: 0.9,
    stops: [[0, '#F6E2B8'], [0.6, '#F1D9A6'], [0.72, '#4A2412'], [0.95, '#33170B'], [0.97, '#C98B4A'], [1, '#D9A066']],
    ice: [[-0.14, 0.5, 0.1], [0.16, 0.92, -0.08], [-0.1, 1.36, -0.12], [0.14, 1.78, 0.12]],
    garnish: 'orange',
  },
  jambu: {
    fill: 0.93,
    stops: [[0, '#F58FB0'], [0.8, '#F9A9C3'], [0.9, '#FFD3E0'], [1, '#FFE9F0']],
    ice: [],
    garnish: 'beans',
  },
  kelapa: {
    fill: 0.86,
    stops: [[0, '#FFF8EC'], [0.34, '#FBEEDB'], [0.52, '#C08A5C'], [0.74, '#7A4423'], [1, '#55290F']],
    ice: [[-0.26, 0.56, 0.12], [0.26, 0.74, -0.14], [-0.04, 1.08, 0.2]],
    garnish: 'pandan',
  },
  aren: {
    fill: 0.7,
    stops: [[0, '#C9762A'], [0.6, '#B0601C'], [1, '#8C4310']],
    ice: [[0, 0.62, 0, 0.62]],
    garnish: 'peel',
  },
  telang: {
    fill: 0.9,
    stops: [[0, '#1E2FBF'], [0.36, '#2D3FD6'], [0.52, '#8B3BD1'], [0.66, '#B040B8'], [0.78, '#3F1D10'], [0.96, '#33170B'], [0.98, '#C98B4A'], [1, '#D9A066']],
    ice: [[-0.1, 0.5, 0.08], [0.1, 0.94, -0.1], [-0.08, 1.4, -0.06], [0.1, 1.86, 0.1], [-0.06, 2.26, 0.04]],
    garnish: 'lemon',
  },
};

const tmpA = new Color();
const tmpB = new Color();
function colorAt(stops, t, out = new Color()) {
  if (t <= stops[0][0]) return out.set(stops[0][1]);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const k = (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]);
      return out.copy(tmpA.set(stops[i - 1][1])).lerp(tmpB.set(stops[i][1]), k);
    }
  }
  return out.set(stops[stops.length - 1][1]);
}

function citrusTexture(rind, flesh, pith = '#FFF1C9') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = rind;
  x.beginPath(); x.arc(128, 128, 128, 0, 7); x.fill();
  x.fillStyle = pith;
  x.beginPath(); x.arc(128, 128, 112, 0, 7); x.fill();
  x.fillStyle = flesh;
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    x.beginPath();
    x.moveTo(128 + Math.cos(a + 0.35) * 14, 128 + Math.sin(a + 0.35) * 14);
    x.arc(128, 128, 102, a + 0.07, a + (Math.PI * 2) / 9 - 0.07);
    x.closePath();
    x.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function citrusWheel(rind, flesh, r = 0.34) {
  const face = new MeshStandardMaterial({ map: citrusTexture(rind, flesh), roughness: 0.55 });
  const side = new MeshStandardMaterial({ color: rind, roughness: 0.6 });
  return new Mesh(new CylinderGeometry(r, r, 0.05, 40), [side, face, face]);
}

function buildGarnish(kind, g, topY) {
  const root = new Group();
  const rim = radiusAt(g.profile, g.h);
  if (kind === 'orange' || kind === 'lemon') {
    const wheel = kind === 'orange' ? citrusWheel('#E0731A', '#F7A63B') : citrusWheel('#F2C91D', '#FFE873', 0.3);
    wheel.rotation.set(Math.PI / 2, 0, 0.25);
    wheel.position.set(rim * 0.55, g.h + 0.02, rim * 0.2);
    root.add(wheel);
  } else if (kind === 'beans') {
    const mat = new MeshStandardMaterial({ color: '#4A2513', roughness: 0.5 });
    const groove = new MeshStandardMaterial({ color: '#2A1309', roughness: 0.6 });
    [[-0.16, 0.02, 0.4], [0.12, -0.1, -0.5], [0.06, 0.16, 1.3]].forEach(([x, z, rot]) => {
      const bean = new Group();
      const body = new Mesh(new SphereGeometry(0.1, 20, 14), mat);
      body.scale.set(1.35, 0.5, 0.95);
      const cut = new Mesh(new CylinderGeometry(0.012, 0.012, 0.24, 6), groove);
      cut.rotation.z = Math.PI / 2;
      cut.position.y = 0.04;
      bean.add(body, cut);
      bean.position.set(x, topY + 0.03, z);
      bean.rotation.y = rot;
      root.add(bean);
    });
  } else if (kind === 'pandan') {
    const mat = new MeshStandardMaterial({ color: '#2E9E4F', roughness: 0.55, side: DoubleSide });
    const dark = new MeshStandardMaterial({ color: '#1D7A3A', roughness: 0.55, side: DoubleSide });
    [[0.55, 0.62, 0.0], [0.2, 0.78, 0.5], [-0.25, 0.5, -0.4]].forEach(([lean, len, yaw], i) => {
      const geo = new PlaneGeometry(0.17, len, 1, 8);
      const pos = geo.attributes.position;
      for (let k = 0; k < pos.count; k++) {
        const y = pos.getY(k) / len + 0.5; // 0 at the knot, 1 at the tip
        pos.setX(k, pos.getX(k) * (1 - y * 0.92));
        pos.setZ(k, Math.sin(y * 1.9) * 0.2 * (0.6 + lean));
        pos.setY(k, pos.getY(k) + len / 2);
      }
      geo.computeVertexNormals();
      const leaf = new Mesh(geo, i % 2 ? dark : mat);
      leaf.rotation.set(0, yaw, -lean);
      root.add(leaf);
    });
    const knot = new Mesh(new SphereGeometry(0.1, 16, 12), dark);
    knot.scale.set(1.2, 0.8, 1);
    root.add(knot);
    root.position.set(0.12, topY + 0.1, 0.05);
  } else if (kind === 'peel') {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const a = t * Math.PI * 3.2;
      pts.push(new Vector3(Math.cos(a) * (0.16 + t * 0.07), t * 0.85, Math.sin(a) * (0.16 + t * 0.07)));
    }
    const peel = new Mesh(
      new TubeGeometry(new CatmullRomCurve3(pts), 60, 0.05, 8),
      new MeshStandardMaterial({ color: '#F08A1C', roughness: 0.5 }),
    );
    peel.scale.set(1, 1, 0.45);
    peel.rotation.z = -0.5;
    peel.position.set(0.24, topY - 0.3, 0.28);
    root.add(peel);
  }
  return root;
}

function rimLightMaterial() {
  // Fresnel edge glow: draws the glass the way an illustrator would, as a bright outline.
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: { uColor: { value: new Color('#FFFFFF') } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
      void main(){ float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); f = pow(f, 3.2); gl_FragColor = vec4(uColor, f * 0.6); }`,
  });
}

function buildDrink(product) {
  const g = GLASSWARE[product.glass];
  const d = DRINKS[product.id];
  const root = new Group();
  const lift = new Group(); // everything that bobs together
  root.add(lift);

  // liquid
  const fillTop = g.base + (g.h - g.base) * d.fill;
  const pts = [new Vector2(0, g.base)];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const y = g.base + ((fillTop - g.base) * i) / N;
    pts.push(new Vector2(Math.max(0.001, (radiusAt(g.profile, y) - WALL) * 0.985), y));
  }
  const liquidGeo = new LatheGeometry(pts, 56);
  const pos = liquidGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    colorAt(d.stops, (pos.getY(i) - g.base) / (fillTop - g.base), c);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  liquidGeo.setAttribute('color', new BufferAttribute(colors, 3));
  const clip = new Plane(new Vector3(0, -1, 0), 0);
  const liquid = new Mesh(liquidGeo, new MeshStandardMaterial({ vertexColors: true, roughness: 0.45, envMapIntensity: 0.6, clippingPlanes: [clip], side: DoubleSide }));
  const cap = new Mesh(new CircleGeometry(1, 56), new MeshStandardMaterial({ roughness: 0.45, envMapIntensity: 0.6 }));
  cap.rotation.x = -Math.PI / 2;
  lift.add(liquid, cap);

  // ice
  const ice = d.ice.map(([x, y, z, size = 0.36]) => {
    const tint = colorAt(d.stops, (y + g.base - g.base) / (fillTop - g.base)).lerp(new Color('#FFFFFF'), 0.45);
    const m = new Mesh(
      new RoundedBoxGeometry(size, size, size, 3, size * 0.16),
      new MeshPhysicalMaterial({ color: tint, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1 }),
    );
    m.position.set(x, y + g.base, z);
    m.rotation.set(Math.random(), Math.random() * 3, Math.random());
    m.userData.restY = m.position.y;
    lift.add(m);
    return m;
  });

  // garnish
  const garnish = buildGarnish(d.garnish, g, fillTop);
  const gWrap = new Group();
  gWrap.add(garnish);
  lift.add(gWrap);

  // glass: a faint body, a bright fresnel edge
  const glassGeo = glassGeometry(g);
  const body = new Mesh(glassGeo, new MeshPhysicalMaterial({
    color: '#FFFFFF', transparent: true, opacity: 0.1, roughness: 0.03, metalness: 0, clearcoat: 1, envMapIntensity: 1.6, depthWrite: false, side: DoubleSide,
  }));
  const edge = new Mesh(glassGeo, rimLightMaterial());
  body.renderOrder = 2;
  edge.renderOrder = 3;
  lift.add(body, edge);

  // flat cartoon shadow
  const shadow = new Mesh(new CircleGeometry(1, 40), new MeshBasicMaterial({ color: '#2A1610', transparent: true, opacity: 0.2, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  const footR = g.stem ? 0.56 : radiusAt(g.profile, 0);
  shadow.scale.set(footR * 1.9, footR * 1.25, 1);
  shadow.position.set(footR * 0.55, -0.01, 0);
  root.add(shadow);

  // scale every glass to a comparable on-screen size
  const k = 2.75 / Math.max(g.h + 0.5, 2.3);
  root.scale.setScalar(k);

  const state = { level: 0 };
  function sync() {
    const y = g.base + (fillTop - g.base) * state.level;
    clip.constant = (lift.position.y + y) * k + root.position.y;
    cap.visible = state.level > 0.004;
    cap.position.y = y;
    cap.scale.setScalar(Math.max(0.001, (radiusAt(g.profile, y) - WALL) * 0.985));
    colorAt(d.stops, state.level, cap.material.color);
  }
  sync();
  return { root, lift, ice, garnish: gWrap, shadow, state, sync, height: g.h * k };
}

export function createGlassStage(canvas, products) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.localClippingEnabled = true;
  renderer.toneMapping = NoToneMapping; // brand colours must stay as specified, not be filmic-graded
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environmentIntensity = 0.45;
  const sun = new DirectionalLight('#FFFFFF', 1.5);
  sun.position.set(-3, 6, 5);
  scene.add(sun, new HemisphereLight('#FFFFFF', '#FFE2B8', 1.1));

  const camera = new PerspectiveCamera(26, 1, 0.1, 60);
  const drinks = [];
  let current = null;
  let active = false;
  let raf = 0;
  let spin = 0;
  let vel = 0;
  let dragging = false;
  let lastX = 0;
  let t0 = performance.now();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, w < 700 ? 1.75 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the glass the same share of the stage height on any aspect ratio
    const dist = 9.4;
    camera.position.set(0, 2.5, dist);
    camera.lookAt(0, 1.32, 0);
    camera.updateProjectionMatrix();
  }

  function show(i) {
    if (current && current.index === i) return;
    const prev = current;
    if (prev) {
      gsap.killTweensOf([prev.root.position, prev.root.scale, prev.state]);
      gsap.to(prev.root.position, { y: -5, duration: 0.38, ease: 'power2.in', onUpdate: prev.sync, onComplete: () => scene.remove(prev.root) });
    }
    const d = drinks[i] || (drinks[i] = buildDrink(products[i]));
    d.index = i;
    current = d;
    scene.add(d.root);
    spin = -0.9;
    vel = 0.05;

    const tl = gsap.timeline({ delay: prev ? 0.18 : 0, onUpdate: d.sync });
    gsap.killTweensOf([d.root.position, d.lift.scale, d.state, d.garnish.scale, d.garnish.position, d.shadow.material, ...d.ice.map((m) => m.position)]);
    d.root.position.y = 6;
    d.state.level = 0;
    d.garnish.scale.setScalar(0.001);
    d.garnish.position.y = 1.2;
    d.shadow.material.opacity = 0;
    d.ice.forEach((m) => { m.position.y = m.userData.restY + 5; m.visible = false; });
    d.sync();

    tl.to(d.root.position, { y: 0, duration: 0.75, ease: 'bounce.out' }, 0)
      .to(d.shadow.material, { opacity: 0.2, duration: 0.4 }, 0.25)
      .fromTo(d.lift.scale, { x: 1.12, y: 0.86, z: 1.12 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, 0.42);
    d.ice.forEach((m, k) => {
      tl.set(m, { visible: true }, 0.5 + k * 0.1)
        .to(m.position, { y: m.userData.restY, duration: 0.55, ease: 'bounce.out' }, 0.5 + k * 0.1);
    });
    const pourAt = 0.75 + d.ice.length * 0.1;
    tl.to(d.state, { level: 1, duration: 1.25, ease: 'power1.inOut' }, pourAt)
      .to(d.garnish.scale, { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(2.6)' }, pourAt + 1.05)
      .to(d.garnish.position, { y: 0, duration: 0.6, ease: 'bounce.out' }, pourAt + 1.05);
    kick();
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;
    if (current) {
      if (!dragging) {
        vel += (0.32 * dt - vel) * 0.04; // ease back to a lazy idle spin
        spin += vel;
      }
      current.root.rotation.y = spin;
      current.lift.position.y = Math.sin(now / 900) * 0.035;
      current.sync();
    }
    renderer.render(scene, camera);
    if (active) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!raf && active) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
  }

  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx * 0.012;
    spin += vel;
  });
  const release = () => { dragging = false; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  new ResizeObserver(resize).observe(canvas);
  resize();

  return {
    show,
    setActive(v) { active = v; if (v) kick(); },
  };
}
