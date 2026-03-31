import { useEffect, useRef } from "react";
import * as THREE from "three";

function getParticleColors() {
  const style = getComputedStyle(document.documentElement);
  const toRgb = (css: string): [number, number, number] => {
    const match = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]) / 255, parseInt(match[2]) / 255, parseInt(match[3]) / 255];
    }
    return [0.5, 0.5, 0.5];
  };
  return {
    p1: toRgb(style.getPropertyValue("--particle-1").trim() || "rgba(201, 168, 76, 0.4)"),
    p2: toRgb(style.getPropertyValue("--particle-2").trim() || "rgba(251, 246, 238, 0.3)"),
    p3: toRgb(style.getPropertyValue("--particle-3").trim() || "rgba(141, 125, 107, 0.3)"),
  };
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const colorsArrayRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    geometryRef.current = particlesGeometry;
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    colorsArrayRef.current = colorsArray;

    const colors = getParticleColors();
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 50;

      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        [colorsArray[i], colorsArray[i + 1], colorsArray[i + 2]] = colors.p1;
      } else if (colorChoice < 0.7) {
        [colorsArray[i], colorsArray[i + 1], colorsArray[i + 2]] = colors.p2;
      } else {
        [colorsArray[i], colorsArray[i + 1], colorsArray[i + 2]] = colors.p3;
      }
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    meshRef.current = particlesMesh;
    scene.add(particlesMesh);

    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.0003;
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.position.x += (mouse.x * 2 - particlesMesh.position.x) * 0.01;
      particlesMesh.position.y += (mouse.y * 2 - particlesMesh.position.y) * 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const handleThemeChange = () => {
      const newColors = getParticleColors();
      const ca = colorsArrayRef.current;
      if (!ca) return;
      for (let i = 0; i < particlesCount * 3; i += 3) {
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          [ca[i], ca[i + 1], ca[i + 2]] = newColors.p1;
        } else if (colorChoice < 0.7) {
          [ca[i], ca[i + 1], ca[i + 2]] = newColors.p2;
        } else {
          [ca[i], ca[i + 1], ca[i + 2]] = newColors.p3;
        }
      }
      if (geometryRef.current) {
        geometryRef.current.attributes.color.needsUpdate = true;
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "data-theme") handleThemeChange();
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="particle-bg" aria-hidden="true" />;
}
