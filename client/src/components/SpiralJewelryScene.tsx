import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function SpiralJewelryScene({ modelPath = "/diamond_engagement_ring.glb", envPath = "/venice.hdr" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const jewelryRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 0.5, 2.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.6,  // Subtle bloom
      0.4,
      0.88
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(hemi);

    const spot = new THREE.SpotLight(0xffffff, 5);
    spot.position.set(4, 6, 3);
    spot.castShadow = true;
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 1);
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    // Key light for diamond sparkle
    const keyLight = new THREE.SpotLight(0xffffff, 4);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);
    jewelryRef.current = group;

    const loader = new GLTFLoader();
    const rgbe = new RGBELoader();

    // Load HDR
    rgbe.load(envPath, (hdr) => {
      const envTex = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envTex;
      hdr.dispose();
    });

    // White Gold/Platinum material for the ring band
    function makeWhiteGoldMaterial() {
      return new THREE.MeshPhysicalMaterial({
        color: 0xE8E8E8,  // Slightly warm white
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 2.5,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
      });
    }

    // Diamond material for the stone
    function makeDiamondMaterial() {
      return new THREE.MeshPhysicalMaterial({
        transmission: 1,
        ior: 2.42,
        thickness: 0.8,
        roughness: 0,
        metalness: 0,
        envMapIntensity: 6,
        clearcoat: 1,
        clearcoatRoughness: 0,
        sheen: 1.5,
        sheenColor: new THREE.Color(0xffffff),
        sheenRoughness: 0,
        iridescence: 1,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 400],
        side: THREE.DoubleSide,
      });
    }

 loader.load(
  modelPath,
  (gltf) => {
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    

    model.position.sub(center);  // Center the model at origin

    const maxDim = Math.max(size.x, size.y, size.z);
    model.scale.setScalar(1 / maxDim);

    // Apply materials
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Detect diamond vs metal
        const isDiamond = 
          child.name.toLowerCase().includes('diamond') || 
          child.name.toLowerCase().includes('stone') ||
          child.name.toLowerCase().includes('gem') ||
          child.position.y > 0.3;
        
        if (isDiamond) {
          child.material = makeDiamondMaterial();
        } else {
          child.material = makeWhiteGoldMaterial();
        }
      }
    });

    // Recenter after material application to ensure perfect centering
    const finalBox = new THREE.Box3().setFromObject(model);
    const finalCenter = finalBox.getCenter(new THREE.Vector3());
    model.position.sub(finalCenter);

    group.add(model);
  }
);

    clockRef.current = new THREE.Clock();

    const animate = () => {
      const delta = clockRef.current!.getDelta();

      if (jewelryRef.current) {
        jewelryRef.current.rotation.x += 0.3;
      }

      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (renderer) renderer.dispose();
      if (composer) composer.dispose();
    };
  }, [modelPath, envPath]);

  return (
    <div
      ref={containerRef}
      style={{ width: "50%", height: "100vh", position: "fixed", right:0, top: 0, zIndex: 1}}
    />
  );
}