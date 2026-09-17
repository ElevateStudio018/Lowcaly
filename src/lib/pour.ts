import * as THREE from "three";

/**
 * The mango finale: the pack tips, juice fills a glass, and five ice cubes
 * drop in one after another with a splash and a slow swirl. Everything here
 * is driven by a single 0-1 `progress` value from the scroll stage, so the
 * whole sequence scrubs cleanly in either direction — nothing plays out on
 * its own except the swirl's continuous turn and the cubes' idle bob.
 */

const CUBE_COUNT = 5;
/** Where in the 0-1 progress range each phase lives. */
const FILL_END = 0.22;
const ICE_START = 0.28;
const ICE_END = 0.96;
const ICE_SPAN = (ICE_END - ICE_START) / CUBE_COUNT;
/** Share of a cube's window spent falling; the rest is settled and bobbing. */
const FALL_SHARE = 0.42;
/** How long a splash ring stays on screen, in progress units. */
const SPLASH_LIFE = 0.05;
/** Crown spikes and flying droplets live a little longer than the flat ring. */
const CROWN_LIFE = 0.085;
const DROPLET_LIFE = 0.12;
const CROWN_COUNT = 8;
const DROPLET_COUNT = 7;

const GLASS_R_TOP = 0.34;
const GLASS_R_BOTTOM = 0.29;
const GLASS_H = 1.05;
const LIQUID_R = GLASS_R_TOP * 0.9;
const LIQUID_MAX_H = GLASS_H * 0.72;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const band = (v: number, from: number, to: number) => smooth((v - from) / (to - from));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (v: number) => Math.pow(clamp01(v), 2);
const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 2.2);
/** Deterministic pseudo-random in [0,1) — a fixed function of the seed, not
 *  Math.random(), so a splash looks identical however the scroll scrubs. */
const pseudo = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Small canvas-drawn spiral, used as the swirl disc's texture. */
function swirlTexture(color: string) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.translate(size / 2, size / 2);
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    for (let arm = 0; arm < 3; arm++) {
      ctx.save();
      ctx.rotate((arm * Math.PI * 2) / 3);
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.02) {
        const r = t * size * 0.46;
        const a = t * Math.PI * 2.1;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 5;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.restore();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function buildPour(liquidColor: string, liquidDeep: string) {
  const group = new THREE.Group();

  // --- glass -------------------------------------------------------------
  // Plain transparency rather than physical transmission: transmission
  // forces Three.js to render the scene to a background texture for every
  // transmissive object, every frame — six of them here (the glass plus
  // five ice cubes) was enough to stall a software renderer for hundreds of
  // milliseconds a frame, which showed up as the whole finale lagging well
  // behind the scroll position.
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.15,
    metalness: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const glassGeometry = new THREE.CylinderGeometry(GLASS_R_TOP, GLASS_R_BOTTOM, GLASS_H, 28, 1, true);
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  group.add(glass);

  const rimMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  });
  const rimGeometry = new THREE.TorusGeometry(GLASS_R_TOP, 0.008, 8, 32);
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = GLASS_H / 2;
  group.add(rim);

  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
  });
  const baseGeometry = new THREE.CircleGeometry(GLASS_R_BOTTOM, 28);
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.rotation.x = -Math.PI / 2;
  base.position.y = -GLASS_H / 2;
  group.add(base);

  // --- liquid --------------------------------------------------------------
  const liquidMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(liquidColor),
    transparent: true,
    opacity: 0.92,
    roughness: 0.35,
    metalness: 0,
  });
  const liquidGeometry = new THREE.CylinderGeometry(LIQUID_R, LIQUID_R * 0.96, 1, 28, 1);
  const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.visible = false;
  group.add(liquid);

  const glassBottomY = -GLASS_H / 2 + 0.02;

  // --- swirl on the liquid surface -----------------------------------------
  const swirlMap = swirlTexture(liquidDeep);
  const swirlMaterial = new THREE.MeshBasicMaterial({
    map: swirlMap,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const swirlGeometry = new THREE.CircleGeometry(LIQUID_R * 0.94, 28);
  const swirl = new THREE.Mesh(swirlGeometry, swirlMaterial);
  swirl.rotation.x = -Math.PI / 2;
  swirl.visible = false;
  group.add(swirl);

  // --- pour stream ---------------------------------------------------------
  const streamMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(liquidColor),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const streamGeometry = new THREE.CylinderGeometry(0.026, 0.018, 1, 10);
  const stream = new THREE.Mesh(streamGeometry, streamMaterial);
  group.add(stream);

  // --- ice cubes -------------------------------------------------------------
  const iceMaterial = () =>
    new THREE.MeshStandardMaterial({
      color: 0xe8f6fb,
      transparent: true,
      opacity: 0.68,
      roughness: 0.08,
      metalness: 0,
      depthWrite: false,
    });
  const cubeSize = 0.185;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMaterials: THREE.MeshStandardMaterial[] = [];
  const cubes: THREE.Mesh[] = [];
  // Scattered rest spots so five cubes don't stack on one point.
  const cubeSpots = [
    { x: -0.14, z: 0.08, rest: 0.01 },
    { x: 0.15, z: -0.05, rest: 0.05 },
    { x: -0.04, z: -0.16, rest: -0.03 },
    { x: 0.1, z: 0.15, rest: 0.03 },
    { x: 0.02, z: -0.01, rest: -0.02 },
  ];
  for (let i = 0; i < CUBE_COUNT; i++) {
    const material = iceMaterial();
    cubeMaterials.push(material);
    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.visible = false;
    cube.userData.spin = 0.6 + i * 0.31;
    group.add(cube);
    cubes.push(cube);
  }

  // --- splash rings ----------------------------------------------------------
  const ringMaterial = () =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  const ringGeometry = new THREE.RingGeometry(0.5, 1, 24);
  const ringMaterials: THREE.MeshBasicMaterial[] = [];
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < CUBE_COUNT; i++) {
    const material = ringMaterial();
    ringMaterials.push(material);
    const ring = new THREE.Mesh(ringGeometry, material);
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    group.add(ring);
    rings.push(ring);
  }

  // A splash reads as a crown of water thrown up around the impact point
  // plus a scatter of droplets arcing clear of the glass — the flat ring
  // above is just the ripple; this is the part that actually sells "splash".
  // White rather than a tint of the juice: lerping the liquid colour toward
  // white in Three's linear working space came out pink, not the pale foam
  // a real splash throws up, and a plain white also reads at a glance next
  // to a pack that already carries all the mango colour the scene needs.
  const crownMaterial = () =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  const crownGeometry = new THREE.ConeGeometry(0.032, 0.26, 5);
  const crownMaterials: THREE.MeshBasicMaterial[][] = [];
  const crowns: THREE.Mesh[][] = [];

  const dropletMaterial = () =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
  const dropletGeometry = new THREE.SphereGeometry(0.034, 6, 5);
  const dropletMaterials: THREE.MeshBasicMaterial[][] = [];
  const droplets: THREE.Mesh[][] = [];

  for (let i = 0; i < CUBE_COUNT; i++) {
    const cMats: THREE.MeshBasicMaterial[] = [];
    const cMeshes: THREE.Mesh[] = [];
    for (let j = 0; j < CROWN_COUNT; j++) {
      const material = crownMaterial();
      cMats.push(material);
      const mesh = new THREE.Mesh(crownGeometry, material);
      mesh.visible = false;
      group.add(mesh);
      cMeshes.push(mesh);
    }
    crownMaterials.push(cMats);
    crowns.push(cMeshes);

    const dMats: THREE.MeshBasicMaterial[] = [];
    const dMeshes: THREE.Mesh[] = [];
    for (let k = 0; k < DROPLET_COUNT; k++) {
      const material = dropletMaterial();
      dMats.push(material);
      const mesh = new THREE.Mesh(dropletGeometry, material);
      mesh.visible = false;
      const scale = mix(0.55, 1, pseudo(i * 23 + k * 11 + 2));
      mesh.scale.setScalar(scale);
      group.add(mesh);
      dMeshes.push(mesh);
    }
    dropletMaterials.push(dMats);
    droplets.push(dMeshes);
  }

  let swirlAngle = 0;

  /**
   * @param progress 0-1 within the finale's own window.
   * @param time elapsed seconds, for the swirl and the idle cube bob.
   * @param dt seconds since the last frame, so the swirl accelerates
   *   smoothly regardless of frame rate.
   * @param sceneFade the pack/backdrop fade, so the pour reads as part of
   *   the same moment rather than a separate layer.
   */
  function update(progress: number, time: number, dt: number, sceneFade: number) {
    const p = clamp01(progress);
    const visible = p > 0.001 && sceneFade > 0.01;
    group.visible = visible;
    if (!visible) return;

    // Fill: the liquid rises from nothing to its working level.
    const fill = easeOut(clamp01(p / FILL_END));
    const level = LIQUID_MAX_H * fill;
    liquid.visible = fill > 0.01;
    liquid.scale.y = Math.max(level, 0.001);
    liquid.position.y = glassBottomY + level / 2;

    // Stream: only on screen while actively pouring, at the start of fill.
    const streamT = band(p, 0.02, 0.1) * (1 - band(p, FILL_END - 0.05, FILL_END + 0.02));
    stream.material.opacity = streamT * 0.85 * sceneFade;
    const streamTop = glassBottomY + LIQUID_MAX_H + 0.55;
    const streamBottom = glassBottomY + level;
    const streamLen = Math.max(streamTop - streamBottom, 0.05);
    stream.scale.y = streamLen;
    stream.position.set(0.01, (streamTop + streamBottom) / 2, 0);

    let splashKick = 0;
    let topLevel = level;

    cubes.forEach((cube, i) => {
      const spot = cubeSpots[i];
      const start = ICE_START + i * ICE_SPAN;
      const fallEnd = start + ICE_SPAN * FALL_SHARE;
      const local = clamp01((p - start) / (fallEnd - start));
      const active = p >= start;
      cube.visible = active;
      if (!active) return;

      const fall = easeIn(local);
      const dropFrom = glassBottomY + LIQUID_MAX_H + 0.75 + i * 0.08;
      const restY = glassBottomY + Math.max(level - cubeSize * 0.3, cubeSize * 0.4) + spot.rest;
      const y = mix(dropFrom, restY, fall);
      const bob = local >= 1 ? Math.sin(time * 1.6 + i * 2.1) * 0.012 : 0;
      cube.position.set(spot.x, y + bob, spot.z);
      cube.rotation.set(
        time * 0.3 * cube.userData.spin * (1 - fall * 0.85),
        time * 0.5 * cube.userData.spin,
        (1 - fall) * 1.4,
      );
      cubeMaterials[i].opacity = 0.6 * sceneFade;

      // Splash the instant this cube reaches the surface.
      const ringT = clamp01((p - fallEnd) / SPLASH_LIFE);
      const ring = rings[i];
      const ringMat = ringMaterials[i];
      if (ringT < 1 && p >= fallEnd) {
        ring.visible = true;
        const s = mix(0.22, 0.85, easeOut(ringT));
        ring.scale.setScalar(s);
        ring.position.set(spot.x, glassBottomY + level + 0.012, spot.z);
        ringMat.opacity = (1 - ringT) * 0.9 * sceneFade;
        splashKick += (1 - ringT) * 0.9;
      } else {
        ring.visible = false;
      }

      // Crown: a ring of spikes thrown up from the impact point, rising fast
      // and settling back down as they fade — the part of a splash that
      // actually reads as "something hit the liquid" rather than a ripple.
      const surfaceY = glassBottomY + level;
      const crownT = clamp01((p - fallEnd) / CROWN_LIFE);
      const crownActive = crownT < 1 && p >= fallEnd;
      for (let j = 0; j < CROWN_COUNT; j++) {
        const shard = crowns[i][j];
        shard.visible = crownActive;
        if (!crownActive) continue;
        const shardMat = crownMaterials[i][j];
        const jitter = pseudo(i * 7 + j * 5 + 3);
        const angle = (j / CROWN_COUNT) * Math.PI * 2 + i * 0.9 + jitter * 0.5;
        const riseT = easeOut(clamp01(crownT / 0.35));
        const fadeT = band(crownT, 0.5, 1);
        const heightScale = riseT * (1 - fadeT * 0.85);
        const outward = LIQUID_R * mix(0.58, 0.92, riseT) * mix(0.85, 1.15, jitter);
        const rise = mix(0, 0.15, riseT) * (1 - fadeT * 0.6);
        shard.position.set(
          spot.x + Math.cos(angle) * outward,
          surfaceY + 0.09 * heightScale + rise,
          spot.z + Math.sin(angle) * outward,
        );
        // Point outward and up rather than straight up, like water thrown
        // clear of the impact rather than a fountain jet.
        shard.rotation.set(0, -angle, Math.PI * 0.16 * mix(0.6, 1, jitter));
        shard.scale.set(1, Math.max(heightScale, 0.001), 1);
        shardMat.opacity = riseT * (1 - fadeT) * sceneFade;
        splashKick += (1 - crownT) * 0.5;
      }

      // Droplets: thrown clear on a simple parabola (up then back down to
      // the surface, guaranteed to land exactly as its life ends) rather
      // than simulated gravity, so scrubbing the scroll never leaves one
      // stranded mid-air.
      const dropT = clamp01((p - fallEnd) / DROPLET_LIFE);
      const dropletsActive = dropT < 1 && p >= fallEnd;
      for (let k = 0; k < DROPLET_COUNT; k++) {
        const drop = droplets[i][k];
        drop.visible = dropletsActive;
        if (!dropletsActive) continue;
        const dropMat = dropletMaterials[i][k];
        const rA = pseudo(i * 31 + k * 7);
        const rB = pseudo(i * 17 + k * 3 + 1);
        const rC = pseudo(i * 23 + k * 11 + 2);
        const angle = (k / DROPLET_COUNT) * Math.PI * 2 + i * 1.3 + rA * 0.7;
        const peakRise = mix(0.16, 0.4, rB);
        const maxDist = mix(0.14, 0.34, rC);
        const arc = 4 * dropT * (1 - dropT); // 0 -> 1 -> 0 across the life
        const outward = maxDist * easeOut(dropT);
        drop.position.set(
          spot.x + Math.cos(angle) * outward,
          surfaceY + peakRise * arc,
          spot.z + Math.sin(angle) * outward,
        );
        const fadeIn = band(dropT, 0, 0.1);
        const fadeOut = 1 - band(dropT, 0.75, 1);
        dropMat.opacity = fadeIn * fadeOut * sceneFade;
      }

      if (local >= 1) topLevel = Math.max(topLevel, level);
    });

    // Swirl: a slow constant turn, sped up right after a splash.
    swirlAngle += (0.35 + splashKick * 2.2) * dt;
    swirl.visible = fill > 0.05;
    swirl.rotation.z = swirlAngle;
    swirl.position.y = glassBottomY + topLevel + 0.008;
    swirlMaterial.opacity = 0.55 * sceneFade;

    // Fade every material with the shared envelope so the pour never reads
    // brighter or more solid than the pack it belongs to.
    glassMaterial.opacity = 0.16 * sceneFade;
    rimMaterial.opacity = 0.5 * sceneFade;
    baseMaterial.opacity = 0.14 * sceneFade;
    liquidMaterial.opacity = 0.92 * sceneFade;
    cubeMaterials.forEach((m) => (m.opacity = 0.6 * sceneFade));
  }

  function dispose() {
    glassGeometry.dispose();
    glassMaterial.dispose();
    rimGeometry.dispose();
    rimMaterial.dispose();
    baseGeometry.dispose();
    baseMaterial.dispose();
    liquidGeometry.dispose();
    liquidMaterial.dispose();
    swirlGeometry.dispose();
    swirlMaterial.dispose();
    swirlMap.dispose();
    streamGeometry.dispose();
    streamMaterial.dispose();
    cubeGeometry.dispose();
    cubeMaterials.forEach((m) => m.dispose());
    ringGeometry.dispose();
    ringMaterials.forEach((m) => m.dispose());
    crownGeometry.dispose();
    crownMaterials.forEach((row) => row.forEach((m) => m.dispose()));
    dropletGeometry.dispose();
    dropletMaterials.forEach((row) => row.forEach((m) => m.dispose()));
  }

  return { group, update, dispose };
}
