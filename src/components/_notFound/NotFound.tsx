"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text3D,
  Center,
  Sparkles,
  Float,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import * as THREE from "three";

function CinematicCamera() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 1.5,
      0.05,
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 1.2,
      0.05,
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function InsaneText() {
  const ref = useRef<THREE.Mesh>(null!);
  const [burst, setBurst] = useState(false);
  const { mouse } = useThree();

  useFrame(() => {
    ref.current.rotation.y += 0.002;

    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      mouse.x * 0.8,
      0.08,
    );

    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      mouse.y * 0.6,
      0.08,
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.8}>
      <Center>
        <Text3D
          ref={ref}
          font="/fonts/helvetiker_bold.typeface.json"
          size={1}
          height={0.4}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          onClick={() => setBurst(!burst)}
        >
          NOT FOUND
          <meshStandardMaterial
            color={burst ? "#ff0055" : "#00e5ff"}
            metalness={1}
            roughness={0.15}
            emissive={burst ? "#ff0055" : "#00e5ff"}
            emissiveIntensity={burst ? 3 : 1.2}
          />
        </Text3D>
      </Center>
    </Float>
  );
}

function CursorLight() {
  const ref = useRef<THREE.PointLight>(null!);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    ref.current.position.x = (mouse.x * viewport.width) / 2;
    ref.current.position.y = (mouse.y * viewport.height) / 2;
    ref.current.position.z = 2;
  });

  return <pointLight ref={ref} intensity={6} distance={8} color="#00e5ff" />;
}

export default function Insane404Scene() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "black" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <fog attach="fog" args={["#000", 5, 15]} />

        <ambientLight intensity={0.4} />

        <CursorLight />

        <CinematicCamera />

        <InsaneText />

        <Sparkles count={250} scale={15} size={3} speed={0.6} color="#00e5ff" />

        <Environment preset="night" />

        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
