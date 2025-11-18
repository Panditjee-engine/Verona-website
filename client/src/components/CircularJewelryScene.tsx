// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";




// gsap.registerPlugin(ScrollTrigger);

// interface JewelrySceneProps {
//   onScroll?: (progress: number) => void;
// }

// export default function JewelryScene({ onScroll }: JewelrySceneProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const particlesRef = useRef<THREE.Points | null>(null);
//   const jewelryGroupRef = useRef<THREE.Group | null>(null);
//   const animationFrameRef = useRef<number | undefined>(undefined);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0a0a);
//     sceneRef.current = scene;

//     // Camera setup
//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       width / height,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;
//     cameraRef.current = camera;

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 2048;
//     directionalLight.shadow.mapSize.height = 2048;
//     scene.add(directionalLight);

//     const pointLight = new THREE.PointLight(0x64b5f6, 0.5);
//     pointLight.position.set(-5, 5, 5);
//     scene.add(pointLight);

//     // Create jewelry group (placeholder ring)
//     const jewelryGroup = new THREE.Group();
//     scene.add(jewelryGroup);
//     jewelryGroupRef.current = jewelryGroup;

//     // Create a simple ring geometry as placeholder
//     const ringGeometry = new THREE.TorusGeometry(1.5, 0.3, 64, 100);
//     const ringMaterial = new THREE.MeshStandardMaterial({
//       color: 0xffd700, // Gold
//       metalness: 0.9,
//       roughness: 0.1,
//     });
//     const ring = new THREE.Mesh(ringGeometry, ringMaterial);
//     ring.castShadow = true;
//     ring.receiveShadow = true;
//     jewelryGroup.add(ring);

//     // Create a diamond (placeholder sphere with high reflectivity)
//     // const diamondGeometry = new THREE.OctahedronGeometry(0.4, 3);
//     // const diamondMaterial = new THREE.MeshStandardMaterial({
//     //   color: 0xffffff,
//     //   metalness: 0.5,
//     //   roughness: 0.05,
//     //   emissive: 0x64b5f6,
//     //   emissiveIntensity: 0.3,
//     // });
//     // const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
//     // diamond.position.set(0, 0.8, 0);
//     // diamond.castShadow = true;
//     // diamond.receiveShadow = true;
//     // jewelryGroup.add(diamond);

//     // Create falling diamond particles
//     const particleCount = 200;
//     const particleGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const velocities = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 20;
//       positions[i * 3 + 1] = Math.random() * 15 + 5;
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

//       velocities[i * 3] = (Math.random() - 0.5) * 0.02;
//       velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.01;
//       velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
//     }

//     particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

//     const particleMaterial = new THREE.PointsMaterial({
//       color: 0x64b5f6,
//       size: 0.05,
//       sizeAttenuation: true,
//       transparent: true,
//       opacity: 0.8,
//     });

//     const particles = new THREE.Points(particleGeometry, particleMaterial);
//     scene.add(particles);
//     particlesRef.current = particles;

//     // Animation loop
//     const animate = () => {
//       animationFrameRef.current = requestAnimationFrame(animate);

//       // Update particles
//       const positionAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
//       const velocityAttribute = particleGeometry.getAttribute('velocity') as THREE.BufferAttribute;
//       const positions = positionAttribute.array as Float32Array;
//       const velocities = velocityAttribute.array as Float32Array;

//       for (let i = 0; i < particleCount; i++) {
//         positions[i * 3] += velocities[i * 3];
//         positions[i * 3 + 1] += velocities[i * 3 + 1];
//         positions[i * 3 + 2] += velocities[i * 3 + 2];

//         // Reset particles that fall below
//         if (positions[i * 3 + 1] < -5) {
//           positions[i * 3] = (Math.random() - 0.5) * 20;
//           positions[i * 3 + 1] = Math.random() * 15 + 5;
//           positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
//         }
//       }

//       positionAttribute.needsUpdate = true;

//       // Rotate jewelry
//       if (jewelryGroup) {
//         jewelryGroup.rotation.x += 0.001;
//         jewelryGroup.rotation.y += 0.002;
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Scroll animation
//     gsap.to(jewelryGroup.rotation, {
//       y: Math.PI * 4,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         scrub: 1,
//         onUpdate: (self) => {
//           onScroll?.(self.progress);
//         },
//       },
//     });

//     // Camera zoom on scroll
//     gsap.to(camera.position, {
//       z: 2,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         scrub: 1,
//       },
//     });

//     // Handle window resize
//     const handleResize = () => {
//       if (!containerRef.current) return;

//       const resizeWidth = containerRef.current.clientWidth;
//       const resizeHeight = containerRef.current.clientHeight;

//       camera.aspect = resizeWidth / resizeHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(resizeWidth, resizeHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Load the real diamond model (FBX)
//     // const fbxLoader = new FBXLoader();
//     // fbxLoader.load("/models/diamond.fbx", (object) => {
//     //   object.scale.set(1, 1, 1); // bigger

//     //   object.position.set(0, 0.2, 0); // make visible

//     //   object.traverse((child) => {
//     //     if (child instanceof THREE.Mesh) {
//     //       child.castShadow = true;
//     //       child.receiveShadow = true;

//     //       // If the FBX mesh has geometry
//     //       if (child.geometry) {
//     //         child.geometry.computeVertexNormals();
//     //       }

//     //       // Convert to MeshStandardMaterial (FBX often uses Phong)
//     //       child.material = new THREE.MeshStandardMaterial({
//     //         color: 0xffffff,
//     //         roughness: 0.05,
//     //         metalness: 0,
//     //         envMapIntensity: 3,
//     //         transparent: true,
//     //         opacity: 1,
//     //         side: THREE.DoubleSide,
//     //       });
//     //     }
//     //   });


//     //   jewelryGroup.add(object);
//     // });

// // Load GLB diamond model
// const gltfLoader = new GLTFLoader();
// const pmrem = new THREE.PMREMGenerator(renderer);

// let mixer: THREE.AnimationMixer | null = null;

// // Optional: environment map for reflections
// new THREE.TextureLoader().load("/env/studio.hdr", (tex) => {
//   const env = pmrem.fromEquirectangular(tex).texture;
//   scene.environment = env;
// });

// gltfLoader.load(
//   "/models/diamond-glb.glb",
//   (gltf) => {
//     const model = gltf.scene;

//     model.scale.set(0.1, 0.1, 0.1);
//     model.position.set(0, 0.2, 0);

//     model.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         if (child.geometry) {
//           child.geometry.computeVertexNormals();
//         }

//         child.material = new THREE.MeshPhysicalMaterial({
//           color: 0xffffff,
//           roughness: 0,
//           metalness: 0,
//           transmission: 1,
//           ior: 2.4,
//           thickness: 5,
//           envMapIntensity: 3,
//           clearcoat: 1,
//           clearcoatRoughness: 0,
//           specularIntensity: 1,
//         });
//       }
//     });

//     jewelryGroup.add(model);

//     // Handle animation
//     if (gltf.animations.length > 0) {
//       mixer = new THREE.AnimationMixer(model);
//       const action = mixer.clipAction(gltf.animations[0]);
//       action.play();
//     }
//   },
//   undefined,
//   (error) => {
//     console.error("Error loading GLB model:", error);
//   }
// );





//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       containerRef.current?.removeChild(renderer.domElement);
//       renderer.dispose();
//       particleGeometry.dispose();
//       particleMaterial.dispose();
//       ringGeometry.dispose();
//       ringMaterial.dispose();

//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [onScroll]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-screen bg-black overflow-hidden"
//       style={{ position: 'sticky', top: 0 }}
//     />
//   );
// }


// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";




// gsap.registerPlugin(ScrollTrigger);

// interface JewelrySceneProps {
//   onScroll?: (progress: number) => void;
// }

// export default function JewelryScene({ onScroll }: JewelrySceneProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const particlesRef = useRef<THREE.Points | null>(null);
//   const jewelryGroupRef = useRef<THREE.Group | null>(null);
//   const animationFrameRef = useRef<number | undefined>(undefined);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0a0a);
//     sceneRef.current = scene;

//     // Camera setup
//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       width / height,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;
//     cameraRef.current = camera;

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 2048;
//     directionalLight.shadow.mapSize.height = 2048;
//     scene.add(directionalLight);

//     const pointLight = new THREE.PointLight(0x64b5f6, 0.5);
//     pointLight.position.set(-5, 5, 5);
//     scene.add(pointLight);

//     // Create jewelry group (placeholder ring)
//     const jewelryGroup = new THREE.Group();
//     scene.add(jewelryGroup);
//     jewelryGroupRef.current = jewelryGroup;

//     // Create a simple ring geometry as placeholder
//     const ringGeometry = new THREE.TorusGeometry(1.5, 0.3, 64, 100);
//     const ringMaterial = new THREE.MeshStandardMaterial({
//       color: 0xffd700, // Gold
//       metalness: 0.9,
//       roughness: 0.1,
//     });
//     const ring = new THREE.Mesh(ringGeometry, ringMaterial);
//     ring.castShadow = true;
//     ring.receiveShadow = true;
//     jewelryGroup.add(ring);

//     // Create a diamond (placeholder sphere with high reflectivity)
//     // const diamondGeometry = new THREE.OctahedronGeometry(0.4, 3);
//     // const diamondMaterial = new THREE.MeshStandardMaterial({
//     //   color: 0xffffff,
//     //   metalness: 0.5,
//     //   roughness: 0.05,
//     //   emissive: 0x64b5f6,
//     //   emissiveIntensity: 0.3,
//     // });
//     // const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
//     // diamond.position.set(0, 0.8, 0);
//     // diamond.castShadow = true;
//     // diamond.receiveShadow = true;
//     // jewelryGroup.add(diamond);

//     // Create falling diamond particles
//     const particleCount = 200;
//     const particleGeometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);
//     const velocities = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 20;
//       positions[i * 3 + 1] = Math.random() * 15 + 5;
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

//       velocities[i * 3] = (Math.random() - 0.5) * 0.02;
//       velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.01;
//       velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
//     }

//     particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

//     const particleMaterial = new THREE.PointsMaterial({
//       color: 0x64b5f6,
//       size: 0.05,
//       sizeAttenuation: true,
//       transparent: true,
//       opacity: 0.8,
//     });

//     const particles = new THREE.Points(particleGeometry, particleMaterial);
//     scene.add(particles);
//     particlesRef.current = particles;

//     // Animation loop
//     const animate = () => {
//       animationFrameRef.current = requestAnimationFrame(animate);

//       // Update particles
//       const positionAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
//       const velocityAttribute = particleGeometry.getAttribute('velocity') as THREE.BufferAttribute;
//       const positions = positionAttribute.array as Float32Array;
//       const velocities = velocityAttribute.array as Float32Array;

//       for (let i = 0; i < particleCount; i++) {
//         positions[i * 3] += velocities[i * 3];
//         positions[i * 3 + 1] += velocities[i * 3 + 1];
//         positions[i * 3 + 2] += velocities[i * 3 + 2];

//         // Reset particles that fall below
//         if (positions[i * 3 + 1] < -5) {
//           positions[i * 3] = (Math.random() - 0.5) * 20;
//           positions[i * 3 + 1] = Math.random() * 15 + 5;
//           positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
//         }
//       }

//       positionAttribute.needsUpdate = true;

//       // Rotate jewelry
//       if (jewelryGroup) {
//         jewelryGroup.rotation.x += 0.001;
//         jewelryGroup.rotation.y += 0.002;
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Scroll animation
//     gsap.to(jewelryGroup.rotation, {
//       y: Math.PI * 4,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         scrub: 1,
//         onUpdate: (self) => {
//           onScroll?.(self.progress);
//         },
//       },
//     });

//     // Camera zoom on scroll
//     gsap.to(camera.position, {
//       z: 2,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: 'top top',
//         end: 'bottom bottom',
//         scrub: 1,
//       },
//     });

//     // Handle window resize
//     const handleResize = () => {
//       if (!containerRef.current) return;

//       const resizeWidth = containerRef.current.clientWidth;
//       const resizeHeight = containerRef.current.clientHeight;

//       camera.aspect = resizeWidth / resizeHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(resizeWidth, resizeHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Load the real diamond model (FBX)
//     // const fbxLoader = new FBXLoader();
//     // fbxLoader.load("/models/diamond.fbx", (object) => {
//     //   object.scale.set(1, 1, 1); // bigger

//     //   object.position.set(0, 0.2, 0); // make visible

//     //   object.traverse((child) => {
//     //     if (child instanceof THREE.Mesh) {
//     //       child.castShadow = true;
//     //       child.receiveShadow = true;

//     //       // If the FBX mesh has geometry
//     //       if (child.geometry) {
//     //         child.geometry.computeVertexNormals();
//     //       }

//     //       // Convert to MeshStandardMaterial (FBX often uses Phong)
//     //       child.material = new THREE.MeshStandardMaterial({
//     //         color: 0xffffff,
//     //         roughness: 0.05,
//     //         metalness: 0,
//     //         envMapIntensity: 3,
//     //         transparent: true,
//     //         opacity: 1,
//     //         side: THREE.DoubleSide,
//     //       });
//     //     }
//     //   });


//     //   jewelryGroup.add(object);
//     // });

// // Load GLB diamond model
// const gltfLoader = new GLTFLoader();
// const pmrem = new THREE.PMREMGenerator(renderer);

// let mixer: THREE.AnimationMixer | null = null;

// // Optional: environment map for reflections
// new THREE.TextureLoader().load("/env/studio.hdr", (tex) => {
//   const env = pmrem.fromEquirectangular(tex).texture;
//   scene.environment = env;
// });

// gltfLoader.load(
//   "/models/diamond-glb.glb",
//   (gltf) => {
//     const model = gltf.scene;

//     model.scale.set(0.1, 0.1, 0.1);
//     model.position.set(0, 0.2, 0);

//     model.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         if (child.geometry) {
//           child.geometry.computeVertexNormals();
//         }

//         child.material = new THREE.MeshPhysicalMaterial({
//           color: 0xffffff,
//           roughness: 0,
//           metalness: 0,
//           transmission: 1,
//           ior: 2.4,
//           thickness: 5,
//           envMapIntensity: 3,
//           clearcoat: 1,
//           clearcoatRoughness: 0,
//           specularIntensity: 1,
//         });
//       }
//     });

//     jewelryGroup.add(model);

//     // Handle animation
//     if (gltf.animations.length > 0) {
//       mixer = new THREE.AnimationMixer(model);
//       const action = mixer.clipAction(gltf.animations[0]);
//       action.play();
//     }
//   },
//   undefined,
//   (error) => {
//     console.error("Error loading GLB model:", error);
//   }
// );





//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       containerRef.current?.removeChild(renderer.domElement);
//       renderer.dispose();
//       particleGeometry.dispose();
//       particleMaterial.dispose();
//       ringGeometry.dispose();
//       ringMaterial.dispose();

//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [onScroll]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-screen bg-black overflow-hidden"
//       style={{ position: 'sticky', top: 0 }}
//     />
//   );
// }

// 

// Updated complete React component with diamond rendering, bloom, dispersion-like effects, and postprocessing
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function CircularJewelryScene({ modelPath = "/ring-glb.glb", envPath = "/venice.hdr" }) {
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
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.8,  // Reduced bloom intensity
      0.4,
      0.85  // Higher threshold so only bright parts bloom
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(hemi);

    const spot = new THREE.SpotLight(0xffffff, 4);
    spot.position.set(4, 6, 3);
    spot.castShadow = true;
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(-3, 2, 2);
    scene.add(fill);

    // Additional key light for the diamond
    const keyLight = new THREE.SpotLight(0xffffff, 3);
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

    // Gold material for the ring band
    function makeGoldMaterial() {
      return new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 1,
        roughness: 0.15,
        envMapIntensity: 2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      });
    }

    // Diamond material for the stone
    function makeDiamondMaterial() {
      return new THREE.MeshPhysicalMaterial({
        transmission: 1,
        ior: 2.42,
        thickness: 0.5,
        roughness: 0,
        metalness: 0,
        envMapIntensity: 5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        sheen: 1,
        sheenColor: new THREE.Color(0xffffff),
        sheenRoughness: 0,
        iridescence: 0.8,
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

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(1 / maxDim);

        // Apply materials based on mesh name or position
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Check if it's the diamond (usually higher up or has specific name)
            // You may need to adjust this logic based on your model's structure
            const isDiamond = child.name.toLowerCase().includes('diamond') || 
                             child.name.toLowerCase().includes('stone') ||
                             child.name.toLowerCase().includes('gem') ||
                             child.position.y > 0.3; // Diamond is usually on top
            
            if (isDiamond) {
              child.material = makeDiamondMaterial();
            } else {
              child.material = makeGoldMaterial();
            }
          }
        });

        group.add(model);
      }
    );

    clockRef.current = new THREE.Clock();

    const animate = () => {
      const delta = clockRef.current!.getDelta();

      if (jewelryRef.current) {
        jewelryRef.current.rotation.y += 0.3; // Slightly faster rotation
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
      style={{ width: "50%", height: "100vh", position: "fixed", top: 0, left: 0, right:0, zIndex: 1}}
    />
  );
}
