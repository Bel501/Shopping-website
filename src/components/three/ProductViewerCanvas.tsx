import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { StudioLighting } from './StudioLighting';
import { ProceduralSneakerFallback, SneakerModel } from './SneakerModel';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import { ProductVariant } from '../../data/products';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { StaticFallback } from './StaticFallback';
import { ChevronDown, ChevronUp, Grid, Rotate3d } from 'lucide-react';

type CameraPreset = 'studio' | 'profile' | 'sole';

const PRESETS: Record<CameraPreset, { label: string; pos: [number, number, number] }> = {
  studio: { label: '3/4 Studio', pos: [2.8, 1.1, 3.6] },
  profile: { label: 'Side Profile', pos: [0.0, 0.25, 4.4] },
  sole: { label: 'Carbon Plate', pos: [1.6, -1.8, 3.1] },
};

const CameraRig: React.FC<{
  preset: CameraPreset | null;
  onUserInteract: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ preset, onUserInteract, controlsRef }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...PRESETS.studio.pos));
  const transitioning = useRef(false);

  useEffect(() => {
    if (!preset) return;
    targetPos.current.set(...PRESETS[preset].pos);
    transitioning.current = true;
  }, [preset]);

  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    const handleStart = () => {
      transitioning.current = false;
      onUserInteract();
    };
    ctrl.addEventListener('start', handleStart);
    return () => ctrl.removeEventListener('start', handleStart);
  }, [controlsRef, onUserInteract]);

  useFrame((_, delta) => {
    if (!transitioning.current) return;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 6, delta);
    if (camera.position.distanceTo(targetPos.current) < 0.03) {
      transitioning.current = false;
    }
  });

  return null;
};

interface ProductViewerCanvasProps {
  modelUrl: string;
  modelScale?: number;
  variant: ProductVariant;
  productName: string;
  fallbackImageUrl?: string;
}

export const ProductViewerCanvas: React.FC<ProductViewerCanvasProps> = ({
  modelUrl,
  modelScale = 10.5,
  variant,
  productName,
  fallbackImageUrl,
}) => {
  const { canRender3D, isSoftwareGl, prefersReducedMotion } = useDeviceCapabilities();
  const [autoRotate, setAutoRotate] = useState(!prefersReducedMotion && !isSoftwareGl);
  const [wireframe, setWireframe] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPreset | null>('studio');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  if (!canRender3D || contextLost) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-carbon lg:h-[600px] lg:aspect-auto">
        <StaticFallback
          label={productName}
          imageUrl={fallbackImageUrl}
          colorHex={variant.hex}
          accentHex={variant.accentHex}
        />
      </div>
    );
  }

  return (
    <div
      data-cursor="drag"
      className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-carbon to-obsidian lg:h-[620px]"
    >
      {/* Top-left subtle interaction hint */}
      <div className="pointer-events-none absolute left-5 top-5 z-20">
        <span className="font-mono text-[11px] tracking-wider text-titanium">
          Drag to orbit · Scroll to zoom
        </span>
      </div>

      {/* Collapsible Bottom Control Dock (Zero viewport occlusion) */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-zinc-800 bg-obsidian/92 px-3 py-1 font-mono text-[10px] text-titanium transition hover:text-bone"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="h-3 w-3" /> Show Controls
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> Hide Controls
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-obsidian/92 px-3 py-2 shadow-2xl">
            <div className="flex items-center gap-1 border-r border-zinc-800 pr-2">
              {(Object.keys(PRESETS) as CameraPreset[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePreset(key)}
                  className={`whitespace-nowrap shrink-0 rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition ${
                    activePreset === key
                      ? 'bg-volt text-obsidian font-medium'
                      : 'text-titanium hover:bg-zinc-900 hover:text-bone'
                  }`}
                >
                  {PRESETS[key].label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition ${
                autoRotate
                  ? 'border-volt/60 bg-volt/10 text-volt'
                  : 'border-zinc-800 bg-carbon text-titanium hover:text-bone'
              }`}
            >
              <Rotate3d className="h-3.5 w-3.5" />
              {autoRotate ? 'Spin On' : 'Spin Off'}
            </button>

            <button
              type="button"
              onClick={() => setWireframe((v) => !v)}
              className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition ${
                wireframe
                  ? 'border-volt/60 bg-volt/10 text-volt'
                  : 'border-zinc-800 bg-carbon text-titanium hover:text-bone'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              Wireframe
            </button>
          </div>
        )}
      </div>

      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        camera={{ position: PRESETS.studio.pos, fov: 36 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
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
        <CameraRig
          preset={activePreset}
          onUserInteract={() => setActivePreset(null)}
          controlsRef={controlsRef}
        />
        <ModelErrorBoundary
          colorHex={variant.hex}
          accentHex={variant.accentHex}
          wireframe={wireframe}
        >
          <Suspense
            fallback={
              <ProceduralSneakerFallback
                colorHex={variant.hex}
                accentHex={variant.accentHex}
                wireframe={wireframe}
              />
            }
          >
            <SneakerModel
              url={modelUrl}
              scale={modelScale}
              colorHex={variant.hex}
              accentHex={variant.accentHex}
              roughness={variant.roughness}
              metalness={variant.metalness}
              wireframe={wireframe}
            />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping={!isSoftwareGl}
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
          minDistance={2.2}
          maxDistance={6.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.4}
        />
      </Canvas>
    </div>
  );
};
