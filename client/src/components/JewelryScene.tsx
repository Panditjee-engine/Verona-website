
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



gsap.registerPlugin(ScrollTrigger);

export default function JewelryScene({ modelPath = "/VERONA.glb", sloganPath = "/SLOGAN.glb", floatingModels = ["/2.glb", "/3.glb", "/4.glb", "/5.glb", "/6.glb", "/7.glb", "/8.glb", "/9.glb", "/10.glb", "/11.glb", "12.glb", "13.glb", "14.glb", "15.glb", "16.glb", "17.glb", "18.glb"], envPath = "/venice.hdr", floatingCount = 11 }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // const clockRef = useRef<THREE.Clock | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const jewelryRef = useRef<THREE.Group | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);
  const sloganGroupRef = useRef<THREE.Group | null>(null);
  const envMapRef = useRef<THREE.Texture | null>(null);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;
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
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    composerRef.current = composer;

    const pmremGen = new THREE.PMREMGenerator(renderer);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 0.6);
    scene.add(hemi);

    const spot = new THREE.SpotLight(0xffffff, 5);
    spot.position.set(4, 6, 3);
    spot.castShadow = true;
    spot.angle = Math.PI / 6;
    spot.penumbra = 0.3;
    scene.add(spot);

    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(-3, 2, 2);
    scene.add(fill);


    // Add rim light for extra sparkle
    const rimLight1 = new THREE.PointLight(0x4af2ff, 2, 10);
    rimLight1.position.set(2, 1, -2);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xffa6f9, 1.5, 10);
    rimLight2.position.set(-2, 1, 2);
    scene.add(rimLight2);

    const group = new THREE.Group();
    scene.add(group);
    jewelryRef.current = group;

    const sloganGroup = new THREE.Group();
    scene.add(sloganGroup);
    sloganGroupRef.current = sloganGroup;

    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    floatingGroupRef.current = floatingGroup;

    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(width, height),
    //   0.4, // strength
    //   0.4, // radius
    //   0.85 // threshold
    // );
    // composer.addPass(bloomPass);


    const loader = new GLTFLoader();
    const rgbe = new RGBELoader();

    rgbe.load(envPath, (hdr) => {
      const envTex = pmremGen.fromEquirectangular(hdr).texture;
      scene.environment = envTex;
      envMapRef.current = envTex;      // <-- store it so new materials can see it
      hdr.dispose();

      // Update existing meshes (in case they were created before env loaded)
      floatingGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshPhysicalMaterial).envMap = envTex;
          (child.material as THREE.MeshPhysicalMaterial).needsUpdate = true;
        }
      });

      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshPhysicalMaterial).envMap = envTex;
          (child.material as THREE.MeshPhysicalMaterial).needsUpdate = true;
        }
      });
    });




    // function makeDiamondMaterial() {
    //   return new THREE.MeshPhysicalMaterial({
    //     metalness: 0,
    //     roughness: 0,
    //     transmission: 1,
    //     ior: 2.45, // closer to real diamond
    //     thickness: 5,
    //     dispersion: 0.05, // ✨ Fake chromatic dispersion (Three.js r165+)
    //     attenuationDistance: 0.1,
    //     attenuationColor: new THREE.Color("#ffffff"),

    //     clearcoat: 1,
    //     clearcoatRoughness: 0,

    //     specularIntensity: 2.2,
    //     specularColor: new THREE.Color("#ffffff"),

    //     iridescence: 1,
    //     iridescenceIOR: 2.0,
    //     iridescenceThicknessRange: [200, 1200],

    //     envMapIntensity: 15, // increased reflection strength
    //     color: new THREE.Color("white"),
    //     side: THREE.DoubleSide,
    //     transparent: true
    //   });
    // }

    function makeDiamondMaterial() {
      return new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        transmission: 1,
        ior: 2.45,
        thickness: 2,
        dispersion: 0.05,
        attenuationDistance: 0.6,
        attenuationColor: new THREE.Color("#000"),
        clearcoat: 1,
        clearcoatRoughness: 0,
        specularIntensity: 2.2,
        specularColor: new THREE.Color("#000"),
        iridescence: 1,
        iridescenceIOR: 2.0,
        iridescenceThicknessRange: [200, 1200],
        envMap: envMapRef.current ?? null,   // 🔥 use envMap if already loaded
        envMapIntensity: 5,
        color: new THREE.Color("white"),
        side: THREE.DoubleSide,
        transparent: true,
      });
    }



    // ---- LOAD FLOATING DIAMONDS ----
    // for (let i = 0; i < floatingCount; i++) {
    //   const randomModel = floatingModels[Math.floor(Math.random() * floatingModels.length)];

    //   loader.load(randomModel, (gltf) => {
    //     const model = gltf.scene.clone(true); // <-- important

    //     const scale = THREE.MathUtils.randFloat(0.15, 0.4);
    //     model.scale.setScalar(scale);

    //     model.position.set(
    //       THREE.MathUtils.randFloatSpread(6),
    //       THREE.MathUtils.randFloatSpread(4),
    //       THREE.MathUtils.randFloatSpread(3)
    //     );

    //     model.traverse((child) => {
    //       if (child instanceof THREE.Mesh) {
    //         child.material = makeDiamondMaterial();
    //         child.material = makeDiamondMaterial();
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //       }
    //     });

    //     (model as any).velocity = new THREE.Vector3(
    //       THREE.MathUtils.randFloat(-0.002, 0.002),
    //       THREE.MathUtils.randFloat(-0.002, 0.002),
    //       THREE.MathUtils.randFloat(-0.002, 0.002)
    //     );

    //     floatingGroup.add(model);
    //   });





    // }

    for (let i = 0; i < floatingCount; i++) {
      const randomModel = floatingModels[Math.floor(Math.random() * floatingModels.length)];

      loader.load(randomModel, (gltf) => {
        const model = gltf.scene.clone(true);

        // Make sure size is reasonable
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = THREE.MathUtils.randFloat(0.2, 0.12); // how big you want them
        const scaleFactor = targetSize / maxDim;
        model.scale.setScalar(scaleFactor);

        // Place around the main piece in a donut
        const angle = (i / floatingCount) * Math.PI * 2;
        const radius = 1.4 + Math.random() * 0.4;

        model.position.set(
          Math.cos(angle) * radius,
          THREE.MathUtils.randFloat(-0.3, 0.8),
          Math.sin(angle) * radius * 0.6
        );

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = makeDiamondMaterial();
          }
        });

        // Add velocity for floating
        (model as any).velocity = new THREE.Vector3(
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002),
          THREE.MathUtils.randFloat(-0.002, 0.002)
        );

        floatingGroup.add(model);

        // Quick debug if needed:
        // console.log("Added floating model", model.position);
      });
    }



    loader.load(
      sloganPath,
      (gltf) => {
        const model = gltf.scene;

        // ---- STEP 1: RESET POSITION SO CENTERING WORKS ----
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        // ---- STEP 2: COMPUTE BOUNDING BOX + SCALE ----
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 0.94 / maxDim; // adjust scale (1.0 small, 1.2 bigger)

        model.scale.setScalar(scaleFactor);

        // ---- STEP 3: RECALCULATE BOX AFTER SCALING ----
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        // ---- STEP 4: RECENTER MODEL ----
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Optional fine-tuning: push slightly upward if needed
        model.position.y -= 0.05;

        // ---- FIX ROTATION HERE ----
        model.rotation.x = Math.PI / 2;

        // ---- STEP 5: APPLY MATERIAL ----
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = makeDiamondMaterial();
          }
        });

        group.add(model);
      }
    );



    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // ---- STEP 1: RESET POSITION SO CENTERING WORKS ----
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        // ---- STEP 2: COMPUTE BOUNDING BOX + SCALE ----
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 0.94 / maxDim; // adjust scale (1.0 small, 1.2 bigger)

        model.scale.setScalar(scaleFactor);

        // ---- STEP 3: RECALCULATE BOX AFTER SCALING ----
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        // ---- STEP 4: RECENTER MODEL ----
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Optional fine-tuning: push slightly upward if needed
        model.position.y -= 0.05;

        // ---- FIX ROTATION HERE ----
        model.rotation.x = Math.PI / 2;

        // ---- STEP 5: APPLY MATERIAL ----
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = makeDiamondMaterial();
          }
        });

        group.add(model);
      }
    );








    // clockRef.current = new THREE.Clock();

    // const animate = () => {

    //   // Update floating diamonds

    //   if (!clockRef.current) return; // safety check

    //   if (floatingGroup.children.length > 0) {
    //     floatingGroup.children.forEach((child) => {
    //       if ((child as any).velocity) {
    //         const vel = (child as any).velocity;
    //         child.position.add(vel);
    //         child.rotation.y += 0.005;
    //         child.rotation.x += 0.003;

    //         // Bounce back if too far
    //         if (Math.abs(child.position.x) > 4) vel.x *= -1;
    //         if (Math.abs(child.position.y) > 3) vel.y *= -1;
    //         if (Math.abs(child.position.z) > 2) vel.z *= -1;
    //       }
    //     });
    //   }

    //   const delta = clockRef.current.getDelta();
    //   composerRef.current?.render(delta);

    //   composer.render();
    //   requestAnimationFrame(animate);
    // };

    const animate = () => {
      const delta = clockRef.current.getDelta();

      // Update floating diamonds
      floatingGroup.children.forEach((child) => {
        const anyChild = child as any;
        if (anyChild.velocity) {
          const vel: THREE.Vector3 = anyChild.velocity;
          child.position.add(vel);
          child.rotation.y += 0.005;
          child.rotation.x += 0.003;

          if (Math.abs(child.position.x) > 4) vel.x *= -1;
          if (Math.abs(child.position.y) > 3) vel.y *= -1;
          if (Math.abs(child.position.z) > 2) vel.z *= -1;
        }
      });

      if (composerRef.current) {
        composerRef.current.render(delta);
      } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

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
      style={{ width: "100%", height: "100vh", position: "sticky", top: 0, background: "transparent" }}
    />
  );
}



