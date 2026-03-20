import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Text, Decal } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════
   Custom face textures — draw eyes, brows, mouth
   directly on transparent canvas. The colored sphere
   IS the blob head; these are just the facial features.
   ═══════════════════════════════════════════════ */
const faceCache = new Map<string, THREE.CanvasTexture>();

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, px?: number, py?: number) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2c2c2c';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(px ?? x, py ?? y + h * 0.05, w * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc((px ?? x) - w * 0.2, (py ?? y) - h * 0.15, w * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function getFaceTexture(emotion: string): THREE.CanvasTexture {
  if (faceCache.has(emotion)) return faceCache.get(emotion)!;
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = S; canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, S, S);
  const cx = S / 2, cy = S / 2;

  switch (emotion) {
    case 'happy': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 70, cy - 90, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 70, cy - 90, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 40, 28, 32);
      drawEye(ctx, cx + 70, cy - 40, 28, 32);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx, cy + 45, 75, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy + 45, 75, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 75, cy + 45); ctx.lineTo(cx + 75, cy + 45); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,120,0.3)';
      ctx.beginPath(); ctx.ellipse(cx - 105, cy + 15, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 105, cy + 15, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'sad': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 70); ctx.quadraticCurveTo(cx - 70, cy - 100, cx - 40, cy - 80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 100, cy - 70); ctx.quadraticCurveTo(cx + 70, cy - 100, cx + 40, cy - 80); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 35, 26, 24, cx - 70, cy - 28);
      drawEye(ctx, cx + 70, cy - 35, 26, 24, cx + 70, cy - 28);
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(cx, cy + 100, 50, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      ctx.fillStyle = 'rgba(80,160,255,0.7)';
      ctx.beginPath(); ctx.ellipse(cx + 95, cy + 5, 10, 18, 0.2, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'angry': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 105, cy - 60); ctx.lineTo(cx - 40, cy - 85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 105, cy - 60); ctx.lineTo(cx + 40, cy - 85); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 35, 26, 22, cx - 62, cy - 32);
      drawEye(ctx, cx + 70, cy - 35, 26, 22, cx + 62, cy - 32);
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx - 55, cy + 40, 110, 35);
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 5;
      ctx.strokeRect(cx - 55, cy + 40, 110, 35);
      for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 55 + i * 22, cy + 40); ctx.lineTo(cx - 55 + i * 22, cy + 75); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(200,50,50,0.5)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx + 90, cy - 110); ctx.lineTo(cx + 100, cy - 95); ctx.lineTo(cx + 85, cy - 95); ctx.lineTo(cx + 95, cy - 80); ctx.stroke();
      break;
    }
    case 'scared': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 70, cy - 105, 35, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 70, cy - 105, 35, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      drawEye(ctx, cx - 68, cy - 40, 34, 38);
      drawEye(ctx, cx + 68, cy - 40, 34, 38);
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 55);
      ctx.quadraticCurveTo(cx - 25, cy + 40, cx, cy + 55);
      ctx.quadraticCurveTo(cx + 25, cy + 70, cx + 50, cy + 55);
      ctx.stroke();
      ctx.fillStyle = 'rgba(80,180,255,0.6)';
      ctx.beginPath(); ctx.ellipse(cx + 110, cy - 50, 10, 16, 0.3, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'excited': {
      const drawStar = (sx: number, sy: number, r: number) => {
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const method = i === 0 ? 'moveTo' : 'lineTo';
          ctx[method](sx + Math.cos(a) * r, sy + Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
      };
      drawStar(cx - 68, cy - 35, 30);
      drawStar(cx + 68, cy - 35, 30);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 75, cy - 45, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 61, cy - 45, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2c2c2c';
      ctx.beginPath(); ctx.ellipse(cx, cy + 55, 55, 40, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c0392b';
      ctx.beginPath(); ctx.ellipse(cx, cy + 65, 30, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,120,120,0.35)';
      ctx.beginPath(); ctx.ellipse(cx - 110, cy + 10, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 110, cy + 10, 24, 15, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'surprised': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 70, cy - 110, 32, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 70, cy - 110, 32, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 40, 36, 40);
      drawEye(ctx, cx + 70, cy - 40, 36, 40);
      ctx.fillStyle = '#2c2c2c';
      ctx.beginPath(); ctx.ellipse(cx, cy + 60, 30, 35, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#8b0000';
      ctx.beginPath(); ctx.ellipse(cx, cy + 62, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'proud': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 70, cy - 85, 28, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 40, cy - 95); ctx.quadraticCurveTo(cx + 70, cy - 110, cx + 100, cy - 90); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 38, 26, 20, cx - 65, cy - 35);
      drawEye(ctx, cx + 70, cy - 38, 26, 20, cx + 65, cy - 35);
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cx - 70, cy - 44, 26, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 70, cy - 44, 26, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx - 35, cy + 50); ctx.quadraticCurveTo(cx + 10, cy + 65, cx + 50, cy + 40); ctx.stroke();
      break;
    }
    case 'nervous': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 70); ctx.quadraticCurveTo(cx - 70, cy - 95, cx - 40, cy - 75); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 40, cy - 75); ctx.quadraticCurveTo(cx + 70, cy - 95, cx + 100, cy - 70); ctx.stroke();
      drawEye(ctx, cx - 68, cy - 35, 24, 28);
      drawEye(ctx, cx + 68, cy - 35, 22, 24, cx + 72, cy - 32);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy + 45); ctx.lineTo(cx + 55, cy + 45);
      ctx.lineTo(cx + 55, cy + 70); ctx.lineTo(cx - 55, cy + 70); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 5;
      ctx.strokeRect(cx - 55, cy + 45, 110, 25);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { ctx.moveTo(cx - 55 + i * 22, cy + 45); ctx.lineTo(cx - 55 + i * 22, cy + 70); }
      ctx.stroke();
      ctx.fillStyle = 'rgba(80,180,255,0.5)';
      ctx.beginPath(); ctx.ellipse(cx - 110, cy - 30, 9, 14, -0.3, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'disgusted': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 75); ctx.lineTo(cx - 40, cy - 65); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 100, cy - 75); ctx.lineTo(cx + 40, cy - 65); ctx.stroke();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx - 95, cy - 35); ctx.quadraticCurveTo(cx - 68, cy - 50, cx - 40, cy - 35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 40, cy - 35); ctx.quadraticCurveTo(cx + 68, cy - 50, cx + 95, cy - 35); ctx.stroke();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(cx - 68, cy - 38, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 68, cy - 38, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy + 50, 40, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath(); ctx.ellipse(cx, cy + 80, 20, 25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(cx, cy + 80, 20, 25, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 8, cy + 5); ctx.quadraticCurveTo(cx, cy - 5, cx + 8, cy + 5); ctx.stroke();
      break;
    }
    case 'friendly': {
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 70, cy - 90, 28, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 70, cy - 90, 28, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      drawEye(ctx, cx - 70, cy - 38, 28, 30, cx - 70, cy - 34);
      drawEye(ctx, cx + 70, cy - 38, 28, 30, cx + 70, cy - 34);
      ctx.strokeStyle = '#2c2c2c'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(cx, cy + 30, 55, 0.15, Math.PI - 0.15); ctx.stroke();
      ctx.fillStyle = 'rgba(255,100,120,0.4)';
      ctx.beginPath(); ctx.ellipse(cx - 108, cy + 15, 26, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 108, cy + 15, 26, 16, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  faceCache.set(emotion, tex);
  return tex;
}

/* ═══════════════════════════════════════════════
   GLOBAL TIMELINE — 60s loop
   ═══════════════════════════════════════════════ */
const LOOP = 60;

// Global registry for all characters to avoid overlap
const CHARACTERS: { id: string; pos: THREE.Vector3; radius: number }[] = [];

// Get cursor position in world space
const G = { time: 0, shake: 0, cursor: new THREE.Vector3() };

function TimelineTicker() {
  const { mouse, camera } = useThree();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();

  useFrame((_, d) => {
    G.time = (G.time + d) % LOOP;
    G.shake *= 0.9;
    
    // Update cursor world position
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, G.cursor);
  });
  return null;
}

const lerpA = (a: number, b: number, t: number) => a + (b - a) * t;

/* ═══════════════════════════════════════════════
   EMOJI CHARACTER — fully articulated
   ═══════════════════════════════════════════════ */
interface EmojiProps {
  emotion: string;
  color: string;
  face: string;
  label: string;
  waypoints: [number, number, number][];
  speed: number;
  bodyScale?: number;
  idleAnim: 'bounce' | 'sway' | 'tremble' | 'spin' | 'wave' | 'stomp';
  actionSeq: { start: number; end: number; action: string }[];
  behavior?: 'follow' | 'run' | 'patrol';
}

function EmojiCharacter({
  emotion, color, label, waypoints, speed, bodyScale = 1, idleAnim, actionSeq, behavior = 'patrol'
}: EmojiProps) {
  const outerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const lArmUpper = useRef<THREE.Group>(null);
  const rArmUpper = useRef<THREE.Group>(null);
  const lArmLower = useRef<THREE.Group>(null);
  const rArmLower = useRef<THREE.Group>(null);
  const lLegUpper = useRef<THREE.Group>(null);
  const rLegUpper = useRef<THREE.Group>(null);
  const lLegLower = useRef<THREE.Group>(null);
  const rLegLower = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const s = useRef({
    id: Math.random().toString(36).slice(2),
    wpIdx: 1,
    pos: new THREE.Vector3(...waypoints[0]),
    target: new THREE.Vector3(...(waypoints[1] || waypoints[0])),
    angle: 0,
    cycle: Math.random() * 10,
    radius: bodyScale * 1.5 // approximate collision radius
  });

  useFrame((_, delta) => {
    if (!outerRef.current || !bodyRef.current) return;
    const st = s.current;
    
    // Register or update global position
    let charMatch = CHARACTERS.find(c => c.id === st.id);
    if (!charMatch) {
      charMatch = { id: st.id, pos: st.pos, radius: st.radius };
      CHARACTERS.push(charMatch);
    } else {
      charMatch.pos.copy(st.pos);
    }
    
    const t = G.time;
    st.cycle += delta;
    const c = st.cycle;

    let act: string | null = null;
    let ap = 0, ae = 0;
    for (const e of actionSeq) {
      if (t >= e.start && t < e.end) {
        act = e.action;
        ae = t - e.start;
        ap = ae / (e.end - e.start);
        break;
      }
    }

    // Behavior logic (Cursor Interaction vs Patrol)
    let moveDir = new THREE.Vector3();
    let isWalking = false;
    let targetDist = 0;

    const cursorDist = st.pos.distanceTo(G.cursor);
    
    if (behavior === 'follow' && cursorDist > 2) {
      // Follow cursor
      targetDist = cursorDist;
      moveDir.subVectors(G.cursor, st.pos).normalize();
      isWalking = true;
      st.target.copy(G.cursor);
    } else if (behavior === 'run' && cursorDist < 6) {
      // Run away from cursor
      targetDist = cursorDist;
      moveDir.subVectors(st.pos, G.cursor).normalize();
      isWalking = true;
      st.target.copy(st.pos).add(moveDir.clone().multiplyScalar(2));
    } else {
      // Normal Patrol
      moveDir.subVectors(st.target, st.pos);
      targetDist = moveDir.length();
      if (targetDist < 0.3) {
        st.wpIdx = (st.wpIdx + 1) % waypoints.length;
        st.target.set(...waypoints[st.wpIdx]);
      } else {
        moveDir.normalize();
        isWalking = true;
      }
    }

    // Collision Avoidance (Boids Separation)
    const avoidance = new THREE.Vector3();
    let collisionCount = 0;
    for (const other of CHARACTERS) {
      if (other.id === st.id) continue;
      const d = st.pos.distanceTo(other.pos);
      const minDistance = st.radius + other.radius;
      if (d < minDistance) {
        const repulsion = new THREE.Vector3().subVectors(st.pos, other.pos).normalize();
        repulsion.multiplyScalar((minDistance - d) / minDistance);
        avoidance.add(repulsion);
        collisionCount++;
      }
    }
    
    if (collisionCount > 0) {
      // Pushed by others
      avoidance.divideScalar(collisionCount).multiplyScalar(speed * delta * 2);
      st.pos.add(avoidance);
    }

    if (isWalking && (act === null || act === 'slouch_walk' || act === 'run_panic' || act === 'pace')) {
      const step = Math.min(speed * delta * (behavior === 'run' ? 1.5 : 1), targetDist);
      st.pos.addScaledVector(moveDir, step);
      st.angle = lerpA(st.angle, Math.atan2(moveDir.x, moveDir.z), 0.1);
    }

    const walk = isWalking ? 1 : 0;
    const walkFreq = 8;
    const walkAmp = 0.5;
    const bob = Math.abs(Math.sin(c * walkFreq)) * 0.12 * walk;

    outerRef.current.position.set(st.pos.x, bob, st.pos.z);
    bodyRef.current.rotation.y = st.angle;

    const laU = lArmUpper.current, raU = rArmUpper.current;
    const laL = lArmLower.current, raL = rArmLower.current;
    const llU = lLegUpper.current, rlU = rLegUpper.current;
    const llL = lLegLower.current, rlL = rLegLower.current;
    const head = headRef.current;
    const torso = torsoRef.current;

    if (!laU || !raU || !laL || !raL || !llU || !rlU || !llL || !rlL || !head || !torso) return;

    head.rotation.set(0, 0, 0);
    torso.rotation.set(0, 0, 0);

    const lsw = Math.sin(c * walkFreq) * walkAmp * walk;
    const rsw = Math.sin(c * walkFreq + Math.PI) * walkAmp * walk;

    laU.rotation.x = -lsw * 0.6;
    raU.rotation.x = -rsw * 0.6;
    laL.rotation.x = Math.max(0, -lsw) * 0.3;
    raL.rotation.x = Math.max(0, -rsw) * 0.3;
    llU.rotation.x = lsw;
    rlU.rotation.x = rsw;
    llL.rotation.x = Math.max(0, -lsw) * 0.6;
    rlL.rotation.x = Math.max(0, -rsw) * 0.6;

    // Idle
    if (!act) {
      switch (idleAnim) {
        case 'bounce':
          outerRef.current.position.y += Math.abs(Math.sin(c * 4)) * 0.15;
          head.rotation.z = Math.sin(c * 3) * 0.08;
          laU.rotation.z = -0.3 + Math.sin(c * 2) * 0.1;
          raU.rotation.z = 0.3 + Math.sin(c * 2 + 1) * 0.1;
          break;
        case 'sway':
          torso.rotation.z = Math.sin(c * 2) * 0.1;
          head.rotation.x = Math.sin(c * 1.5) * 0.1;
          laU.rotation.z = -0.2 + Math.sin(c * 1.8) * 0.15;
          raU.rotation.z = 0.2 + Math.sin(c * 1.8 + 1) * 0.15;
          break;
        case 'tremble':
          torso.rotation.z = Math.sin(c * 30) * 0.06;
          head.rotation.z = Math.sin(c * 25) * 0.08;
          laU.rotation.z = -0.3 + Math.sin(c * 20) * 0.1;
          raU.rotation.z = 0.3 + Math.sin(c * 20 + 2) * 0.1;
          outerRef.current.position.y += Math.sin(c * 35) * 0.02;
          break;
        case 'spin':
          bodyRef.current.rotation.y += delta * 1.5;
          head.rotation.z = Math.sin(c * 4) * 0.15;
          break;
        case 'wave':
          raU.rotation.x = -1.2 + Math.sin(c * 6) * 0.4;
          raU.rotation.z = 0.5;
          raL.rotation.x = Math.sin(c * 8) * 0.3;
          head.rotation.z = Math.sin(c * 3) * 0.1;
          break;
        case 'stomp':
          outerRef.current.position.y += Math.abs(Math.sin(c * 2)) * 0.05;
          torso.rotation.x = Math.sin(c * 2) * 0.06;
          laU.rotation.x = Math.sin(c * 2) * 0.2;
          raU.rotation.x = Math.sin(c * 2 + 1) * 0.2;
          break;
      }
    }

    // Choreographed actions
    if (act) {
      switch (act) {
        case 'jump_joy': {
          const arc = Math.sin(ap * Math.PI);
          outerRef.current.position.y += arc * 2.5;
          laU.rotation.x = -2.5 * arc; raU.rotation.x = -2.5 * arc;
          laU.rotation.z = -0.8 * arc; raU.rotation.z = 0.8 * arc;
          head.rotation.x = -0.3 * arc;
          torso.rotation.x = -0.15 * arc;
          llU.rotation.x = -0.4 * arc; rlU.rotation.x = -0.4 * arc;
          break;
        }
        case 'dance': {
          torso.rotation.z = Math.sin(ae * 10) * 0.3;
          laU.rotation.x = Math.sin(ae * 8) * 1.2;
          raU.rotation.x = Math.sin(ae * 8 + Math.PI) * 1.2;
          laU.rotation.z = Math.sin(ae * 6) * 0.5;
          raU.rotation.z = Math.sin(ae * 6 + 1) * 0.5;
          llU.rotation.x = Math.sin(ae * 10) * 0.4;
          rlU.rotation.x = Math.sin(ae * 10 + Math.PI) * 0.4;
          outerRef.current.position.y += Math.abs(Math.sin(ae * 10)) * 0.3;
          head.rotation.z = Math.sin(ae * 5) * 0.2;
          break;
        }
        case 'clap': {
          const cl = Math.sin(ae * 14);
          laU.rotation.x = -1.2; raU.rotation.x = -1.2;
          laU.rotation.z = cl * 0.4 - 0.2;
          raU.rotation.z = -cl * 0.4 + 0.2;
          laL.rotation.x = -0.3; raL.rotation.x = -0.3;
          head.rotation.x = -0.2; head.rotation.z = Math.sin(ae * 7) * 0.1;
          outerRef.current.position.y += Math.abs(Math.sin(ae * 8)) * 0.1;
          break;
        }
        case 'cry': {
          head.rotation.x = 0.4;
          torso.rotation.x = 0.2;
          laU.rotation.x = 0.3; raU.rotation.x = 0.3;
          laU.rotation.z = -0.15; raU.rotation.z = 0.15;
          head.rotation.z = Math.sin(ae * 4) * 0.08;
          torso.rotation.z = Math.sin(ae * 3) * 0.04;
          outerRef.current.position.y += Math.sin(ae * 2) * 0.03;
          break;
        }
        case 'slouch_walk': {
          head.rotation.x = 0.35;
          torso.rotation.x = 0.15;
          laU.rotation.z = -0.05; raU.rotation.z = 0.05;
          const sw = Math.sin(ae * 4) * 0.15;
          llU.rotation.x = sw; rlU.rotation.x = -sw;
          laU.rotation.x = -sw * 0.3; raU.rotation.x = sw * 0.3;
          break;
        }
        case 'stomp_ground': {
          const ph = ap < 0.5 ? ap / 0.5 : (1 - ap) / 0.5;
          laU.rotation.x = -2.0 * ph;
          raU.rotation.x = -2.0 * ph;
          torso.rotation.x = -0.3 * ph;
          const stomp = Math.sin(ae * 12);
          llU.rotation.x = stomp * 0.8;
          outerRef.current.position.y += Math.abs(stomp) * 0.15 * ph;
          head.rotation.x = -0.25 * ph;
          if (stomp > 0.8) G.shake = Math.max(G.shake, 0.15);
          break;
        }
        case 'fist_shake': {
          laU.rotation.x = -2.2 + Math.sin(ae * 12) * 0.3;
          raU.rotation.x = -2.2 + Math.sin(ae * 12 + 1) * 0.3;
          laU.rotation.z = -0.5; raU.rotation.z = 0.5;
          head.rotation.z = Math.sin(ae * 8) * 0.15;
          torso.rotation.z = Math.sin(ae * 6) * 0.1;
          break;
        }
        case 'hide': {
          torso.rotation.x = 0.4 * Math.sin(ap * Math.PI);
          laU.rotation.x = -1.5; raU.rotation.x = -1.5;
          laU.rotation.z = 0.3; raU.rotation.z = -0.3;
          head.rotation.x = 0.3;
          head.rotation.z = Math.sin(ae * 25) * 0.1;
          outerRef.current.position.y -= 0.3 * Math.sin(ap * Math.PI);
          break;
        }
        case 'run_panic': {
          const run = Math.sin(ae * 16);
          llU.rotation.x = run * 1.0;
          rlU.rotation.x = -run * 1.0;
          laU.rotation.x = -run * 0.8;
          raU.rotation.x = run * 0.8;
          laU.rotation.z = -0.5; raU.rotation.z = 0.5;
          outerRef.current.position.y += Math.abs(run) * 0.2;
          head.rotation.z = Math.sin(ae * 20) * 0.15;
          torso.rotation.z = Math.sin(ae * 12) * 0.08;
          outerRef.current.position.x += Math.sin(ae * 3) * delta * 2;
          break;
        }
        case 'spin_jump': {
          bodyRef.current.rotation.y += delta * 12;
          const arc2 = Math.sin(ap * Math.PI);
          outerRef.current.position.y += arc2 * 2;
          laU.rotation.x = -2.5 * arc2;
          raU.rotation.x = -2.5 * arc2;
          laU.rotation.z = -1.0 * arc2;
          raU.rotation.z = 1.0 * arc2;
          break;
        }
        case 'cheer': {
          laU.rotation.x = -2.8; raU.rotation.x = -2.8;
          laU.rotation.z = Math.sin(ae * 10) * 0.4 - 0.5;
          raU.rotation.z = Math.sin(ae * 10 + 1) * 0.4 + 0.5;
          laL.rotation.x = Math.sin(ae * 12) * 0.3;
          raL.rotation.x = Math.sin(ae * 12 + 1) * 0.3;
          outerRef.current.position.y += Math.abs(Math.sin(ae * 8)) * 0.4;
          head.rotation.x = -0.2;
          torso.rotation.z = Math.sin(ae * 6) * 0.1;
          break;
        }
        case 'jump_back': {
          const jb = Math.sin(ap * Math.PI);
          outerRef.current.position.y += jb * 1.5;
          outerRef.current.position.z -= jb * 1.0;
          laU.rotation.x = -1.0; raU.rotation.x = -1.0;
          laU.rotation.z = -0.8 * jb; raU.rotation.z = 0.8 * jb;
          torso.rotation.x = -0.3 * jb;
          head.rotation.x = -0.2 * jb;
          break;
        }
        case 'double_take': {
          head.rotation.y = Math.sin(ae * 6) * 0.8;
          head.rotation.x = -0.15;
          torso.rotation.y = Math.sin(ae * 4) * 0.2;
          laU.rotation.z = -0.3 + Math.sin(ae * 5) * 0.3;
          raU.rotation.z = 0.3 + Math.sin(ae * 5 + 1) * 0.3;
          break;
        }
        case 'chest_puff': {
          torso.rotation.x = -0.2;
          head.rotation.x = -0.15;
          laU.rotation.z = -0.6; raU.rotation.z = 0.6;
          laU.rotation.x = 0.2; raU.rotation.x = 0.2;
          torso.rotation.z = Math.sin(ae * 2) * 0.03;
          outerRef.current.position.y += 0.1 * Math.sin(ap * Math.PI);
          break;
        }
        case 'flex': {
          laU.rotation.x = -1.8; raU.rotation.x = -1.8;
          laU.rotation.z = -0.8; raU.rotation.z = 0.8;
          laL.rotation.x = -1.2; raL.rotation.x = -1.2;
          torso.rotation.x = -0.1;
          head.rotation.x = -0.1;
          const pulse = Math.sin(ae * 6) * 0.08;
          bodyRef.current.scale.setScalar(bodyScale * (1 + pulse));
          break;
        }
        case 'fidget': {
          laU.rotation.x = -0.8 + Math.sin(ae * 8) * 0.4;
          raU.rotation.x = -0.8 + Math.sin(ae * 8 + 2) * 0.4;
          laU.rotation.z = Math.sin(ae * 12) * 0.15;
          raU.rotation.z = Math.sin(ae * 12 + 1) * 0.15;
          head.rotation.z = Math.sin(ae * 6) * 0.1;
          llU.rotation.x = Math.sin(ae * 10) * 0.15;
          rlU.rotation.x = Math.sin(ae * 10 + 1) * 0.15;
          break;
        }
        case 'pace': {
          const pace = Math.sin(ae * 4);
          outerRef.current.position.x += pace * delta * 2;
          llU.rotation.x = Math.sin(ae * 8) * 0.5;
          rlU.rotation.x = Math.sin(ae * 8 + Math.PI) * 0.5;
          laU.rotation.x = Math.sin(ae * 8 + Math.PI) * 0.3;
          raU.rotation.x = Math.sin(ae * 8) * 0.3;
          head.rotation.y = pace * 0.3;
          break;
        }
        case 'recoil': {
          torso.rotation.x = -0.3 * Math.sin(ap * Math.PI);
          head.rotation.x = -0.2;
          head.rotation.y = 0.3 * Math.sin(ap * Math.PI);
          laU.rotation.x = -0.5; raU.rotation.x = -0.8;
          laU.rotation.z = -0.3; raU.rotation.z = 0.6;
          outerRef.current.position.z += Math.sin(ap * Math.PI) * 0.3;
          break;
        }
        case 'wave_away': {
          raU.rotation.x = -1.5;
          raU.rotation.z = 0.5 + Math.sin(ae * 8) * 0.3;
          raL.rotation.x = Math.sin(ae * 10) * 0.4;
          head.rotation.y = 0.4;
          head.rotation.x = 0.1;
          torso.rotation.y = 0.15;
          break;
        }
      }
    }

    if (act !== 'flex') {
      bodyRef.current.scale.setScalar(bodyScale);
    }
  });

  const sc = bodyScale;
  const skinColor = color;

  return (
    <group ref={outerRef} position={waypoints[0]}>
      <group ref={bodyRef} scale={sc}>
        <group ref={headRef} position={[0, 1.55, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.88, 32, 32]} />
            <meshStandardMaterial color={skinColor} roughness={0.25} metalness={0.05} />
            <Decal position={[0, 0.02, 0.55]} rotation={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
              <meshBasicMaterial
                map={getFaceTexture(emotion)}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
                depthTest
                depthWrite={false}
              />
            </Decal>
          </mesh>
        </group>

        <group ref={torsoRef} />

        {/* LEFT ARM */}
        <group ref={lArmUpper} position={[-0.85, 1.35, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
          <group ref={lArmLower} position={[0, -0.48, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.08, 0.28, 4, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0]} castShadow>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* RIGHT ARM */}
        <group ref={rArmUpper} position={[0.85, 1.35, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
          <group ref={rArmLower} position={[0, -0.48, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.08, 0.28, 4, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0]} castShadow>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* LEFT LEG */}
        <group ref={lLegUpper} position={[-0.3, 0.55, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.35, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
          <group ref={lLegLower} position={[0, -0.48, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0.06]} castShadow>
              <boxGeometry args={[0.18, 0.1, 0.26]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rLegUpper} position={[0.3, 0.55, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.35, 4, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>
          <group ref={rLegLower} position={[0, -0.48, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0.06]} castShadow>
              <boxGeometry args={[0.18, 0.1, 0.26]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>
          </group>
        </group>

        <Text
          position={[0, 2.65, 0]}
          fontSize={0.22}
          color="#fff"
          outlineWidth={0.02}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   FANTASY WORLD — Emoji Civilization
   ═══════════════════════════════════════════════ */

/* --- Cinematic orbiting camera --- */
function CinematicCamera() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * 0.08;
    const r = 18 + Math.sin(t * 0.7) * 4;
    const h = 5 + Math.sin(t * 0.5) * 2;
    camera.position.x = Math.sin(t) * r;
    camera.position.z = Math.cos(t) * r;
    camera.position.y = h;
    camera.lookAt(0, 1.5, 0);
  });
  return null;
}

/* --- Floating Heart Platform --- */
function HeartPlatform({ position, scale = 1, color = '#FF6B9D' }: {
  position: [number, number, number]; scale?: number; color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.3;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Heart shape approximated with spheres */}
      <mesh castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.7, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.7, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Flat top for walking */}
      <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.6, 32]} />
        <meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={2} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* --- Candy Building --- */
function CandyBuilding({ position, h = 3, color = '#FF69B4', roofColor = '#FFD700' }: {
  position: [number, number, number]; h?: number; color?: string; roofColor?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + position[0] * 2) * 0.02;
  });
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.0, h, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Stripes */}
      {[0.3, 0.6, 0.9].map((t, i) => (
        <mesh key={i} position={[0, h * t, 0]}>
          <torusGeometry args={[0.82 + (1 - t) * 0.18, 0.06, 8, 24]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Roof — cone */}
      <mesh position={[0, h + 0.5, 0]} castShadow>
        <coneGeometry args={[1.1, 1.2, 12]} />
        <meshStandardMaterial color={roofColor} roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Roof tip ball */}
      <mesh position={[0, h + 1.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive={roofColor} emissiveIntensity={3} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.6, 0.95]}>
        <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} />
      </mesh>
      {/* Windows — little glowing spheres */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.85, h * 0.6, Math.cos(a) * 0.85]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#FFF9C4" emissive="#FFE082" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

/* --- Candy Tree (lollipop style) --- */
function CandyTree({ position, h = 2.5, color = '#E040FB' }: {
  position: [number, number, number]; h?: number; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + position[0] * 3) * 0.06;
  });
  return (
    <group position={position}>
      {/* Stick */}
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, h * 0.8, 8]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      {/* Lollipop top */}
      <mesh ref={ref} position={[0, h * 0.85, 0]} castShadow>
        <sphereGeometry args={[h * 0.3, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Spiral decoration */}
      <mesh position={[0, h * 0.85, 0]}>
        <torusGeometry args={[h * 0.22, 0.04, 6, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* --- Cloud City Platform --- */
function CloudPlatform({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.4 + position[0]) * 0.5;
  });
  return (
    <group ref={ref} position={position}>
      <mesh><sphereGeometry args={[1.5, 12, 12]} /><meshStandardMaterial color="#E8EAF6" roughness={0.8} transparent opacity={0.9} /></mesh>
      <mesh position={[1.2, -0.2, 0.3]}><sphereGeometry args={[1.0, 12, 12]} /><meshStandardMaterial color="#E8EAF6" roughness={0.8} transparent opacity={0.9} /></mesh>
      <mesh position={[-1.1, -0.15, -0.2]}><sphereGeometry args={[0.9, 12, 12]} /><meshStandardMaterial color="#E8EAF6" roughness={0.8} transparent opacity={0.9} /></mesh>
      <mesh position={[0.3, 0.3, -0.5]}><sphereGeometry args={[0.8, 12, 12]} /><meshStandardMaterial color="#F3E5F5" roughness={0.8} transparent opacity={0.85} /></mesh>
      <mesh position={[-0.5, 0.2, 0.6]}><sphereGeometry args={[0.7, 12, 12]} /><meshStandardMaterial color="#EDE7F6" roughness={0.8} transparent opacity={0.85} /></mesh>
      {/* Tiny building on cloud */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.0, 8]} />
        <meshStandardMaterial color="#CE93D8" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.5, 0.6, 8]} />
        <meshStandardMaterial color="#FFD54F" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* --- Glowing Neon Path --- */
function NeonPath({ points, color = '#7C4DFF' }: {
  points: [number, number, number][]; color?: string;
}) {
  return (
    <group>
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        const next = points[i + 1];
        const dx = next[0] - p[0], dz = next[2] - p[2];
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        const cx = (p[0] + next[0]) / 2;
        const cz = (p[2] + next[2]) / 2;
        return (
          <group key={i}>
            <mesh position={[cx, 0.02, cz]} rotation={[-Math.PI / 2, 0, angle]}>
              <planeGeometry args={[0.6, len]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Edge glow */}
            {[-0.35, 0.35].map(offset => (
              <mesh key={offset} position={[cx + Math.cos(angle) * offset, 0.03, cz - Math.sin(angle) * offset]} rotation={[-Math.PI / 2, 0, angle]}>
                <planeGeometry args={[0.08, len]} />
                <meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={4} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* --- Rainbow Bridge --- */
function RainbowBridge({ from, to, height = 4 }: {
  from: [number, number, number]; to: [number, number, number]; height?: number;
}) {
  const colors = ['#FF0000', '#FF8C00', '#FFD700', '#00C853', '#2979FF', '#7C4DFF', '#E040FB'];
  const segments = 24;
  return (
    <group>
      {colors.map((color, ci) => {
        const offset = (ci - 3) * 0.2;
        return (
          <group key={ci}>
            {Array.from({ length: segments }).map((_, i) => {
              const t1 = i / segments;
              const t2 = (i + 1) / segments;
              const arc1 = Math.sin(t1 * Math.PI) * height;
              const arc2 = Math.sin(t2 * Math.PI) * height;
              const x1 = from[0] + (to[0] - from[0]) * t1;
              const z1 = from[2] + (to[2] - from[2]) * t1;
              const x2 = from[0] + (to[0] - from[0]) * t2;
              const z2 = from[2] + (to[2] - from[2]) * t2;
              const cx = (x1 + x2) / 2;
              const cy = (arc1 + arc2) / 2 + from[1];
              const cz = (z1 + z2) / 2;
              return (
                <mesh key={i} position={[cx + offset * 0.3, cy, cz + offset * 0.3]}>
                  <sphereGeometry args={[0.12, 4, 4]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/* --- Sparkle Particles --- */
function Sparkles() {
  const count = 80;
  const ref = useRef<THREE.Group>(null);
  const positions = useRef(
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 30,
      Math.random() * 12 + 1,
      (Math.random() - 0.5) * 30,
      Math.random() * 5, // speed offset
    ])
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const p = positions.current[i];
      child.position.y = p[2] + Math.sin(clock.elapsedTime * 0.8 + p[3]) * 1.5;
      (child as THREE.Mesh).scale.setScalar(0.5 + Math.sin(clock.elapsedTime * 2 + p[3]) * 0.4);
    });
  });
  return (
    <group ref={ref}>
      {positions.current.map((p, i) => (
        <mesh key={i} position={[p[0], p[2], p[1]]}>
          <sphereGeometry args={[0.06, 4, 4]} />
          <meshStandardMaterial
            color={['#FFD700', '#FF69B4', '#7C4DFF', '#00E5FF', '#FF6D00', '#E040FB'][i % 6]}
            emissive={['#FFD700', '#FF69B4', '#7C4DFF', '#00E5FF', '#FF6D00', '#E040FB'][i % 6]}
            emissiveIntensity={4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* --- Crystal Cluster --- */
function CrystalCluster({ position, color = '#7C4DFF' }: {
  position: [number, number, number]; color?: string;
}) {
  return (
    <group position={position}>
      {[0, 0.8, 1.6, 2.4, 3.6].map((a, i) => {
        const angle = a + i * 0.3;
        const h = 0.8 + Math.random() * 1.2;
        const r = 0.15 + Math.random() * 0.1;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.3, h / 2, Math.sin(angle) * 0.3]}
            rotation={[Math.sin(i) * 0.2, 0, Math.cos(i) * 0.15]} castShadow>
            <coneGeometry args={[r, h, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} roughness={0.1} metalness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

/* --- Giant Mushroom --- */
function GiantMushroom({ position, h = 2.5, color = '#FF6B9D' }: {
  position: [number, number, number]; h?: number; color?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, h * 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, h * 0.7, 8]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      <mesh position={[0, h * 0.75, 0]} castShadow>
        <sphereGeometry args={[h * 0.35, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Glowing spots */}
      {[0, 1.2, 2.5, 4.0].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * h * 0.28, h * 0.8 + Math.sin(a) * 0.1, Math.sin(a) * h * 0.28]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
}

/* --- Floating Gem --- */
function FloatingGem({ position, color = '#00E5FF' }: {
  position: [number, number, number]; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2 + position[0] * 2) * 0.4;
    ref.current.rotation.y = clock.elapsedTime * 1.5;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.05} metalness={0.5} />
    </mesh>
  );
}

/* --- Floating Ring --- */
function FloatingRing({ position, color = '#FFD700', size = 2 }: {
  position: [number, number, number]; color?: string; size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.3;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.2;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[size, 0.08, 8, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SCENE — Emoji Civilization Fantasy World
   ═══════════════════════════════════════════════ */
export default function Scene3D() {
  return (
    <>
      {/* Lighting — magical, multi-color */}
      <ambientLight intensity={1.5} color="#E8D5FF" />
      <directionalLight
        position={[8, 12, 8]} intensity={2} color="#FFE4B5" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={20} shadow-camera-bottom={-20}
      />
      <directionalLight position={[-6, 8, -5]} intensity={1} color="#C5CAE9" />
      <hemisphereLight intensity={1.2} groundColor="#CE93D8" color="#90CAF9" />
      <pointLight position={[0, 6, 0]} intensity={3} color="#FFD54F" distance={25} />
      <pointLight position={[-8, 3, 5]} intensity={2} color="#FF69B4" distance={15} />
      <pointLight position={[8, 3, -5]} intensity={2} color="#7C4DFF" distance={15} />

      {/* Atmospheric Fog matching the sky */}
      <fog attach="fog" args={['#e0f2fe', 25, 65]} />

      <TimelineTicker />
      <CinematicCamera />

      {/* ═══ FLOATING HEART PLATFORMS ═══ */}
      <HeartPlatform position={[-18, 12, -10]} scale={1.2} color="#FF6B9D" />
      <HeartPlatform position={[16, 14, 8]} scale={0.9} color="#E040FB" />
      <HeartPlatform position={[0, 16, -18]} scale={0.7} color="#FF4081" />

      {/* ═══ CLOUD CITY PLATFORMS ═══ */}
      <CloudPlatform position={[-12, 16, 8]} />
      <CloudPlatform position={[10, 20, -12]} />
      <CloudPlatform position={[18, 14, 4]} />

      {/* ═══ CANDY BUILDINGS — Main Town ═══ */}
      <CandyBuilding position={[-10, 0, -6]} h={3.5} color="#FF69B4" roofColor="#FFD700" />
      <CandyBuilding position={[12, 0, -8]} h={4} color="#7C4DFF" roofColor="#FF6D00" />
      <CandyBuilding position={[-14, 0, 6]} h={2.8} color="#00BCD4" roofColor="#E040FB" />
      <CandyBuilding position={[14, 0, 8]} h={3.2} color="#FF6D00" roofColor="#00E5FF" />
      <CandyBuilding position={[0, 0, -14]} h={5} color="#E040FB" roofColor="#FFD700" />
      <CandyBuilding position={[-6, 0, 12]} h={2.5} color="#FFD54F" roofColor="#FF69B4" />
      <CandyBuilding position={[16, 0, -2]} h={3} color="#66BB6A" roofColor="#FFAB40" />

      {/* ═══ CANDY FOREST ═══ */}
      <CandyTree position={[-6, 0, -10]} h={3} color="#E040FB" />
      <CandyTree position={[6, 0, -12]} h={2.5} color="#FF69B4" />
      <CandyTree position={[-16, 0, -2]} h={3.5} color="#00E5FF" />
      <CandyTree position={[15, 0, 3]} h={2.8} color="#FFD700" />
      <CandyTree position={[-12, 0, -12]} h={2.2} color="#7C4DFF" />
      <CandyTree position={[12, 0, 12]} h={3.2} color="#FF6D00" />
      <CandyTree position={[-18, 0, 0]} h={2.5} color="#66BB6A" />
      <CandyTree position={[18, 0, -8]} h={2.8} color="#FF4081" />
      <CandyTree position={[-2, 0, 15]} h={2.0} color="#CE93D8" />
      <CandyTree position={[8, 0, 14]} h={2.7} color="#00BCD4" />

      {/* ═══ GIANT MUSHROOMS ═══ */}
      <GiantMushroom position={[-8, 0, 6]} h={3} color="#FF6B9D" />
      <GiantMushroom position={[8, 0, 7]} h={2.5} color="#BA68C8" />
      <GiantMushroom position={[15, 0, -10]} h={2} color="#EF5350" />
      <GiantMushroom position={[-16, 0, -8]} h={3.5} color="#FFB74D" />

      {/* ═══ CRYSTAL CLUSTERS ═══ */}
      <CrystalCluster position={[-4, 0, -6]} color="#7C4DFF" />
      <CrystalCluster position={[10, 0, 0]} color="#00E5FF" />
      <CrystalCluster position={[-12, 0, 10]} color="#E040FB" />
      <CrystalCluster position={[4, 0, 12]} color="#FF69B4" />

      {/* ═══ GLOWING NEON PATHWAYS ═══ */}
      <NeonPath
        color="#7C4DFF"
        points={[[-16, 0, 0], [-8, 0, 0], [0, 0, 0], [8, 0, 0], [16, 0, 0]]}
      />
      <NeonPath
        color="#FF69B4"
        points={[[0, 0, -16], [0, 0, -8], [0, 0, 0], [0, 0, 8], [0, 0, 16]]}
      />
      <NeonPath
        color="#FFD700"
        points={[[-12, 0, -12], [-6, 0, -6], [0, 0, 0], [6, 0, 6], [12, 0, 12]]}
      />

      {/* ═══ RAINBOW BRIDGE ═══ */}
      <RainbowBridge from={[-14, 0, -8]} to={[14, 0, 8]} height={8} />

      {/* ═══ FLOATING GEMS ═══ */}
      <FloatingGem position={[-6, 6, 4]} color="#00E5FF" />
      <FloatingGem position={[8, 8, -6]} color="#FFD700" />
      <FloatingGem position={[0, 9, 10]} color="#FF69B4" />
      <FloatingGem position={[-12, 7, -4]} color="#7C4DFF" />
      <FloatingGem position={[14, 5, 2]} color="#E040FB" />
      <FloatingGem position={[4, 11, -12]} color="#FF6D00" />

      {/* ═══ FLOATING RINGS ═══ */}
      <FloatingRing position={[0, 14, 0]} color="#FFD700" size={4} />
      <FloatingRing position={[-10, 10, -10]} color="#FF69B4" size={2.5} />
      <FloatingRing position={[12, 12, 6]} color="#7C4DFF" size={3} />

      {/* ═══ SPARKLE PARTICLES ═══ */}
      <Sparkles />

      {/* ═══ EMOTION CHARACTERS — wide roaming routes ═══ */}

      <EmojiCharacter
        emotion="happy" color="#FFD700" face="😄" label="HAPPY"
        bodyScale={1} idleAnim="bounce" speed={3.0} behavior="follow"
        waypoints={[[-6, 0, -4], [0, 0, -6], [6, 0, -4], [8, 0, 2], [4, 0, 8], [-4, 0, 8], [-8, 0, 2]]}
        actionSeq={[]}
      />

      <EmojiCharacter
        emotion="sad" color="#4A90D9" face="😢" label="SAD"
        bodyScale={0.9} idleAnim="sway" speed={1.4}
        waypoints={[[-14, 0, 8], [-14, 0, 0], [-10, 0, -6], [-6, 0, -10], [-2, 0, -6]]}
        actionSeq={[
          { start: 4, end: 10, action: 'cry' },
          { start: 20, end: 26, action: 'slouch_walk' },
          { start: 38, end: 44, action: 'cry' },
          { start: 52, end: 58, action: 'slouch_walk' },
        ]}
      />

      <EmojiCharacter
        emotion="angry" color="#E74C3C" face="😠" label="ANGRY"
        bodyScale={1.1} idleAnim="stomp" speed={2.5}
        waypoints={[[-8, 0, -12], [0, 0, -12], [8, 0, -10], [12, 0, -6], [8, 0, -2], [-4, 0, -4], [-8, 0, -8]]}
        actionSeq={[
          { start: 3, end: 7, action: 'stomp_ground' },
          { start: 15, end: 19, action: 'fist_shake' },
          { start: 27, end: 31, action: 'stomp_ground' },
          { start: 39, end: 43, action: 'fist_shake' },
          { start: 51, end: 55, action: 'stomp_ground' },
        ]}
      />

      <EmojiCharacter
        emotion="scared" color="#9B59B6" face="😨" label="SCARED"
        bodyScale={0.85} idleAnim="tremble" speed={4.5} behavior="run"
        waypoints={[[14, 0, -4], [16, 0, 4], [12, 0, 10], [8, 0, 6], [12, 0, 0]]}
        actionSeq={[
          { start: 5, end: 9, action: 'hide' },
          { start: 30, end: 34, action: 'hide' },
          { start: 52, end: 56, action: 'hide' },
        ]}
      />

      <EmojiCharacter
        emotion="excited" color="#FF8C00" face="🤩" label="EXCITED"
        bodyScale={1} idleAnim="bounce" speed={4.0} behavior="follow"
        waypoints={[[0, 0, 12], [10, 0, 8], [14, 0, 0], [10, 0, -8], [0, 0, -12], [-10, 0, -8], [-14, 0, 0], [-10, 0, 8]]}
        actionSeq={[]}
      />

      <EmojiCharacter
        emotion="surprised" color="#1ABC9C" face="😲" label="SURPRISED"
        bodyScale={0.95} idleAnim="sway" speed={2.5}
        waypoints={[[-4, 0, -6], [4, 0, -2], [-2, 0, 2], [6, 0, 6], [-4, 0, 4]]}
        actionSeq={[
          { start: 4, end: 7, action: 'jump_back' },
          { start: 16, end: 20, action: 'double_take' },
          { start: 28, end: 31, action: 'jump_back' },
          { start: 40, end: 44, action: 'double_take' },
          { start: 52, end: 55, action: 'jump_back' },
        ]}
      />

      <EmojiCharacter
        emotion="proud" color="#DAA520" face="😤" label="PROUD"
        bodyScale={1.15} idleAnim="stomp" speed={2}
        waypoints={[[0, 0, 10], [0, 0, 4], [0, 0, -4], [0, 0, -10], [4, 0, -6], [-4, 0, 0]]}
        actionSeq={[
          { start: 2, end: 8, action: 'chest_puff' },
          { start: 18, end: 24, action: 'flex' },
          { start: 34, end: 40, action: 'chest_puff' },
          { start: 50, end: 56, action: 'flex' },
        ]}
      />

      <EmojiCharacter
        emotion="nervous" color="#82C341" face="😬" label="NERVOUS"
        bodyScale={0.85} idleAnim="tremble" speed={3.5} behavior="run"
        waypoints={[[2, 0, 0], [4, 0, -2], [2, 0, -4], [-2, 0, -4], [-4, 0, -2], [-2, 0, 0]]}
        actionSeq={[
          { start: 6, end: 12, action: 'fidget' },
          { start: 38, end: 44, action: 'fidget' },
        ]}
      />

      <EmojiCharacter
        emotion="disgusted" color="#27AE60" face="🤢" label="DISGUSTED"
        bodyScale={0.9} idleAnim="sway" speed={2.0}
        waypoints={[[16, 0, 10], [16, 0, 0], [12, 0, -8], [8, 0, -12], [4, 0, -8]]}
        actionSeq={[
          { start: 7, end: 13, action: 'recoil' },
          { start: 23, end: 29, action: 'wave_away' },
          { start: 39, end: 45, action: 'recoil' },
          { start: 53, end: 59, action: 'wave_away' },
        ]}
      />

      <EmojiCharacter
        emotion="friendly" color="#E91E8F" face="🥰" label="FRIENDLY"
        bodyScale={0.95} idleAnim="wave" speed={3.0} behavior="follow"
        waypoints={[[-12, 0, 0], [-6, 0, 0], [0, 0, 0], [6, 0, 0], [12, 0, 0], [6, 0, 4], [0, 0, 6], [-6, 0, 4]]}
        actionSeq={[]}
      />

      {/* ═══ GROUND — magical radial platform ═══ */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#2d1b4e" roughness={0.7} />
      </mesh>
      {/* Inner glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5, 5.3, 64]} />
        <meshStandardMaterial color="#7C4DFF" emissive="#7C4DFF" emissiveIntensity={2} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[10, 10.3, 64]} />
        <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={2} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[15, 15.3, 64]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1.5} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <ContactShadows position={[0, 0, 0]} scale={35} blur={2.5} far={6} opacity={0.2} />
    </>
  );
}

