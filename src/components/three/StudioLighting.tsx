import React from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';

interface StudioLightingProps {
  showFloorShadow?: boolean;
  isSoftwareGl?: boolean;
}

export const StudioLighting: React.FC<StudioLightingProps> = ({
  showFloorShadow = true,
  isSoftwareGl = false,
}) => {
  return (
    <>
      <hemisphereLight args={['#dbeafe', '#18181b', 0.45]} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.75}
        color="#fff9f0"
        castShadow={!isSoftwareGl}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <spotLight
        position={[-6, 5, -4]}
        intensity={1.35}
        angle={0.5}
        penumbra={1}
        color="#D4FF00"
      />
      <pointLight position={[0, -3, 4]} intensity={0.55} color="#a1a1aa" />

      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 5, -3]}
          scale={[10, 4, 1]}
          target={[0, 0, 0]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[-5, 2, 2]}
          scale={[6, 3, 1]}
          target={[0, 0, 0]}
          color="#e4e4e7"
        />
        <Lightformer
          form="ring"
          intensity={1.8}
          position={[5, 1, 3]}
          scale={[3, 3, 1]}
          target={[0, 0, 0]}
          color="#D4FF00"
        />
      </Environment>

      {showFloorShadow && !isSoftwareGl && (
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.55}
          scale={8}
          blur={2.4}
          far={4}
          resolution={256}
          color="#000000"
        />
      )}
    </>
  );
};
