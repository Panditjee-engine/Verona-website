import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface JewelrySceneProps {
  onScroll?: (progress: number) => void;
}

export default function JewelryScene({ onScroll }: JewelrySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const jewelryGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x64b5f6, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create jewelry group (placeholder ring)
    const jewelryGroup = new THREE.Group();
    scene.add(jewelryGroup);
    jewelryGroupRef.current = jewelryGroup;

    // Create a simple ring geometry as placeholder
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.3, 64, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // Gold
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    ring.receiveShadow = true;
    jewelryGroup.add(ring);

    // Create a diamond (placeholder sphere with high reflectivity)
    const diamondGeometry = new THREE.OctahedronGeometry(0.4, 3);
    const diamondMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.05,
      emissive: 0x64b5f6,
      emissiveIntensity: 0.3,
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.set(0, 0.8, 0);
    diamond.castShadow = true;
    diamond.receiveShadow = true;
    jewelryGroup.add(diamond);

    // Create falling diamond particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x64b5f6,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update particles
      const positionAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const velocityAttribute = particleGeometry.getAttribute('velocity') as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      const velocities = velocityAttribute.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset particles that fall below
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 1] = Math.random() * 15 + 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }

      positionAttribute.needsUpdate = true;

      // Rotate jewelry
      if (jewelryGroup) {
        jewelryGroup.rotation.x += 0.001;
        jewelryGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Scroll animation
    gsap.to(jewelryGroup.rotation, {
      y: Math.PI * 4,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          onScroll?.(self.progress);
        },
      },
    });

    // Camera zoom on scroll
    gsap.to(camera.position, {
      z: 2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const resizeWidth = containerRef.current.clientWidth;
      const resizeHeight = containerRef.current.clientHeight;

      camera.aspect = resizeWidth / resizeHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(resizeWidth, resizeHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      diamondGeometry.dispose();
      diamondMaterial.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{ position: 'sticky', top: 0 }}
    />
  );
}
