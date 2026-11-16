import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { PRODUCTS } from '../../data/products';
import { StudioLighting } from './StudioLighting';
import { ProceduralSneakerFallback, SneakerModel } from './SneakerModel';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { StaticFallback } from './StaticFallback';

export interface ScrollChoreography {
  progress: number;
  heroWeight: number;
}

interface SceneProps {
  choreographyRef: React.MutableRefObject<ScrollChoreography>;
  reducedMotion: boolean;
}

const ChoreographedSneaker: React.FC<SceneProps> = ({ choreographyRef, reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const p = choreographyRef.current.progress;
    const heroWeight = choreographyRef.current.heroWeight;
    const elapsed = state.clock.elapsedTime;

    let targetX = 0.72;
    let targetY = -0.1;
    let targetRotY = -0.55;
    let targetRotX = 0.12;
    let targetRotZ = 0.05;
    let targetCamZ = 4.6;

    if (p < 0.33) {
      const t = p / 0.33;
      targetX = THREE.MathUtils.lerp(0.72, -0.92, t);
      targetY = THREE.MathUtils.lerp(-0.1, 0.05, t);
      targetRotY = THREE.MathUtils.lerp(-0.55, 0.85, t);
      targetRotX = THREE.MathUtils.lerp(0.12, 0.25, t);
      targetCamZ = THREE.MathUtils.lerp(4.6, 3.85, t);
    } else if (p < 0.66) {
      const t = (p - 0.33) / 0.33;
      targetX = THREE.MathUtils.lerp(-0.92, 0.92, t);
      targetY = THREE.MathUtils.lerp(0.05, -0.05, t);
      targetRotY = THREE.MathUtils.lerp(0.85, 2.35, t);
      targetRotX = THREE.MathUtils.lerp(0.25, -0.18, t);
      targetCamZ = THREE.MathUtils.lerp(3.85, 3.25, t);
    } else {
      const t = (p - 0.66) / 0.34;
      targetX = THREE.MathUtils.lerp(0.92, 0.0, t);
      targetY = THREE.MathUtils.lerp(-0.05, 0.22, t);
      targetRotY = THREE.MathUtils.lerp(2.35, Math.PI * 1.15, t);
      targetRotX = THREE.MathUtils.lerp(-0.18, -0.62, t);
      targetRotZ = THREE.MathUtils.lerp(0.05, -0.18, t);
      targetCamZ = THREE.MathUtils.lerp(3.25, 4.1, t);
    }

    const idleSpin = reducedMotion ? 0 : Math.sin(elapsed * 0.45) * 0.22 * heroWeight;
    const floatY = reducedMotion ? 0 : Math.sin(elapsed * 1.4) * 0.06;
    const parallaxX = reducedMotion ? 0 : pointer.current.y * 0.16 * heroWeight;
    const parallaxY = reducedMotion ? 0 : pointer.current.x * 0.25 * heroWeight;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      6,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY + floatY,
      6,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX + parallaxX,
      6,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY + idleSpin + parallaxY,
      6,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotZ,
      6,
      delta
    );

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6, delta);
  });

  return (
    <group ref={groupRef}>
      <ModelErrorBoundary colorHex="#1c1d21" accentHex="#D4FF00">
        <Suspense fallback={<ProceduralSneakerFallback colorHex="#1c1d21" accentHex="#D4FF00" />}>
          <SneakerModel
            url={BRAND_CONFIG.defaultModelUrl}
            scale={10.5}
            colorHex="#1c1d21"
            accentHex="#D4FF00"
            roughness={0.45}
            metalness={0.25}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
};

export const HeroStoryCanvas: React.FC<{
  choreographyRef: React.MutableRefObject<ScrollChoreography>;
}> = ({ choreographyRef }) => {
  const { canRender3D, isSoftwareGl, prefersReducedMotion } = useDeviceCapabilities();
  const [contextLost, setContextLost] = useState(false);

  if (!canRender3D || contextLost) {
    return (
      <div className="flex h-full w-full items-center justify-end pr-8 opacity-90">
        <div className="aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800">
          <StaticFallback imageUrl={PRODUCTS[0].imageUrl} label={PRODUCTS[0].name} />
        </div>
      </div>
    );
  }

  return (
    <Canvas
      shadows={!isSoftwareGl}
      dpr={isSoftwareGl ? 1 : [1, 2]}
      camera={{ position: [0, 0.2, 4.6], fov: 38 }}
      gl={{
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      onCreated={({ gl }) => {
        const el = gl.domElement;
        el.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          setContextLost(true);
        });
        el.addEventListener('webglcontextrestored', () => {
          setContextLost(false);
        });
      }}
    >
      <StudioLighting isSoftwareGl={isSoftwareGl} />
      <ChoreographedSneaker
        choreographyRef={choreographyRef}
        reducedMotion={prefersReducedMotion}
      />
    </Canvas>
  );
};
