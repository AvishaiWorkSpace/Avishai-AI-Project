import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Interactive 3D padel racket, built procedurally with Three.js.
// - Emerald face with a perforation grid (like a real control racket)
// - Champagne-gold metallic rim + accents
// - Studio lighting + soft reflections
// - Drag to spin · gentle auto-rotate · tilts toward the cursor
//
// Works fully offline (no hosted scene needed).
export default function PadelRacket3D({ className = '', autoRotate = true }) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      setFailed(true);
      return;
    }

    let width = mount.clientWidth || 320;
    let height = mount.clientHeight || 360;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    // ---- soft studio environment for metallic reflections ----
    let pmrem;
    (async () => {
      try {
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
        pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      } catch (e) {
        /* lights below are enough on their own */
      }
    })();

    // ---- lighting ----
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1c2a22, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 6, 6);
    scene.add(key);
    const goldRim = new THREE.DirectionalLight(0xffd29a, 1.5);
    goldRim.position.set(-6, 2, -4);
    scene.add(goldRim);
    const fill = new THREE.DirectionalLight(0xbfe3d2, 0.5);
    fill.position.set(-3, -4, 5);
    scene.add(fill);

    // ---- materials ----
    const faceMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#15402f'),
      metalness: 0.25,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      sheen: 0.5,
      sheenColor: new THREE.Color('#2f6f53'),
    });
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c79a4f'),
      metalness: 1,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });
    const gripMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14181a'),
      metalness: 0.2,
      roughness: 0.75,
    });

    const racket = new THREE.Group();

    // ---- racket head (face) with perforations ----
    const RX = 1.35, RY = 1.7;
    const headShape = new THREE.Shape();
    headShape.absellipse(0, 0, RX, RY, 0, Math.PI * 2, false, 0);

    // perforation grid — keep holes inside the ellipse with a margin
    const holeR = 0.12;
    for (let gx = -3; gx <= 3; gx++) {
      for (let gy = -4; gy <= 4; gy++) {
        const cx = gx * 0.38;
        const cy = gy * 0.34;
        const norm = (cx * cx) / ((RX - 0.34) * (RX - 0.34)) + (cy * cy) / ((RY - 0.34) * (RY - 0.34));
        if (norm <= 1) {
          const hole = new THREE.Path();
          hole.absarc(cx, cy, holeR, 0, Math.PI * 2, true);
          headShape.holes.push(hole);
        }
      }
    }

    const extrude = {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 4,
      curveSegments: 48,
      steps: 1,
    };
    const headGeo = new THREE.ExtrudeGeometry(headShape, extrude);
    headGeo.translate(0, 0, -extrude.depth / 2);
    headGeo.computeVertexNormals();
    // group 0 = front/back caps -> emerald · group 1 = walls/bevel -> gold rim
    const head = new THREE.Mesh(headGeo, [faceMat, goldMat]);
    head.position.y = 1.05;
    racket.add(head);

    // thin gold edge ring hugging the head for extra sparkle
    const ringGeo = new THREE.TorusGeometry(1, 0.055, 16, 120);
    ringGeo.scale(RX + 0.07, RY + 0.07, 1);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.position.y = 1.05;
    racket.add(ring);

    // ---- throat (tapered bridge) ----
    const throatGeo = new THREE.CylinderGeometry(0.16, 0.52, 0.95, 32, 1, true);
    const throat = new THREE.Mesh(throatGeo, faceMat);
    throat.position.y = -0.62;
    racket.add(throat);

    // ---- handle + grip ----
    const handleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.7, 32);
    const handle = new THREE.Mesh(handleGeo, gripMat);
    handle.position.y = -1.85;
    racket.add(handle);

    // grip wrap ridges
    for (let i = 0; i < 7; i++) {
      const wrapGeo = new THREE.TorusGeometry(0.205, 0.022, 10, 40);
      const wrap = new THREE.Mesh(wrapGeo, goldMat);
      wrap.rotation.x = Math.PI / 2;
      wrap.position.y = -1.2 - i * 0.2;
      racket.add(wrap);
    }

    // butt cap
    const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 32);
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.y = -2.72;
    racket.add(cap);

    racket.scale.setScalar(1.12);
    racket.position.y = 0.25;
    racket.rotation.x = -0.12;
    scene.add(racket);

    // ---- interaction state ----
    let dragging = false;
    let lastX = 0, lastY = 0;
    let velY = 0, velX = 0;
    let targetTiltX = -0.12;
    let pointerInside = false;

    const el = renderer.domElement;
    const onDown = (e) => {
      dragging = true;
      el.style.cursor = 'grabbing';
      lastX = e.clientX; lastY = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      pointerInside = true;
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        velY = dx * 0.008;
        velX = dy * 0.006;
        racket.rotation.y += velY;
        racket.rotation.x = THREE.MathUtils.clamp(racket.rotation.x + velX, -0.9, 0.9);
      } else {
        // hover tilt toward cursor
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetTiltX = -0.12 + ny * 0.25;
        racket.rotation.y += nx * 0.0006;
      }
    };
    const onUp = (e) => {
      dragging = false;
      el.style.cursor = 'grab';
      el.releasePointerCapture?.(e.pointerId);
    };
    const onLeave = () => { pointerInside = false; dragging = false; };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', onLeave);

    // ---- resize ----
    const ro = new ResizeObserver(() => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    // ---- render loop ----
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!dragging) {
        if (autoRotate) racket.rotation.y += 0.004 + velY;
        velY *= 0.94;
        velX *= 0.9;
        // ease tilt back / toward hover
        const goal = pointerInside ? targetTiltX : -0.12;
        racket.rotation.x += (goal - racket.rotation.x) * 0.05;
      }
      racket.position.y = 0.25 + Math.sin(Date.now() * 0.0011) * 0.05; // gentle float
      renderer.render(scene, camera);
    };
    animate();

    // ---- cleanup ----
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onLeave);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      pmrem?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [autoRotate]);

  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-7xl">🎾</span>
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}
