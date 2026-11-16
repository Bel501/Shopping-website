import React, { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SneakerModelProps {
  url: string;
  scale?: number;
  colorHex?: string;
  accentHex?: string;
  roughness?: number;
  metalness?: number;
  wireframe?: boolean;
}

const _targetColor = new THREE.Color();
const _accentColor = new THREE.Color();
const _fallbackBase = new THREE.Color('#ffffff');

export const SneakerModel: React.FC<SneakerModelProps> = ({
  url,
  scale = 10.5,
  colorHex,
  accentHex = '#D4FF00',
  roughness,
  metalness,
  wireframe = false,
}) => {
  const gltf = useGLTF(url, true);

  const { clonedScene, originalColors } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const originals = new Map<string, THREE.Color>();

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          const matClone = mesh.material.clone();
          mesh.material = matClone;
          if (matClone instanceof THREE.MeshStandardMaterial) {
            originals.set(mesh.uuid, matClone.color.clone());
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    return { clonedScene: clone, originalColors: originals };
  }, [gltf.scene]);

  useEffect(() => {
    if (colorHex) _targetColor.set(colorHex);
    _accentColor.set(accentHex);

    let meshIdx = 0;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material;

        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.wireframe = wireframe;

          if (colorHex) {
            const nameLower = (mesh.name + ' ' + mat.name).toLowerCase();
            const isAccent =
              nameLower.includes('lace') ||
              nameLower.includes('accent') ||
              nameLower.includes('stitch') ||
              meshIdx % 4 === 3;

            if (isAccent) {
              mat.color.lerp(_accentColor, 0.55);
            } else {
              const base = originalColors.get(mesh.uuid) || _fallbackBase;
              mat.color.copy(base).lerp(_targetColor, 0.85);
            }
          }

          if (typeof roughness === 'number') mat.roughness = roughness;
          if (typeof metalness === 'number') mat.metalness = metalness;
          mat.needsUpdate = true;
          meshIdx++;
        }
      }
    });
  }, [clonedScene, originalColors, colorHex, accentHex, roughness, metalness, wireframe]);

  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  return <primitive object={clonedScene} scale={scale} />;
};

/**
 * Composite 8-part procedural architectural sneaker fallback used while loading
 * or if remote GLB download is unavailable.
 */
export const ProceduralSneakerFallback: React.FC<{
  colorHex?: string;
  accentHex?: string;
  wireframe?: boolean;
}> = ({ colorHex = '#1c1d21', accentHex = '#D4FF00', wireframe = false }) => {
  const { midsoleGeo, carbonGeo, upperGeo, heelGeo, laceGeo } = useMemo(() => {
    // 1. Sculpted rocker midsole profile
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-1.25, -0.35);
    soleShape.quadraticCurveTo(-0.3, -0.45, 1.25, -0.25);
    soleShape.lineTo(1.32, -0.05);
    soleShape.quadraticCurveTo(0.2, -0.15, -1.2, 0.08);
    soleShape.closePath();
    const midsole = new THREE.ExtrudeGeometry(soleShape, {
      depth: 0.86,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 4,
    });
    midsole.center();

    // 2. Split carbon propulsion plate
    const plateShape = new THREE.Shape();
    plateShape.moveTo(-1.12, -0.04);
    plateShape.quadraticCurveTo(0.05, -0.12, 1.18, 0.02);
    plateShape.lineTo(1.16, 0.08);
    plateShape.quadraticCurveTo(0.05, -0.04, -1.1, 0.04);
    plateShape.closePath();
    const carbon = new THREE.ExtrudeGeometry(plateShape, {
      depth: 0.88,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    carbon.center();

    // 3. Aerodynamic knitted upper silhouette
    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.14, 0.0);
    upperShape.quadraticCurveTo(-0.85, 0.62, -0.25, 0.72);
    upperShape.quadraticCurveTo(0.25, 0.48, 0.85, 0.25);
    upperShape.quadraticCurveTo(1.22, 0.14, 1.2, 0.0);
    upperShape.closePath();
    const upper = new THREE.ExtrudeGeometry(upperShape, {
      depth: 0.74,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.07,
      bevelSegments: 5,
    });
    upper.center();

    // 4. External heel stabilizer cage
    const heelShape = new THREE.Shape();
    heelShape.moveTo(-0.35, -0.2);
    heelShape.lineTo(-0.22, 0.42);
    heelShape.lineTo(0.18, 0.35);
    heelShape.lineTo(0.28, -0.18);
    heelShape.closePath();
    const heel = new THREE.ExtrudeGeometry(heelShape, {
      depth: 0.82,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    heel.center();

    // 5. Tension lace tube
    const laceCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.54, -0.22),
      new THREE.Vector3(0.22, 0.38, 0.22),
      new THREE.Vector3(0.48, 0.26, -0.2),
      new THREE.Vector3(0.74, 0.16, 0.18),
    ]);
    const lace = new THREE.TubeGeometry(laceCurve, 24, 0.024, 8, false);

    return {
      midsoleGeo: midsole,
      carbonGeo: carbon,
      upperGeo: upper,
      heelGeo: heel,
      laceGeo: lace,
    };
  }, []);

  useEffect(() => {
    return () => {
      midsoleGeo.dispose();
      carbonGeo.dispose();
      upperGeo.dispose();
      heelGeo.dispose();
      laceGeo.dispose();
    };
  }, [midsoleGeo, carbonGeo, upperGeo, heelGeo, laceGeo]);

  return (
    <group scale={1.15} rotation={[0.08, -0.45, 0]}>
      {/* Sculpted Pebax Midsole */}
      <mesh geometry={midsoleGeo} position={[0, -0.34, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e4e4e7"
          roughness={0.55}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Split Carbon Propulsion Plate */}
      <mesh geometry={carbonGeo} position={[0.02, -0.17, 0]} castShadow>
        <meshStandardMaterial
          color={accentHex}
          roughness={0.2}
          metalness={0.75}
          wireframe={wireframe}
        />
      </mesh>

      {/* Bio-Dyneema Knit Upper */}
      <mesh geometry={upperGeo} position={[-0.02, 0.22, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={colorHex}
          roughness={0.72}
          metalness={0.12}
          wireframe={wireframe}
        />
      </mesh>

      {/* Articulated Heel Counter */}
      <mesh geometry={heelGeo} position={[-0.86, 0.22, 0]} castShadow>
        <meshStandardMaterial
          color="#18181b"
          roughness={0.28}
          metalness={0.58}
          wireframe={wireframe}
        />
      </mesh>

      {/* Anodized Pull Loop */}
      <mesh position={[-1.18, 0.62, 0]} rotation={[0, 0, 0.35]} castShadow>
        <torusGeometry args={[0.1, 0.022, 10, 24]} />
        <meshStandardMaterial
          color={accentHex}
          roughness={0.22}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>

      {/* Knit Collar Cuff */}
      <mesh position={[-0.68, 0.56, 0]} rotation={[0, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.22, 24]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.82}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Kevlar Tension Laces */}
      <mesh geometry={laceGeo} position={[0.1, 0.04, 0]} castShadow>
        <meshStandardMaterial
          color={accentHex}
          roughness={0.4}
          metalness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* Vibram Outsole Forefoot Pod */}
      <mesh position={[0.68, -0.56, 0]} rotation={[0, 0, -0.08]} receiveShadow>
        <boxGeometry args={[0.92, 0.07, 0.88]} />
        <meshStandardMaterial
          color="#09090b"
          roughness={0.85}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
};
