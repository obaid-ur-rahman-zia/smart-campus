"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 350;

function createParticleGeometry() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

const particleGeometry = createParticleGeometry();

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.05}
        color="#4682b4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CampusScene() {
  const globeRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = -state.clock.elapsedTime * 0.16;
    }
  });

  return (
    <group>
      <mesh ref={globeRef} position={[0, 0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial color="#123d74" metalness={0.45} roughness={0.25} />
      </mesh>

      <mesh ref={cloudRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.57, 64, 64]} />
        <meshStandardMaterial color="#8bbcf4" transparent opacity={0.18} />
      </mesh>

      <mesh position={[0, 0.2, 0]} rotation={[0.45, 0, 0.3]}>
        <torusGeometry args={[2.35, 0.03, 24, 160]} />
        <meshStandardMaterial color="#4ea4ff" emissive="#4ea4ff" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>

      <mesh position={[0, 0.2, 0]} rotation={[-0.7, 0.5, 0]}>
        <torusGeometry args={[2.55, 0.018, 18, 120]} />
        <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={0.4} transparent opacity={0.4} />
      </mesh>

      <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial color="#0b1b34" transparent opacity={0.85} />
      </mesh>

      <ParticleField />
    </group>
  );
}

export function CampusSceneComponent() {
  return (
    <div className="h-full w-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 4, -2]} intensity={0.8} color="#7ab5ff" />
        <pointLight position={[0, 3, 0]} intensity={0.45} color="#4ea4ff" />

        {/* Environment */}
        <Stars radius={50} depth={10} count={500} factor={3} saturation={0} fade speed={1} />

        <Float
          speed={1.8}
          rotationIntensity={0.15}
          floatIntensity={0.28}
          floatingRange={[-0.12, 0.12]}
        >
          <CampusScene />
        </Float>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
