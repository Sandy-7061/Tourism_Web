import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Subtle fog to blend distant objects into the navy atmosphere
    scene.fog = new THREE.FogExp2(0x0a1628, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffecd2, 2.5);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const blueBacklight = new THREE.PointLight(0x0284c7, 3, 50);
    blueBacklight.position.set(-15, -5, -5);
    scene.add(blueBacklight);

    const orangeLight = new THREE.PointLight(0xff6b35, 4, 40);
    orangeLight.position.set(15, 8, 5);
    scene.add(orangeLight);

    // 3. Helper to create a stylized 3D airplane
    function createAirplane(colorHex: number, accentHex: number) {
      const airplane = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.2,
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: accentHex,
        roughness: 0.2,
        metalness: 0.5,
      });

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.6,
        transparent: true,
      });

      // Fuselage
      const fuselageGeo = new THREE.ConeGeometry(0.55, 3.8, 12);
      fuselageGeo.rotateX(Math.PI / 2);
      const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
      airplane.add(fuselage);

      // Cockpit windshield
      const windshieldGeo = new THREE.BoxGeometry(0.36, 0.28, 0.8);
      const windshield = new THREE.Mesh(windshieldGeo, glassMat);
      windshield.position.set(0, 0.3, 0.7);
      windshield.rotation.x = -Math.PI / 12;
      airplane.add(windshield);

      // Main Wings
      const wingGeo = new THREE.BoxGeometry(4.2, 0.08, 0.85);
      const wing = new THREE.Mesh(wingGeo, bodyMat);
      wing.position.set(0, 0.05, 0.2);
      airplane.add(wing);

      // Wingtips
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), accentMat);
      tipL.position.set(-2.1, 0.15, 0.2);
      airplane.add(tipL);

      const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), accentMat);
      tipR.position.set(2.1, 0.15, 0.2);
      airplane.add(tipR);

      // Tail wings (Horizontal stabilizer)
      const tailWingGeo = new THREE.BoxGeometry(1.6, 0.06, 0.45);
      const tailWing = new THREE.Mesh(tailWingGeo, bodyMat);
      tailWing.position.set(0, 0.1, -1.5);
      airplane.add(tailWing);

      // Vertical Fin
      const finGeo = new THREE.BoxGeometry(0.08, 0.75, 0.55);
      const fin = new THREE.Mesh(finGeo, accentMat);
      fin.position.set(0, 0.45, -1.5);
      fin.rotation.x = Math.PI / 12;
      airplane.add(fin);

      // Jet Engines
      const engineGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.8, 10);
      engineGeo.rotateX(Math.PI / 2);
      const engineL = new THREE.Mesh(engineGeo, accentMat);
      engineL.position.set(-1.1, -0.15, 0.3);
      airplane.add(engineL);

      const engineR = new THREE.Mesh(engineGeo, accentMat);
      engineR.position.set(1.1, -0.15, 0.3);
      airplane.add(engineR);

      return airplane;
    }

    // 4. Planes Group and Trajectories
    const planes: {
      mesh: THREE.Group;
      speed: number;
      radiusX: number;
      radiusY: number;
      radiusZ: number;
      offset: number;
      tiltSpeed: number;
      trailParticles: THREE.Points;
      trailGeo: THREE.BufferGeometry;
      trailPositions: Float32Array;
    }[] = [];

    const planeConfigs = [
      { color: 0xffffff, accent: 0xff6b35, rX: 11, rY: 3.5, rZ: 6, speed: 0.45, offset: 0 },
      { color: 0xf1f5f9, accent: 0x0284c7, rX: 14, rY: 4.8, rZ: 8, speed: 0.32, offset: Math.PI },
      { color: 0xffedd5, accent: 0xf59e0b, rX: 8, rY: 2.2, rZ: 5, speed: 0.55, offset: Math.PI * 0.5 },
    ];

    planeConfigs.forEach((cfg) => {
      const plane = createAirplane(cfg.color, cfg.accent);
      plane.scale.set(0.65, 0.65, 0.65);
      scene.add(plane);

      // Vapor / Jet Trail Particles
      const TRAIL_COUNT = 40;
      const trailPositions = new Float32Array(TRAIL_COUNT * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.PointsMaterial({
        color: cfg.accent,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const trailParticles = new THREE.Points(trailGeo, trailMat);
      scene.add(trailParticles);

      planes.push({
        mesh: plane,
        speed: cfg.speed,
        radiusX: cfg.rX,
        radiusY: cfg.rY,
        radiusZ: cfg.rZ,
        offset: cfg.offset,
        tiltSpeed: cfg.speed * 2,
        trailParticles,
        trailGeo,
        trailPositions,
      });
    });

    // 5. Stylized 3D Fluffy Clouds
    const clouds: THREE.Group[] = [];
    function createCloud() {
      const cloud = new THREE.Group();
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
      });

      const puffCount = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < puffCount; i++) {
        const radius = 0.8 + Math.random() * 0.9;
        const puffGeo = new THREE.DodecahedronGeometry(radius, 1);
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.5
        );
        cloud.add(puff);
      }
      return cloud;
    }

    for (let i = 0; i < 7; i++) {
      const cloud = createCloud();
      cloud.position.set(
        (Math.random() - 0.5) * 28,
        Math.random() * 7 - 1,
        -5 + (Math.random() - 0.5) * 10
      );
      const scale = 0.6 + Math.random() * 0.7;
      cloud.scale.set(scale, scale, scale);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // 6. Floating Travel Elements (Hot Air Balloon & Waypoint Compass Pin)
    // Stylized Hot Air Balloon
    const balloonGroup = new THREE.Group();
    const balloonGeo = new THREE.SphereGeometry(1.6, 16, 16);
    balloonGeo.scale(1, 1.35, 1);
    const balloonMat = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      roughness: 0.4,
      metalness: 0.1,
    });
    const balloon = new THREE.Mesh(balloonGeo, balloonMat);
    balloonGroup.add(balloon);

    // Basket
    const basketGeo = new THREE.BoxGeometry(0.5, 0.4, 0.5);
    const basketMat = new THREE.MeshStandardMaterial({ color: 0x854d0e });
    const basket = new THREE.Mesh(basketGeo, basketMat);
    basket.position.y = -2.5;
    balloonGroup.add(basket);

    // Strings
    const ropeGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.2);
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0xd4d4d8 });
    const rope1 = new THREE.Mesh(ropeGeo, ropeMat);
    rope1.position.set(0.2, -1.9, 0.2);
    balloonGroup.add(rope1);
    const rope2 = new THREE.Mesh(ropeGeo, ropeMat);
    rope2.position.set(-0.2, -1.9, -0.2);
    balloonGroup.add(rope2);

    balloonGroup.position.set(-9, 3, -2);
    balloonGroup.scale.set(0.7, 0.7, 0.7);
    scene.add(balloonGroup);

    // Floating 3D Map Pin / Waypoint
    const pinGroup = new THREE.Group();
    const pinHeadGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const pinHeadMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.2,
    });
    const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
    pinHead.position.y = 1.2;
    pinGroup.add(pinHead);

    const pinConeGeo = new THREE.ConeGeometry(0.68, 1.4, 16);
    pinConeGeo.rotateX(Math.PI);
    const pinCone = new THREE.Mesh(pinConeGeo, pinHeadMat);
    pinCone.position.y = 0.5;
    pinGroup.add(pinCone);

    // Glowing ring under pin
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = -0.2;
    pinGroup.add(ring);

    pinGroup.position.set(8.5, -0.5, 0);
    pinGroup.scale.set(0.6, 0.6, 0.6);
    scene.add(pinGroup);

    // 7. Golden & Cyan Floating Travel Dust / Particles
    const PARTICLE_COUNT = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);

    const c1 = new THREE.Color(0xff6b35);
    const c2 = new THREE.Color(0x38bdf8);
    const c3 = new THREE.Color(0xfbbf24);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const pick = Math.random();
      const col = pick > 0.6 ? c1 : pick > 0.3 ? c2 : c3;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Flight Arc Curves across the sky
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-14, -2, -6),
      new THREE.Vector3(0, 8, -2),
      new THREE.Vector3(14, 1, -4)
    );
    const arcPoints = curve.getPoints(50);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineDashedMaterial({
      color: 0xffedd5,
      dashSize: 0.4,
      gapSize: 0.2,
      opacity: 0.4,
      transparent: true,
    });
    const flightArc = new THREE.Line(arcGeo, arcMat);
    flightArc.computeLineDistances();
    scene.add(flightArc);

    // 9. Mouse Interaction Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 10. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      camera.position.x = mouseX * 2.2;
      camera.position.y = 1.5 + mouseY * 1.5;
      camera.lookAt(0, 1.2, 0);

      // Animate Planes along 3D orbits with banking
      planes.forEach((item, index) => {
        const t = elapsedTime * item.speed + item.offset;
        const x = Math.sin(t) * item.radiusX;
        const y = Math.sin(t * 1.5) * (item.radiusY * 0.5) + (index === 0 ? 1 : index === 1 ? 3 : -0.5);
        const z = Math.cos(t) * item.radiusZ;

        // Tangent vector for forward orientation
        const nextT = t + 0.02;
        const nextX = Math.sin(nextT) * item.radiusX;
        const nextY = Math.sin(nextT * 1.5) * (item.radiusY * 0.5) + (index === 0 ? 1 : index === 1 ? 3 : -0.5);
        const nextZ = Math.cos(nextT) * item.radiusZ;

        item.mesh.position.set(x, y, z);
        item.mesh.lookAt(nextX, nextY, nextZ);

        // Banking tilt when turning
        const bankAngle = Math.sin(t) * 0.45;
        item.mesh.rotateZ(bankAngle);

        // Update jet trail positions
        const posAttr = item.trailGeo.attributes.position as THREE.BufferAttribute;
        const arr = item.trailPositions;
        for (let j = arr.length - 3; j >= 3; j -= 3) {
          arr[j] = arr[j - 3];
          arr[j + 1] = arr[j - 2];
          arr[j + 2] = arr[j - 1];
        }
        arr[0] = x;
        arr[1] = y;
        arr[2] = z;
        posAttr.needsUpdate = true;
      });

      // Animate Clouds floating slowly
      clouds.forEach((cloud, i) => {
        cloud.position.x += 0.006 * (i % 2 === 0 ? 1 : 0.8);
        if (cloud.position.x > 18) cloud.position.x = -18;
        cloud.position.y += Math.sin(elapsedTime * 0.8 + i) * 0.002;
      });

      // Animate Hot Air Balloon gentle bobbing & slight rotation
      balloonGroup.position.y = 3.2 + Math.sin(elapsedTime * 0.6) * 0.4;
      balloonGroup.rotation.y = elapsedTime * 0.08;

      // Animate Waypoint Pin hovering
      pinGroup.position.y = -0.5 + Math.sin(elapsedTime * 1.2) * 0.25;
      pinGroup.rotation.y = elapsedTime * 0.3;
      ring.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.15);

      // Animate Particles
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-[2] overflow-hidden opacity-90"
      aria-hidden="true"
    />
  );
}
